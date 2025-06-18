import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  fetch_coffee_records,
  update_coffee_record
} from 'components/State/action';
import 'assets/css/coffee_table.css';

const ViewCatalogue = (props) => {
  const {
    coffeeRecords,
    fetch_coffee_records,
    update_coffee_record
  } = props;

  const STATUS_MAP = {
    1: "Pending",
    2: "Sold",
    3: "Catalogued",
  };

  const MILL_MAP = {
    1: "ICM", 2: "BU", 3: "HM", 4: "TY", 5: "IM", 6: "KM", 7: "RF",
    8: "TK", 9: "KF", 10: "LE", 11: "nan", 12: "KK", 13: "US", 14: "FH", 15: "GR",
  };

  const [selectedGrade, setSelectedGrade] = useState("");
  const [weightThreshold, setWeightThreshold] = useState("");
  const [bagThreshold, setBagThreshold] = useState("");
  const [selectedOutturn, setSelectedOutturn] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  useEffect(() => {
    const trimmedGrade = selectedGrade.trim().toLowerCase();
    const weightLimit = parseFloat(weightThreshold);
    const bagLimit = parseFloat(bagThreshold);
    const trimmedOutturn = selectedOutturn.trim().toLowerCase();

    let filtered = coffeeRecords.filter((record) => record.status === 1);

    if (trimmedGrade) {
      filtered = filtered.filter(
        (record) => record.grade?.toLowerCase() === trimmedGrade
      );
    }

    if (weightThreshold.trim() !== "" && !isNaN(weightLimit)) {
      filtered = filtered.filter((record) => Number(record.weight) >= weightLimit);
    }

    if (bagThreshold.trim() !== "" && !isNaN(bagLimit)) {
      filtered = filtered.filter((record) => Number(record.bags) >= bagLimit);
    }

    if (trimmedOutturn) {
      filtered = filtered.filter(
        (record) => record.outturn?.toLowerCase() === trimmedOutturn
      );
    }

    setFilteredRecords(filtered);
  }, [selectedGrade, weightThreshold, bagThreshold, selectedOutturn, coffeeRecords]);

  const handleAddToSale = async () => {
    const userInput = prompt("Enter Sale Number:");
    if (!userInput || !userInput.trim()) {
      alert("Sale number is required.");
      return;
    }
    const finalSaleNumber = userInput.trim();

    for (const record of filteredRecords) {
      // Prepare FormData to match backend expectations
      const formData = new FormData();

      // Append existing record fields
      for (const key in record) {
        if (Object.hasOwnProperty.call(record, key)) {
          let value = record[key];
          
          // Force status to "catalogued" before appending
          if (key === 'status') {
            value = '3'; // or whatever ID corresponds to "catalogued"
          }
      
          formData.append(key, value);
        }
      }
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      // Override sale and status fields
      formData.set('sale', finalSaleNumber);
      formData.set('status', 3); // Catalogued

      // Await update action dispatch
      await update_coffee_record(formData);
    }

    // Clear filters and filtered records after update
    setSelectedGrade("");
    setWeightThreshold("");
    setBagThreshold("");
    setSelectedOutturn("");
    setFilteredRecords([]);
  };

  const weightSummary = filteredRecords.reduce((acc, record) => {
    const weight = Number(record.weight) || 0;
    const bags = Number(record.bags) || 0;

    acc.total += weight;
    acc.totalBags += bags;

    if (!acc.grades[record.grade]) {
      acc.grades[record.grade] = { weight: 0, bags: 0 };
    }

    acc.grades[record.grade].weight += weight;
    acc.grades[record.grade].bags += bags;

    return acc;
  }, { total: 0, totalBags: 0, grades: {} });

  const uniqueGrades = [...new Set(coffeeRecords.map((rec) => rec.grade))].sort();
  const uniqueOutturns = [...new Set(coffeeRecords.filter(r => r.status === 1).map((rec) => rec.outturn))].sort();

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Add Coffee to Sale</h3>

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Filter by Grade</label>
          <select
            className="form-control"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="">All Grades</option>
            {uniqueGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label>Filter by Outturn</label>
          <input
            className="form-control mb-2"
            placeholder="Type or select outturn"
            value={selectedOutturn}
            onChange={(e) => setSelectedOutturn(e.target.value)}
            list="outturn-list"
          />
          <datalist id="outturn-list">
            {uniqueOutturns.map((outturn) => (
              <option key={outturn} value={outturn} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label>Weight (≥)</label>
          <input
            type="number"
            className="form-control"
            value={weightThreshold}
            onChange={(e) => setWeightThreshold(e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
        <div className="col-md-4">
          <label>Bags (≥)</label>
          <input
            type="number"
            className="form-control"
            value={bagThreshold}
            onChange={(e) => setBagThreshold(e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-success w-100" onClick={handleAddToSale}>
            Add Coffee to Sale
          </button>
        </div>
      </div>

      <div className="summary mb-3 p-3 border rounded bg-light">
        <h5>Summary</h5>
        <div className="row">
          <div className="col-md-3">
            <p><strong>Total Weight:</strong> {weightSummary.total.toFixed(2)}</p>
          </div>
          <div className="col-md-3">
            <p><strong>Total Bags:</strong> {weightSummary.totalBags}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Grades Summary:</strong></p>
            <div className="d-flex flex-wrap">
              {Object.entries(weightSummary.grades).map(([grade, data]) => (
                <div key={grade} className="me-3">
                  <p className="mb-0"><strong>{grade}:</strong> {data.bags} bags</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="results-section">
        <h5>Filtered Coffee Records</h5>
        {filteredRecords.length > 0 ? (
          <table className="coffee-table table table-striped">
            <thead>
              <tr>
                <th>Outturn</th>
                <th>Bulk Outturn</th>
                <th>Mark</th>
                <th>Grade</th>
                <th>Bags</th>
                <th>Pockets</th>
                <th>Weight</th>
                <th>Mill</th>
                <th>Status</th>
                <th>Sale</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.outturn}</td>
                  <td>{record.bulkoutturn}</td>
                  <td>{record.mark}</td>
                  <td>{record.grade}</td>
                  <td>{record.bags}</td>
                  <td>{record.pockets}</td>
                  <td>{record.weight}</td>
                  <td>{MILL_MAP[record.mill] || record.mill}</td>
                  <td>{STATUS_MAP[record.status] || "Unknown"}</td>
                  <td>{record.sale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No matching records found.</p>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  fetch_coffee_records: () => dispatch(fetch_coffee_records()),
  update_coffee_record: (data) => dispatch(update_coffee_record(data))
});

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCatalogue);
