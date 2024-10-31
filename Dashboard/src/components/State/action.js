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
export const post_coffee_records = (coffeeRecord, file = null) => async (dispatch) => {
    try {
        const api_url = 'http://127.0.0.1:8000/api/coffee/';
        
        // Initialize a new FormData object to handle both form data and file uploads
        const formData = new FormData();
        
        // Append form data fields to formData
        Object.keys(coffeeRecord).forEach((key) => {
            formData.append(key, coffeeRecord[key]);
        });
        
        // If a file is provided, append it to the formData
        if (file) {
            formData.append('file', file); // Assuming the API expects 'file' as the field name for the uploaded file
        }
        
        console.log(formData)
      // Configuration for the fetch request (no need for Content-Type header when using FormData)
      const fetchConfig = {
        method: 'POST',
        body: formData,
      };
  
      // Dispatch request start action (if needed)
      dispatch({ type: 'POST_COFFEE_DATA_REQUEST' });
  
      // Make the API request to your Django backend
      const response = await fetch(api_url, fetchConfig);
  
      // Handle success or failure response
      if (response.ok) {
        const responseData = await response.json();
        dispatch({ type: 'POST_COFFEE_DATA_SUCCESS', payload: responseData });
      } else {
        const errorData = await response.json();
        dispatch({ type: 'POST_COFFEE_DATA_FAILURE', payload: errorData });
      }
    } catch (error) {
      // Dispatch failure action if an error occurs
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






