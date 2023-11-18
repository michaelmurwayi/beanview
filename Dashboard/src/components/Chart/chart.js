import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetch_grade_performance } from 'components/State/action';

const BarChart = (props) => {
  // Use performancePerGrade to render the chart
  const {performancePerGrade, fetch_grade_performance} = props
  const [gradeLabels, setGradeLabels] = useState([]);
  const [gradeData, setGradeData] = useState([]);

  useEffect(() => {
    // Fetch or calculate chart data and update Redux state using the action
    if (!performancePerGrade.length){
      fetch_grade_performance();

    }else{
      performancePerGrade[0].forEach(performance =>{
        // setGradeLabels()
        setGradeLabels(prevLabels => [...prevLabels, ...performance["grade"]]);
        setGradeData(prevData => [...prevData, performance["net_weight"]])

      })
    }
  },[fetch_grade_performance, performancePerGrade]);
  
 
  
  
  const data = {
    labels:gradeLabels,
    datasets: [
      {
        label: 'Grade Performance',
        data: gradeData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      // Add more datasets as needed
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const divStyle = {
    height: '100%'
  };

  return (
    <div style={divStyle }>
      <Bar data={data} options={options} />
    </div>
  );
};

const mapDispatchToProps = {fetch_grade_performance}

const mapStateToProps = (state) => ({
  performancePerGrade: state.reducer.performancePerGrade,
});

export default connect(mapStateToProps,mapDispatchToProps)(BarChart);