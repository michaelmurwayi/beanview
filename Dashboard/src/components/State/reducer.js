import initialState from "./initialState";

const reducer = (state = initialState, action) => {
    const newState = {...state};
    switch(action.type){
        case 'FETCH NET WEIGHT':
            newState.totalNetWeight = action.payload.total_net_weight;
            return newState
        case 'FETCH_NET_WEIGHT_ERROR':
            return {
                ...state,
                totalNetWeight: null,
                loading: false,
                netweightError: false,
            }
        default:
            return state
    }
}


export default reducer 