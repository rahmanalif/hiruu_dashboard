import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import businessesReducer from "./businessesSlice";
import couponsReducer from "./couponsSlice";
import maintainerRolesReducer from "./maintainerRolesSlice";
import supportChatReducer from "./supportChatSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    businesses: businessesReducer,
    coupons: couponsReducer,
    maintainerRoles: maintainerRolesReducer,
    supportChats: supportChatReducer,
    users: usersReducer,
  },
});
