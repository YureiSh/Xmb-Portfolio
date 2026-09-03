import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices';
import xmbReducer from './slices/xmbSlice';
import { audioMiddleware } from './audioMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    xmb: xmbReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(audioMiddleware),
});

/* 
Redux toolkit'te createStore yerine configureStore ile
daha az boilerplate'li bir configure söz konusu.

Oluşturduğumuz sesleri middleware ile yöneteceğiz. 
State fonksiyonları sadece state'i değiştirir, sesleri çalmaz.
Middleware ise action'ları dinler ve sesleri çalar. 
Bu sayede state ve ses yönetimi ayrılmış olur. 
Gamepad kontrolleri eklerken fazla bir değişiklik yapmayız.
*/
