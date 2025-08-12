import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/axios';

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchcurrentuser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/me');
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue('Not authenticated');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    isLoggedIn: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        ((state.isLoading = true), (state.error = null));
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        ((state.isLoading = false), (state.user = action.payload || null));
        state.isLoggedIn = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        console.log(' state in  reject  : ', state);
        ((state.isLoading = false), (state.user = null));
        state.isLoggedIn = false;
      });
  },
});

export default authSlice.reducer;
