import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IProject } from '../components/project/types';

interface IProjectState {
  project: IProject | null;
}

const initialState: IProjectState = {
  project: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<IProject>) => {
      state.project = action.payload;
    },
  },
});

export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;
