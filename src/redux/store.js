import { configureStore } from '@reduxjs/toolkit';
import certificateSlice from './certificateSlice';

const store = configureStore({
  reducer: {
    display_certificates: certificateSlice,
  },
});

export default store;
