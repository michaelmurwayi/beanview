import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/Navigation/NavigationSlice';
import coffeeReducer from '../features/Coffee/CoffeeSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    coffee: coffeeReducer,
  },
});

export default store;
