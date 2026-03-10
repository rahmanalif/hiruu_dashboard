import { io } from "socket.io-client";

let chatSocket = null;

const getSocketBaseUrl = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return null;
  }

  return apiBaseUrl.replace(/\/api\/v\d+$/, "");
};

export const getChatSocket = (token) => {
  const baseUrl = getSocketBaseUrl();
  if (!baseUrl || !token) {
    return null;
  }

  if (chatSocket) {
    return chatSocket;
  }

  chatSocket = io(`${baseUrl}/chat`, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    auth: {
      token,
      authorization: `Bearer ${token}`,
    },
  });

  return chatSocket;
};

export const disconnectChatSocket = () => {
  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
  }
};
