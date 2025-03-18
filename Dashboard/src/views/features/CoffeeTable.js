import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetch_coffee_records, update_coffee_record, delete_coffee_record } from "components/State/action";
import { Modal, Button } from "react-bootstrap";
import "assets/css/coffee_table.css";
import { de } from "date-fns/locale";

const DataTable = (props) => {
  const { coffeeRecords, fetch_coffee_records, updateCoffeeRecords, deleteCoffeeRecord } = props;
  const [editModal, setEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCatalogueType, setSelectedCatalogueType] = useState("");
  const [filters, setFilters] = useState({ weight: "", grade: "", mark: "", outturn: "" });

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = (record) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteCoffeeRecord(record);
    }
  };

  const handleEdit = (record) => {
    if (!record) return;
    console.log(record);
    setSelectedRecord({ ...record });
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedRecord.mark || !selectedRecord.grade || selectedRecord.weight <= 0) {
      alert("Please fill out all fields correctly.");
      return;
    }
    console.log(selectedRecord);
    updateCoffeeRecords(selectedRecord);
    setEditModal(false);
  };

  const filteredRecords = coffeeRecords.filter(
    (record) =>
      (filters.weight === "" || record.weight >= parseFloat(filters.weight)) &&
      (filters.grade === "" || filters.grade === "ALL" || record.grade === filters.grade) &&
      (filters.mark === "" || record.mark.toLowerCase().includes(filters.mark.toLowerCase())) &&
      (filters.outturn === "" || record.outturn.toLowerCase().includes(filters.outturn.toLowerCase()))
  );

  return (
    <div className="d-flex flex-column align-items-center">
      <h2 className="mb-3">Coffee Records</h2>

      {/* Filter Inputs */}
      <div className="mb-3">
        <input type="text" name="mark" placeholder="Filter by Mark" onChange={handleChange} className="form-control d-inline w-auto me-2" />
        <input type="text" name="grade" placeholder="Filter by Grade" onChange={handleChange} className="form-control d-inline w-auto me-2" />
        <input type="text" name="outturn" placeholder="Filter by Outturn" onChange={handleChange} className="form-control d-inline w-auto me-2" />
      </div>

      {/* Coffee Records Table */}
      <div className="table-responsive w-75">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Mark</th>
              <th>Grade</th>
              <th>Outturn</th>
              <th>Weight (kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.mark}</td>
                  <td>{record.grade}</td>
                  <td>{record.outturn}</td>
                  <td>{record.weight}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(record)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(record.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No matching records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Record Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Coffee Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <>
              {['mark', 'grade', 'outturn', 'weight'].map((field) => (
                <div className="mb-3" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type={field === 'weight' ? 'number' : 'text'}
                    className="form-control"
                    value={selectedRecord[field] || ""}
                    onChange={(e) => setSelectedRecord({ ...selectedRecord, [field]: e.target.value })}
                  />
                </div>
              ))}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_coffee_records: () => dispatch(fetch_coffee_records()),
    updateCoffeeRecords: (data) => dispatch(update_coffee_record(data)),
    deleteCoffeeRecord: (id) => dispatch(delete_coffee_record(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    coffeeRecords: state.reducer.coffeeRecords,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
