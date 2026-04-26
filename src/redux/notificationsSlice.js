import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readStoredAuth, resolveAccessToken } from "@/lib/auth";

const initialState = {
  notifications: [],
  pagination: null,
  status: "idle",
  error: null,
  markReadStatus: "idle",
  markAllReadStatus: "idle",
  markReadError: null,
};

const getAccessToken = (state) => {
  const tokenFromStore = resolveAccessToken(state?.auth?.tokens);

  if (tokenFromStore) {
    return tokenFromStore;
  }

  return resolveAccessToken(readStoredAuth()?.tokens);
};

const requestJson = async ({ endpoint, method = "GET", accessToken }) => {
  let response;
  try {
    response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new Error(error?.message || "Network error");
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
};

const buildQuery = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const extractNotifications = (payload) => {
  const data = payload?.data;
  const candidates = [
    data?.notifications,
    data?.items,
    data?.results,
    data?.docs,
    data,
    payload?.notifications,
    payload?.items,
    payload?.results,
    payload,
  ];

  return candidates.find(Array.isArray) || [];
};

const extractPagination = (payload) =>
  payload?.pagination ||
  payload?.data?.pagination ||
  payload?.data?.meta ||
  payload?.meta ||
  null;

export const fetchAdminNotifications = createAsyncThunk(
  "notifications/fetchAdminNotifications",
  async (params = {}, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    const query = buildQuery({
      sort: "createdAt:desc",
      page: 1,
      limit: 20,
      ...params,
    });
    try {
      const payload = await requestJson({
        endpoint: `${baseUrl}/notifications/admin${query}`,
        accessToken,
      });

      return {
        notifications: extractNotifications(payload),
        pagination: extractPagination(payload),
      };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async ({ id, scope = "admin" }, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    if (!id) {
      return rejectWithValue("Missing notification ID");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    const query = buildQuery({ scope });
    try {
      const payload = await requestJson({
        endpoint: `${baseUrl}/notifications/${id}/read${query}`,
        method: "PATCH",
        accessToken,
      });

      return { id, notification: payload?.data || payload?.notification || null };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to mark notification as read");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    try {
      await requestJson({
        endpoint: `${baseUrl}/notifications/read-all`,
        method: "PATCH",
        accessToken,
      });

      return true;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to mark notifications as read");
    }
  }
);

const markItemRead = (notification) => ({
  ...notification,
  isRead: true,
  read: true,
  readAt: notification?.readAt || new Date().toISOString(),
});

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load notifications";
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.markReadStatus = "loading";
        state.markReadError = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.markReadStatus = "succeeded";
        state.notifications = state.notifications.map((notification) => {
          const notificationId = notification?.id || notification?._id;
          if (String(notificationId) !== String(action.payload.id)) {
            return notification;
          }

          return action.payload.notification || markItemRead(notification);
        });
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.markReadStatus = "failed";
        state.markReadError = action.payload || "Failed to mark notification as read";
      })
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.markAllReadStatus = "loading";
        state.markReadError = null;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.markAllReadStatus = "succeeded";
        state.notifications = state.notifications.map(markItemRead);
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.markAllReadStatus = "failed";
        state.markReadError = action.payload || "Failed to mark notifications as read";
      });
  },
});

export default notificationsSlice.reducer;
