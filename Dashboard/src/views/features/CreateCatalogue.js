import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { connect } from 'react-redux';
import { fetch_coffee_records } from 'components/State/action';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'assets/css/coffee_table.css';
import { MDBIcon } from 'mdbreact';
import initialState from 'components/State/initialState';
import { post_catalogue_records } from 'components/State/action';

const DataTable = (props) => {
  const { coffeeRecords, fetch_coffee_records } = props;
  const [state, setState] = useState(initialState);
  const [saleNumber, setSaleNumber] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [filters, setFilters] = useState({
    weight: "",
    grade: "",
    coffeeClass: "",
  });

  const togglePopup = () => setShowPopup(!showPopup);

  // Set default date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-01-01'), // Default start date
    endDate: new Date(), // Default end date
    key: 'selection',
  });

  const [loading, setLoading] = useState(true); // Loading state for data fetch
  const [filteredCatalogue, setFilteredCatalogue] = useState([]); // Store filtered records

  // Fetch coffee records on component mount
  useEffect(() => {
    fetch_coffee_records().finally(() => setLoading(false)); // Set loading to false after fetch
  }, [fetch_coffee_records]);

  // Handle date range change
  const handleDateChange = (ranges) => {
    setDateRange(ranges.selection);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filter records based on selected date range
  const filteredRecords = coffeeRecords.filter((record) => {
    return (
      (filters.weight === "" || record.weight >= parseFloat(filters.weight)) &&
      (filters.grade === "" || record.grade === filters.grade) &&
      (filters.coffeeClass === "" || record.coffeeClass === filters.coffeeClass)
    );
  });
  // Data for the table
  // const data = {
  //   columns: [
  //     { label: 'Mark', field: 'mark', sort: 'asc', width: 150 },
  //     { label: 'Outturn', field: 'outturn', sort: 'asc', width: 150 },
  //     { label: 'Grade', field: 'grade', sort: 'asc', width: 270 },
  //     { label: 'Bags', field: 'bags', sort: 'asc', width: 100 },
  //     { label: 'Pockets', field: 'pockets', sort: 'asc', width: 100 },
  //     { label: 'Weight', field: 'weight', sort: 'asc', width: 200 },
  //     { label: 'Certificate', field: 'certificate', sort: 'asc', width: 150 },
  //     { label: 'Mill', field: 'mill', sort: 'asc', width: 100 },
      
  //   ],
  //   rows: filteredRecords, // Using filtered records
  // };

  // Handle catalogue generation logic
  const handleGenerateCatalogue = () => {
    alert("Catalogue generation feature coming soon!");
  };

  const handleDeleteRecord = (index) => {
    setFilteredCatalogue((prevCatalogue) => prevCatalogue.filter((_, i) => i !== index));
  };


  const handleUploadCatalogue = () => {
    alert("Upload catalogue feature coming soon!");
  };
  

  // Inline styles for the popup
  const popupStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
    },
    popup: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      maxWidth: '60vw', // Reduce popup width
      maxHeight: '100vh', // Set max height
      width: '90%',
      overflow: 'auto', // Prevent overall overflow
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '20px',
      background: 'red',
      width: '30px',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      cursor: 'pointer',
      fontSize: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', 
      borderRadius: '15px',
    },
    tableContainer: {
      maxHeight: '50vh', // Set max height for scroll
      overflowY: 'auto', // Enable vertical scrolling
      border: '1px solid #ddd',
      padding: '10px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      border: '0px solid black',
      padding: '10px',
      backgroundColor: '#f2f2f2',
      position: '',
      top: '0', // Keep headers sticky
      zIndex: '10',
    },
    td: {
      border: '1px solid black',
      padding: '2px',
      textAlign: 'center',
    },
  };
  const handleSubmit = () => {
    handleGenerateCatalogue(filters);
    togglePopup();
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        {/* Generate Catalogue Card */}
        <div className="col-md-6 d-flex justify-content-center">
          <div className="card action-card"  onClick={togglePopup}>
            <div className="card-body text-center">
              <MDBIcon icon="file-download" size="3x" className="mb-3 text-primary" />
              <h5 className="card-title">Generate Catalogue</h5>
              <p className="card-text">Create a coffee records catalogue for export.</p>
            </div>
          </div>
        </div>

        {/* Upload Catalogue Card */}
        <div className="col-md-6 d-flex justify-content-center">
          <div className="card action-card" onClick={handleUploadCatalogue}>
            <div className="card-body text-center">
              <MDBIcon icon="upload" size="3x" className="mb-3 text-success" />
              <h5 className="card-title">Upload Final Catalogue</h5>
              <p className="card-text">Upload and finalize the coffee catalogue.</p>
            </div>
          </div>
        </div>
      </div>
       {/* Popup Modal */}
       {showPopup && (
  <div className="popup-overlay">
    <div className="popup-container">
      <h4>Select Catalogue Filters</h4>

      <div className="popup-content">
        {/* Left Column - Filters */}
        <div className="filter-section">
          <label>Weight:</label>
          <input
            type="number"
            name="weight"
            value={filters.weight}
            onChange={handleChange}
            className="form-control"
            min="0"
            step="0.1"
            placeholder="Enter weight"
          />

          <label>Grade:</label>
          <select name="grade" value={filters.grade} onChange={handleChange} className="form-control">
            <option value="">Select Grade</option>
            <option value="ALL">ALL</option>
            <option value="AA">AA</option>
            <option value="AB">AB</option>
            <option value="PB">PB</option>
          </select>

          <label>Class:</label>
          <select name="coffeeClass" value={filters.coffeeClass} onChange={handleChange} className="form-control">
            <option value="">Select Class</option>
            <option value="Premium">Premium</option>
            <option value="Standard">Standard</option>
            <option value="Commercial">Commercial</option>
          </select>

          {/* Buttons */}
          <div className="popup-buttons">
            <button className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
            <button className="btn btn-secondary" onClick={togglePopup}>Cancel</button>
          </div>
        </div>

        {/* Right Column - Filtered Results */}
        <div className="results-section">
          <h5>Filtered Coffee Records</h5>
          {filteredRecords.length > 0 ? (
            <table className="coffee-table">
              <thead>
                <tr>
                  <th>Mark</th>
                  <th>Grade</th>
                  <th>Weight</th>
                  <th>Class</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.mark}</td>
                    <td>{record.grade}</td>
                    <td>{record.weight}</td>
                    <td>{record.coffeeClass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No matching records found.</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_coffee_records: () => dispatch(fetch_coffee_records()),
    post_catalogue_records: (data) => dispatch(post_catalogue_records(data)),
  };
}

const mapStateToProps = (state) => {
  return {
    coffeeRecords: state.reducer.coffeeRecords, // Access coffee records from state
    catalogue: state.reducer.catalogue,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
