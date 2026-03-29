import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readStoredAuth, resolveAccessToken } from "@/lib/auth";

const initialState = {
  coupons: [],
  pagination: null,
  metadata: null,
  status: "idle",
  error: null,
  createdCoupons: [],
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

export const createCoupon = createAsyncThunk(
  "coupons/createCoupon",
  async (couponData, { getState, rejectWithValue }) => {
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
      response = await fetch(`${baseUrl}/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(couponData),
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
      return rejectWithValue(payload?.message || "Failed to create coupon");
    }

    return payload?.data || couponData;
  }
);

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async ({ page = 1, limit = 10, search = "" } = {}, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) {
      query.set("search", search);
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/coupons?${query.toString()}`, {
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
      return rejectWithValue(payload?.message || "Failed to load coupons");
    }

    return {
      coupons: Array.isArray(payload?.data) ? payload.data : [],
      pagination: payload?.pagination || null,
      metadata: payload?.metadata || null,
    };
  }
);

export const updateCoupon = createAsyncThunk(
  "coupons/updateCoupon",
  async ({ id, couponData }, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    if (!id) {
      return rejectWithValue("Missing coupon id");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/coupons/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(couponData),
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
      return rejectWithValue(payload?.message || "Failed to update coupon");
    }

    return payload?.data || { id, ...couponData };
  }
);

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    resetCreateCouponState(state) {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetUpdateCouponState(state) {
      state.updateStatus = "idle";
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.coupons = action.payload.coupons;
        state.pagination = action.payload.pagination;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load coupons";
      })
      .addCase(createCoupon.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.createdCoupons = [action.payload, ...state.createdCoupons];
        state.coupons = [action.payload, ...state.coupons.filter((coupon) => coupon.id !== action.payload?.id)];
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create coupon";
      })
      .addCase(updateCoupon.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.coupons = state.coupons.map((coupon) =>
          coupon.id === action.payload?.id ? { ...coupon, ...action.payload } : coupon
        );
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update coupon";
      });
  },
});

export const { resetCreateCouponState, resetUpdateCouponState } = couponsSlice.actions;
export default couponsSlice.reducer;
