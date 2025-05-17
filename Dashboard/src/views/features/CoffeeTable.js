import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  fetch_coffee_records,
  update_coffee_record,
  delete_coffee_record,
  submit_sale_summary,
} from "components/State/action";
import { Button } from "react-bootstrap";
import "assets/css/coffee_table.css";

const STATUS_MAP = {
  1: "Pending",
  2: "Catalogued",
  3: "Sold",
};

const MILL_MAP = {
  1: "ICM", 2: "BU", 3: "HM", 4: "TY", 5: "IM", 6: "KM", 7: "RF",
  8: "TK", 9: "KF", 10: "LE", 11: "nan", 12: "KK", 13: "US", 14: "FH", 15: "GR",
};

const DataTable = (props) => {
  const {
    coffeeRecords,
    fetch_coffee_records,
    updateCoffeeRecords,
    deleteCoffeeRecord,
    submitSaleSummary,
  } = props;

  const [editingId, setEditingId] = useState(null);
  const [editRecord, setEditRecord] = useState({});
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

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditRecord({ ...record });
  };

  const handleSaveEdit = () => {
    updateCoffeeRecords(editRecord);
    setEditingId(null);
    setEditRecord({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditRecord({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteCoffeeRecord(id);
    }
  };

  const isFilterEmpty = Object.values(filters).every((val) => val === "");

  const filteredRecords = isFilterEmpty
    ? coffeeRecords
    : coffeeRecords.filter((record) =>
        (filters.weight === "" || record.weight >= parseFloat(filters.weight)) &&
        (filters.grade === "" || filters.grade === "ALL" || record.grade === filters.grade) &&
        (filters.mark === "" || (record.mark && record.mark.toLowerCase().includes(filters.mark.toLowerCase()))) &&
        (filters.outturn === "" || (record.outturn && record.outturn.toLowerCase().includes(filters.outturn.toLowerCase()))) &&
        (filters.sale_number === "" || parseInt(record.sale) === parseInt(filters.sale_number))
      );

  return (
    <div className="d-flex flex-column align-items-center">
      <h2 className="mb-3">Coffee Records</h2>
      <div className="mb-3">
        <input type="text" name="mark" placeholder="Filter by Mark" onChange={handleChange} className="form-control d-inline w-auto me-2" />
        <select name="grade" onChange={handleChange} className="form-control d-inline w-auto me-2">
          <option value="">All Grades</option>
          <option value="AA">AA</option>
          <option value="AB">AB</option>
          <option value="PB">PB</option>
          <option value="C">C</option>
        </select>
        <input type="text" name="outturn" placeholder="Filter by Outturn" onChange={handleChange} className="form-control d-inline w-auto me-2" />
        <input type="number" name="weight" placeholder="Min Weight (kg)" onChange={handleChange} className="form-control d-inline w-auto" />
        <input type="text" name="sale_number" placeholder="Filter by Sale Number" onChange={handleChange} className="form-control d-inline w-auto ms-2" />
      </div>

      <div className="table-responsive w-100">
        <table className="table table-bordered">
          <thead style={{ backgroundColor: "#003366", color: "white" }}>
            <tr>
              <th>Outturn</th>
              <th>Bulk Outturn</th>
              <th>Mark</th>
              <th>Type</th>
              <th>Grade</th>
              <th>Bags</th>
              <th>Pockets</th>
              <th>Weight (kg)</th>
              <th>Sale</th>
              <th>Season</th>
              <th>Certificate</th>
              <th>Mill</th>
              <th>Price</th>
              <th>Buyer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                {[
                  "outturn", "bulkoutturn", "mark", "type", "grade",
                  "bags", "pockets", "weight", "sale", "season",
                  "certificate", "mill", "price", "buyer"
                ].map((field) => (
                  <td key={field}>
                    {editingId === record.id ? (
                      <input
                        type={field === "weight" || field === "sale" ? "number" : "text"}
                        value={editRecord[field] || ""}
                        onChange={(e) => setEditRecord({ ...editRecord, [field]: e.target.value })}
                        className="form-control form-control-sm"
                      />
                    ) : field === "mill" ? (
                      MILL_MAP[record[field]] || "unknown"
                    ) : (
                      record[field]
                    )}
                  </td>
                ))}
                <td>{STATUS_MAP[record.status_id] || "Unknown"}</td>
                <td>
                  {editingId === record.id ? (
                    <>
                      <button className="btn btn-sm btn-success me-1" onClick={handleSaveEdit}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(record)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(record.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan="16" className="text-center">No matching records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
