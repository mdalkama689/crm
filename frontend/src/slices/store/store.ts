import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../AuthSlice';
import sidebarReducer from '../SideBarSlice';
import projectSlice from '../ProjectSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
    project: projectSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
