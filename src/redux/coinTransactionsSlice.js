import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readStoredAuth, resolveAccessToken } from "@/lib/auth";

const initialState = {
  transactions: [],
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

export const fetchCoinTransactions = createAsyncThunk(
  "coinTransactions/fetchCoinTransactions",
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
    const endpoint = `${baseUrl}/coin-transactions/admin/query${query ? `?${query}` : ""}`;

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
      return rejectWithValue(payload?.message || "Failed to load rewards");
    }

    return {
      transactions: Array.isArray(payload?.data) ? payload.data : [],
      pagination: payload?.pagination || null,
    };
  }
);

const coinTransactionsSlice = createSlice({
  name: "coinTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoinTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCoinTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCoinTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load rewards";
      });
  },
});

export default coinTransactionsSlice.reducer;
