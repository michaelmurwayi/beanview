import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import {
  fetch_coffee_records,
  update_catalogue_record,
  delete_catalogue_record,
  generate_auction_file
} from "components/State/action";
import { MDBIcon } from "mdbreact";
import { Modal, Button } from "react-bootstrap";

const Files = (props) => {
  const { coffeeRecords, fetch_coffee_records, updateRecord, generateAuctionFile } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const agentCode = 49;

  const gradeOrder = [
    "T", "TT", "C", "AB", "PB", "E", "AA", "SB", "HE", "UG3",
    "UG2", "UG1", "UG", "NL", "ML"
  ];

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records]);

  const uniqueSaleNumbers = useMemo(() => {
    return [...new Set(coffeeRecords.map(record => record.sale).filter(Boolean))];
  }, [coffeeRecords]);

  const orderByGrade = (records) => {
    return [...records].sort((a, b) => {
      const indexA = gradeOrder.indexOf(a.grade);
      const indexB = gradeOrder.indexOf(b.grade);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const handleFolderClick = (saleNumber) => {
    const filtered = coffeeRecords.filter(record => record.sale === saleNumber);
    console.log(filtered);
    setSelectedSale(saleNumber);
    setShowModal(true);

    const categorized = {};
    filtered.forEach(record => {
      console.log(record);
      if (!record.bulkoutturn) {
        const key = `no-bulkoutturn-${Math.random()}`;
        categorized[key] = {
          mark: record.outturn + '/' + record.mark,
          outturn: record.outturn,
          bulkoutturn: record.bulkoutturn,
          grade: record.grade,
          type: record.type,
          weight: parseInt(record.weight, 10),
          sale: record.sale,
          season: record.season,
          certificate: record.certificate,
          mill: record.mill,
          warehouse: record.warehouse,
          agentCode: record.agentCode || agentCode,
          reserve: record.reserve,
          certificate: record.certificate ,
          
        };
        console.log(categorized[key]);
        return;
      }

      const key = `${record.bulkoutturn}-${record.grade}`;
      if (!categorized[key]) {
        categorized[key] = {
          mark: record.bulkoutturn + '/' + record.grade + '/' + 'Bulk',
          outturn: record.bulkoutturn,
          bulkoutturn: record.bulkoutturn,
          grade: record.grade,
          type: record.type,
          weight: 0,
          sale: record.sale,
          season: record.season,
          certificate: record.certificate,
          mill: record.mill,
          warehouse: record.warehouse,
          agentCode: record.agentCode || agentCode,
          reserve: record.reserve,
          certificate: record.certificate,
          
        };
      }

      categorized[key].weight += parseInt(record.weight, 10);
    });

    const summary = Object.values(categorized).map(entry => {
      const bags = Math.floor(entry.weight / 60);
      const pockets = entry.weight % 60;
      return {
        ...entry,
        bags,
        pockets,
      };
    });

    const sortedSummary = orderByGrade(summary);
    setFilteredRecords(sortedSummary);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editRecord) return;
    updateRecord(editRecord);
    setFilteredRecords(prev =>
      prev.map(rec => rec.id === editRecord.id ? editRecord : rec)
    );
    setEditModal(false);
  };

  const handleDelete = (record) => {
    if (window.confirm("Are you sure you want to remove this record from the sale?")) {
      const updatedRecord = { ...record, sale: "" };
      updateRecord(updatedRecord);
      setFilteredRecords(prev => prev.filter(rec => rec.id !== record.id));
    }
  };

  const handleGenerateAuctionFile = () => {
    if (window.confirm(`Generate auction file for sale ${selectedSale}?`)) {
      generateAuctionFile({
        sale: selectedSale,
        records: filteredRecords
      });
    }
  };

  const titleCase = (str) => str.replace(/\b\w/g, l => l.toUpperCase());

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

      <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>Records for Sale {selectedSale}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {filteredRecords.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>C_Outturn</th>
                    <th>Mark</th>
                    <th>Grade</th>
                    <th>Bags</th>
                    <th>Pockets</th>
                    <th>Weight</th>
                    <th>Sale No</th>
                    <th>Season</th>
                    <th>Certificate</th>
                    <th>Mill</th>
                    <th>W/H</th>
                    <th>Agent Code</th>
                    <th>Reserve Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.outturn}</td>
                      <td>{record.mark}</td>
                      <td>{record.grade}</td>
                      <td>{record.bags}</td>
                      <td>{record.pockets}</td>
                      <td>{record.weight}</td>
                      <td>{record.sale}</td>
                      <td>{record.season}</td>
                      <td>{record.certificate}</td>
                      <td>{record.mill}</td>
                      <td>{record.warehouse}</td>
                      <td>{record.agentCode || agentCode}</td>
                      <td>{record.reserve}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(record)}>Edit</Button>{" "}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(record)}>Remove</Button>
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
          <Button variant="success" onClick={handleGenerateAuctionFile}>
            Generate Auction File
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editRecord && (
            <>
              {["mark", "outturn", "grade", "type", "bags", "weight"].map((field) => (
                <div className="mb-3" key={field}>
                  <label htmlFor={field}>{titleCase(field)}:</label>
                  <input
                    id={field}
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
  generateAuctionFile: (data) => dispatch(generate_auction_file(data))
});

const mapStateToProps = (state) => ({
  coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(Files);
