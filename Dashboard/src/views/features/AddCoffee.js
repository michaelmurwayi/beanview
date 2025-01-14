import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Container,
  Row,
  Col,
} from "reactstrap";
import "./coffee.css";
import { post_coffee_records } from "components/State/action";
import { connect, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";

const AddCoffee = (props) => {
  const { success, error } = useSelector((state) => ({
    success: state.reducer.success,
    error: state.reducer.error,
  }));
  
  const { dispatchCoffeeRecord } = props;

  // Initialize formData with keys for all inputs
  const [formData, setFormData] = useState({
    outturn: '',
    mark: '',
    certificate: '',
    season: '',
    bags: '',
    pockets: '',
    grade: '',
    weight: '',
    mill: '',
    warehouse: '',
    status: '',
  });

  // State for the file and upload method
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, setSelectedSheet] = useState('all'); // State for selected sheet or 'all'
  const [uploadMethod, setUploadMethod] = useState('form'); // New state to track upload method

  // Watch for success or error changes
  useEffect(() => {
    if (success) {
      toast.success('🎉 Success! Your coffee record has been added successfully! Thank you for your contribution!');
      resetFormData();
    }
    if (error) {
      // Check if the error contains a 'detail' field for better error messages
      console.log(error)
      const errorMessage = error.detail || error || 'An unexpected error occurred.';
      toast.error(`⚠️ Submission failed: ${errorMessage}. Please check your inputs.`);
    }
  }, [success, error]);

  const resetFormData = () => {
    setFormData({
      outturn: '',
      mark: '',
      certificate: '',
      season: '',
      bags: '',
      pockets: '',
      grade: '',
      weight: '',
      mill: '',
      warehouse: '',
      status: '',
    });
    setFile(null); // Reset file state
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  const handleFileChange = (event) => {
    
    const selectedFile = event.target.files[0]; // Get the first file only
    setFile(selectedFile)
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        setSheetNames(workbook.SheetNames.slice(0, -3)); // Get all sheet names
        
      };
      reader.readAsArrayBuffer(selectedFile); // Read the file as an ArrayBuffer
    }
  };

  const handleUploadMethodChange = (event) => {
    setUploadMethod(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    const dataToSend = new FormData();
    console.log(sheetNames)
    // Append form data or file based on upload method
    // Append form data or file based on upload method
    if (uploadMethod === 'form') {
      Object.entries(formData).forEach(([key, value]) => {
        // Only append if the value is not empty or undefined
        if (value) {
          dataToSend.append(key, value);
        }
      });
      console.log(sheetNames)
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
      dispatchCoffeeRecord(dataToSend);
    } else {
      toast.warn("⚠️ No data to submit. Please fill in the required fields.");
    }
  };

  return (
    <div>
      <Container className="mt" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8"></Col>
                  <Col className="text-right" xs="4">
                    <h3 className="mb-0">Add Coffee Record</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <label>
                      <input 
                        type="radio" 
                        value="form" 
                        checked={uploadMethod === 'form'} 
                        onChange={handleUploadMethodChange} 
                      />
                      Fill out the form
                    </label>
                    <label className="ml-3">
                      <input 
                        type="radio" 
                        value="file" 
                        checked={uploadMethod === 'file'} 
                        onChange={handleUploadMethodChange} 
                      />
                      <span className="text-success">Upload a file</span>
                    </label>
                  </FormGroup>

                  {uploadMethod === 'form' && (
                    <>
                      <h6 className="heading-small text-muted mb-4">Estate information</h6>
                      <div className="pl-lg-4">
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <label className="form-control-label" htmlFor="input-first-name">
                                Outturn Number
                              </label>
                              <input name="outturn" value={formData.outturn} onChange={handleChange} placeholder="Outturn Number" className="form-control" type="text" />
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label className="form-control-label" htmlFor="input-last-name">
                                Mark Number
                              </label>
                              <input name="mark" value={formData.mark} onChange={handleChange} placeholder="Mark Number" className="form-control" type="text" />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <label className="form-control-label" htmlFor="input-email">
                                Certificate
                              </label>
                              <input name="certificate" value={formData.certificate} onChange={handleChange} placeholder="Certificate" className="form-control" type="text" />
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label className="form-control-label" htmlFor="input-country">
                                Season
                              </label>
                              <input name="season" value={formData.season} onChange={handleChange} placeholder="Season" className="form-control" type="text" />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <hr className="my-4" />
                      <h6 className="heading-small text-muted mb-4">Coffee information</h6>
                      <div className="pl-lg-4">
                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <label className="form-control-label" htmlFor="input-address">
                                Bags
                              </label>
                              <input name="bags" value={formData.bags} onChange={handleChange} placeholder="Bags" className="form-control" type="text" />
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <label className="form-control-label" htmlFor="input-address">
                                Pockets
                              </label>
                              <input name="pockets" value={formData.pockets} onChange={handleChange} placeholder="Pockets" className="form-control" type="text" />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg="4">
                            <FormGroup>
                              <label className="form-control-label" htmlFor="input-city">
                                Grade
                              </label>
                              <input name="grade" value={formData.grade} onChange={handleChange} placeholder="Grade" className="form-control" type="text" />
                            </FormGroup>
                          </Col>
                          <Col lg="4">
                            <FormGroup>
                              <label className="form-control-label" htmlFor="input-country">
                                Weight
                              </label>
                              <input name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (Kgs)" className="form-control" type="text" />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <hr className="my-4" />
                      <h6 className="heading-small text-muted mb-4">Additional Information</h6>
                      <div className="pl-lg-4">
                        <FormGroup>
                          <label>Miller Code</label>
                          <input name="mill" value={formData.mill} onChange={handleChange} placeholder="Miller Code" className="form-control" type="text" />
                        </FormGroup>
                      </div>
                      <div className="pl-lg-4">
                        <FormGroup>
                          <label>Warehouse</label>
                          <input name="warehouse" value={formData.warehouse} onChange={handleChange} placeholder="Warehouse" className="form-control" type="text" />
                        </FormGroup>
                      </div>
                      <div className="pl-lg-4">
                        <FormGroup>
                          <label>Status</label>
                          <input name="status" value={formData.status} onChange={handleChange} placeholder="Status" className="form-control" type="text" />
                        </FormGroup>
                      </div>
                    </>
                  )}
                  {uploadMethod === 'file' && (
                    <FormGroup className="text-success">
                      <input type="file" id="file" name="file" onChange={handleFileChange} className="form-control" />
                    </FormGroup>
                    
                  )}
                  {/* Display sheet names */}
                  {sheetNames.length > 0 && (
                     <form onSubmit={handleSubmit}>
                     {/* File input, disabled for immutability */}
                     
                     {/* Dropdown to select between sheet names or include all */}
                     {sheetNames.length > 0 && (
                       <div className="form-group">
                         <label htmlFor="sheet">Select Sheet</label>
                         <select
                           id="sheet"
                           name="sheet"
                           className="form-control"
                           value={selectedSheet}
                           onChange={(e) => setSelectedSheet(e.target.value)}
                         >
                          <option value="all">Include All Sheets</option>
                           {sheetNames.map((name, index) => (
                             <option key={index} value={name}>
                               {name}
                             </option>
                           ))}
                         </select>
                       </div>
                     )}
             
                     {/* Submit button */}
                    {/* <button type="submit" className="btn-xs btn-primary">
                        Submit
                      </button> */}
                    </form>
                    )}
                    <Button
                      className="mt-5"
                      color="primary"
                      type="submit"
                      size="sm"
                    >
                      {sheetNames.length > 0
                        ? 'Submit File'  // If sheetNames are available, show 'Submit File'
                        : uploadMethod === 'form'
                        ? 'Add Coffee'   // If form is selected, show 'Add Coffee'
                        : 'Check File'   // Otherwise, show 'Check File'
                      }
                    </Button>
                    
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  error: state.reducer.error,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchCoffeeRecord: (data) => dispatch(post_coffee_records(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCoffee);
