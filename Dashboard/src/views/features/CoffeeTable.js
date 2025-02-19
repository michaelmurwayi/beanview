import React, { useEffect, useState } from "react";
import { MDBDataTable } from "mdbreact";
import { connect } from "react-redux";
import { fetch_coffee_records, delete_coffee_record } from "components/State/action";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "assets/css/coffee_table.css";
import { MDBIcon } from "mdbreact";
import Modal from "components/UpdateForm/Form";

const DataTable = (props) => {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const { coffeeRecords, fetch_coffee_records, delete_coffee_record } = props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // State for date filtering, initialized to show all records
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleDateChange = (ranges) => {
    setDateRange(ranges.selection);
  };

  const handleUpdate = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await delete_coffee_record(id);
        setAlert({ type: "success", message: "Record deleted successfully" });
      } catch (error) {
        setAlert({
          type: "error",
          message: "Unable to delete record. Please contact system admin.",
        });
      }
    }
  };

  // Filtering records based on date range
  const filteredRecords =
    dateRange.startDate && dateRange.endDate
      ? coffeeRecords.filter((record) => {
          const recordDate = new Date(record.created_at);
          return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
        })
      : coffeeRecords; // Show all records if no filter is selected

  const data = {
    columns: [
      { label: "ID", field: "id", sort: "asc", width: 150 },
      { label: "Mark", field: "mark", sort: "asc", width: 150 },
      { label: "Outturn", field: "outturn", sort: "asc", width: 150 },
      { label: "Grade", field: "grade", sort: "asc", width: 270 },
      { label: "Bags", field: "bags", sort: "asc", width: 100 },
      { label: "Pockets", field: "pockets", sort: "asc", width: 100 },
      { label: "Weight", field: "weight", sort: "asc", width: 200 },
      { label: "Season", field: "season", sort: "asc", width: 100 },
      { label: "Certificate", field: "certificate", sort: "asc", width: 150 },
      { label: "Mill", field: "mill", sort: "asc", width: 100 },
      { label: "Status", field: "status", sort: "asc", width: 100 },
      { label: "Created_at", field: "created_at", sort: "asc", width: 100 },
      {
        label: "Actions",
        field: "actions",
        sort: "disabled",
        width: 200,
      },
    ],
    rows: filteredRecords.map((record) => ({
      ...record,
      actions: (
        <div className="d-flex">
          <button className="btn-sm btn-info custom-button" onClick={() => handleUpdate(record)}>
            <i className="fas fa-pen-fancy"></i> Edit
          </button>
          <button
            className="btn-sm btn-danger custom-button"
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: "5px" }}
          >
            <i className="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      ),
    })),
  };

  return (
    <div className="container-fluid">
      {/* Alert Messages */}
      {alert.message && (
        <div className={`alert ${alert.type === "success" ? "alert-success" : "alert-error"}`}>
          {alert.message}
        </div>
      )}

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
          <MDBIcon icon="chevron-left" key="<" />,
          <MDBIcon icon="chevron-right" key=">" />,
        ]}
        barReverse={false}
        className="COFFEE RECORDS"
      />

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} toggleModal={toggleModal} record={selectedRecord} />
    </div>
  );
};

const mapDispatchToProps = { fetch_coffee_records, delete_coffee_record };

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
  selectedRecord: state.reducer.selectedRecord,
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
