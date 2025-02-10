import React from "react";
import { connect } from "react-redux";  
import { fetch_coffee_records } from "components/State/action";
import { useEffect } from "react";
const Files = (props) => {
    const { coffeeRecords, fetch_coffee_records } = props;
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
    
  return (
    <div>
      <div className="d-flex justify-content-center align-items-left vh-100 bg-light">
        <div className="text-center">
          <h1 className="display-1">Files</h1>
          <br/>
          <div className="container row">
          <div className="row" style={{ width: "100vw", alignItems: "center" }}>
            <div className="col-md-2 text-center">
              <i className="fa-solid fa-folder" style={{ fontSize: "10vh" }}></i>
            </div>
            <div className="col-md-8">
              <hr /> {/* Add a horizontal line in the middle column */}
            </div>
            <div className="col-md-2 text-center">
              <p style={{ fontSize: "3vh", margin: 0 }}>FILE</p>
            </div>
          </div>
          </div>  
        </div>
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
