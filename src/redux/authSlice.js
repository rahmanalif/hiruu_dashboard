import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readStoredAuth, resolveAccessToken } from "@/lib/auth";

const initialState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  status: "idle",
  error: null,
};

const AUTH_STORAGE_KEY = "auth";

const persistAuth = ({ user, tokens, rememberMe }) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify({ user, tokens });

  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, payload);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(AUTH_STORAGE_KEY, payload);
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const clearAuthState = (state) => {
  state.isAuthenticated = false;
  state.user = null;
  state.tokens = null;
  state.status = "idle";
  state.error = null;

  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, rememberMe, fcmToken }, { rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          rememberMe: Boolean(rememberMe),
          fcmToken: fcmToken || null,
        }),
      });
    } catch (error) {
      return rejectWithValue(error?.message || "Network error");
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.success) {
      return rejectWithValue(payload?.message || "Login failed");
    }

    persistAuth({
      user: payload.data,
      tokens: payload.tokens,
      rememberMe: Boolean(rememberMe),
    });

    return { user: payload.data, tokens: payload.tokens };
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      return rejectWithValue(error?.message || "Network error");
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.success) {
      return rejectWithValue(payload?.message || "Request failed");
    }

    return true;
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, password }, { rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
    } catch (error) {
      return rejectWithValue(error?.message || "Network error");
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.success) {
      return rejectWithValue(payload?.message || "Reset failed");
    }

    return true;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    const accessToken =
      resolveAccessToken(getState()?.auth?.tokens) ||
      resolveAccessToken(readStoredAuth()?.tokens);

    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      return rejectWithValue(error?.message || "Network error");
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.success) {
      return rejectWithValue(payload?.message || "Logout failed");
    }

    return true;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload || null;
    },
    logout(state) {
      clearAuthState(state);
    },
    hydrateFromStorage(state, action) {
      const { user, tokens } = action.payload || {};
      if (user && tokens) {
        state.isAuthenticated = true;
        state.user = user;
        state.tokens = tokens;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Request failed";
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Reset failed";
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearAuthState(state);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { login, logout, hydrateFromStorage } = authSlice.actions;
export default authSlice.reducer;
