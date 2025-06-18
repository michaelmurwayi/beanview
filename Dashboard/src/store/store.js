import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/Navigation/NavigationSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
  },
});

export default store;
