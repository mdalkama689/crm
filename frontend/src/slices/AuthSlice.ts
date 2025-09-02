import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../api/axios';
import type { ApiResponse } from '../types/ApiResponse';

interface AvatarUrlReponse extends ApiResponse {
  avatarUrl: string;
}

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

export const fetchGravatarUrl = createAsyncThunk(
  'auth/gravatarurl',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get<AvatarUrlReponse>(
        '/get-avatar-url-from-gravatar',
      );

      if (response.data.success && response.data.avatarUrl) {
        if (
          response.data.avatarUrl.trim() ||
          response.data.avatarUrl.trim() !== ''
        ) {
          return response.data.avatarUrl;
        }
      }

      return '';
    } catch (error) {
      return thunkAPI.rejectWithValue(
        'Something went wrong while fetching gravatar url!',
      );
    }
  },
);

interface UserProps {
  fullname: string;
  email: string;
  role: string;
  tenantId: string;
}

interface AuthProps {
  user: UserProps | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: null;
  avatarUrl: string;
}
const initialState: AuthProps = {
  user: null,
  isLoading: true,
  isLoggedIn: false,
  error: null,
  avatarUrl: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
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
        ((state.isLoading = false), (state.user = null));
        state.isLoggedIn = false;
      })

      .addCase(fetchGravatarUrl.fulfilled, (state, action) => {
        state.avatarUrl = action.payload || '';
      });
  },
});

export default authSlice.reducer;
