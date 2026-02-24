import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/Navigation/NavigationSlice';
import coffeeReducer from './slices/Coffee/coffeeSlice';
import farmersReducer from './slices/Farmers/farmerSlice';
import catalogueReducer from './slices/Catalogue/catalogueSlice'
import payoutUploadReducer from './slices/Payout/payoutUploadSlice';

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    coffee: coffeeReducer,
    farmer: farmersReducer,
    catalogue: catalogueReducer,
    payoutUpload: payoutUploadReducer,
  },
});

export default store;
