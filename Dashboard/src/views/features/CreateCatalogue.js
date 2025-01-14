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
  const [state, setState] = useState(initialState)
  
  // Set default date range
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-01-01'), // Default start date
    endDate: new Date(), // Default end date
    key: 'selection',
  });

  const [loading, setLoading] = useState(true); // Loading state for data fetch
  const [filteredCatalogue, setFilteredCatalogue] = useState([]); // Store filtered records
  const [modalOpen, setModalOpen] = useState(false); // Modal open state

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
      { label: 'Season', field: 'season', sort: 'asc', width: 100 },
      { label: 'Certificate', field: 'certificate', sort: 'asc', width: 150 },
      { label: 'Mill', field: 'mill', sort: 'asc', width: 100 },
      { label: 'Status', field: 'status', sort: 'asc', width: 100 },
      { label: 'Created_at', field: 'created_at', sort: 'asc', width: 100 },
    ],
    rows: filteredRecords, // Using filtered records
  };

    // Handle catalogue generation logic
    const handleGenerateCatalogue = () => {
      // Filter records where the weight is greater than 120 KG
      const filteredRecords = coffeeRecords.filter(record => parseFloat(record.weight) > 120);
      state.catalogue.coffeeRecords = coffeeRecords.filter(record => parseFloat(record.weight) > 120);
      if (filteredRecords.length > 0) {
        // Replace this with actual catalogue generation logic
        alert(`Catalogue generated with ${filteredRecords} records.`);
        console.log(state.catalogue.coffeeRecords); // Log or handle the filtered records as needed
      } else {
        alert("No records found with weight greater than 120 KG.");
      }
    };

  return (
    <div className="container-fluid">
      {/* Date Range Picker */}
      <div className="date-range-picker mb-3">
        <DateRangePicker
          ranges={[dateRange]}
          onChange={handleDateChange}
          months={2}
          direction="horizontal"
        />
      </div>

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
            <button
              className="btn btn-info"
              onClick={handleGenerateCatalogue}
            >
              <i className="fas fa-download"></i> Generate Catalogue
            </button>
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
