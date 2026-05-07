# React Native Support/Chat Integration Guide

Complete guide for integrating the support and chat system in React Native with Socket.IO real-time functionality.

## Table of Contents

1. [Installation](#installation)
2. [Socket Setup](#socket-setup)
3. [REST API Integration](#rest-api-integration)
4. [Socket Events](#socket-events)
5. [Implementation Examples](#implementation-examples)
6. [Best Practices](#best-practices)

---

## Installation

Install required dependencies:

```bash
npm install socket.io-client axios
# or
yarn add socket.io-client axios
```

---

## Socket Setup

### Connection Configuration

```typescript
import io from 'socket.io-client';

const SOCKET_BASE_URL = 'https://your-api-domain.com';
const accessToken = 'your-jwt-token'; // Get from auth

const chatSocket = io(`${SOCKET_BASE_URL}/chat`, {
  transports: ['websocket'],
  auth: { token: accessToken },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});
```

### Connection Lifecycle

```typescript
// Connection events
chatSocket.on('connect', () => {
  console.log('Connected to chat socket');
});

chatSocket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

chatSocket.on('error', (error) => {
  console.error('Socket error:', error);
});
```


---

## REST API Integration

### Base Configuration

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://your-api-domain.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken(); // Your token retrieval method
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Chat Room APIs

#### 1. Get User Chat Rooms

```typescript
interface ChatRoom {
  id: string;
  type: 'business_group' | 'direct' | 'support';
  name: string;
  description?: string;
  avatar?: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    sender: { name: string };
  };
  unreadCount: number;
  participants: Array<{
    userId: string;
    user: { name: string; avatar: string };
  }>;
  isActive: boolean;
  createdAt: string;
}

const getChatRooms = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'business_group' | 'direct' | 'support';
  isActive?: boolean;
}) => {
  const response = await apiClient.get('/chat/rooms', { params });
  return response.data;
};
```

#### 2. Get Chat Room Details

```typescript
const getChatRoomById = async (chatRoomId: string) => {
  const response = await apiClient.get(`/chat/rooms/${chatRoomId}`);
  return response.data;
};
```

#### 3. Create Chat Room

```typescript
interface CreateChatRoomDto {
  type: 'business_group' | 'direct' | 'support';
  name?: string;
  description?: string;
  participantIds?: string[];
  businessId?: string;
  referenceRecruitmentId?: string;
}

const createChatRoom = async (data: CreateChatRoomDto) => {
  const response = await apiClient.post('/chat/rooms', data);
  return response.data;
};
```

### Message APIs

#### 1. Get Messages

```typescript
interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'video' | 'audio' | 'voice_note' | 'system';
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  attachments?: Array<{
    type: string;
    url: string;
    fileName?: string;
    fileSize?: number;
  }>;
  replyTo?: Message;
  mentions?: string[];
  isRead: boolean;
  createdAt: string;
}

const getChatMessages = async (
  chatRoomId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    senderId?: string;
    after?: string;
    before?: string;
  }
) => {
  const response = await apiClient.get(`/chat/rooms/${chatRoomId}/messages`, { params });
  return response.data;
};
```

#### 2. Send Text Message (REST)

```typescript
interface SendMessageDto {
  content: string;
  type?: 'text' | 'image' | 'file' | 'video' | 'audio' | 'voice_note';
  replyToId?: string;
  mentions?: string[];
}

const sendMessage = async (chatRoomId: string, data: SendMessageDto) => {
  const response = await apiClient.post(`/chat/rooms/${chatRoomId}/messages`, data);
  return response.data;
};
```

#### 3. Send Message with Media

```typescript
const sendMessageWithMedia = async (
  chatRoomId: string,
  content: string,
  mediaFiles: Array<{ uri: string; type: string; name: string }>
) => {
  const formData = new FormData();
  
  if (content) {
    formData.append('content', content);
  }
  
  mediaFiles.forEach((file) => {
    formData.append('media', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as any);
  });

  const response = await apiClient.post(
    `/chat/rooms/${chatRoomId}/messages`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};
```

#### 4. Mark Message as Read

```typescript
const markMessageAsRead = async (messageId: string) => {
  const response = await apiClient.patch(`/chat/messages/${messageId}/read`);
  return response.data;
};
```

#### 5. Mark All Chat Messages as Read

```typescript
const markChatAsRead = async (chatRoomId: string) => {
  const response = await apiClient.patch(`/chat/rooms/${chatRoomId}/read`);
  return response.data;
};
```

### Participant Management

#### 1. Add Participant

```typescript
const addParticipant = async (chatRoomId: string, userId: string) => {
  const response = await apiClient.post(`/chat/rooms/${chatRoomId}/participants`, {
    userId,
  });
  return response.data;
};
```

#### 2. Remove Participant

```typescript
const removeParticipant = async (chatRoomId: string, userId: string) => {
  const response = await apiClient.patch(
    `/chat/rooms/${chatRoomId}/participants/${userId}/remove`
  );
  return response.data;
};
```

### Support/FAQ APIs

#### 1. Get FAQ List

```typescript
interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

const getFAQs = async () => {
  const response = await apiClient.get('/settings/faq');
  return response.data;
};
```


---

## Socket Events

### Client → Server Events

#### 1. Send Message

```typescript
chatSocket.emit('send_message', {
  chatRoomId: 'uuid',
  content: 'Hello!',
  type: 'text', // optional: 'text' | 'image' | 'file' | 'video' | 'audio' | 'voice_note'
  replyToId: 'uuid', // optional
  mentions: ['userId1', 'userId2'], // optional
});
```

#### 2. Typing Indicators

```typescript
// Start typing
chatSocket.emit('typing_start', {
  chatRoomId: 'uuid',
});

// Stop typing
chatSocket.emit('typing_stop', {
  chatRoomId: 'uuid',
});
```

#### 3. Mark as Read

```typescript
// Mark specific message as read
chatSocket.emit('mark_as_read', {
  chatRoomId: 'uuid',
  messageId: 'uuid', // optional - if omitted, marks all messages as read
});

// Mark all messages in chat as read
chatSocket.emit('mark_as_read', {
  chatRoomId: 'uuid',
});
```

#### 4. Join/Leave Chat Room

```typescript
// Join a chat room
chatSocket.emit('join_chat', {
  chatRoomId: 'uuid',
});

// Leave a chat room
chatSocket.emit('leave_chat', {
  chatRoomId: 'uuid',
});
```

### Server → Client Events

#### 1. New Message

```typescript
chatSocket.on('new_message', (data: {
  chatRoomId: string;
  message: Message;
}) => {
  console.log('New message received:', data);
  // Update your message list
  // Show notification if not in current chat
});
```

#### 2. User Typing

```typescript
chatSocket.on('user_typing', (data: {
  userId: string;
  userName: string;
  chatRoomId: string;
  isTyping: boolean;
}) => {
  console.log(`${data.userName} is ${data.isTyping ? 'typing' : 'stopped typing'}`);
  // Update typing indicator UI
});
```

#### 3. Message Read Receipt

```typescript
chatSocket.on('message_read', (data: {
  userId: string;
  userName: string;
  chatRoomId: string;
  messageId?: string;
}) => {
  console.log(`${data.userName} read the message`);
  // Update message read status
});
```

#### 4. User Online/Offline Status

```typescript
chatSocket.on('user_online', (data: {
  userId: string;
  name: string;
  avatar: string;
}) => {
  console.log(`${data.name} is online`);
  // Update user status in UI
});

chatSocket.on('user_offline', (data: {
  userId: string;
}) => {
  console.log(`User ${data.userId} is offline`);
  // Update user status in UI
});
```

#### 5. Chat Room Events

```typescript
chatSocket.on('joined_chat', (data: {
  chatRoomId: string;
}) => {
  console.log('Successfully joined chat room');
});

chatSocket.on('left_chat', (data: {
  chatRoomId: string;
}) => {
  console.log('Left chat room');
});
```

#### 6. Error Handling

```typescript
chatSocket.on('error', (data: {
  message: string;
}) => {
  console.error('Socket error:', data.message);
  // Show error to user
});
```

---

## Implementation Examples

### Complete Chat Service

```typescript
// services/ChatService.ts
import io, { Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

class ChatService extends EventEmitter {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(`${SOCKET_BASE_URL}/chat`, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Chat connected');
      this.reconnectAttempts = 0;
      this.emit('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Chat disconnected:', reason);
      this.emit('disconnected', reason);
    });

    this.socket.on('new_message', (data) => {
      this.emit('new_message', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('message_read', (data) => {
      this.emit('message_read', data);
    });

    this.socket.on('user_online', (data) => {
      this.emit('user_online', data);
    });

    this.socket.on('user_offline', (data) => {
      this.emit('user_offline', data);
    });

    this.socket.on('error', (data) => {
      this.emit('error', data);
    });
  }

  sendMessage(chatRoomId: string, content: string, options?: {
    type?: string;
    replyToId?: string;
    mentions?: string[];
  }) {
    this.socket?.emit('send_message', {
      chatRoomId,
      content,
      ...options,
    });
  }

  startTyping(chatRoomId: string) {
    this.socket?.emit('typing_start', { chatRoomId });
  }

  stopTyping(chatRoomId: string) {
    this.socket?.emit('typing_stop', { chatRoomId });
  }

  markAsRead(chatRoomId: string, messageId?: string) {
    this.socket?.emit('mark_as_read', { chatRoomId, messageId });
  }

  joinChat(chatRoomId: string) {
    this.socket?.emit('join_chat', { chatRoomId });
  }

  leaveChat(chatRoomId: string) {
    this.socket?.emit('leave_chat', { chatRoomId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new ChatService();
```


### React Native Chat Screen Component

```typescript
// screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ChatService from '../services/ChatService';
import { getChatMessages, markChatAsRead } from '../api/chat';

interface ChatScreenProps {
  route: {
    params: {
      chatRoomId: string;
      chatRoomName: string;
    };
  };
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { chatRoomId, chatRoomName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Load initial messages
    loadMessages();

    // Join chat room
    ChatService.joinChat(chatRoomId);

    // Mark messages as read when entering
    markChatAsRead(chatRoomId);

    // Setup socket listeners
    ChatService.on('new_message', handleNewMessage);
    ChatService.on('user_typing', handleUserTyping);
    ChatService.on('message_read', handleMessageRead);

    return () => {
      // Cleanup
      ChatService.leaveChat(chatRoomId);
      ChatService.off('new_message', handleNewMessage);
      ChatService.off('user_typing', handleUserTyping);
      ChatService.off('message_read', handleMessageRead);
    };
  }, [chatRoomId]);

  const loadMessages = async () => {
    try {
      const response = await getChatMessages(chatRoomId, {
        page: 1,
        limit: 50,
      });
      setMessages(response.data.data.reverse());
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewMessage = (data: { chatRoomId: string; message: Message }) => {
    if (data.chatRoomId === chatRoomId) {
      setMessages((prev) => [...prev, data.message]);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Mark as read
      ChatService.markAsRead(chatRoomId);
    }
  };

  const handleUserTyping = (data: {
    userId: string;
    userName: string;
    chatRoomId: string;
    isTyping: boolean;
  }) => {
    if (data.chatRoomId === chatRoomId) {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.userName);
        } else {
          newSet.delete(data.userName);
        }
        return newSet;
      });
    }
  };

  const handleMessageRead = (data: {
    userId: string;
    chatRoomId: string;
    messageId?: string;
  }) => {
    if (data.chatRoomId === chatRoomId) {
      // Update message read status in UI
      setMessages((prev) =>
        prev.map((msg) =>
          !data.messageId || msg.id === data.messageId
            ? { ...msg, isRead: true }
            : msg
        )
      );
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);

    // Handle typing indicator
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      ChatService.startTyping(chatRoomId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      ChatService.stopTyping(chatRoomId);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;

    // Send via socket for real-time delivery
    ChatService.sendMessage(chatRoomId, inputText.trim());

    // Clear input
    setInputText('');

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      ChatService.stopTyping(chatRoomId);
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender.id === currentUserId; // Get from auth context

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          marginVertical: 4,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            maxWidth: '70%',
            backgroundColor: isOwnMessage ? '#007AFF' : '#E5E5EA',
            borderRadius: 16,
            padding: 12,
          }}
        >
          {!isOwnMessage && (
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
              {item.sender.name}
            </Text>
          )}
          <Text style={{ color: isOwnMessage ? '#FFF' : '#000' }}>
            {item.content}
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: isOwnMessage ? '#FFF' : '#8E8E93',
              marginTop: 4,
            }}
          >
            {new Date(item.createdAt).toLocaleTimeString()}
            {isOwnMessage && item.isRead && ' ✓✓'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <View style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, color: '#8E8E93', fontStyle: 'italic' }}>
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </Text>
          </View>
        )}

        {/* Input Area */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#F2F2F7',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
            }}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={handleInputChange}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={inputText.trim().length === 0}
            style={{
              backgroundColor: inputText.trim().length > 0 ? '#007AFF' : '#C7C7CC',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 18 }}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
```


### Chat List Screen Component

```typescript
// screens/ChatListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChatService from '../services/ChatService';
import { getChatRooms } from '../api/chat';

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChatRooms();

    // Listen for new messages to update unread counts
    ChatService.on('new_message', handleNewMessage);

    return () => {
      ChatService.off('new_message', handleNewMessage);
    };
  }, []);

  const loadChatRooms = async () => {
    try {
      const response = await getChatRooms({
        page: 1,
        limit: 50,
        isActive: true,
      });
      setChatRooms(response.data);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChatRooms();
    setRefreshing(false);
  };

  const handleNewMessage = (data: { chatRoomId: string; message: Message }) => {
    // Update chat room list with new message
    setChatRooms((prev) =>
      prev.map((room) =>
        room.id === data.chatRoomId
          ? {
              ...room,
              lastMessage: {
                content: data.message.content,
                createdAt: data.message.createdAt,
                sender: data.message.sender,
              },
              unreadCount: room.unreadCount + 1,
            }
          : room
      )
    );
  };

  const handleChatPress = (chatRoom: ChatRoom) => {
    navigation.navigate('Chat', {
      chatRoomId: chatRoom.id,
      chatRoomName: chatRoom.name,
    });
  };

  const renderChatRoom = ({ item }: { item: ChatRoom }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5EA',
        }}
        onPress={() => handleChatPress(item)}
      >
        {/* Avatar */}
        <Image
          source={{ uri: item.avatar || '/uploads/users/user.png' }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 12,
          }}
        />

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {item.name}
            </Text>
            {item.lastMessage && (
              <Text style={{ fontSize: 12, color: '#8E8E93' }}>
                {new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text
              style={{
                fontSize: 14,
                color: '#8E8E93',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {item.lastMessage?.content || 'No messages yet'}
            </Text>
            {item.unreadCount > 0 && (
              <View
                style={{
                  backgroundColor: '#007AFF',
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 6,
                  marginLeft: 8,
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <FlatList
        data={chatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#8E8E93' }}>No chats yet</Text>
          </View>
        }
      />
    </View>
  );
};

export default ChatListScreen;
```

### Support/FAQ Screen Component

```typescript
// screens/SupportScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getFAQs, createChatRoom } from '../api/chat';
import { useNavigation } from '@react-navigation/native';

const SupportScreen: React.FC = () => {
  const navigation = useNavigation();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const response = await getFAQs();
      setFaqs(response.data);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    }
  };

  const handleContactSupport = async () => {
    try {
      // Create or get support chat room
      const response = await createChatRoom({
        type: 'support',
        name: 'Support Chat',
      });

      // Navigate to chat
      navigation.navigate('Chat', {
        chatRoomId: response.data.id,
        chatRoomName: 'Support Chat',
      });
    } catch (error) {
      console.error('Failed to create support chat:', error);
    }
  };

  const toggleFaq = (faqId: string) => {
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>
          Find answers to common questions or contact our support team
        </Text>
      </View>

      {/* Contact Support Button */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={handleContactSupport}
      >
        <Text style={styles.contactButtonText}>💬 Contact Support</Text>
      </TouchableOpacity>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => toggleFaq(faq.id)}
            >
              <Text style={styles.faqQuestionText}>{faq.question}</Text>
              <Text style={styles.faqIcon}>
                {expandedFaqId === faq.id ? '−' : '+'}
              </Text>
            </TouchableOpacity>

            {expandedFaqId === faq.id && (
              <View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  faqSection: {
    backgroundColor: '#FFF',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginBottom: 8,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  faqIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  faqAnswer: {
    paddingBottom: 12,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
  },
});

export default SupportScreen;
```


### Context Provider for Chat

```typescript
// contexts/ChatContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import ChatService from '../services/ChatService';
import { useAuth } from './AuthContext'; // Your auth context

interface ChatContextType {
  isConnected: boolean;
  totalUnreadCount: number;
  onlineUsers: Set<string>;
}

const ChatContext = createContext<ChatContextType>({
  isConnected: false,
  totalUnreadCount: 0,
  onlineUsers: new Set(),
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, accessToken } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user && accessToken) {
      // Connect to chat socket
      ChatService.connect(accessToken);

      // Setup listeners
      ChatService.on('connected', handleConnected);
      ChatService.on('disconnected', handleDisconnected);
      ChatService.on('new_message', handleNewMessage);
      ChatService.on('user_online', handleUserOnline);
      ChatService.on('user_offline', handleUserOffline);

      return () => {
        ChatService.off('connected', handleConnected);
        ChatService.off('disconnected', handleDisconnected);
        ChatService.off('new_message', handleNewMessage);
        ChatService.off('user_online', handleUserOnline);
        ChatService.off('user_offline', handleUserOffline);
        ChatService.disconnect();
      };
    }
  }, [user, accessToken]);

  const handleConnected = () => {
    setIsConnected(true);
  };

  const handleDisconnected = () => {
    setIsConnected(false);
  };

  const handleNewMessage = (data: { chatRoomId: string; message: Message }) => {
    // Increment unread count if not in the chat room
    setTotalUnreadCount((prev) => prev + 1);
  };

  const handleUserOnline = (data: { userId: string }) => {
    setOnlineUsers((prev) => new Set(prev).add(data.userId));
  };

  const handleUserOffline = (data: { userId: string }) => {
    setOnlineUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(data.userId);
      return newSet;
    });
  };

  return (
    <ChatContext.Provider
      value={{
        isConnected,
        totalUnreadCount,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
```

### App Setup

```typescript
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import SupportScreen from './screens/SupportScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="ChatList"
              component={ChatListScreen}
              options={{ title: 'Messages' }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={({ route }) => ({
                title: route.params?.chatRoomName || 'Chat',
              })}
            />
            <Stack.Screen
              name="Support"
              component={SupportScreen}
              options={{ title: 'Support' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
```

---

## Best Practices

### 1. Connection Management

```typescript
// Reconnect on app state change
import { AppState } from 'react-native';

useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      // Reconnect when app comes to foreground
      if (!ChatService.isConnected()) {
        ChatService.connect(accessToken);
      }
    } else if (nextAppState === 'background') {
      // Optionally disconnect when app goes to background
      // ChatService.disconnect();
    }
  });

  return () => {
    subscription.remove();
  };
}, [accessToken]);
```

### 2. Error Handling

```typescript
// Handle socket errors gracefully
ChatService.on('error', (data) => {
  console.error('Chat error:', data.message);
  
  // Show user-friendly error
  Alert.alert('Connection Error', 'Unable to connect to chat. Please try again.');
  
  // Optionally retry connection
  setTimeout(() => {
    if (!ChatService.isConnected()) {
      ChatService.connect(accessToken);
    }
  }, 3000);
});
```

### 3. Typing Indicator Optimization

```typescript
// Debounce typing events to reduce server load
import { debounce } from 'lodash';

const debouncedStopTyping = useRef(
  debounce((chatRoomId: string) => {
    ChatService.stopTyping(chatRoomId);
  }, 2000)
).current;

const handleInputChange = (text: string) => {
  setInputText(text);

  if (text.length > 0) {
    if (!isTyping) {
      setIsTyping(true);
      ChatService.startTyping(chatRoomId);
    }
    debouncedStopTyping(chatRoomId);
  } else {
    setIsTyping(false);
    ChatService.stopTyping(chatRoomId);
  }
};
```

### 4. Message Pagination

```typescript
// Load more messages when scrolling to top
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);

const loadMoreMessages = async () => {
  if (loading || !hasMore) return;

  setLoading(true);
  try {
    const response = await getChatMessages(chatRoomId, {
      page: page + 1,
      limit: 50,
    });

    if (response.data.data.length > 0) {
      setMessages((prev) => [...response.data.data.reverse(), ...prev]);
      setPage(page + 1);
    } else {
      setHasMore(false);
    }
  } catch (error) {
    console.error('Failed to load more messages:', error);
  } finally {
    setLoading(false);
  }
};

// In FlatList
<FlatList
  onEndReached={loadMoreMessages}
  onEndReachedThreshold={0.5}
  inverted // For chat-style scrolling
  // ... other props
/>
```

### 5. Push Notifications Integration

```typescript
// Handle push notifications for new messages
import messaging from '@react-native-firebase/messaging';

useEffect(() => {
  // Handle foreground messages
  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground message:', remoteMessage);
    
    // Show local notification or update UI
    if (remoteMessage.data?.type === 'new_message') {
      // Update chat list or show in-app notification
    }
  });

  // Handle notification tap when app is in background
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened app:', remoteMessage);
    
    if (remoteMessage.data?.chatRoomId) {
      navigation.navigate('Chat', {
        chatRoomId: remoteMessage.data.chatRoomId,
        chatRoomName: remoteMessage.data.chatRoomName,
      });
    }
  });

  return unsubscribe;
}, []);
```

### 6. Offline Support

```typescript
// Queue messages when offline
import AsyncStorage from '@react-native-async-storage/async-storage';

const sendMessageWithOfflineSupport = async (
  chatRoomId: string,
  content: string
) => {
  const tempMessage = {
    id: `temp-${Date.now()}`,
    chatRoomId,
    content,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  // Add to UI immediately
  setMessages((prev) => [...prev, tempMessage]);

  try {
    if (ChatService.isConnected()) {
      ChatService.sendMessage(chatRoomId, content);
    } else {
      // Queue for later
      const queue = await AsyncStorage.getItem('message_queue');
      const messages = queue ? JSON.parse(queue) : [];
      messages.push({ chatRoomId, content });
      await AsyncStorage.setItem('message_queue', JSON.stringify(messages));
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    // Mark message as failed
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
      )
    );
  }
};

// Process queued messages when reconnected
ChatService.on('connected', async () => {
  const queue = await AsyncStorage.getItem('message_queue');
  if (queue) {
    const messages = JSON.parse(queue);
    for (const msg of messages) {
      ChatService.sendMessage(msg.chatRoomId, msg.content);
    }
    await AsyncStorage.removeItem('message_queue');
  }
});
```

### 7. Memory Management

```typescript
// Clean up old messages to prevent memory issues
const MAX_MESSAGES_IN_MEMORY = 100;

useEffect(() => {
  if (messages.length > MAX_MESSAGES_IN_MEMORY) {
    setMessages((prev) => prev.slice(-MAX_MESSAGES_IN_MEMORY));
  }
}, [messages]);
```

### 8. Security Best Practices

```typescript
// Always validate and sanitize user input
const sanitizeMessage = (content: string): string => {
  return content.trim().slice(0, 1000); // Max 1000 characters
};

// Refresh token before it expires
const refreshTokenIfNeeded = async () => {
  const tokenExpiry = await AsyncStorage.getItem('token_expiry');
  if (tokenExpiry && Date.now() > parseInt(tokenExpiry) - 60000) {
    // Refresh token 1 minute before expiry
    const newToken = await refreshAccessToken();
    ChatService.disconnect();
    ChatService.connect(newToken);
  }
};
```

---

## Troubleshooting

### Common Issues

1. **Socket not connecting**
   - Verify the token is valid and not expired
   - Check network connectivity
   - Ensure SOCKET_BASE_URL is correct
   - Check CORS settings on the server

2. **Messages not appearing in real-time**
   - Verify socket is connected: `ChatService.isConnected()`
   - Check if user has joined the chat room
   - Verify event listeners are properly set up

3. **Typing indicator not working**
   - Ensure typing events are being emitted
   - Check debounce/timeout logic
   - Verify other users are in the same chat room

4. **High memory usage**
   - Implement message pagination
   - Limit messages in memory
   - Clean up event listeners properly

5. **Connection drops frequently**
   - Increase reconnection attempts
   - Implement exponential backoff
   - Handle app state changes properly

---

## Additional Resources

- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [React Native Navigation](https://reactnavigation.org/)
- [Axios Documentation](https://axios-http.com/)
- [React Native Best Practices](https://reactnative.dev/docs/performance)

---

## Support

For additional help or questions:
- Create a support chat room using the API
- Check the FAQ section in the app
- Contact the development team

