import React from "react";

const Files = () => {
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

export default Files;
