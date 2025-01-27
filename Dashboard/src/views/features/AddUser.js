import React, { useState } from "react";
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
import UserHeader from "components/Headers/UserHeader.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { post_farmers_records } from "components/State/action";
import { connect } from 'react-redux';

const AddUser = (props) => {
  const { dispatchFarmersRecords } = props;
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, setSelectedSheet] = useState('all'); // State for selected sheet or 'all'
  const [uploadMethod, setUploadMethod] = useState('form'); // New state to track upload method
  const [formData, setFormData] = useState({
    farmerName: '',
    mark: '',
    cbkNumber: '',
    nationalId: '',
    phoneNumber: '',
    email: '',
    county: '',
    town: '',
    address: '',
    bank: '',
    branch: '',
    account: '',
    currency: '',
    idDocument: null,  // File input for ID
    bankStatement: null,  // File input for bank statement
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],  // Save the uploaded file
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
      event.preventDefault(); // Prevent default form submission
      const dataToSend = new FormData();
      // Append form data or file based on upload method
      // Append form data or file based on upload method
      if (uploadMethod === 'form') {
        Object.entries(formData).forEach(([key, value]) => {
          // Only append if the value is not empty or undefined
          if (value) {
            dataToSend.append(key, value);
          }
        });
        console.log(Object.entries(formData))
      } else if (uploadMethod === 'file' && file) {
        dataToSend.append('file', file);
        dataToSend.append('filename', file.name);
        if (selectedSheet == "all"){
            dataToSend.append("sheetnames", sheetNames)
        }else{
          dataToSend.append("sheetnames", selectedSheet)
        }
      }
      console.log(dataToSend.has('file'))
    
      // Only dispatch if there's data to send
      if (dataToSend.has('file') || Object.keys(formData).some((key) => formData[key] !== '')) {
        dispatchFarmersRecords(dataToSend);
      } else {
        toast.warn("⚠️ No data to submit. Please fill in the required fields.");
      }
    };
  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Farmer Account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="primary" onClick={handleSubmit} size="sm">
                      Add User
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">Farmer Information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="farmerName">
                            Farmer Name
                          </label>
                          <Input
                            id="farmerName"
                            name="farmerName"
                            placeholder="Farmer name"
                            type="text"
                            value={formData.farmerName}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="mark">
                            Mark
                          </label>
                          <Input
                            id="mark"
                            name="mark"
                            placeholder="Mark"
                            type="text"
                            value={formData.mark}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="cbkNumber">
                            CBK Number
                          </label>
                          <Input
                            id="cbkNumber"
                            name="cbkNumber"
                            placeholder="YY.****"
                            type="text"
                            value={formData.cbkNumber}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="nationalId">
                            National ID
                          </label>
                          <Input
                            id="nationalId"
                            name="nationalId"
                            placeholder="National ID"
                            type="text"
                            value={formData.nationalId}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Contact Information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="phoneNumber">
                            Phone Number
                          </label>
                          <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Enter phone number"
                            type="text"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="email">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            name="email"
                            placeholder="jesse@example.com"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="county">
                            County
                          </label>
                          <Input
                            id="county"
                            name="county"
                            placeholder="County"
                            type="text"
                            value={formData.county}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="town">
                            Town
                          </label>
                          <Input
                            id="town"
                            name="town"
                            placeholder="Town"
                            type="text"
                            value={formData.town}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Payment Information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="bank">
                            Bank
                          </label>
                          <Input
                            id="bank"
                            name="bank"
                            placeholder="Bank Name"
                            type="text"
                            value={formData.bank}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="branch">
                            Branch
                          </label>
                          <Input
                            id="branch"
                            name="branch"
                            placeholder="Branch"
                            type="text"
                            value={formData.branch}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="10">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="account">
                            Account Number
                          </label>
                          <Input
                            id="account"
                            name="account"
                            placeholder="Account Number"
                            type="text"
                            value={formData.account}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="2">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="currency">
                            Currency
                          </label>
                          <Input
                            id="currency"
                            name="currency"
                            placeholder="Currency"
                            type="text"
                            value={formData.currency}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                 
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchFarmersRecords: (data) => dispatch(post_farmers_records(data)),
});

export default connect(null,mapDispatchToProps) (AddUser);
