import { createSlice } from '@reduxjs/toolkit';

import { IRootState } from '../../store';
import { getRandomAnimals, IAnimal } from './list.api';

export interface IListState {
  loading: boolean;
  list: IAnimal[];
  filteredList: IAnimal[];
};

const initialState: IListState = {
  list: [],
  filteredList: [],
  loading: false,
};

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    resetState: state => {
      Object.assign(state, initialState);
    },
    sortList: (state, { payload }: { payload: keyof IAnimal }) => {
      state.list = state.list.sort((a, b) => {
        if (a[payload] < b[payload]) {
          return -1;
        }
        if (a[payload] > b[payload]) {
          return 1;
        }
        return 0;
      });
      state.filteredList = state.filteredList.sort((a, b) => {
        if (a[payload] < b[payload]) {
          return -1;
        }
        if (a[payload] > b[payload]) {
          return 1;
        }
        return 0;
      });
    },
    filterList: (state, { payload }: { payload: string }) => {
      state.filteredList = state.list
        .filter(animal => animal.name.toLowerCase().includes(payload.toLowerCase()));
    }
  },
  extraReducers: builder => {
    builder.addCase(getRandomAnimals.pending, state => {
      state.loading = true;
    });
    builder.addCase(getRandomAnimals.fulfilled, (state, action) => {
      state.list = action.payload;
      state.filteredList = [...state.list];
      state.loading = false;
    });
    builder.addCase(getRandomAnimals.rejected, state => {
      state.loading = false;
    });
  },
});

export const selectList = (
  state: IRootState
) => state.list as IListState;

export const {
  resetState,
  sortList,
  filterList,
} = listSlice.actions;

const listReducer = listSlice.reducer;
export default listReducer;
