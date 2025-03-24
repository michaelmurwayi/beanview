import React, { useEffect, useState, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { fetch_coffee_records, update_catalogue_record } from "components/State/action";
import { MDBIcon } from 'mdbreact';
import { Modal, Button } from 'react-bootstrap';

const Files = (props) => {
    const { coffeeRecords, fetch_coffee_records, updateRecord } = props;
    const [expandedSale, setExpandedSale] = useState(null);
    const [filteredCatalogue, setFilteredCatalogue] = useState([]);
    const [selectedCatalogueType, setSelectedCatalogueType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filteredByType, setFilteredByType] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [editRecord, setEditRecord] = useState(null);

    useEffect(() => {
        const getCoffeeRecords = async () => {
            try {
                await fetch_coffee_records();
            } catch (error) {
                console.error("Error fetching coffee records:", error);
            }
        };
        getCoffeeRecords();
    }, []);
    
    const uniqueSaleNumbers = useMemo(() => {
        return [...new Set(coffeeRecords.map(record => record.sale_number).filter(Boolean))];
    }, [coffeeRecords]);

    const handleFolderSelection = useCallback((saleNumber) => {
        if (expandedSale === saleNumber) {
            setExpandedSale(null);
            setFilteredCatalogue([]);
            return;
        }

        const filtered = coffeeRecords.filter(
            (record) => record.sale_number === saleNumber && record.status === 3
        );

        setFilteredCatalogue(filtered);
        setExpandedSale(saleNumber);
    }, [expandedSale, coffeeRecords]);

    const catalogueTypes = useMemo(() => {
        return [...new Set(filteredCatalogue.map(record => record.catalogue_type).filter(Boolean))];
    }, [filteredCatalogue]);

    const handleCatalogueClick = (type) => {
        const filtered = filteredCatalogue.filter(record => record.catalogue_type === type);
        setFilteredByType(filtered);
        setSelectedCatalogueType(type);
        setShowModal(true);
    };

    const handleEdit = (record) => {
        setEditRecord(record);
        setEditModal(true);
    };
    
    const handleSaveEdit = () => {
        if (!editRecord) return;
    
        alert("Coffee record will be permanently updated. Are you sure you want to proceed?");
        updateRecord(editRecord); // Dispatch action to update the record
    
        setFilteredByType((prev) =>
            prev.map((rec) => (rec.outturn === editRecord.outturn && rec.grade === editRecord.grade ? editRecord : rec))
        );
    
    
        setEditModal(false);
    };


    const handleDelete = (record) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
        updateRecord(record); // Dispatch Redux action

        setFilteredByType((prev) => prev.filter((rec) => rec.id !== record.id));
    }
};


    return (
        <div className="d-flex justify-content-center align-items-left vh-100 bg-light">
            <div className="text-center">
                <h1 className="display-1">Files</h1>
                <h4>Auction File and DSS Files Ordered According to Sale Numbers</h4>
                <br/>
                <div className="container">
                    {uniqueSaleNumbers.map((saleNumber) => (
                        <div key={saleNumber} className="my-3" style={{ width: "60vw" }}>
                            <div className="row">
                                <div className="col-md-6 d-flex justify-content-center">
                                    <div 
                                        className="card action-card" 
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleFolderSelection(saleNumber)}
                                    >
                                        <div className="card-body text-center">
                                            <MDBIcon icon="file-download" size="3x" className="mb-3 text-primary" />
                                            <h3>Sale {saleNumber}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Dropdown Content */}
                            {expandedSale === saleNumber && (
                                <div className="mt-3 p-3" style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }}>
                                    <h5 className="text-center">Catalogue Types</h5>
                                    {catalogueTypes.length > 0 ? (
                                        <ul className="list-group">
                                            {catalogueTypes.map((type, index) => (
                                                <li 
                                                    key={index} 
                                                    className="list-group-item" 
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleCatalogueClick(type)}
                                                >
                                                    {type}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-center text-muted">No catalogues found for this sale.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Modal for Displaying Filtered Catalogue */}
                <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Catalogue: {selectedCatalogueType}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {filteredByType.length > 0 ? (
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
                                        {filteredByType.map((record, index) => (
                                            <tr key={index}>
                                                <td>{record.mark}</td>
                                                <td>{record.outturn}</td>
                                                <td>{record.grade}</td>
                                                <td>{record.type}</td>
                                                <td>{record.bags}</td>
                                                <td>{record.weight}</td>
                                                <td>
                                                    <Button variant="warning" size="sm" onClick={() => handleEdit(record)}>
                                                        Edit
                                                    </Button>{' '}
                                                    <Button variant="danger" size="sm" onClick={() => handleDelete(record)}>
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-muted">No records found for this catalogue type.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Record Modal */}
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
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
      fetch_coffee_records: () => dispatch(fetch_coffee_records()),
      updateRecord: (data) => dispatch(update_catalogue_record(data)),
    };
  };

const mapStateToProps = (state) => ({
    coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(Files);
