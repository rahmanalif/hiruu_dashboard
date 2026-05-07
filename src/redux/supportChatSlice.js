import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readStoredAuth, resolveAccessToken } from "@/lib/auth";

const initialState = {
  chats: [],
  pagination: null,
  status: "idle",
  error: null,
  createStatus: "idle",
  createError: null,
  activeChatId: null,
  activeChatDetails: null,
  detailsStatus: "idle",
  detailsError: null,
  activeChatMessages: [],
  messagesPagination: null,
  messagesStatus: "idle",
  messagesError: null,
  sendStatus: "idle",
  sendError: null,
};

const getAccessToken = (state) => {
  const tokenFromStore = resolveAccessToken(state?.auth?.tokens);

  if (tokenFromStore) {
    return tokenFromStore;
  }

  return resolveAccessToken(readStoredAuth()?.tokens);
};

const normalizeMessagesPayload = (payloadData) => {
  if (Array.isArray(payloadData)) {
    return payloadData;
  }

  if (Array.isArray(payloadData?.messages)) {
    return payloadData.messages;
  }

  if (Array.isArray(payloadData?.data)) {
    return payloadData.data;
  }

  if (Array.isArray(payloadData?.items)) {
    return payloadData.items;
  }

  return [];
};

export const fetchSupportChats = createAsyncThunk(
  "supportChats/fetchSupportChats",
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
    const endpoint = `${baseUrl}/admin/support/chats${query ? `?${query}` : ""}`;

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
      return rejectWithValue(payload?.message || "Failed to load support chats");
    }

    return {
      chats: Array.isArray(payload?.data) ? payload.data : [],
      pagination: payload?.pagination || null,
    };
  }
);

export const fetchSupportChatDetails = createAsyncThunk(
  "supportChats/fetchSupportChatDetails",
  async (chatId, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    if (!chatId) {
      return rejectWithValue("Missing support chat id");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/admin/support/chats/${chatId}`, {
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
      return rejectWithValue(
        payload?.message || "Failed to load support chat details"
      );
    }

    return payload?.data || null;
  }
);

export const createSupportChat = createAsyncThunk(
  "supportChats/createSupportChat",
  async (userId, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    if (!userId) {
      return rejectWithValue("Missing user id");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/admin/support/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId }),
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
      return rejectWithValue(payload?.message || "Failed to create support chat");
    }

    return payload?.data || null;
  }
);

export const fetchSupportChatMessages = createAsyncThunk(
  "supportChats/fetchSupportChatMessages",
  async ({ chatId, params = {} }, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    if (!chatId) {
      return rejectWithValue("Missing support chat id");
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
    const endpoint = `${baseUrl}/chat/rooms/${chatId}/messages${
      query ? `?${query}` : ""
    }`;

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
      return rejectWithValue(payload?.message || "Failed to load messages");
    }

    return {
      chatId,
      messages: normalizeMessagesPayload(payload?.data),
      pagination: payload?.pagination || payload?.data?.pagination || null,
    };
  }
);

export const sendSupportChatMessage = createAsyncThunk(
  "supportChats/sendSupportChatMessage",
  async ({ chatId, content, type = "text", mediaFiles = [] }, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    if (!chatId) {
      return rejectWithValue("Missing support chat id");
    }

    const trimmedContent = content?.trim() || "";
    if (!trimmedContent && !mediaFiles.length) {
      return rejectWithValue("Message content or media is required");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    const formData = new FormData();
    if (trimmedContent) {
      formData.append("content", trimmedContent);
    }
    formData.append("type", mediaFiles.length ? type || "file" : type);
    mediaFiles.forEach((file) => {
      formData.append("media", file);
    });

    let response;
    try {
      response = await fetch(`${baseUrl}/chat/rooms/${chatId}/messages`, {
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
      return rejectWithValue(payload?.message || "Failed to send message");
    }

    return payload?.data || null;
  }
);

export const markSupportChatRoomRead = createAsyncThunk(
  "supportChats/markSupportChatRoomRead",
  async (chatId, { getState, rejectWithValue }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return rejectWithValue("Missing NEXT_PUBLIC_API_BASE_URL");
    }

    if (!chatId) {
      return rejectWithValue("Missing support chat id");
    }

    const accessToken = getAccessToken(getState());
    if (!accessToken) {
      return rejectWithValue("Missing access token");
    }

    let response;
    try {
      response = await fetch(`${baseUrl}/chat/rooms/${chatId}/read`, {
        method: "PATCH",
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
      return rejectWithValue(payload?.message || "Failed to mark room as read");
    }

    return chatId;
  }
);

const supportChatSlice = createSlice({
  name: "supportChats",
  initialState,
  reducers: {
    setActiveChat(state, action) {
      state.activeChatId = action.payload;
      state.detailsError = null;
      state.messagesError = null;
      state.sendError = null;
    },
    appendIncomingMessage(state, action) {
      const { chatRoomId, message } = action.payload || {};
      const nextMessage = message || action.payload;

      if (!chatRoomId || !nextMessage) {
        return;
      }

      const hasMessage = state.activeChatMessages.some(
        (currentMessage) => currentMessage.id === nextMessage.id
      );

      if (chatRoomId === state.activeChatId) {
        state.activeChatMessages = hasMessage
          ? state.activeChatMessages.map((currentMessage) =>
              currentMessage.id === nextMessage.id ? nextMessage : currentMessage
            )
          : [...state.activeChatMessages, nextMessage];
      }

      const existingChatIndex = state.chats.findIndex((chat) => chat.id === chatRoomId);

      if (existingChatIndex === -1) {
        state.chats = [
          {
            id: chatRoomId,
            user: nextMessage.sender || null,
            lastMessage: nextMessage,
            lastMessageAt: nextMessage.createdAt || null,
            unreadCount: chatRoomId === state.activeChatId ? 0 : 1,
            isArchived: false,
          },
          ...state.chats,
        ];
        return;
      }

      state.chats = state.chats.map((chat) => {
        if (chat.id !== chatRoomId) {
          return chat;
        }

        const nextUnreadCount =
          chatRoomId === state.activeChatId
            ? 0
            : nextMessage.senderId
              ? (chat.unreadCount || 0) + 1
              : chat.unreadCount || 0;

        return {
          ...chat,
          lastMessage: nextMessage,
          lastMessageAt: nextMessage.createdAt || chat.lastMessageAt,
          unreadCount: nextUnreadCount,
        };
      });
    },
    updateUserPresence(state, action) {
      const { userId, isOnline, lastSeen } = action.payload || {};

      if (!userId) {
        return;
      }

      const patchPresence = (user) => {
        if (!user || user.id !== userId) {
          return user;
        }

        return {
          ...user,
          isOnline,
          lastSeen: isOnline ? null : (lastSeen || user.lastSeen || new Date().toISOString()),
        };
      };

      state.chats = state.chats.map((chat) => ({
        ...chat,
        user: patchPresence(chat.user),
      }));

      if (state.activeChatDetails) {
        state.activeChatDetails = {
          ...state.activeChatDetails,
          user: patchPresence(state.activeChatDetails.user),
          participants: Array.isArray(state.activeChatDetails.participants)
            ? state.activeChatDetails.participants.map((participant) => ({
                ...participant,
                user: patchPresence(participant.user),
              }))
            : state.activeChatDetails.participants,
        };
      }
    },
    applyMessageReadReceipt(state, action) {
      const { chatRoomId, messageId, userId, userName, userAvatar, readAt } = action.payload || {};

      if (!chatRoomId || !userId) {
        return;
      }

      const nextReceipt = {
        id: `${messageId || "bulk"}-${userId}`,
        messageId: messageId || null,
        userId,
        readAt: readAt || new Date().toISOString(),
        user: {
          id: userId,
          name: userName || null,
          avatar: userAvatar || null,
        },
      };

      const attachReceipt = (message) => {
        const receipts = Array.isArray(message.readReceipts) ? message.readReceipts : [];
        const alreadyExists = receipts.some((receipt) => receipt.userId === userId);

        if (alreadyExists) {
          return message;
        }

        return {
          ...message,
          readReceipts: [...receipts, { ...nextReceipt, messageId: message.id }],
        };
      };

      if (chatRoomId === state.activeChatId) {
        state.activeChatMessages = state.activeChatMessages.map((message) => {
          if (messageId) {
            return message.id === messageId ? attachReceipt(message) : message;
          }

          return message.senderId !== userId ? attachReceipt(message) : message;
        });
      }

      state.chats = state.chats.map((chat) => {
        if (chat.id !== chatRoomId || !chat.lastMessage) {
          return chat;
        }

        if (messageId && chat.lastMessage.id !== messageId) {
          return chat;
        }

        if (!messageId && chat.lastMessage.senderId === userId) {
          return chat;
        }

        return {
          ...chat,
          lastMessage: attachReceipt(chat.lastMessage),
        };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportChats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSupportChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = action.payload.chats;
        state.pagination = action.payload.pagination;

        const activeChatExists = state.chats.some(
          (chat) => chat.id === state.activeChatId
        );

        if (!activeChatExists) {
          state.activeChatId = state.chats[0]?.id || null;
        }
      })
      .addCase(fetchSupportChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load support chats";
      })
      .addCase(createSupportChat.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createSupportChat.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.createError = null;

        if (!action.payload?.id) {
          return;
        }

        const nextChat = action.payload;
        const existingIndex = state.chats.findIndex((chat) => chat.id === nextChat.id);

        if (existingIndex >= 0) {
          state.chats[existingIndex] = {
            ...state.chats[existingIndex],
            ...nextChat,
          };
        } else {
          state.chats = [nextChat, ...state.chats];
        }

        state.activeChatId = nextChat.id;
        state.activeChatDetails = nextChat;
      })
      .addCase(createSupportChat.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create support chat";
      })
      .addCase(fetchSupportChatDetails.pending, (state) => {
        state.detailsStatus = "loading";
        state.detailsError = null;
      })
      .addCase(fetchSupportChatDetails.fulfilled, (state, action) => {
        state.detailsStatus = "succeeded";
        state.activeChatDetails = action.payload;
      })
      .addCase(fetchSupportChatDetails.rejected, (state, action) => {
        state.detailsStatus = "failed";
        state.detailsError =
          action.payload || "Failed to load support chat details";
      })
      .addCase(fetchSupportChatMessages.pending, (state) => {
        state.messagesStatus = "loading";
        state.messagesError = null;
      })
      .addCase(fetchSupportChatMessages.fulfilled, (state, action) => {
        state.messagesStatus = "succeeded";
        state.activeChatMessages = Array.isArray(action.payload.messages)
          ? action.payload.messages
          : [];
        state.messagesPagination = action.payload.pagination;
      })
      .addCase(fetchSupportChatMessages.rejected, (state, action) => {
        state.messagesStatus = "failed";
        state.messagesError = action.payload || "Failed to load messages";
      })
      .addCase(sendSupportChatMessage.pending, (state) => {
        state.sendStatus = "loading";
        state.sendError = null;
      })
      .addCase(sendSupportChatMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";

        if (action.payload) {
          const nextMessage = action.payload;
          const nextMessageId = nextMessage.id;
          const hasMessage = state.activeChatMessages.some(
            (message) => message.id === nextMessageId
          );

          state.activeChatMessages = hasMessage
            ? state.activeChatMessages.map((message) =>
                message.id === nextMessageId ? nextMessage : message
              )
            : [...state.activeChatMessages, nextMessage];

          state.chats = state.chats.map((chat) =>
            chat.id === state.activeChatId
              ? {
                  ...chat,
                  lastMessage: action.payload,
                  lastMessageAt: action.payload.createdAt || chat.lastMessageAt,
                }
              : chat
          );

          if (state.activeChatDetails?.id === state.activeChatId) {
            state.activeChatDetails = {
              ...state.activeChatDetails,
              lastMessageAt:
                action.payload.createdAt || state.activeChatDetails.lastMessageAt,
            };
          }
        }
      })
      .addCase(sendSupportChatMessage.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.sendError = action.payload || "Failed to send message";
      })
      .addCase(markSupportChatRoomRead.fulfilled, (state, action) => {
        state.chats = state.chats.map((chat) =>
          chat.id === action.payload ? { ...chat, unreadCount: 0 } : chat
        );
      });
  },
});

export const { setActiveChat, appendIncomingMessage, updateUserPresence, applyMessageReadReceipt } = supportChatSlice.actions;
export default supportChatSlice.reducer;
