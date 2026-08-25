import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices';
import xmbReducer from './slices/xmbSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    xmb: xmbReducer
  },
});

/* 
Redux toolkit'te createStore yerine configureStore ile
daha az boilerplate'li bir configure söz konusu.
*/
