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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { post_farmers_records } from "components/State/action";
import { connect } from "react-redux";

const AddUser = (props) => {
  const { dispatchFarmersRecords } = props;
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("all"); // 'all' or specific sheet name
  const [uploadMethod, setUploadMethod] = useState("form"); // Track upload method (form or file)
  const [formData, setFormData] = useState({
    farmerName: "",
    mark: "",
    cbkNumber: "",
    nationalId: "",
    phoneNumber: "",
    email: "",
    county: "",
    town: "",
    address: "",
    bank: "",
    branch: "",
    account: "",
    currency: "",
    idDocument: null,
    bankStatement: null,
  });

  // Handle text and file input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
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
    event.preventDefault();

    const dataToSend = new FormData();
    if (uploadMethod === "form") {
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          dataToSend.append(key, value);
        }
      });
    } else if (uploadMethod === "file" && file) {
      dataToSend.append("file", file);
      dataToSend.append("filename", file.name);
      dataToSend.append("sheetnames", selectedSheet === "all" ? sheetNames : selectedSheet);
    }

    // Check for empty data before dispatching
    if (dataToSend.has("file") || Object.values(formData).some((value) => value !== "")) {
      dispatchFarmersRecords(dataToSend);
      toast.success("✅ Data submitted successfully!");
    } else {
      toast.warn("⚠️ No data to submit. Please fill in the required fields.");
    }
  };

  return (
    <>
      <UserHeader />
      <ToastContainer />
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
                          <label htmlFor="farmerName">Farmer Name</label>
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
                          <label htmlFor="mark">Mark</label>
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
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label htmlFor="cbkNumber">CBK Number</label>
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
                          <label htmlFor="nationalId">National ID</label>
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
                          <label htmlFor="phoneNumber">Phone Number</label>
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
                          <label htmlFor="email">Email Address</label>
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
                  </div>

                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">File Upload</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label htmlFor="idDocument">ID Document</label>
                      <Input id="idDocument" name="idDocument" type="file" onChange={handleChange} />
                    </FormGroup>
                    <FormGroup>
                      <label htmlFor="bankStatement">Bank Statement</label>
                      <Input id="bankStatement" name="bankStatement" type="file" onChange={handleChange} />
                    </FormGroup>
                  </div>

                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">Submission Options</h6>
                  <FormGroup>
                    <Input
                      type="select"
                      value={uploadMethod}
                      onChange={(e) => setUploadMethod(e.target.value)}
                    >
                      <option value="form">Submit via Form</option>
                      <option value="file">Upload Excel File</option>
                    </Input>
                  </FormGroup>

                  {uploadMethod === "file" && (
                    <FormGroup>
                      <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </FormGroup>
                  )}

                  <Button color="primary" type="submit">
                    Submit
                  </Button>
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

export default connect(null, mapDispatchToProps)(AddUser);
