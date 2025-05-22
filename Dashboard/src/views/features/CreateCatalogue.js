import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetch_coffee_records, post_catalogue_records } from 'components/State/action';
import 'assets/css/coffee_table.css';

const ViewCatalogue = (props) => {
  const {
    coffeeRecords,
    fetch_coffee_records,
    post_catalogue_records
  } = props;

  const [saleNumber, setSaleNumber] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const trimmedSaleNumber = saleNumber.trim().toLowerCase();
    const trimmedGrade = selectedGrade.trim().toLowerCase();
  
    let filtered = [];
  
    if (trimmedSaleNumber) {
      // Try filtering by sale number
      const bySale = coffeeRecords.filter(
        (record) =>
          record.sale?.toString().toLowerCase() === trimmedSaleNumber
      );
  
      // If matches found, use them; otherwise fallback to status === 1
      filtered = bySale.length > 0
        ? bySale
        : coffeeRecords.filter((record) => record.status === 1);
    } else {
      // No sale number: show only status === 1
      filtered = coffeeRecords.filter((record) => record.status === 1);
    }
  
    // Apply grade filter if selected
    if (trimmedGrade) {
      filtered = filtered.filter(
        (record) => record.grade?.toLowerCase() === trimmedGrade
      );
    }
  
    setFilteredRecords(filtered);
  }, [saleNumber, selectedGrade, coffeeRecords]);
  
  const handleDeleteRecord = (index) => {
    setFilteredRecords((prevRecords) => prevRecords.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!saleNumber.trim()) {
      alert("Sale number is required.");
      return;
    }

    const data = {
      saleNumber,
      catalogueType: "all",
      records: filteredRecords,
    };

    console.log(data);
    post_catalogue_records(data);

    setSaleNumber("");
    setSelectedGrade("");
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

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Coffee Catalogue</h3>

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Sale Number</label>
          <input
            type="text"
            value={saleNumber}
            onChange={(e) => setSaleNumber(e.target.value)}
            className="form-control"
            placeholder="Enter Sale Number"
          />
        </div>

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
      </div>

      <div className="row mb-3">
        <div className="col-12 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={handleSubmit}>
            Generate Catalogue
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
        <h5>All Coffee Records</h5>
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
                <th>Mill</th>
                <th>Sale Number</th>
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
                  <td>{record.mill}</td>
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
  post_catalogue_records: (data) => dispatch(post_catalogue_records(data)),
});

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCatalogue);
