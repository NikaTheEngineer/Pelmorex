import { configureStore } from '@reduxjs/toolkit';

import listReducer from './modules/List/list.slice';

const store = configureStore({
  reducer: {
    list: listReducer,
  },
  devTools: true,
});

export default store;

export type IStore = typeof store;

export type IRootState = ReturnType<typeof store.getState>;

export type IAppDispatch = typeof store.dispatch;
