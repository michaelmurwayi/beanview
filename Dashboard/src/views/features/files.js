import React from "react";
import { connect } from "react-redux";  
import { fetch_coffee_records } from "components/State/action";
import { useEffect, useState } from "react";

const Files = (props) => {
    const { coffeeRecords, fetch_coffee_records } = props;
    const [showPopup, setShowPopup] = useState(false);
    const [filteredCatalogue, setFilteredCatalogue] = useState([]);
    
    // Fetch data on component mount
    useEffect(() => {
      fetch_coffee_records();
    }, [fetch_coffee_records]);

    const uniqueSaleNumbers = [
      ...new Set(
        coffeeRecords
          .map(record => record.sale_number)
          .filter(saleNumber => saleNumber !== null && saleNumber !== undefined)
      )
    ];
    console.log(uniqueSaleNumbers);

    // Inline styles for the popup
  const popupStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
    },
    popup: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      maxWidth: '60vw', // Reduce popup width
      maxHeight: '100vh', // Set max height
      width: '90%',
      overflow: 'auto', // Prevent overall overflow
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'red',
      width: '30px',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      cursor: 'pointer',
      fontSize: '10px',
      fontWeight: 'bolder',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', 
      borderRadius: '15px',
    },
    tableContainer: {
      maxHeight: '50vh', // Set max height for scroll
      overflowY: 'auto', // Enable vertical scrolling
      border: '1px solid #ddd',
      padding: '10px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      border: '0px solid black',
      padding: '10px',
      backgroundColor: '#f2f2f2',
      position: '',
      top: '0', // Keep headers sticky
      zIndex: '10',
    },
    td: {
      border: '1px solid black',
      padding: '2px',
      textAlign: 'center',
    },
    uploadButton: {
      backgroundColor: "#0004ff", // Bright blue background
      color: "white", // White text
      border: "none", // No border
      padding: "12px 20px", // Better padding for a comfortable click area
      cursor: "pointer", // Pointer cursor for clarity
      fontSize: "1.8vh", // Slightly bigger font
      fontWeight: "bold", // Bold text
      borderRadius: "8px", // More rounded corners
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
      transition: "all 0.3s ease", // Smooth transition effect
    },
    
    auctionButton:{
      backgroundColor: '#ffffff',
      color: 'black',
      border: 'none',
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '1.8vh',
      fontWeight: 'bold',
      borderRadius: '8px',
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
      transition: "all 0.3s ease", // Smooth transition effect
    },
    dssButton:{
      backgroundColor: '#009900',
      color: 'white',
      border: 'none',
      padding: '10px',
      cursor: 'pointer',
      fontSize: '1.8vh',
      fontWeight: 'bold',
      borderRadius: '8px',
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Soft shadow for depth
      transition: "all 0.3s ease", // Smooth transition effect
    }
  };
  const handleFolderSelection = (event, saleNumber) => {
    // Filter records where weight > 120 and status is not 'PENDING'
    event.preventDefault();
    console.log(coffeeRecords[1]['sale_number']);
    const filtered = coffeeRecords.filter(
      (record) =>
        parseFloat(record.sale_number) === parseFloat(saleNumber) && 
        record.status.toUpperCase() === "CATALOGUED"
    );
    
    console.log("Filtered Records:", filtered);
    if (filtered.length > 0) {
      setFilteredCatalogue(filtered);
      setShowPopup(true);
    } else {
      alert("No records found with weight greater than 120 KG.");
    }
  };
    
  return (
    <div>
      <div className="d-flex justify-content-center align-items-left vh-100 bg-light">
        <div className="text-center">
          <h1 className="display-1">Files</h1>
          <h4> Auction File and Dss Files Ordered According to Sale Numbers</h4>
          <br/>
          <div className="container">
          {uniqueSaleNumbers.map((saleNumber) => (
            <div
              key={saleNumber}
              className="row my-3"
              style={{ width: "60vw", alignItems: "center" }}
            >
              <div className="col-md-2 text-center"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.firstChild.style.color = "#F8D775")}
                onMouseLeave={(e) => (e.currentTarget.firstChild.style.color = "#4C9DA0")}
                onClick={ (event) => handleFolderSelection(event, saleNumber)}
              >
                <i className="fa-solid fa-folder" style={{ fontSize: "10vh" }}></i>
              </div>
              <div className="col-md-8">
                <hr className="mt-5" /> {/* Horizontal line in the middle column */}
              </div>
              <div className="col-md-2 text-center">
                <p style={{ fontSize: "2vh", margin: 0, fontWeight:"bold", color: 'black' }}>SALE {saleNumber}</p>
              </div>
            </div>
          ))}
        </div>  
        </div>
        {/* Popup Modal for Filtered Records */}
      {showPopup && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <div className="d-flex justify-content-center gap-4">
              <button className="btn btn-default col-md-4" style={popupStyles.uploadButton}> <i class="fa-solid fa-upload"></i> Upload Catalogue</button>
              <button className="btn btn-secondary col-md-2" style={popupStyles.auctionButton}><i class="fa-solid fa-download"></i> Auction File</button>
              <button className="btn btn-success col-md-2" style={popupStyles.dssButton}><i class="fa-solid fa-download"></i> DSS File</button>
              <button onClick={() => setShowPopup(false)} style={popupStyles.closeButton}>X</button>
            </div>
            {filteredCatalogue.length > 0 ? (
              <table style={popupStyles.table} className='mt-3'>
              <thead>
                <tr style={{ background: '#f2f2f2' }}>
                  {Object.keys(coffeeRecords[0]).filter(key => !['created_at', 'status', 'season', 'updated_at', 'file'].includes(key)).map((key) => (
                    <th key={key} style={popupStyles.th}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCatalogue.map((record, index) => (
                  <tr key={index}>
                    {Object.entries(record)
                      .filter(([key]) => !['created_at', 'status', 'season', 'updated_at', 'file'].includes(key))
                      .map(([_, value], idx) => (
                        <td key={idx} style={popupStyles.td}>{value}</td>
                    ))}
                    
                  </tr>
                ))}
              </tbody>
            </table>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

const mapDispatchToProps = {
  fetch_coffee_records};

const mapStateToProps = (state) => {
  return {
    coffeeRecords: state.reducer.coffeeRecords,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Files);
