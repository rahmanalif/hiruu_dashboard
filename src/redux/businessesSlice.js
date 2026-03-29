import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readStoredAuth, resolveAccessToken } from "@/lib/auth";

const initialState = {
  businesses: [],
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

export const fetchBusinessesQuery = createAsyncThunk(
  "businesses/fetchBusinessesQuery",
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
    const endpoint = `${baseUrl}/business/query${query ? `?${query}` : ""}`;

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
      return rejectWithValue(payload?.message || "Failed to load businesses");
    }

    return {
      businesses: Array.isArray(payload?.data) ? payload.data : [],
      pagination: payload?.pagination || null,
    };
  }
);

const businessesSlice = createSlice({
  name: "businesses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessesQuery.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBusinessesQuery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.businesses = action.payload.businesses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBusinessesQuery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load businesses";
      });
  },
});

export default businessesSlice.reducer;
