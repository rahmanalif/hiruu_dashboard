import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import businessesReducer from "./businessesSlice";
import coinTransactionsReducer from "./coinTransactionsSlice";
import couponsReducer from "./couponsSlice";
import maintainerRolesReducer from "./maintainerRolesSlice";
import notificationsReducer from "./notificationsSlice";
import supportChatReducer from "./supportChatSlice";
import transactionsReducer from "./transactionsSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    businesses: businessesReducer,
    coinTransactions: coinTransactionsReducer,
    coupons: couponsReducer,
    maintainerRoles: maintainerRolesReducer,
    notifications: notificationsReducer,
    supportChats: supportChatReducer,
    transactions: transactionsReducer,
    users: usersReducer,
  },
});
