"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Check,
  CheckCheck,
  Mail,
  Menu,
  MessageSquare,
  Paperclip,
  RefreshCw,
  Send,
  Smile,
  User,
  X,
} from "lucide-react";
import {
  fetchSupportChatDetails,
  fetchSupportChatMessages,
  fetchSupportChats,
  markSupportChatRoomRead,
  sendSupportChatMessage,
  appendIncomingMessage,
  setActiveChat,
} from "@/store/supportChatSlice";
import { getChatSocket, disconnectChatSocket } from "@/lib/chatSocket";
import { resolveAccessToken } from "@/lib/auth";

const formatDateTime = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getInitials = (name) => {
  if (!name) {
    return "NA";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
};

const ChatMessagingInterface = () => {
  const dispatch = useDispatch();
  const {
    chats,
    pagination,
    status,
    error,
    activeChatId,
    activeChatDetails,
    detailsStatus,
    detailsError,
    activeChatMessages,
    messagesStatus,
    messagesError,
    sendStatus,
    sendError,
  } = useSelector((state) => state.supportChats);
  const authTokens = useSelector((state) => state.auth.tokens);
  const [message, setMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("Open");
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    dispatch(fetchSupportChats({ page: 1, limit: 20 }));
  }, [dispatch, authTokens]);

  useEffect(() => {
    const accessToken = resolveAccessToken(authTokens);
    if (!accessToken) {
      return undefined;
    }

    const socket = getChatSocket(accessToken);
    if (!socket) {
      return undefined;
    }

    socketRef.current = socket;

    const handleConnect = () => {
      setSocketStatus("connected");
      if (activeChatId) {
        socket.emit("join_chat", { chatRoomId: activeChatId });
      }
    };

    const handleDisconnect = () => {
      setSocketStatus("disconnected");
    };

    const handleConnectError = () => {
      setSocketStatus("error");
    };

    const handleNewMessage = (payload) => {
      dispatch(appendIncomingMessage(payload));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("new_message", handleNewMessage);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("new_message", handleNewMessage);
    };
  }, [activeChatId, authTokens, dispatch]);

  useEffect(() => {
    if (activeChatId) {
      dispatch(fetchSupportChatDetails(activeChatId));
      dispatch(fetchSupportChatMessages({ chatId: activeChatId, params: { page: 1, limit: 50 } }));
      dispatch(markSupportChatRoomRead(activeChatId));

      if (socketRef.current?.connected) {
        socketRef.current.emit("join_chat", { chatRoomId: activeChatId });
      }
    }
  }, [activeChatId, dispatch]);

  useEffect(() => {
    return () => {
      disconnectChatSocket();
    };
  }, []);

  const filteredChats = useMemo(() => {
    const nextChats = [...chats];

    if (activeFilter === "Open") {
      return nextChats.filter((chat) => !chat.isArchived);
    }

    return nextChats.sort((a, b) => {
      const timeA = new Date(a.lastMessageAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.lastMessageAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });
  }, [activeFilter, chats]);

  const selectedListChat =
    filteredChats.find((chat) => chat.id === activeChatId) ||
    chats.find((chat) => chat.id === activeChatId) ||
    filteredChats[0] ||
    null;

  const activeChat =
    activeChatDetails?.id === selectedListChat?.id
      ? {
          ...selectedListChat,
          ...activeChatDetails,
          stats: activeChatDetails?.stats,
          participants: activeChatDetails?.participants,
        }
      : selectedListChat;

  const activeUser = activeChat?.user || null;
  const lastMessage =
    activeChatMessages[activeChatMessages.length - 1] || activeChat?.lastMessage || null;
  const currentUser = useSelector((state) => state.auth.user);
  const orderedMessages = useMemo(() => {
    return [...activeChatMessages].sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeA - timeB;
    });
  }, [activeChatMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [orderedMessages]);

  const handleSendMessage = async () => {
    if (!activeChatId || !message.trim() || sendStatus === "loading") {
      return;
    }

    const result = await dispatch(
      sendSupportChatMessage({
        chatId: activeChatId,
        content: message,
        type: "text",
      })
    );

    if (sendSupportChatMessage.fulfilled.match(result)) {
      setMessage("");
      dispatch(fetchSupportChatMessages({ chatId: activeChatId, params: { page: 1, limit: 50 } }));
      dispatch(fetchSupportChats({ page: 1, limit: 20 }));
    }
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={activeFilter === "Open" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("Open")}
                  className={activeFilter === "Open" ? "bg-gray-900" : ""}
                >
                  Open
                  {activeFilter === "Open" && <X className="w-3 h-3 ml-1" />}
                </Button>
                <Button
                  variant={activeFilter === "Newest" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter("Newest")}
                  className={activeFilter === "Newest" ? "bg-gray-900" : ""}
                >
                  Newest
                  {activeFilter === "Newest" && <X className="w-3 h-3 ml-1" />}
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => dispatch(fetchSupportChats({ page: 1, limit: 20 }))}
              disabled={status === "loading"}
            >
              <RefreshCw
                className={`w-4 h-4 ${status === "loading" ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Total chats: {pagination?.total ?? filteredChats.length}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Socket: {socketStatus}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {status === "loading" && chats.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">Loading support chats...</div>
          ) : null}

          {error ? <div className="p-4 text-sm text-red-600">{error}</div> : null}

          {status !== "loading" && filteredChats.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No support chats found.</div>
          ) : null}

          {filteredChats.map((chat) => {
            const isActive = chat.id === activeChat?.id;
            const userName = chat.user?.name || "Unknown user";
            const preview =
              chat.lastMessage?.content || "No messages available yet.";

            return (
              <button
                type="button"
                key={chat.id}
                onClick={() => dispatch(setActiveChat(chat.id))}
                className={`w-full flex items-center gap-3 p-4 text-left border-b transition-colors ${
                  isActive ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={chat.user?.avatar || ""} />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {userName}
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {formatTime(chat.lastMessageAt)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{preview}</div>
                </div>
                {chat.unreadCount > 0 ? (
                  <Badge className="bg-red-500 text-white hover:bg-red-500 rounded-full min-w-5 h-5 flex items-center justify-center px-1 text-xs">
                    {chat.unreadCount}
                  </Badge>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-green-100 px-6 py-4 border-b flex items-center justify-between">
          {activeChat ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activeUser?.avatar || ""} />
                  <AvatarFallback>{getInitials(activeUser?.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">
                    {activeUser?.name || "Unknown user"}
                  </div>
                  <div className="text-sm text-green-700">
                    {activeUser?.isOnline
                      ? "Online"
                      : `Last seen ${formatDateTime(activeUser?.lastSeen)}`}
                  </div>
                </div>
              </div>
              <Button className="bg-[#3EBF5A] hover:bg-[#2e8d42] text-white">
                <Check className="w-4 h-4 mr-2" />
                {activeChat.isArchived ? "Archived" : "Open"}
              </Button>
            </>
          ) : (
            <div className="text-sm text-gray-600">Select a support chat to view details.</div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeChat ? (
            <div className="max-w-3xl mx-auto">
              <div className="text-center text-sm text-gray-500 mb-6">
                Last activity {formatDateTime(activeChat.lastMessageAt)}
              </div>

              {detailsStatus === "loading" ? (
                <div className="mb-4 text-sm text-gray-500">
                  Loading chat details...
                </div>
              ) : null}

              {detailsError ? (
                <div className="mb-4 text-sm text-red-600">{detailsError}</div>
              ) : null}

              {messagesStatus === "loading" ? (
                <div className="mb-4 text-sm text-gray-500">Loading messages...</div>
              ) : null}

              {messagesError ? (
                <div className="mb-4 text-sm text-red-600">{messagesError}</div>
              ) : null}

              {orderedMessages.length > 0 ? (
                <div className="space-y-4">
                  {orderedMessages.map((chatMessage) => {
                    const isOwnMessage = chatMessage.senderId === currentUser?.id;

                    return (
                      <div
                        key={chatMessage.id}
                        className={`flex ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isOwnMessage ? (
                          <Avatar className="w-8 h-8 mr-2">
                            <AvatarImage src={chatMessage.sender?.avatar || ""} />
                            <AvatarFallback>
                              {getInitials(chatMessage.sender?.name || "User")}
                            </AvatarFallback>
                          </Avatar>
                        ) : null}
                        <div
                          className={`flex flex-col ${
                            isOwnMessage ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-4 py-3 max-w-md ${
                              isOwnMessage
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {chatMessage.content}
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            {isOwnMessage ? (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            ) : null}
                            <span>{formatTime(chatMessage.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  No messages found for this chat yet.
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              No support chat selected.
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <Button variant="ghost" size="sm" className="p-2" disabled>
              <Paperclip className="w-5 h-5 text-gray-500" />
            </Button>
            <Input
              type="text"
              placeholder="Type a reply..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              disabled={!activeChatId || sendStatus === "loading"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button variant="ghost" size="sm" className="p-2" disabled>
              <Smile className="w-5 h-5 text-gray-500" />
            </Button>
            <Button
              className="bg-gray-900 hover:bg-gray-800 text-white"
              disabled={!activeChatId || !message.trim() || sendStatus === "loading"}
              onClick={handleSendMessage}
            >
              {sendStatus === "loading" ? "Sending..." : "Send"}
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {sendError ? (
            <div className="max-w-3xl mx-auto mt-2 text-sm text-red-600">
              {sendError}
            </div>
          ) : null}
        </div>
      </div>

      <div className="w-80 bg-white border-l overflow-y-auto">
        <div className="p-6 border-b">
          {activeUser ? (
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={activeUser.avatar || ""} />
                <AvatarFallback>{getInitials(activeUser.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900">
                  {activeUser.name || "Unknown user"}
                </div>
                <div className="text-sm text-gray-500">
                  {activeUser.email || "No email provided"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">User details will appear here.</div>
          )}
        </div>

        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">About</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                {activeUser?.name || "Unknown user"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                {activeUser?.email || "No email provided"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                Joined chat: {formatDateTime(activeChat?.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                Total messages: {activeChat?.totalMessages ?? 0}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">Chat Summary</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>Unread: {activeChat?.unreadCount ?? 0}</p>
            <p>
              Participants:{" "}
              {activeChat?.participantCount ??
                activeChat?.participants?.length ??
                0}
            </p>
            <p>Assigned admins: {activeChat?.assignedAdmins?.length ?? 0}</p>
            <p>Type: {activeChat?.type || "support"}</p>
            <p>Total messages: {activeChat?.stats?.totalMessages ?? 0}</p>
            <p>
              First message: {formatDateTime(activeChat?.stats?.firstMessageAt)}
            </p>
            <p>
              Last admin reply:{" "}
              {formatDateTime(activeChat?.stats?.lastAdminMessageAt)}
            </p>
          </div>
        </div>

        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">Participants</h3>
          <div className="space-y-3">
            {(activeChat?.participants || []).length > 0 ? (
              activeChat.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={participant.user?.avatar || ""} />
                    <AvatarFallback>
                      {getInitials(participant.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {participant.user?.name || "Unknown user"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {participant.user?.role || participant.role} · unread{" "}
                      {participant.unreadCount ?? 0}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No participants found.</p>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Latest Message</h3>
          <div className="text-sm text-gray-600">
            {lastMessage?.content || "No latest message available."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessagingInterface;
