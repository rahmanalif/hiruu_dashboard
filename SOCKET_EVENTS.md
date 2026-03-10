# Socket Events Documentation

This document describes all WebSocket events available in the application, organized by namespace.

## Table of Contents

- [Chat Namespace (`/chat`)](#chat-namespace-chat)
  - [Client Events (Incoming)](#chat-client-events-incoming)
  - [Server Events (Outgoing)](#chat-server-events-outgoing)
- [Calls Namespace (`/calls`)](#calls-namespace-calls)
  - [Client Events (Incoming)](#calls-client-events-incoming)
  - [Server Events (Outgoing)](#calls-server-events-outgoing)

---

## Chat Namespace (`/chat`)

### Connection

**Namespace:** `/chat`

**Authentication:** Required via JWT token in `auth.token` or `authorization` header

**CORS:** Enabled for all origins

### Chat Client Events (Incoming)

Events that clients can send to the server.

#### `send_message`

Send a new message to a chat room.

**Body:**
```json
{
  "chatRoomId": "string",
  "content": "string",
  "type": "string (optional)",
  "replyToId": "string (optional)",
  "mentions": ["string"] // optional array of user IDs
}
```

**Response Events:**
- `new_message` - Emitted to all participants in the chat room
- `error` - Emitted to sender if error occurs

---

#### `typing_start`

Notify other participants that the user started typing.

**Body:**
```json
{
  "chatRoomId": "string"
}
```

**Response Events:**
- `user_typing` - Emitted to other participants in the chat room

---

#### `typing_stop`

Notify other participants that the user stopped typing.

**Body:**
```json
{
  "chatRoomId": "string"
}
```

**Response Events:**
- `user_typing` - Emitted to other participants in the chat room

---

#### `mark_as_read`

Mark a message or entire chat as read.

**Body:**
```json
{
  "chatRoomId": "string",
  "messageId": "string (optional)" // If omitted, marks entire chat as read
}
```

**Response Events:**
- `message_read` - Emitted to other participants in the chat room
- `error` - Emitted to sender if error occurs

---

#### `join_chat`

Join a specific chat room to receive its events.

**Body:**
```json
{
  "chatRoomId": "string"
}
```

**Response Events:**
- `joined_chat` - Emitted to the client
- `error` - Emitted if user is not a participant

---

#### `leave_chat`

Leave a specific chat room.

**Body:**
```json
{
  "chatRoomId": "string"
}
```

**Response Events:**
- `left_chat` - Emitted to the client

---

### Chat Server Events (Outgoing)

Events that the server emits to clients.

#### `user_online`

Broadcasted when a user connects.

**Body:**
```json
{
  "userId": "string",
  "name": "string",
  "avatar": "string"
}
```

---

#### `user_offline`

Broadcasted when a user disconnects.

**Body:**
```json
{
  "userId": "string"
}
```

---

#### `new_message`

Emitted to all participants when a new message is sent.

**Body:**
```json
{
  "message": {
    // Full message object from database
  },
  "chatRoomId": "string"
}
```

---

#### `user_typing`

Emitted when a user starts or stops typing.

**Body:**
```json
{
  "userId": "string",
  "userName": "string",
  "chatRoomId": "string",
  "isTyping": true // or false
}
```

---

#### `message_read`

Emitted when a user marks a message or chat as read.

**Body:**
```json
{
  "userId": "string",
  "userName": "string",
  "chatRoomId": "string",
  "messageId": "string (optional)"
}
```

---

#### `joined_chat`

Confirmation that the client joined a chat room.

**Body:**
```json
{
  "chatRoomId": "string"
}
```

---

#### `left_chat`

Confirmation that the client left a chat room.

**Body:**
```json
{
  "chatRoomId": "string"
}
```

---

#### `error`

Emitted when an error occurs.

**Body:**
```json
{
  "message": "string"
}
```

---

## Calls Namespace (`/calls`)

### Connection

**Namespace:** `/calls`

**Authentication:** Required via JWT token in `auth.token` or `authorization` header

**CORS:** Enabled for all origins

### Calls Client Events (Incoming)

Events that clients can send to the server.

#### `join_call`

Join a call and receive information about other participants.

**Body:**
```json
{
  "callId": "string"
}
```

**Response Events:**
- `participant_joined` - Emitted to other participants
- `call_participants` - Emitted to the joining user with current participants
- `error` - Emitted if user is not authorized or call doesn't exist

---

#### `leave_call`

Leave a call.

**Body:**
```json
{
  "callId": "string"
}
```

**Response Events:**
- `participant_left` - Emitted to other participants

---

#### `media_state_changed`

Update media state (microphone, camera, screen sharing).

**Body:**
```json
{
  "callId": "string",
  "isMicMuted": true, // optional
  "isCameraOff": true, // optional
  "isSharingScreen": false // optional
}
```

**Response Events:**
- `participant_media_changed` - Emitted to other participants
- `error` - Emitted if error occurs

---

#### `call_status_changed`

Update call participant status.

**Body:**
```json
{
  "callId": "string",
  "status": "string", // pending, ringing, active, declined, missed, left
  "reason": "string (optional)" // Decline reason if status is 'declined'
}
```

**Response Events:**
- `participant_status_changed` - Emitted to other participants
- `error` - Emitted if invalid status

---

### Calls Server Events (Outgoing)

Events that the server emits to clients.

#### `participant_joined`

Emitted when a participant joins the call.

**Body:**
```json
{
  "userId": "string",
  "userName": "string",
  "avatar": "string"
}
```

---

#### `participant_left`

Emitted when a participant leaves the call.

**Body:**
```json
{
  "userId": "string",
  "userName": "string"
}
```

---

#### `participant_disconnected`

Emitted when a participant disconnects unexpectedly.

**Body:**
```json
{
  "userId": "string",
  "userName": "string"
}
```

---

#### `call_participants`

Sent to a user when they join a call, containing current participants.

**Body:**
```json
{
  "callId": "string",
  "participants": [
    {
      "userId": "string",
      "userName": "string",
      "avatar": "string",
      "status": "string",
      "isMicMuted": true,
      "isCameraOff": false,
      "isSharingScreen": false
    }
  ]
}
```

---

#### `participant_media_changed`

Emitted when a participant changes their media state.

**Body:**
```json
{
  "callId": "string",
  "userId": "string",
  "userName": "string",
  "isMicMuted": true, // optional
  "isCameraOff": true, // optional
  "isSharingScreen": false // optional
}
```

---

#### `participant_status_changed`

Emitted when a participant's status changes.

**Body:**
```json
{
  "userId": "string",
  "userName": "string",
  "status": "string",
  "reason": "string (optional)"
}
```

---

#### `incoming_call`

Emitted to specific users when they receive an incoming call.

**Body:**
```json
{
  "callId": "string"
  // Additional call data
}
```

---

#### `call_ended`

Emitted to all participants when a call ends.

**Body:**
```json
{
  "callId": "string",
  "reason": "string",
  "endedAt": "ISO 8601 timestamp"
}
```

---

#### `error`

Emitted when an error occurs.

**Body:**
```json
{
  "message": "string"
}
```

---

## Connection Lifecycle

### Chat Namespace

1. **Connect** - Client connects with JWT token
2. **Authentication** - Server verifies token and loads user
3. **Auto-join** - User automatically joins all their active chat rooms
4. **Online Status** - User marked as online, `user_online` broadcasted
5. **Disconnect** - User marked as offline, `user_offline` broadcasted

### Calls Namespace

1. **Connect** - Client connects with JWT token
2. **Authentication** - Server verifies token and loads user
3. **Manual Join** - User must explicitly join calls via `join_call` event
4. **Auto-leave** - On disconnect, user is automatically removed from all active calls
5. **Disconnect** - `participant_disconnected` emitted to other call participants

---

## Error Handling

All errors are emitted via the `error` event with a message:

```json
{
  "message": "Error description"
}
```

Common error messages:
- Chat not authenticated
- Not participant in chat
- Not authenticated (calls)
- Not participant in call
- Call ID is required
- Invalid participant status

---

## Notes

- All timestamps are in ISO 8601 format
- User IDs are UUIDs
- Chat rooms and calls use UUID identifiers
- Multiple socket connections per user are supported in the calls namespace
- Users are automatically removed from calls on disconnect
- Push notifications are sent to offline users for new messages (implementation pending)
