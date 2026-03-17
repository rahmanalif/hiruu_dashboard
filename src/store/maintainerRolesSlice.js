import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readStoredAuth, resolveAccessToken } from "@/lib/auth";

const initialState = {
  roles: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
};

const getAccessToken = (state) => {
  const tokenFromStore = resolveAccessToken(state?.auth?.tokens);

  if (tokenFromStore) {
    return tokenFromStore;
  }

  return resolveAccessToken(readStoredAuth()?.tokens);
};

export const fetchMaintainerRoles = createAsyncThunk(
  "maintainerRoles/fetchMaintainerRoles",
  async (_, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/maintainer/permissions/role`, {
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
      return rejectWithValue(payload?.message || "Failed to load roles");
    }

    return Array.isArray(payload?.data) ? payload.data : [];
  }
);

export const createMaintainer = createAsyncThunk(
  "maintainerRoles/createMaintainer",
  async ({ name, email, roleId, avatar }, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("roleId", roleId);

    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/maintainers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
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
      return rejectWithValue(payload?.message || "Failed to create maintainer");
    }

    return payload?.data || null;
  }
);

export const updateMaintainer = createAsyncThunk(
  "maintainerRoles/updateMaintainer",
  async ({ id, name, email, roleId, avatar }, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    if (!id) {
      return rejectWithValue("Missing maintainer id");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("roleId", roleId);

    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/maintainers/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
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
      return rejectWithValue(payload?.message || "Failed to update maintainer");
    }

    return payload?.data || null;
  }
);

const maintainerRolesSlice = createSlice({
  name: "maintainerRoles",
  initialState,
  reducers: {
    resetCreateMaintainerState(state) {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetUpdateMaintainerState(state) {
      state.updateStatus = "idle";
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintainerRoles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMaintainerRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchMaintainerRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load roles";
      })
      .addCase(createMaintainer.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createMaintainer.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createMaintainer.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create maintainer";
      })
      .addCase(updateMaintainer.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateMaintainer.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateMaintainer.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update maintainer";
      });
  },
});

export const { resetCreateMaintainerState, resetUpdateMaintainerState } =
  maintainerRolesSlice.actions;
export default maintainerRolesSlice.reducer;
