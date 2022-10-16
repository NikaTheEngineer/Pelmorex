import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {

  },
  devTools: true,
});

export default store;

export type IStore = typeof store;

export type IRootState = ReturnType<typeof store.getState>;

export type IAppDispatch = typeof store.dispatch;
