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

const DataTable = (props) => {
  const { coffeeRecords, fetch_coffee_records } = props;
  const [state, setState] = useState(initialState);
  const [showPopup, setShowPopup] = useState(false);
  
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

  // Filter records based on selected date range
  const filteredRecords = coffeeRecords.filter((record) => {
    const recordDate = new Date(record.created_at);
    return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
  });

  // Data for the table
  const data = {
    columns: [
      { label: 'Mark', field: 'mark', sort: 'asc', width: 150 },
      { label: 'Outturn', field: 'outturn', sort: 'asc', width: 150 },
      { label: 'Grade', field: 'grade', sort: 'asc', width: 270 },
      { label: 'Bags', field: 'bags', sort: 'asc', width: 100 },
      { label: 'Pockets', field: 'pockets', sort: 'asc', width: 100 },
      { label: 'Weight', field: 'weight', sort: 'asc', width: 200 },
      { label: 'Certificate', field: 'certificate', sort: 'asc', width: 150 },
      { label: 'Mill', field: 'mill', sort: 'asc', width: 100 },
      
    ],
    rows: filteredRecords, // Using filtered records
  };

  // Handle catalogue generation logic
  const handleGenerateCatalogue = () => {
    // Filter records where weight > 120 and status is not 'PENDING'
    const filtered = coffeeRecords.filter(
      (record) => parseFloat(record.weight) > 120 && record.status.toUpperCase() === 'PENDING'
    );

    if (filtered.length > 0) {
      setFilteredCatalogue(filtered);
      console.log(filtered);
      setShowPopup(true);
    } else {
      alert("No records found with weight greater than 120 KG.");
    }
  };

  const handleDeleteRecord = (index) => {
    setFilteredCatalogue((prevCatalogue) => prevCatalogue.filter((_, i) => i !== index));
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
  

  return (
    <div className="container-fluid">
      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center">
          <MDBIcon icon="spinner" spin size="3x" />
          <p>Loading records...</p>
        </div>
      ) : (
        <div>
          {/* Data Table */}
          <MDBDataTable
            data={data}
            bordered
            small
            responsive
            hover
            searching
            paging
            paginationLabel={[
              <MDBIcon icon="chevron-left" key="prev" />,
              <MDBIcon icon="chevron-right" key="next" />,
            ]}
            barReverse={false}
            className="coffee-records" // Custom class for table styling
          />

          {/* Generate Catalogue Button */}
          <div className="text-right mt-4">
            <button className="btn btn-info" onClick={handleGenerateCatalogue}>
              <i className="fas fa-download"></i> Generate Catalogue
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal for Filtered Records */}
      {showPopup && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <h3>Coffee Records to Catalogue</h3>
            <button onClick={() => setShowPopup(false)} style={popupStyles.closeButton}>X</button>
            {filteredCatalogue.length > 0 ? (
              <table style={popupStyles.table}>
              <thead>
                <tr style={{ background: '#f2f2f2' }}>
                  {Object.keys(filteredCatalogue[0]).filter(key => !['created_at', 'status', 'season', 'updated_at', 'file'].includes(key)).map((key) => (
                    <th key={key} style={popupStyles.th}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCatalogue.map((record, index) => (
                  <tr key={index}>
                    {Object.entries(record)
                      .filter(([key]) => !['created_at', 'status', 'season', 'updated_at', 'file'].includes(key))
                      .map(([_, value], idx) => (
                        <td key={idx} style={popupStyles.td}>{value}</td>
                    ))}
                    <td style={popupStyles.td}>
                      
                        <MDBIcon 
                          icon="trash-alt" 
                          style={{ color: 'red', cursor: 'pointer', fontSize: '18px' }} 
                          onClick={() => handleDeleteRecord(index)} 
                        />
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = { fetch_coffee_records };

const mapStateToProps = (state) => {
  return {
    coffeeRecords: state.reducer.coffeeRecords, // Access coffee records from state
    catalogue: state.reducer.catalogue,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
