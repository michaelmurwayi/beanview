import initialState from "./initialState";

const reducer = (state = initialState, action) => {
    const newState = {...state};
    switch(action.type){
        case 'FETCH NET WEIGHT':
            return {
                ...state,
                totalNetWeight : action.payload.total_net_weight
            }
        case 'FETCH NET WEIGHT ERROR':
            return {
                ...state,
                totalNetWeight: null,
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}


export default reducer 