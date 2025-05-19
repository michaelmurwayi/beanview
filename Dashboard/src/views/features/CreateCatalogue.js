import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetch_coffee_records, post_catalogue_records } from 'components/State/action';
import { MDBIcon } from 'mdbreact';
import 'assets/css/coffee_table.css';

const ViewCatalogue = (props) => {
  const { coffeeRecords, fetch_coffee_records, mainGrades, miscelleneousGrades, post_catalogue_records } = props;

  const [saleNumber, setSaleNumber] = useState("");
  const [catalogueType, setCatalogueType] = useState("");
  const [filters, setFilters] = useState({
    weight: "",
    grade: "",
    coffeeClass: "",
  });
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  useEffect(() => {
    setFilteredRecords(coffeeRecords.filter((record) => {
      const isMainCatalogue = catalogueType === "main";
      const isMiscCatalogue = catalogueType === "misc";

      const inMainGrades = mainGrades.includes(record.grade);
      const inMiscGrades = miscelleneousGrades.includes(record.grade);
      const isPLType = record.type === "PL";

      return (
        record.status_id === 1 &&
        (filters.weight === "" || record.weight >= parseFloat(filters.weight)) &&
        (filters.grade === "" || record.grade === filters.grade) &&
        (filters.coffeeClass === "" || record.coffeeClass === filters.coffeeClass) &&
        (
          (isMainCatalogue && inMainGrades) ||
          (isMiscCatalogue && ((inMiscGrades && !inMainGrades) || (inMiscGrades && inMainGrades && isPLType)))
        )
      );
    }));
  }, [coffeeRecords, filters, catalogueType, mainGrades, miscelleneousGrades]);

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
    if (!catalogueType) {
      alert("Catalogue type is required.");
      return;
    }
    const data = {
      saleNumber,
      catalogueType,
      records: filteredRecords,
    };
    console.log(data);
    post_catalogue_records(data);
    // Reset if needed
    setSaleNumber("");
    setCatalogueType("");
    setFilters({ weight: "", grade: "", coffeeClass: "" });
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

  const availableGrades = Array.from(new Set(filteredRecords.map(record => record.grade)));
  const maxWeight = Math.max(0, ...filteredRecords.map(record => parseFloat(record.weight)));

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Coffee Catalogue</h3>
      <div className="filters mb-3 row">
        <div className="col-md-3">
          <label>Catalogue Type</label>
          <select
            value={catalogueType}
            onChange={(e) => setCatalogueType(e.target.value)}
            className="form-control"
          >
            <option value="">Select Catalogue Type</option>
            <option value="main">Main Catalogue</option>
            <option value="misc">Miscellaneous</option>
          </select>
        </div>
        <div className="col-md-3">
          <label>Sale Number</label>
          <input
            type="text"
            value={saleNumber}
            onChange={(e) => setSaleNumber(e.target.value)}
            className="form-control"
            placeholder="Enter Sale Number"
          />
        </div>
        <div className="col-md-2">
          <label>Weight (min)</label>
          <input
            type="number"
            name="weight"
            value={filters.weight}
            onChange={handleChange}
            className="form-control"
            min="0"
            max={maxWeight}
            step="0.1"
            placeholder="Weight"
          />
        </div>
        <div className="col-md-2">
          <label>Grade</label>
          <select
            name="grade"
            value={filters.grade}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Grade</option>
            {availableGrades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button
            className="btn btn-primary w-100"
            onClick={handleSubmit}
          >
            Generate Catalogue
          </button>
        </div>
      </div>

      <div className="summary mb-3 p-3 border rounded" style={{ backgroundColor: '#f9f9f9' }}>
        <h5>Summary</h5>
        <p><strong>Total Weight:</strong> {weightSummary.total.toFixed(2)}</p>
        <p><strong>Total Bags:</strong> {weightSummary.totalBags}</p>
        <div>
          {Object.entries(weightSummary.grades).map(([grade, data]) => (
            <p key={grade} style={{ marginBottom: '0.25rem' }}>
              <strong>{grade}:</strong> {data.bags} bags
            </p>
          ))}
        </div>
      </div>

      <div className="results-section">
        <h5>Filtered Coffee Records</h5>
        {filteredRecords.length > 0 ? (
          <table className="coffee-table table table-striped">
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
    mainGrades: state.reducer.mainGrades,
    miscelleneousGrades: state.reducer.miscelleneousGrades
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewCatalogue);
