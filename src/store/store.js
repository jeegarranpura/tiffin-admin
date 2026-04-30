import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage: (storage && storage.default) || storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/PURGE', 'persist/PAUSE', 'persist/FLUSH'],
      },
    }),
});

export const persistor = persistStore(store);
