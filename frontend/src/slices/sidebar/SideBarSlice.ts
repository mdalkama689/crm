import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isSideBarOpen: false,
  currentSideBarTab: 'dashboard',
  notificationCount: 0,
};

const sideBarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
    setCurrentSideBarTab: (state, action: PayloadAction<string>) => {
      state.currentSideBarTab = action.payload.trim().toLowerCase();
    },
    setNotificationCount: (state, action: PayloadAction<number>) => {
      state.notificationCount = action.payload;
    },
  },
});

export const { toggleSidebar, setCurrentSideBarTab, setNotificationCount } =
  sideBarSlice.actions;

export default sideBarSlice.reducer;
