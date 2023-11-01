import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { connect }  from "react-redux"
import React, { useEffect } from 'react'
import { fetch_total_net_weight, fetch_total_tare_weight, fetch_total_bags } from "components/State/action";




const Header = (props) => {
  
  const {totalNetWeight,totalTareWeight,totalUsers,totalBags,grade,performancePerGrade, fetch_total_net_weight, fetch_total_tare_weight, fetch_total_bags, error} = props
  
  useEffect (()=>{
    fetch_total_net_weight();
    fetch_total_tare_weight();
    fetch_total_bags();
  }, [fetch_total_net_weight,fetch_total_tare_weight, fetch_total_bags]);
  
  return (
    
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Net Weight
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                           
                        {totalNetWeight}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Tare Weight
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                        {totalTareWeight}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Number of Bagsz
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalBags}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-coffee"/>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Number of Users
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {totalUsers}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
  
  );
};

const mapDsipatchToProps = { fetch_total_net_weight, fetch_total_tare_weight, fetch_total_bags }


const mapStateToProps = (state) =>{
  return {
    totalNetWeight: state.reducer.totalNetWeight,
    totalTareWeight: state.reducer.totalTareWeight,
    totalUsers: state.reducer.totalUsers,
    totalBags: state.reducer.totalBags,
    grade: state.reducer.grade,
    performancePerGrade: state.reducer.performancePerGrade,
    error: state.reducer.error


  }
}




export default connect (mapStateToProps, mapDsipatchToProps)(Header);
