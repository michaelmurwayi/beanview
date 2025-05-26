import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  fetch_coffee_records,
  post_catalogue_records,
  post_coffee_records,
} from 'components/State/action';
import 'assets/css/coffee_table.css';

const ViewCatalogue = (props) => {
  const {
    coffeeRecords,
    fetch_coffee_records,
    post_coffee_records,
  } = props;

  const STATUS_MAP = {
    1: 'Pending',
    2: 'Sold',
    3: 'Catalogued',
  };

  const MILL_MAP = {
    1: 'ICM', 2: 'BU', 3: 'HM', 4: 'TY', 5: 'IM', 6: 'KM', 7: 'RF',
    8: 'TK', 9: 'KF', 10: 'LE', 11: 'nan', 12: 'KK', 13: 'US', 14: 'FH', 15: 'GR',
  };

  const [selectedGrade, setSelectedGrade] = useState('');
  const [weightThreshold, setWeightThreshold] = useState('');
  const [bagThreshold, setBagThreshold] = useState('');
  const [outturnInput, setOutturnInput] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editRecord, setEditRecord] = useState({});

  useEffect(() => {
    fetch_coffee_records();
  }, []);

  useEffect(() => {
    const trimmedGrade = selectedGrade.trim().toLowerCase();
    const weightLimit = parseFloat(weightThreshold);
    const bagLimit = parseFloat(bagThreshold);
    const trimmedOutturn = outturnInput.trim().toLowerCase();

    let filtered = coffeeRecords.filter((record) => record.status === 1);

    if (trimmedGrade) {
      filtered = filtered.filter(
        (record) => record.grade?.toLowerCase() === trimmedGrade
      );
    }

    if (weightThreshold.trim() !== '' && !isNaN(weightLimit)) {
      filtered = filtered.filter((record) => Number(record.weight) >= weightLimit);
    }

    if (bagThreshold.trim() !== '' && !isNaN(bagLimit)) {
      filtered = filtered.filter((record) => Number(record.bags) >= bagLimit);
    }

    if (trimmedOutturn) {
      filtered = filtered.filter(
        (record) => record.outturn?.toLowerCase().includes(trimmedOutturn)
      );
    }

    setFilteredRecords(filtered);
  }, [selectedGrade, weightThreshold, bagThreshold, outturnInput, coffeeRecords]);

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditRecord({ ...record });
  };

  const handleSave = (id = null) => {
    if (id) {
      // Single edit
      const updated = coffeeRecords.map((rec) =>
        rec.id === id ? { ...rec, ...editRecord } : rec
      );
      post_coffee_records(updated);
    } else {
      // Batch save from filtered
      const updatedRecords = filteredRecords.map((record) => ({
        ...record,
        sale: editRecord.sale || record.sale,
        status: 3,
      }));

      post_catalogue_records({
        saleNumber: editRecord.sale || 'N/A',
        records: updatedRecords,
      });
    }
    setEditingId(null);
    setEditRecord({});
  };

  const handleAddToSale = () => {
    const userInput = prompt('Enter Sale Number:');
    if (!userInput || !userInput.trim()) {
      alert('Sale number is required.');
      return;
    }
    setEditRecord({ sale: userInput.trim() });
    handleSave(null);
  };

  const weightSummary = filteredRecords.reduce(
    (acc, record) => {
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
    },
    { total: 0, totalBags: 0, grades: {} }
  );

  const uniqueGrades = [...new Set(coffeeRecords.map((rec) => rec.grade))].sort();
  const pendingOutturns = [...new Set(coffeeRecords.filter(r => r.status === 1).map(r => r.outturn))].sort();

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
            className="form-control mb-1"
            placeholder="Enter Outturn"
            value={outturnInput}
            onChange={(e) => setOutturnInput(e.target.value)}
          />
          <select
            className="form-control"
            value={outturnInput}
            onChange={(e) => setOutturnInput(e.target.value)}
          >
            <option value="">All Pending Outturns</option>
            {pendingOutturns.map((out) => (
              <option key={out} value={out}>
                {out}
              </option>
            ))}
          </select>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.outturn}</td>
                  <td>{record.bulkoutturn}</td>
                  <td>{record.mark}</td>
                  <td>{record.grade}</td>
                  <td>{record.bags}</td>
                  <td>{record.pockets}</td>
                  <td>{record.weight}</td>
                  <td>{MILL_MAP[record.mill] || record.mill}</td>
                  <td>{STATUS_MAP[record.status] || 'Unknown'}</td>
                  <td>
                    {editingId === record.id ? (
                      <input
                        type="text"
                        value={editRecord.sale || ''}
                        onChange={(e) =>
                          setEditRecord({ ...editRecord, sale: e.target.value })
                        }
                      />
                    ) : (
                      record.sale
                    )}
                  </td>
                  <td>
                    {editingId === record.id ? (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSave(record.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>
                    )}
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

const mapDispatchToProps = (dispatch) => ({
  fetch_coffee_records: () => dispatch(fetch_coffee_records()),
  post_coffee_records: (data) => dispatch(post_coffee_records(data)),
  post_catalogue_records: (data) => dispatch(post_catalogue_records(data)),
});

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCatalogue);
