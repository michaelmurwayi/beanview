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
  const [filteredRecords, setFilteredRecords] = useState([]);

  const togglePopup = () => setShowPopup(!showPopup);

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  useEffect(() => {
    setFilteredRecords(coffeeRecords.filter((record) => {
      return (
        record.status === 1 &&
        (filters.weight === "" || record.weight >= parseFloat(filters.weight)) &&
        (filters.grade === "" || record.grade === filters.grade) &&
        (filters.coffeeClass === "" || record.coffeeClass === filters.coffeeClass)
      );
    }));
  }, [coffeeRecords, filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDeleteRecord = (index) => {
    setFilteredRecords((prevRecords) => prevRecords.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!saleNumber.trim()) {
      alert("Sale number is required.");
      return;
    }
    togglePopup();
  };

  const weightSummary = filteredRecords.reduce((acc, record) => {
    const weight = Number(record.weight) || 0;
    const bags = Number(record.bags) || 0; // Ensure bags are counted

    acc.total += weight;
    acc.totalBags += bags;

    if (!acc.grades[record.grade]) {
        acc.grades[record.grade] = { weight: 0, bags: 0 };
    }

    acc.grades[record.grade].weight += weight;
    acc.grades[record.grade].bags += bags;

    return acc;
  }, { total: 0, totalBags: 0, grades: {} });

  const availableGrades = Array.from(new Set(filteredRecords.map(record => record.grade)));
  const maxWeight = Math.max(0, ...filteredRecords.map(record => parseFloat(record.weight)));


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center">
          <div className="card action-card" onClick={togglePopup}>
            <div className="card-body text-center">
              <MDBIcon icon="file-download" size="3x" className="mb-3 text-primary" />
              <h5 className="card-title">Generate Catalogue</h5>
              <p className="card-text">Create a coffee records catalogue for export.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-center">
          <div className="card action-card" onClick={togglePopup}>
            <div className="card-body text-center">
              <MDBIcon icon="file-download" size="3x" className="mb-3 text-primary" />
              <h5 className="card-title">Upload Final Catalogue</h5>
              <p className="card-text">Upload final catalogue with auction results.</p>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container" style={{ width: '70%', height: '90vh', overflow: 'hidden' }}>
            <div className="popup-content" style={{ display: 'flex', height: '100%' }}>
              <div className="filter-section" style={{ width: '30%', paddingRight: '20px' }}>
            
                <label>Sale Number:</label>
                <input type="text" name="saleNumber" value={saleNumber} onChange={(e) => setSaleNumber(e.target.value)} className="form-control" placeholder="Enter Sale Number" required />
                <label>Weight:</label>
                <input type="number" name="weight" value={filters.weight} onChange={handleChange} className="form-control" min="0" max={maxWeight} step="0.1" placeholder="Enter weight" />

                <label>Grade:</label>
                <select name="grade" value={filters.grade} onChange={handleChange} className="form-control">
                  <option value="">Select Grade</option>
                  {availableGrades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>

                <label>Class:</label>
                <select name="coffeeClass" value={filters.coffeeClass} onChange={handleChange} className="form-control">
                  <option value="">Select Class</option>
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Commercial">Commercial</option>
                </select>

                <div className="popup-buttons" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="btn btn-primary" onClick={handleSubmit}>Confirm</button>
                  <button className="btn btn-secondary" onClick={togglePopup}>Cancel</button>
                </div>
                <div className="summary" style={{ 
                    textAlign: 'left', 
                    marginTop: '10px', 
                    padding: '1px', 
                    border: '1px solid #ddd', 
                    borderRadius: '5px', 
                    backgroundColor: '#f9f9f9', 
                    overflowY: 'auto',
                  }}>
                    <h5 style={{ fontWeight: 'bold', color: '#333' }}>Summary</h5>
                    <p style={{ fontSize: '16px', marginBottom: '5px', overflow: 'auto' }}>
                      <span style={{ fontWeight: 'bold', color: '#007bff' }}>Total Weight:</span> {weightSummary.total.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#007bff' }}>Total Bags:</span> {weightSummary.totalBags}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', overflowY: 'auto', maxHeight: '100vh' }}>
                      {Object.entries(weightSummary.grades).map(([grade, data]) => (
                        <p key={grade} style={{ 
                          margin: '0', 
                          padding: '0px', 
                          backgroundColor: '#fff', 
                          borderRadius: '3px' 
                        }}>
                          <span style={{ fontWeight: 'bold', color: '#333' }}>{grade}:</span> 
                          <b> {data.bags} bags</b>
                        </p>
                      ))}
                    </div>
                  </div>

              </div>

              <div className="results-section" style={{ width: '70%', overflowY: 'auto', maxHeight: '100vh' }}>
                <h5>Filtered Coffee Records</h5>
                {filteredRecords.length > 0 ? (
                  <table className="coffee-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th>Mark</th>
                        <th>Grade</th>
                        <th>Bags</th>
                        <th>Pockets</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record, index) => (
                        <tr key={index}>
                          <td>{record.mark}</td>
                          <td>{record.grade}</td>
                          <td>{record.bags}</td>
                          <td>{record.pockets}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRecord(index)}>Delete</button>
                          </td>
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
};

const mapStateToProps = (state) => {
  return {
    coffeeRecords: state.reducer.coffeeRecords,
    catalogue: state.reducer.catalogue,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
