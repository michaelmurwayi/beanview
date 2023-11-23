/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState } from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import "./coffee.css"

const Icons = () => {
  const [copiedText, setCopiedText] = useState();
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };
  return (
    <>
      {/* <Header /> */}
      
      <div className="container mt-5">
        <h1>Add Coffee Record</h1>
      <form className="my-form" onSubmit={handleSubmit}>
          <div class="form-group">
            <label class="col-md-12 control-label">Estate</label>  
            <div class="col-md-12 inputGroupContainer">
            <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input  name="estate" placeholder="Estate" class="form-control"  type="text"/>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-12 control-label">Outturn</label>  
            <div class="col-md-12 inputGroupContainer">
            <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input  name="outturn" placeholder="Outturn" class="form-control"  type="text"/>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-12 control-label">Grade</label>  
            <div class="col-md-12 inputGroupContainer">
            <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input  name="grade" placeholder="Grade" class="form-control"  type="text"/>
              </div>
            </div>
            <div class="form-group">
            <label class="col-md-12 control-label">Bags</label>  
            <div class="col-md-12 inputGroupContainer">
            <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input  name="bags" placeholder="Bags" class="form-control"  type="text"/>
              </div>
            </div>
          </div>
          </div>

          <div class="form-group">
            <label class="col-md-12 control-label">Estate</label>  
            <div class="col-md-12 inputGroupContainer">
            <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input  name="estate" placeholder="Estate" class="form-control"  type="text"/>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-12 control-label">Outturn</label>  
            <div class="col-md-12 inputGroupContainer">
            <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input  name="outturn" placeholder="Outturn" class="form-control"  type="text"/>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-12 control-label">Grade</label>  
            <div class="col-md-12 inputGroupContainer">
            <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input  name="grade" placeholder="Grade" class="form-control"  type="text"/>
              </div>
            </div>
            <div class="form-group">
            <label class="col-md-12 control-label">Bags</label>  
            <div class="col-md-12 inputGroupContainer">
            <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input  name="bags" placeholder="Bags" class="form-control"  type="text"/>
              </div>
            </div>
          </div>
          </div>
          <div className="mt-2">
          <div className="col-md-6">
            <button className="btn btn-primary">
              Add Record
            </button>
          </div>
      </div>
      </form>
      </div>
    </>
  );
};

export default Icons;
