import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { connect } from 'react-redux';
import { fetch_coffee_records } from 'components/State/action';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'assets/css/coffee_table.css';
import { MDBIcon } from 'mdbreact';
import Modal from 'components/UpdateForm/Form';

const DataTable = (props) => {
  const { coffeeRecords, fetch_coffee_records } = props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // Set default date range to show all available records
  const [dateRange, setDateRange] = useState({
    startDate: new Date('2024-01-01'), // Default start date (far in the past)
    endDate: new Date(), // Default end date (current date)
    key: 'selection',
  });

  // Fetch data on component mount
  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  // Handle date range change
  const handleDateChange = (ranges) => {
    setDateRange(ranges.selection);
  };
  const handleUpdate = (record) => {
    setSelectedRecord(record);
    setModalOpen(true); // Open the modal
    
  };

  // Filter data based on selected date range (if applicable)
  const filteredRecords = coffeeRecords.filter((record) => {
    const recordDate = new Date(record.created_at); // Assuming 'created_at' is a date string
    return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
  });

  const data = {
    columns: [
      {
        label: 'id',
        field: 'id',
        sort: 'asc',
        width: 150,
      },
      {
        label: 'Mark',
        field: 'mark',
        sort: 'asc',
        width: 150,
      },
      {
        label: 'Outturn',
        field: 'outturn',
        sort: 'asc',
        width: 150,
      },
      {
        label: 'Grade',
        field: 'grade',
        sort: 'asc',
        width: 270,
      },
      {
        label: 'Bags',
        field: 'bags',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'Pockets',
        field: 'pockets',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'Weight',
        field: 'weight',
        sort: 'asc',
        width: 200,
      },
      {
        label: 'Season',
        field: 'season',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'Certificate',
        field: 'certificate',
        sort: 'asc',
        width: 150,
      },
      {
        label: 'Mill',
        field: 'mill',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'Status',
        field: 'status',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'Created_at',
        field: 'created_at',
        sort: 'asc',
        width: 100,
      },
      {
        label: 'Actions',
        field: 'actions',
        sort: 'disabled', // Disable sorting for action buttons
        width: 200,
      },
    ],

    rows: filteredRecords.map(record => ({
      ...record,
    actions: (
      <>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleUpdate(record)}
        >
        <i class="fas fa-pen-fancy"></i>
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => handleDelete(record.id)}
          style={{ marginLeft: '5px' }}
        >
          <i class="fas fa-delete-left"></i>
        </button>
      </>
    ),
    })),
    
    };
   
    const handleModalSave = (updatedRecord) => {
      console.log('Updated Record:', updatedRecord);
      // Handle the updated record here (e.g., dispatching an action to update the store)
      setModalOpen(false); // Close the modal after saving
    };
    const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this record?')) {
        alert(`Delete action triggered for record ID: ${id}`);
        // Add your delete logic here
      }
    };
  
  return (
    <div className="container-fluid">
      {/* Date Range Picker */}
      <div className="date-range-picker">
        <DateRangePicker
          ranges={[dateRange]}
          onChange={handleDateChange}
          months={2}
          direction="horizontal"
        />
      </div>

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
          <MDBIcon icon="chevron-right" key="next" />
        ]}
        barReverse={false}
        className="COFFEE RECORDS" // Add your custom CSS for hover effect
      />
       {/* Modal Form */}
       <Modal isOpen={isModalOpen} toggleModal={toggleModal} record={selectedRecord} onSave={handleModalSave}>
        
      </Modal>
    </div>
  );
};

const mapDispatchToProps = { fetch_coffee_records };

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
