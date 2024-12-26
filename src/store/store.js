import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage for web
import { createWrapper } from 'next-redux-wrapper';
import userReducer from './userSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Wrap the user reducer with persistence
const persistedReducer = persistReducer(persistConfig, userReducer);

// Configure the store
export const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
  // Add serializableCheck middleware to prevent non-serializable actions or state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Allow redux-persist to persist state
        ignoredPaths: ['user.register'], // Ignore paths like 'user.register' if you store functions here
      },
    }),
});

export const persistor = persistStore(store);

// Create wrapper for next-redux-wrapper
export const wrapper = createWrapper(() => store);
