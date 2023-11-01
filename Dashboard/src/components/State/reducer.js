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
                totalTareWeight: null,
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}


export default reducer 