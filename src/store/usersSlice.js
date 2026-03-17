import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readStoredAuth, resolveAccessToken } from "@/lib/auth";

const initialState = {
  users: [],
  pagination: null,
  status: "idle",
  error: null,
};

const getAccessToken = (state) => {
  const tokenFromStore = resolveAccessToken(state?.auth?.tokens);

  if (tokenFromStore) {
    return tokenFromStore;
  }

  return resolveAccessToken(readStoredAuth()?.tokens);
};

export const fetchUsersQuery = createAsyncThunk(
  "users/fetchUsersQuery",
  async (params = {}, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });

    const query = searchParams.toString();
    const endpoint = `${baseUrl}/users/query${query ? `?${query}` : ""}`;

    let response;
    try {
      response = await fetch(endpoint, {
        method: "GET",
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
      return rejectWithValue(payload?.message || "Failed to load users");
    }

    return {
      users: Array.isArray(payload?.data) ? payload.data : [],
      pagination: payload?.pagination || null,
    };
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersQuery.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsersQuery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsersQuery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load users";
      });
  },
});

export default usersSlice.reducer;
