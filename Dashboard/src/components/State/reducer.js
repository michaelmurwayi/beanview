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
        case 'FETCH USERS RECORDS':
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: null,
            }
        case 'FETCH USERS RECORDS ERROR':
            return {
                ...state,
                users: null,  
                loading: false,
                error: action.payload,
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
                coffeeRecord: action.payload, 
                error: null };
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
                error: action.payload,
            }
        default:
            return state
    }

}


export default reducer 