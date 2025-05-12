import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  fetch_coffee_records,
  update_coffee_record,
  delete_coffee_record,
  submit_sale_summary, // NEW ACTION
} from "components/State/action";
import { Modal, Button } from "react-bootstrap";
import "assets/css/coffee_table.css";

// Status ID mapping
const STATUS_MAP = {
  1: "Pending",
  2: "Catalogued",
  3: "Sold",
};

const DataTable = (props) => {
  const {
    coffeeRecords,
    fetch_coffee_records,
    updateCoffeeRecords,
    deleteCoffeeRecord,
    submitSaleSummary,
  } = props;

  const [editModal, setEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [summaryModal, setSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState({
    summary: [],
    recordsByMark: {},
  });
  const [filters, setFilters] = useState({
    weight: "",
    grade: "",
    mark: "",
    outturn: "",
    sale_number: "",
  });

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteCoffeeRecord(id);
    }
  };

  const handleEdit = (record) => {
    if (!record) return;
    setSelectedRecord({ ...record });
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    if (
      !selectedRecord.mark?.trim() ||
      !selectedRecord.grade?.trim() ||
      !selectedRecord.outturn?.trim() ||
      !selectedRecord.weight ||
      isNaN(selectedRecord.weight) ||
      Number(selectedRecord.weight) <= 0
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    updateCoffeeRecords(selectedRecord);
    setEditModal(false);
  };

  const isFilterEmpty = Object.values(filters).every((val) => val === "");

  const filteredRecords = isFilterEmpty
    ? coffeeRecords
    : coffeeRecords.filter((record) =>
        (filters.weight === "" || record.weight >= parseFloat(filters.weight)) &&
        (filters.grade === "" || filters.grade === "ALL" || record.grade === filters.grade) &&
        (filters.mark === "" || (record.mark && record.mark.toLowerCase().includes(filters.mark.toLowerCase()))) &&
        (filters.outturn === "" || (record.outturn && record.outturn.toLowerCase().includes(filters.outturn.toLowerCase()))) &&
        (filters.sale_number === "" || record.sale_number === filters.sale_number)
      );

  const generateSummary = () => {
    const summary = {};
    const recordsByMark = {};

    filteredRecords.forEach((record) => {
      if (!summary[record.mark]) {
        summary[record.mark] = {
          totalWeight: 0,
          count: 0,
        };
        recordsByMark[record.mark] = [];
      }

      summary[record.mark].totalWeight += Number(record.weight);
      summary[record.mark].count += 1;
      recordsByMark[record.mark].push(record);
    });

    const result = Object.entries(summary).map(([mark, data]) => ({
      mark,
      ...data,
    }));

    const summaryPayload = {
      summary: result,
      recordsByMark,
    };

    setSummaryData(summaryPayload);
    submitSaleSummary(summaryPayload);
    setSummaryModal(true);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex justify-content-between align-items-center w-75 mb-3">
        <h2 className="mb-0">Coffee Records</h2>
      </div>
      <div>
        <Button variant="info" className="mb-5" onClick={generateSummary}>
          Generate Sale Summary by Mark
        </Button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          name="mark"
          placeholder="Filter by Mark"
          onChange={handleChange}
          className="form-control d-inline w-auto me-2"
        />
        <select
          name="grade"
          onChange={handleChange}
          className="form-control d-inline w-auto me-2"
        >
          <option value="">All Grades</option>
          <option value="AA">AA</option>
          <option value="AB">AB</option>
          <option value="PB">PB</option>
          <option value="C">C</option>
        </select>
        <input
          type="text"
          name="outturn"
          placeholder="Filter by Outturn"
          onChange={handleChange}
          className="form-control d-inline w-auto me-2"
        />
        <input
          type="number"
          name="weight"
          placeholder="Min Weight (kg)"
          onChange={handleChange}
          className="form-control d-inline w-auto"
        />
        <input
          type="text"
          name="sale_number"
          placeholder="Filter by Sale Number"
          onChange={handleChange}
          className="form-control d-inline w-auto ms-2"
        />
      </div>

      <div className="table-responsive w-100">
        <table className="table table-bordered">
          <thead style={{ backgroundColor: "#003366", color: "white" }}>
            <tr>
              <th>Outturn</th>
              <th>Mark</th>
              <th>Grade</th>
              <th>Type</th>
              <th>Bags</th>
              <th>Pockets</th>
              <th>Weight (kg)</th>
              <th>Sale Number</th>
              <th>Season</th>
              <th>Certificate</th>
              <th>Mill</th>
              <th>Warehouse</th>
              <th>Price</th>
              <th>Buyer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.outturn}</td>
                  <td>{record.mark}</td>
                  <td>{record.grade}</td>
                  <td>{record.type}</td>
                  <td>{record.bags}</td>
                  <td>{record.pockets}</td>
                  <td>{record.weight}</td>
                  <td>{record.sale_number}</td>
                  <td>{record.season}</td>
                  <td>{record.certificate}</td>
                  <td>{record.mill}</td>
                  <td>{record.warehouse}</td>
                  <td>{record.price}</td>
                  <td>{record.buyer}</td>
                  <td>{STATUS_MAP[record.status_id] || "Unknown"}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(record)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(record.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="text-center">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Coffee Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <>
              {["mark", "grade", "outturn", "weight"].map((field) => (
                <div className="mb-3" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type={field === "weight" ? "number" : "text"}
                    className="form-control"
                    value={selectedRecord[field] || ""}
                    onChange={(e) =>
                      setSelectedRecord({ ...selectedRecord, [field]: e.target.value })
                    }
                  />
                </div>
              ))}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Summary Modal */}
      <Modal show={summaryModal} onHide={() => setSummaryModal(false)} size="xl">
        <Modal.Header className="d-flex justify-content-between align-items-start">
          <div>
            <Modal.Title>Sale Summary by Mark</Modal.Title>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="success"
              onClick={() => {
                submitSaleSummary(summaryData);
                alert("Sale summary has been submitted successfully.");
              }}
            >
              Confirm & Submit Sale Summary
            </Button>
            <Button variant="secondary" onClick={() => setSummaryModal(false)}>
              Close
            </Button>
          </div>
        </Modal.Header>

        <Modal.Body style={{ overflowX: "auto" }}>
          {summaryData.summary.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Mark</th>
                  <th>Total Weight (kg)</th>
                  <th>Number of Records</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.summary.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className="table-primary">
                      <td>{item.mark}</td>
                      <td>{item.totalWeight.toFixed(2)}</td>
                      <td>{item.count}</td>
                    </tr>
                    <tr className="table-secondary">
                      <th></th>
                      <th>Grade</th>
                      <th>Outturn</th>
                      <th>Bags</th>
                      <th>Pockets</th>
                      <th>Weight (kg)</th>
                      <th>Status</th>
                    </tr>
                    {summaryData.recordsByMark[item.mark]?.map((record, i) => (
                      <tr key={i}>
                        <td></td>
                        <td>{record.grade}</td>
                        <td>{record.outturn}</td>
                        <td>{record.bags}</td>
                        <td>{record.pockets}</td>
                        <td>{record.weight}</td>
                        <td>{STATUS_MAP[record.status_id] || "Unknown"}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetch_coffee_records: () => dispatch(fetch_coffee_records()),
  updateCoffeeRecords: (data) => dispatch(update_coffee_record(data)),
  deleteCoffeeRecord: (id) => dispatch(delete_coffee_record(id)),
  submitSaleSummary: (summaryData) => dispatch(submit_sale_summary(summaryData)),
});

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTable);
