import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import maintainerRolesReducer from "./maintainerRolesSlice";
import supportChatReducer from "./supportChatSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    maintainerRoles: maintainerRolesReducer,
    supportChats: supportChatReducer,
    users: usersReducer,
  },
});
