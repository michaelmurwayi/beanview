import React, { useEffect, useState } from 'react';
import { MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { fetch_coffee_records, post_catalogue_records } from 'components/State/action';
import initialState from 'components/State/initialState';
import 'assets/css/coffee_table.css';

const DataTable = (props) => {
  const { coffeeRecords, fetch_coffee_records } = props;
  const [state, setState] = useState(initialState);
  const [showPopup, setShowPopup] = useState(false);
  const [filters, setFilters] = useState({
    weight: "",
    grade: "",
    coffeeClass: "",
  });

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  const togglePopup = () => setShowPopup(!showPopup);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredRecords = coffeeRecords.filter((record) => {
    return (
      (filters.weight === "" || record.weight >= parseFloat(filters.weight)) &&
      (filters.grade === "" || record.grade === filters.grade) &&
      (filters.coffeeClass === "" || record.coffeeClass === filters.coffeeClass)
    );
  });

  const handleSubmit = () => {
    togglePopup();
  };

  const handleUploadCatalogue = () => {
    alert("Upload catalogue feature coming soon!");
  };

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
      overflow: 'auto',
    },
    popup: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      maxWidth: '70vw',
      maxHeight: '80vh',
      width: '90%',
      overflow: 'auto',
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
      borderRadius: '15px',
    },
    tableContainer: {
      maxHeight: '60vh',
      overflowY: 'auto',
      border: '1px solid #ddd',
      padding: '10px',
    },
    recordsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '10px',
    },
    recordBox: {
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
    },
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        {/* Generate Catalogue Card */}
        <div className="col-md-6 d-flex justify-content-center">
          <div className="card action-card" onClick={togglePopup}>
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
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <h4>Select Catalogue Filters</h4>

            <div className="popup-content d-flex">
              {/* Left Column - Filters */}
              <div className="filter-section" style={{ flex: 1, paddingRight: '20px' }}>
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
                <div className="popup-buttons mt-3">
                  <button className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
                  <button className="btn btn-secondary" onClick={togglePopup}>Cancel</button>
                </div>
              </div>

              {/* Right Column - Filtered Results */}
              <div className="results-section" style={{ flex: 4}}>
                <h5>Filtered Coffee Records</h5>
                <div style={popupStyles.tableContainer}>
                  {filteredRecords.length > 0 ? (
                    <div style={popupStyles.recordsGrid}>
                      {filteredRecords.map((record, index) => (
                        <div key={index} style={popupStyles.recordBox}>
                          <strong>Mark:</strong> {record.mark} <br />
                          <strong>Grade:</strong> {record.grade} <br />
                          <strong>Weight:</strong> {record.weight}kg <br />
                          <strong>Class:</strong> {record.coffeeClass}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No matching records found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button style={popupStyles.closeButton} onClick={togglePopup}>X</button>
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
    coffeeRecords: state.reducer.coffeeRecords,
    catalogue: state.reducer.catalogue,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
