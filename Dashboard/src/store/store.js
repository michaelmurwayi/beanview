import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/Navigation/NavigationSlice';
import coffeeReducer from '../features/Coffee/CoffeeSlice';
import farmersReducer from './slices/Farmers/farmerSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    coffee: coffeeReducer,
    farmer: farmersReducer,
  },
});

export default store;
