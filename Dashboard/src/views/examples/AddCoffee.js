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
import { useEffect, useState } from "react";
// react component that copies the given text inside your clipboard
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import "./coffee.css"
import { post_coffee_records } from "components/State/action";
import { connect } from "react-redux";

const AddCoffee = (props) => {

  const {error, dispatchCoffeeRecord} = props
  const [formData, setFormData] = useState({});
  
  const handleChange = (event) => {

    const key = event.target.name;
    const value  = event.target.value;

    setFormData({
      ...formData,
      [key]: value 
    })
    event.preventDefault();
    // Handle form submission logic here
  };
  const coffeeRecord = {...formData}
  const handleSubmit = (event) =>{
    if (Object.keys(coffeeRecord).length > 0){
      dispatchCoffeeRecord(coffeeRecord)

    }else{
      console.log("we are here")
      event.preventDefault();
    }
    
  }
  return (
    <>  
      <div>

        <Container className="mt" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                  </Col>
                  <Col className="text-right" xs="4">
                    <h3 className="mb-0">Add Coffee Record</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form >
                  <h6 className="heading-small text-muted mb-4">
                    Coffee information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Estate
                          </label>
                          <input  name="estate" value={formData.estate || ''} onChange={handleChange}  placeholder="Estate" className="form-control"  type="text"/>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Outturn
                          </label>
                          <input  name="outturn" value={formData.outturn || ''} onChange={handleChange}  placeholder="Outturn" className="form-control"  type="text"/>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                            >
                            Grade
                          </label>
                          <input  name="grade" value={formData.grade || ''} onChange={handleChange}  placeholder="Grade" className="form-control"  type="text"/>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                            >
                            Status
                          </label>
                          <input  name="status" value={formData.status || ''} onChange={handleChange}  placeholder="Status" className="form-control"  type="text"/>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Coffee information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Bags
                          </label>
                          <input  name="bags" value={formData.bags || ''} onChange={handleChange}  placeholder="Bags" className="form-control"  type="text"/>
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Pockets
                          </label>
                          <input  name="pockets" value={formData.pockets || ''} onChange={handleChange}  placeholder="Pockets" className="form-control"  type="text"/>
                        </FormGroup>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Net Weight
                          </label>
                          <input  name="net_weight" value={formData.net_weight || ''} onChange={handleChange}  placeholder="Net Weight (Kgs) " className="form-control"  type="text"/>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                            >
                            Tare Weight
                          </label>
                          <input  name="tare_weight" value={formData.tare_weight || ''} onChange={handleChange}  placeholder="Tare Weight (Kgs)" className="form-control"  type="text"/>
                        </FormGroup>
                      </Col>
                      
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">Variance</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>Variance</label>
                      <input  name="variance" value={formData.variance || ''} onChange={handleChange}  placeholder="Variance" className="form-control"  type="text"/>
                    </FormGroup>
                  </div>

                  <Button
                      className="mt-5"
                      color="primary" 
                      type="submit"
                      size="sm"
                      onClick={handleSubmit}
                    >
                      Add Coffee
                    </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </>
  );
};

const mapStateToProps = (state) =>({
  error: state.reducer.error
})

const mapDsipatchToProps = (dispatch) => ({
    dispatchCoffeeRecord: (data) => dispatch(post_coffee_records(data))
})
export default connect(mapStateToProps,mapDsipatchToProps)(AddCoffee);
