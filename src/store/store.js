import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import supportChatReducer from "./supportChatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    supportChats: supportChatReducer,
  },
});
