import initialState from "./initialState";

const reducer = (state = initialState, action) => {
    
    switch(action.type){
        case 'FETCH NET WEIGHT':
            return {
                ...state,
                totalNetWeight : action.payload.total_net_weight,
                loading: false,
                error: null,
            }
        case 'FETCH NET WEIGHT ERROR':
            return {
                ...state,
                totalNetWeight: null,
                loading: false,
                error: action.payload,
            }
        case 'FETCH TARE WEIGHT':
            return {
                ...state,
                totalTareWeight : action.payload.total_tare_weight,
                loading: false,
                error: null,
            }
        case 'FETCH TARE WEIGHT ERROR':
            return {
                ...state,
                totalTareWeight: null,
                loading: false,
                error: action.payload,
            }
        case 'FETCH TOTAL BAGS':
            return {
                ...state,
                totalBags: action.payload.total_number_bags,
                loading: false,
                error: null,
            }
        case 'FETCH TOTAL BAGS ERROR':
            return {
                ...state,
                totalBags: null,
                loading: false,
                error: action.payload,
            }
        case 'FETCH TOTAL FARMERS':
            return {
                ...state,
                totalUsers: action.payload.total_number_farmers,
                loading: false,
                error: null,
            }
        case 'FETCH TOTAL FARMERS ERROR':
            return {
                ...state,
                totalUsers: null,
                loading: false,
                error: action.payload,
            }
        case 'FETCH GRADE PERFORMANCE':
            return {
                ...state,
                performancePerGrade: Object.values(action.payload),
                loading: false,
                error: null,
            }
        case 'FETCH GRADE PERFORMANCE ERROR':
            return {
                ...state,
                performancePerGrade: null,  
                loading: false,
                error: action.payload,
            }
        case 'FETCH DAILY DELIVERIES':
            return {
                ...state,
                dailyDeliveries: action.payload.deliveries,
                loading: false,
                error: null,
            }
        case 'FETCH DAILY DELIVERIES ERROR':
            return {
                ...state,
                dailyDeliveries: null,  
                loading: false,
                error: action.payload,
            }
        case 'FETCH COFFEE RECORDS':
            return {
                ...state,
                coffeeRecords: action.payload,
                loading: false,
                error: null,
            }
        case 'FETCH COFFEE RECORDS ERROR':
            return {
                ...state,
                coffeeRecords: null,  
                loading: false,
                error: action.payload,
            }
        case 'FETCH FARMERS RECORDS':
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: null,
            }
        case 'FETCH FARMERS RECORDS ERROR':
            return {
                ...state,
                users: null,  
                loading: false,
                error: action.payload,
            }
        case 'POST FARMERS RECORDS REQUEST':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case 'POST FARMERS RECORDS SUCCESS':
            return{
                ...state,
                loading: true,
                farmers: [...state.farmers, action.payload],
                success: true,
                error: null,
            }
        case 'POST_COFFEE_DATA_REQUEST':
            return { 
                ...state, 
                loading: true, 
                error: null 
            };
        case 'POST_COFFEE_DATA_SUCCESS':
            return { 
                ...state, 
                loading: false, 
                coffeeRecords: [...state.coffeeRecords, action.payload], // Assuming you're adding a new record
                success: true, 
                error: null 
            };
        case 'POST_COFFEE_DATA_FAILURE':
            return { 
                ...state, 
                loading: false, 
                success: false, // Set to false on failure
                error: action.payload || true // Use payload for error message or set to true
            };
        case 'UPDATE_COFFEE_DATA_REQUEST':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'UPDATE_COFFEE_DATA_SUCCESS':
            return {
                ...state,
                isLoading: false,
                coffeeRecords: state.coffeeRecords.map((record) =>
                    record.id === action.payload.id ? action.payload : record
                ),
            };
        case 'UPDATE_COFFEE_DATA_FAILURE':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
          // Handle delete actions
          case 'DELETE_COFFEE_RECORD_REQUEST':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'DELETE_COFFEE_RECORD_SUCCESS':
            return {
                ...state,
                isLoading: false,
                coffeeRecords: state.coffeeRecords.filter(
                    (record) => record.id !== action.payload.id
                ),
            };
        case 'DELETE_COFFEE_RECORD_FAILURE':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case 'FETCH LOTS DATA':
            return {
                ...state,
                lots: action.payload,
                loading: false,
                error: null,
            }
        case 'FETCH LOTS DATA ERROR':
            return {
                ...state,
                lots: null,  
                loading: false,
                error: "Error uploading Coffee please check records and try again",
            }
            
        case 'FETCH CATALOGUE DATA':
            return {
                ...state,
                lots: action.payload,
                loading: false,
                error: null,
            }
        case 'FETCH CATALOGUE DATA ERROR':
            return {
                ...state,
                lots: null,  
                loading: false,
                error: action.payload,
            }
        
        case 'POST CATALOGUE DATA':
            return {
                ...state,
                lots: action.payload,
                loading: false,
                error: null,
            }
        case 'POST CATALOGUE DATA ERROR':
            return {
                ...state,
                lots: null,  
                loading: false,
                error: action.payload,
            }
        
            
        default:
            return state
    }

}


export default reducer 