// action js
import axios from 'axios';


export const fetch_total_net_weight = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/coffee/total_net_weight/")
        dispatch({type: 'FETCH NET WEIGHT', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH NET WEIGHT ERROR", payload: error})
    }
}

export const fetch_total_tare_weight = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/coffee/total_tare_weight/")
        dispatch({type: 'FETCH TARE WEIGHT', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH TARE WEIGHT ERROR", payload: error})
    }
}

export const fetch_total_bags = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/coffee/total_number_bags/")
        dispatch({type: 'FETCH TOTAL BAGS', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH TOTAL BAGS ERROR", payload: error})
    }
}

export const fetch_total_farmers = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/coffee/total_number_farmers/")
        dispatch({type: 'FETCH TOTAL FARMERS', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH TOTAL FARMERS ERROR", payload: error})
    }
}

export const fetch_grade_performance = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/coffee/performance_per_grade/")
        dispatch({type: 'FETCH GRADE PERFORMANCE', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH GRADE PERFORMANCE ERROR", payload: "error"})
    }
}