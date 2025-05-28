import React, { useEffect, useState, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import {
  fetch_coffee_records,
  update_catalogue_record,
  delete_catalogue_record
} from "components/State/action";
import { MDBIcon } from "mdbreact";
import { Modal, Button } from "react-bootstrap";

const Files = (props) => {
  const { coffeeRecords, fetch_coffee_records, updateRecord, deleteRecord } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  const uniqueSaleNumbers = useMemo(() => {
    return [...new Set(coffeeRecords.map(record => record.sale).filter(Boolean))];
  }, [coffeeRecords]);

  const handleFolderClick = (saleNumber) => {
    const filtered = coffeeRecords.filter(
      (record) => record.sale === saleNumber && record.status_id === 3
    );
    setFilteredRecords(filtered);
    setSelectedSale(saleNumber);
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editRecord) return;
    updateRecord(editRecord);
    setFilteredRecords((prev) =>
      prev.map((rec) => rec.id === editRecord.id ? editRecord : rec)
    );
    setEditModal(false);
  };

  const handleDelete = (record) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteRecord(record);
      setFilteredRecords((prev) => prev.filter((rec) => rec.id !== record.id));
    }
  };

  return (
    <div className="container py-4">
      <style>{`
        .folder-icon-wrapper {
          transition: all 0.2s;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .folder-icon-wrapper:hover {
          background-color: #f0f0f0;
        }
        .folder-name {
          font-size: 0.95rem;
          font-weight: 500;
          color: #333;
        }
        .folder-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
          gap: 20px;
        }
        .folder-item {
          flex: 0 1 120px;
          text-align: center;
        }
      `}</style>

      <h1 className="text-center mb-2">Files</h1>
      <h4 className="text-center text-muted mb-4">Auction File and DSS Files Ordered by Sale</h4>

      <div className="folder-grid mb-4">
        {uniqueSaleNumbers.map((saleNumber) => (
          <div key={saleNumber} className="folder-item">
            <div
              className="folder-icon-wrapper"
              onClick={() => handleFolderClick(saleNumber)}
            >
              <MDBIcon icon="folder" size="4x" className="mb-2 text-primary" />
              <div className="folder-name">Sale {saleNumber}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with records for clicked sale */}
      <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-lg">
        <Modal.Header closeButton>
          <Modal.Title>Records for Sale {selectedSale}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filteredRecords.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Mark</th>
                    <th>Outturn</th>
                    <th>Grade</th>
                    <th>Type</th>
                    <th>Bags</th>
                    <th>Weight</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.mark}</td>
                      <td>{record.outturn}</td>
                      <td>{record.grade}</td>
                      <td>{record.type}</td>
                      <td>{record.bags}</td>
                      <td>{record.weight}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(record)}>Edit</Button>{" "}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(record)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">No records found for this sale.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editRecord && (
            <>
              {["mark", "outturn", "grade", "type", "bags", "weight"].map((field) => (
                <div className="mb-3" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                  <input
                    type={field === "bags" || field === "weight" ? "number" : "text"}
                    className="form-control"
                    value={editRecord[field]}
                    onChange={(e) => setEditRecord({ ...editRecord, [field]: e.target.value })}
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

const mapDispatchToProps = (dispatch) => ({
  fetch_coffee_records: () => dispatch(fetch_coffee_records()),
  updateRecord: (data) => dispatch(update_catalogue_record(data)),
  deleteRecord: (data) => dispatch(delete_catalogue_record(data)),
});

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(Files);
