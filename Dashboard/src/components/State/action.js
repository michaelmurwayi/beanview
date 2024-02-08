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

export const fetch_daily_delivery = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/coffee/daily_delivery/")
        dispatch({type: 'FETCH DAILY DELIVERIES', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH DAILY DELIVERIES ERROR", payload: "error"})
    }
}

export const fetch_coffee_records = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/coffee/?format=json")
        dispatch({type: 'FETCH COFFEE RECORDS', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH COFFEE RECORDS ERROR", payload: "error"})
    }
}

export const post_coffee_records = (coffeeRecord ) => async (dispatch) =>{
    try {
        const data =  coffeeRecord
        // Dispatch an action to indicate the start of the API request
        // dispatch({ type: 'POST_COFFEE_DATA_REQUEST' });
        
        const customHeaders = {
            'Content-Type': 'application/json',
          };

        const api_url = 'http://127.0.0.1:8000/api/coffee/';
        const axiosConfig = {
            method: 'post', // Specify the HTTP method (post, get, etc.)
            headers: customHeaders, // Set your custom headers
            url: api_url, // Replace with your API endpoint
            body: JSON.stringify(data), // Include your request data
          };

        // Make the API request to your Django backend
        const response = await fetch(api_url, axiosConfig)
        // Check if the request was successful
        if (response.ok) {
          // Dispatch an action with the successful response data
          const responseData = await response.json();
          dispatch({ type: 'POST_COFFEE_DATA_SUCCESS', payload: responseData });
        } else {
          // If the request was not successful, dispatch an action with an error message
          const errorData = await response.json();
          dispatch({ type: 'POST_COFFEE_DATA_FAILURE', payload: errorData });
        }
      } catch (error) {
        // If an error occurs during the request, dispatch an action with the error
        dispatch({ type: 'POST_COFFEE_DATA_FAILURE', payload: { error: 'An error occurred' } });
      }
    };

export const fetch_users_records = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/?format=json")
        dispatch({type: 'FETCH USERS RECORDS', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH USERS RECORDS ERROR", payload: "error"})
    }
}

export const fetch_lots_records = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/lots/?format=json")
        dispatch({type: 'FETCH LOTS DATA', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH LOTS DATA ERROR", payload: "error"})
    }
}






