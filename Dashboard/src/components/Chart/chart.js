import Chart from 'chart.js';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { fetch_grade_performance } from 'components/State/action';

const BarChart = (props) => {
  const { performancePerGrade, fetch_grade_performance } = props 
  const chartRef = useRef(null);
  
  
  useEffect(() => {
    fetch_grade_performance();
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Label 1', 'Label 2', 'Label 3'],
        datasets: [
          {
            label: 'Bar Chart Example',
            data: [10, 20, 30],
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            // borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'],
            // borderWidth: 1,
          },
        ],
      },
    });
  },[fetch_grade_performance]);
  

  return (
    <div style={{height: '100%'}}>
      <canvas ref={chartRef}  />
    </div>
  );
};

const mapDsipatchToProps = {fetch_grade_performance}

const mapStateToProps = (state) =>{
  return {
    performancePerGrade: state.reducer.performancePerGrade
  }
}


export default connect(mapStateToProps, mapDsipatchToProps)(BarChart);
