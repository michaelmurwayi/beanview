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
    console.log("fetching coffee records")
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/coffee/?format=json")
        dispatch({type: 'FETCH COFFEE RECORDS', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH COFFEE RECORDS ERROR", payload: "error"})
    }
}
export const post_coffee_records = (farmersRecord) => async (dispatch) => {
    try {
        const api_url = 'http://127.0.0.1:8000/api/coffee/';
        
        // Initialize FormData
        const formData = new FormData();

        // Check if farmersRecord is a FormData instance
        if (farmersRecord instanceof FormData) {
            for (const [key, value] of farmersRecord.entries()) {
                formData.append(key, value);
            }
        } else {
            // Add each key-value pair to FormData
            Object.keys(farmersRecord).forEach((key) => {
                // If the value is an array or file, handle it accordingly
                if (key === 'file' && farmersRecord[key]) {
                    formData.append(key, farmersRecord[key][0]); // Assuming file is an array
                } else {
                    formData.append(key, farmersRecord[key]);
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
export const update_coffee_record = (coffeeRecords) => async (dispatch) => {
    try {
      dispatch({ type: 'UPDATE_COFFEE_DATA_REQUEST' });
  
      const excludedFields = ['id', 'created_at', 'updated_at'];
      const updatedRecords = [];
      const failedRecords = [];
  
      for (const record of coffeeRecords) {
        const isFormData = record instanceof FormData;
  
        const recordId = isFormData ? record.get('id') : record.id;
  
        if (!recordId) {
          failedRecords.push({ error: 'Missing ID', record });
          continue;
        }
  
        const api_url = `http://127.0.0.1:8000/api/coffee/${recordId}/`;
        const formData = new FormData();
  
        if (isFormData) {
          for (const [key, value] of record.entries()) {
            if (excludedFields.includes(key)) continue;
            if (value === 'null' || value === '') continue;
            formData.append(key, value);
          }
        } else {
          Object.keys(record).forEach((key) => {
            if (excludedFields.includes(key)) return;
  
            const value = record[key];
            if (value === '' || value === 'null') return;
  
            if (key === 'file' && value) {
              formData.append(key, value[0]);
            } else {
              formData.append(key, value);
            }
          });
        }
  
        const response = await fetch(api_url, {
          method: 'PUT',
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          updatedRecords.push(data);
        } else {
          const errorData = await response.json();
          failedRecords.push({ error: errorData.detail, record });
        }
      }
  
      if (failedRecords.length === 0) {
        dispatch({ type: 'UPDATE_COFFEE_DATA_SUCCESS', payload: updatedRecords });
      } else {
        dispatch({
          type: 'UPDATE_COFFEE_DATA_PARTIAL_FAILURE',
          payload: { updated: updatedRecords, failed: failedRecords },
        });
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_COFFEE_DATA_FAILURE',
        payload: error.message || 'Unknown error occurred while updating multiple records.',
      });
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
        const response = await axios.get("http://127.0.0.1:8000/api/farmers/?format=json")
        dispatch({type: 'FETCH FARMERS RECORDS', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH FARMER RECORDS ERROR", payload: "error"})
    }
}
export const post_farmers_records = (farmersRecord) => async(dispatch)=>{
    const api_url = "http://127.0.0.1:8000/api/farmers/"
    try {
        
        // Initialize FormData
        const formData = new FormData();
        // Check if coffeeRecord is a FormData instance
        console.log(farmersRecord instanceof FormData)
        if (farmersRecord instanceof FormData) {
            for (const [key, value] of farmersRecord.entries()) {
                console.log(key, value)
                formData.append(key, value);
            }
        console.log(Object.entries(formData))
        } else {
            // Add each key-value pair to FormData
            Object.keys(farmersRecord).forEach((key) => {
                // If the value is an array or file, handle it accordingly
                if (key === 'file' && farmersRecord[key]) {
                    formData.append(key, farmersRecord[key][0]); // Assuming file is an array
                } else {
                    formData.append(key, farmersRecord[key]);
                }
            });
        }
        
        // Fetch configuration
        const fetchConfig = {
            method: 'POST',
            body: formData,
        };

        // Dispatch request action
        dispatch({ type: 'POST_FARMER_RECORD_REQUEST' });
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
}

export const fetch_lots_records = () => async (dispatch) =>{
    try {
        const response = await axios.get("http://127.0.0.1:8000/api/lots/?format=json")
        dispatch({type: 'FETCH LOTS DATA', payload: response.data})
    }catch (error){
        dispatch({type:"FETCH LOTS DATA ERROR", payload: "error"})
    }
}

export const post_catalogue_records = (catalogueRecord) => async (dispatch) => {
    const api_url = "http://127.0.0.1:8000/api/catalogue/";

    try {
        // Use the provided FormData instance or create a new one
        const formData = catalogueRecord instanceof FormData ? catalogueRecord : new FormData();
        console.log(JSON.stringify(formData["records"], null, 2));

        if (!(catalogueRecord instanceof FormData)) {
            Object.keys(catalogueRecord).forEach((key) => {
                if (key === 'file' && catalogueRecord[key]) {
                    // Check if file is an array or single file
                    if (Array.isArray(catalogueRecord[key])) {
                        catalogueRecord[key].forEach((file) => formData.append(key, file));
                    } else {
                        formData.append(key, JSON.stringify(catalogueRecord[key]));
                    }
                } else {
                    formData.append(key, JSON.stringify(catalogueRecord[key]));
                }
            });
        }

        // Fetch configuration
        const fetchConfig = {
            method: 'POST',
            body: formData,
        };

        // Dispatch request action
        dispatch({ type: 'POST_CATALOGUE_RECORD_REQUEST' });

        console.log(fetchConfig);

        // Perform API request
        const response = await fetch(api_url, fetchConfig);

        // Try parsing response data safely
        let responseData;
        try {
            responseData = await response.json();
        } catch (jsonError) {
            throw new Error("Server returned invalid JSON response.");
        }

        if (response.ok) {
            dispatch({ type: 'POST_CATALOGUE_DATA_SUCCESS', payload: responseData });
        } else {
            const errorMessage = responseData?.detail || "Check upload file for errors.";
            dispatch({ type: 'POST_CATALOGUE_DATA_FAILURE', payload: errorMessage });
        }
    } catch (error) {
        dispatch({ type: 'POST_CATALOGUE_DATA_FAILURE', payload: { error: error.message } });
    }
};

export const update_catalogue_record = (coffeeRecord) => async (dispatch) => {
    try {
        const api_url = `http://127.0.0.1:8000/api/coffee/${coffeeRecord.id}/`; // Assuming the record has an `id` field
        
        // Initialize FormData
        const formData = new FormData();
        // Check if coffeeRecord is a FormData instance
        if (coffeeRecord instanceof FormData) {
            for (const [key, value] of coffeeRecord.entries()) {
                formData.append(key, value);
                console.log(JSON.stringify(formData))
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

export const delete_catalogue_record = (coffeeRecord) => async (dispatch) => {
    console.log("Updating sale_number and status_id...");

    try {
        const api_url = `http://127.0.0.1:8000/api/coffee/${coffeeRecord.id}/`;

        const updatedData = {
            sale_number: "",  // Set sale_number to empty string
            status_id: 1  // Ensure status_id is correctly formatted
        };

        const fetchConfig = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        };
        console.log(fetchConfig.body)
        dispatch({ type: 'UPDATE_COFFEE_DATA_REQUEST' });

        console.log("Sending PUT request to:", api_url);
        console.log("Request body:", updatedData);

        const response = await fetch(api_url, fetchConfig);
        const responseText = await response.text();
        console.log("Response text:", responseText);  // Log raw response

        if (response.ok) {
            const responseData = JSON.parse(responseText);
            dispatch({ type: 'UPDATE_COFFEE_DATA_SUCCESS', payload: responseData });
        } else {
            dispatch({ type: 'UPDATE_COFFEE_DATA_FAILURE', payload: responseText });
        }
    } catch (error) {
        dispatch({ type: 'UPDATE_COFFEE_DATA_FAILURE', payload: { error: error.message } });
    }
};

export const submit_sale_summary = (summaryData) => async (dispatch) => {
    const api_url = `http://127.0.0.1:8000/api/coffee/generate_summary_file/`;
    try {
      const response = await axios.post(api_url, summaryData);
      dispatch({ type: "SUBMIT_SALE_SUMMARY_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "SUBMIT_SALE_SUMMARY_FAILURE", payload: error });
    }
  };