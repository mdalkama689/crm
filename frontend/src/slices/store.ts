import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/AuthSlice';
import sidebarReducer from './sidebar/SideBarSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
