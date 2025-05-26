import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  fetch_coffee_records,
  update_coffee_record,
  delete_coffee_record,
  submit_sale_summary,
} from 'components/State/action';
import 'assets/css/coffee_table.css';

const CoffeeRecords = ({
  coffeeRecords,
  fetch_coffee_records,
  update_coffee_record,
  delete_coffee_record,
  submit_sale_summary,
}) => {
  const STATUS_MAP = { 1: 'Pending', 2: 'Sold', 3: 'Catalogued' };
  const MILL_MAP = {
    1: 'ICM', 2: 'BU', 3: 'HM', 4: 'TY', 5: 'IM', 6: 'KM', 7: 'RF',
    8: 'TK', 9: 'KF', 10: 'LE', 11: 'nan', 12: 'KK', 13: 'US', 14: 'FH', 15: 'GR',
  };

  const [filters, setFilters] = useState({
    outturn: '', bulkOutturn: '', sale: '', mark: '', grade: '', buyer: ''
  });

  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryGroups, setSummaryGroups] = useState({});

  useEffect(() => { fetch_coffee_records(); }, []);

  useEffect(() => {
    let filtered = coffeeRecords.filter(r => {
      return (!filters.outturn || r.outturn?.toLowerCase().includes(filters.outturn.toLowerCase()))
        && (!filters.bulkOutturn || r.bulkoutturn?.toLowerCase().includes(filters.bulkOutturn.toLowerCase()))
        && (!filters.sale || r.sale?.toLowerCase().includes(filters.sale.toLowerCase()))
        && (!filters.mark || r.mark?.toLowerCase().includes(filters.mark.toLowerCase()))
        && (!filters.grade || r.grade?.toLowerCase().includes(filters.grade.toLowerCase()))
        && (!filters.buyer || r.buyer?.toLowerCase().includes(filters.buyer.toLowerCase()));
    });
    setFilteredRecords(filtered);
  }, [coffeeRecords, filters]);

  const handleEditClick = (record) => {
    setSelectedRecord({ ...record });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    update_coffee_record([selectedRecord]);
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      delete_coffee_record(id);
    }
  };

  const handleGenerateSummary = () => {
    const grouped = {};
    filteredRecords.forEach((rec) => {
      const mark = rec.mark || 'Unmarked';
      if (!grouped[mark]) grouped[mark] = [];
      grouped[mark].push(rec);
    });
    setSummaryGroups(grouped);
    setShowSummaryModal(true);
  };

  const submitSaleSummaryFromModal = () => {
    const summaries = Object.entries(summaryGroups).map(([mark, records]) => ({
      mark,
      records,
    }));
    submit_sale_summary({ summaries });
    setShowSummaryModal(false);
  };

  const getSummary = (records) => {
    const totalWeight = records.reduce((sum, rec) => sum + (parseFloat(rec.weight) || 0), 0);
    const totalBags = records.reduce((sum, rec) => sum + (parseInt(rec.bags) || 0), 0);
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
    <div className="container-fluid mt-4">
      <h3 className="mb-4">Coffee Records Catalogue</h3>

      {/* Filter Section */}
      <div className="card mb-4 p-3 shadow-sm w-100">
        <h5 className="mb-3">Filter Records</h5>
        <div className="row g-3">
          {['outturn', 'bulkOutturn', 'sale', 'mark', 'grade', 'buyer'].map((field, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id={`filter-${field}`}
                  placeholder={field}
                  value={filters[field]}
                  onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
                />
                <label htmlFor={`filter-${field}`}>{field}</label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div className="card mb-4 p-3 shadow-sm bg-light w-100">
        <h5 className="mb-3">Summary</h5>
        <div className="row mb-2">
          <div className="col-md-4"><strong>Total Weight:</strong> {summary.totalWeight.toFixed(2)} kg</div>
          <div className="col-md-4"><strong>Total Bags:</strong> {summary.totalBags}</div>
        </div>
        <div className="mb-2"><strong>Grade Breakdown (by bags):</strong></div>
        <div className="row">
          {Object.entries(summary.gradeBreakdown).map(([grade, bagCount]) => (
            <div key={grade} className="col-md-2 col-4 mb-1">
              <span className="badge bg-secondary w-100 py-2">{grade}: {bagCount} bags</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Summary Button */}
      <div className="mb-3">
        <button className="btn btn-outline-success" onClick={handleGenerateSummary}>
          Generate Sale Summary
        </button>
      </div>

      {/* Table Section */}
      <div className="table-responsive">
        {filteredRecords.length > 0 ? (
          <table className="coffee-table table table-bordered table-hover w-100">
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
                <th>Action</th>
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
                  <td>
                    <button className="btn btn-sm btn-primary me-1" onClick={() => handleEditClick(record)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(record.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No matching records found.</p>
        )}
      </div>

      {/* Modals (unchanged logic) */}
      {selectedRecord && showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Coffee Record</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {[
                  'outturn', 'bulkoutturn', 'mark', 'grade',
                  'bags', 'pockets', 'weight', 'sale', 'buyer'
                ].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">{field}</label>
                    <input
                      className="form-control"
                      name={field}
                      value={selectedRecord[field] || ''}
                      onChange={handleEditChange}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSummaryModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sale Summary Preview</h5>
                <button type="button" className="btn-close" onClick={() => setShowSummaryModal(false)}></button>
              </div>
              <div className="modal-body">
                {Object.entries(summaryGroups).map(([mark, records]) => (
                  <div key={mark} className="mb-4">
                    <h6 className="text-primary">{mark}</h6>
                    <table className="table table-sm table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Outturn</th>
                          <th>Grade</th>
                          <th>Bags</th>
                          <th>Weight</th>
                          <th>Buyer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((rec) => (
                          <tr key={rec.id}>
                            <td>{rec.outturn}</td>
                            <td>{rec.grade}</td>
                            <td>{rec.bags}</td>
                            <td>{rec.weight}</td>
                            <td>{rec.buyer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowSummaryModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={submitSaleSummaryFromModal}>Submit Summary</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

const mapDispatchToProps = (dispatch) => ({
  fetch_coffee_records: () => dispatch(fetch_coffee_records()),
  update_coffee_record: (data) => dispatch(update_coffee_record(data)),
  delete_coffee_record: (id) => dispatch(delete_coffee_record(id)),
  submit_sale_summary: (data) => dispatch(submit_sale_summary(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CoffeeRecords);
