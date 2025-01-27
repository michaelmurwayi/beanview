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
export const post_coffee_records = (coffeeRecord) => async (dispatch) => {
    try {
        const api_url = 'http://127.0.0.1:8000/api/coffee/';
        
        // Initialize FormData
        const formData = new FormData();

        // Check if coffeeRecord is a FormData instance
        if (coffeeRecord instanceof FormData) {
            for (const [key, value] of coffeeRecord.entries()) {
                formData.append(key, value);
            }
        } else {
            // Add each key-value pair to FormData
            Object.keys(coffeeRecord).forEach((key) => {
                // If the value is an array or file, handle it accordingly
                if (key === 'file' && coffeeRecord[key]) {
                    formData.append(key, coffeeRecord[key][0]); // Assuming file is an array
                } else {
                    formData.append(key, coffeeRecord[key]);
                }
            });
        }
        
        // Fetch configuration
        const fetchConfig = {
            method: 'POST',
            body: formData,
        };

        // Dispatch request action
        dispatch({ type: 'POST_COFFEE_DATA_REQUEST' });
        console.log(fetchConfig)
        // Perform API request
        const response = await fetch(api_url, fetchConfig);
        
        // Check for successful response
        if (response.ok) {
            const responseData = await response.json();
            dispatch({ type: 'POST_COFFEE_DATA_SUCCESS', payload: responseData });
        } else {
            // Handle non-OK responses
            const errorData = await response.json();
            const errorMessage = errorData.detail || 'Check upload file for errors.';
            dispatch({ type: 'POST_COFFEE_DATA_FAILURE', payload: errorMessage });
        }
    } catch (error) {
        // Catch unexpected errors and dispatch failure action
        dispatch({ type: 'POST_COFFEE_DATA_FAILURE', payload: { error: error.message } });
    }
};

export const update_coffee_record = (coffeeRecord) => async (dispatch) => {
    try {
        const api_url = `http://127.0.0.1:8000/api/coffee/${coffeeRecord.id}/`; // Assuming the record has an `id` field
        
        // Initialize FormData
        const formData = new FormData();

        // Check if coffeeRecord is a FormData instance
        if (coffeeRecord instanceof FormData) {
            for (const [key, value] of coffeeRecord.entries()) {
                formData.append(key, value);
            }
        } else {
            // Add each key-value pair to FormData
            Object.keys(coffeeRecord).forEach((key) => {
                // If the value is an array or file, handle it accordingly
                if (key === 'file' && coffeeRecord[key]) {
                    formData.append(key, coffeeRecord[key][0]); // Assuming file is an array
                } else {
                    formData.append(key, coffeeRecord[key]);
                }
            });
        }
        
        // Fetch configuration for PUT request (to update the record)
        const fetchConfig = {
            method: 'PUT',
            body: formData,
        };

        // Dispatch request action
        dispatch({ type: 'UPDATE_COFFEE_DATA_REQUEST' });

        // Perform API request
        const response = await fetch(api_url, fetchConfig);
        
        // Check for successful response
        if (response.ok) {
            const responseData = await response.json();
            dispatch({ type: 'UPDATE_COFFEE_DATA_SUCCESS', payload: responseData });
        } else {
            // Handle non-OK responses
            const errorData = await response.json();
            const errorMessage = errorData.detail || 'Failed to update the record.';
            dispatch({ type: 'UPDATE_COFFEE_DATA_FAILURE', payload: errorMessage });
        }
    } catch (error) {
        // Catch unexpected errors and dispatch failure action
        dispatch({ type: 'UPDATE_COFFEE_DATA_FAILURE', payload: { error: error.message } });
    }
};

export const delete_coffee_record = (id) => async (dispatch) => {
    try {
        const api_url = `http://127.0.0.1:8000/api/coffee/${id}/`;

        // Dispatch request action
        dispatch({ type: 'DELETE_COFFEE_DATA_REQUEST' });

        // Fetch configuration
        const fetchConfig = {
            method: 'DELETE',
        };

        // Perform API request
        const response = await fetch(api_url, fetchConfig);

        // Check for successful response
        if (response.ok) {
            dispatch({ type: 'DELETE_COFFEE_DATA_SUCCESS', payload: id });
        } else {
            // Handle non-OK responses
            const errorData = await response.json();
            const errorMessage = errorData.detail || 'Failed to delete the coffee record.';
            dispatch({ type: 'DELETE_COFFEE_DATA_FAILURE', payload: errorMessage });
        }
    } catch (error) {
        // Catch unexpected errors and dispatch failure action
        dispatch({ type: 'DELETE_COFFEE_DATA_FAILURE', payload: error.message });
    }
};


 
export const fetch_farmers_records = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/user/?format=json")
        dispatch({type: 'FETCH FARMERS RECORDS', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH FARMER RECORDS ERROR", payload: "error"})
    }
}
export const post_farmers_records = () => async(dispatch)=>{
    const api = "http://127.0.0.1:8000/api/user/"
    try{
        console.log("contact made")
    }catch (error){
        console.log("error")
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






