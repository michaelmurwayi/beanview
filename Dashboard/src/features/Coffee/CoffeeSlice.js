// src/store/reducers/coffeeReducer.js
import { globalInitialState } from '../../store/initialState';

const coffeeReducer = (state = globalInitialState, action) => {
  switch (action.type) {
    case 'FETCH_COFFEE_RECORDS':
      return {
        ...state,
        coffeeRecords: action.payload,
        loading: false,
        error: null,
      };
    
    case 'FETCH_COFFEE_RECORDS_ERROR':
      return {
        ...state,
        coffeeRecords: [],
        loading: false,
        error: action.payload,
      };

    case 'POST_COFFEE_RECORDS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'POST_COFFEE_RECORDS_SUCCESS':
      return {
        ...state,
        loading: false,
        coffeeRecords: [...state.coffeeRecords, action.payload],
        success: true,
        error: null,
      };

    case 'UPDATE_COFFEE_FORM_FIELD':
      return {
        ...state,
        CoffeeUploadFormData: {
          ...state.CoffeeUploadFormData,
          [action.payload.field]: action.payload.value,
        },
      };

    case 'RESET_COFFEE_FORM':
      return {
        ...state,
        CoffeeUploadFormData: globalInitialState.CoffeeUploadFormData,
      };

    default:
      return state;
  }
};

export default coffeeReducer;
