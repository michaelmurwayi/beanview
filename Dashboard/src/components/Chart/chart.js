import Chart from 'chart.js';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { fetch_grade_performance } from 'components/State/action';

const BarChart = (props) => {
  // Use performancePerGrade to render the chart
  const {performancePerGrade, fetch_grade_performance} = props

  useEffect(() => {
    // Fetch or calculate chart data and update Redux state using the action
    fetch_grade_performance();
  },[fetch_grade_performance]);

  return (
    <div>
      <p>we are {performancePerGrade}</p>
      {/* <Bar data={performancePerGrade} options=Chart.js options /> */}
    </div>
  );
};

const mapDispatchToProps = {fetch_grade_performance}

const mapStateToProps = (state) => ({
  performancePerGrade: state.reducer.performancePerGrade,
});

export default connect(mapStateToProps,mapDispatchToProps)(BarChart);