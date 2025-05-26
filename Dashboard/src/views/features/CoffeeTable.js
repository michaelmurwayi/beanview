import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetch_coffee_records } from 'components/State/action';
import 'assets/css/coffee_table.css';

const ViewCatalogue = ({ coffeeRecords, fetch_coffee_records }) => {
  const STATUS_MAP = {
    1: 'Pending',
    2: 'Sold',
    3: 'Catalogued',
  };

  const MILL_MAP = {
    1: 'ICM', 2: 'BU', 3: 'HM', 4: 'TY', 5: 'IM', 6: 'KM', 7: 'RF',
    8: 'TK', 9: 'KF', 10: 'LE', 11: 'nan', 12: 'KK', 13: 'US', 14: 'FH', 15: 'GR',
  };

  const [outturnFilter, setOutturnFilter] = useState('');
  const [bulkOutturnFilter, setBulkOutturnFilter] = useState('');
  const [saleFilter, setSaleFilter] = useState('');
  const [markFilter, setMarkFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [buyerFilter, setBuyerFilter] = useState('');

  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    fetch_coffee_records();
  }, []);

  useEffect(() => {
    let filtered = coffeeRecords;

    if (outturnFilter.trim()) {
      filtered = filtered.filter((r) =>
        r.outturn?.toLowerCase().includes(outturnFilter.trim().toLowerCase())
      );
    }

    if (bulkOutturnFilter.trim()) {
      filtered = filtered.filter((r) =>
        r.bulkoutturn?.toLowerCase().includes(bulkOutturnFilter.trim().toLowerCase())
      );
    }

    if (saleFilter.trim()) {
      filtered = filtered.filter((r) =>
        r.sale?.toLowerCase().includes(saleFilter.trim().toLowerCase())
      );
    }

    if (markFilter.trim()) {
      filtered = filtered.filter((r) =>
        r.mark?.toLowerCase().includes(markFilter.trim().toLowerCase())
      );
    }

    if (gradeFilter.trim()) {
      filtered = filtered.filter((r) =>
        r.grade?.toLowerCase().includes(gradeFilter.trim().toLowerCase())
      );
    }

    if (buyerFilter.trim()) {
      filtered = filtered.filter((r) =>
        r.buyer?.toLowerCase().includes(buyerFilter.trim().toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [
    coffeeRecords,
    outturnFilter,
    bulkOutturnFilter,
    saleFilter,
    markFilter,
    gradeFilter,
    buyerFilter,
  ]);

  const getSummary = (records) => {
    const totalWeight = records.reduce(
      (sum, rec) => sum + (parseFloat(rec.weight) || 0),
      0
    );
    const totalBags = records.reduce(
      (sum, rec) => sum + (parseInt(rec.bags) || 0),
      0
    );

    const gradeBreakdown = {};
    records.forEach((rec) => {
      const grade = rec.grade || 'Unknown';
      const bags = parseInt(rec.bags) || 0;
      gradeBreakdown[grade] = (gradeBreakdown[grade] || 0) + bags;
    });

    return { totalWeight, totalBags, gradeBreakdown };
  };

  const summary = getSummary(filteredRecords);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Coffee Records Catalogue</h3>

      {/* Filter Section */}
      <div className="card mb-4 p-3 shadow-sm">
        <h5 className="mb-3">Filter Records</h5>
        <div className="row g-3">
          {[
            { label: 'Outturn', value: outturnFilter, setter: setOutturnFilter },
            { label: 'Bulk Outturn', value: bulkOutturnFilter, setter: setBulkOutturnFilter },
            { label: 'Sale Number', value: saleFilter, setter: setSaleFilter },
            { label: 'Mark', value: markFilter, setter: setMarkFilter },
            { label: 'Grade', value: gradeFilter, setter: setGradeFilter },
            { label: 'Buyer', value: buyerFilter, setter: setBuyerFilter },
          ].map(({ label, value, setter }, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id={`filter-${label}`}
                  placeholder={label}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                />
                <label htmlFor={`filter-${label}`}>{label}</label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="card mb-4 p-3 shadow-sm bg-light">
        <h5 className="mb-3">Summary</h5>
        <div className="row mb-2">
          <div className="col-md-4"><strong>Total Weight:</strong> {summary.totalWeight.toFixed(2)} kg</div>
          <div className="col-md-4"><strong>Total Bags:</strong> {summary.totalBags}</div>
        </div>

        <div className="mb-2"><strong>Grade Breakdown (by bags):</strong></div>
        <div className="row">
          {Object.entries(summary.gradeBreakdown).map(([grade, bagCount]) => (
            <div key={grade} className="col-md-2 col-4 mb-1">
              <span className="badge bg-secondary w-100 py-2">
                {grade}: {bagCount} bags
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        {filteredRecords.length > 0 ? (
          <table className="coffee-table table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
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
                <th>Buyer</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.outturn}</td>
                  <td>{record.bulkoutturn}</td>
                  <td>{record.mark}</td>
                  <td>{record.grade}</td>
                  <td>{record.bags}</td>
                  <td>{record.pockets}</td>
                  <td>{record.weight}</td>
                  <td>{MILL_MAP[record.mill] || record.mill}</td>
                  <td>{STATUS_MAP[record.status] || 'Unknown'}</td>
                  <td>{record.sale}</td>
                  <td>{record.buyer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No matching records found.</p>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

const mapDispatchToProps = (dispatch) => ({
  fetch_coffee_records: () => dispatch(fetch_coffee_records()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCatalogue);
