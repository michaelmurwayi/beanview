import React, { useEffect, useState, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { fetch_coffee_records } from "components/State/action";
import { MDBIcon } from 'mdbreact';
import { Modal, Button } from 'react-bootstrap';

const Files = ({ coffeeRecords, fetch_coffee_records }) => {
    const [expandedSale, setExpandedSale] = useState(null);
    const [filteredCatalogue, setFilteredCatalogue] = useState([]);
    const [selectedCatalogueType, setSelectedCatalogueType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filteredByType, setFilteredByType] = useState([]);

    useEffect(() => {
        fetch_coffee_records();
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
            (record) => record.sale_number?.toString() === saleNumber.toString() && record.status === 3
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
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Catalogue: {selectedCatalogueType}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {filteredByType.length > 0 ? (
                            <ul className="list-group">
                                {filteredByType.map((record, index) => (
                                    <li key={index} className="list-group-item">
                                        {record.catalogue_name || "Unnamed Catalogue"}
                                    </li>
                                ))}
                            </ul>
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
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    fetch_coffee_records
};

const mapStateToProps = (state) => ({
    coffeeRecords: state.reducer.coffeeRecords,
});

export default connect(mapStateToProps, mapDispatchToProps)(Files);