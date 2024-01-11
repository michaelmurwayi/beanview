import React, { useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { connect } from 'react-redux';
import { fetch_coffee_records } from 'components/State/action';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import "./catalogue.css"

const DataTable = (props) => {
  
  const { coffeeRecords, fetch_coffee_records } = props

  useEffect (()=>{
    fetch_coffee_records();
  },[fetch_coffee_records])

  const lotData = {
    columns: [
      {
        label: 'Lot id',
        field: 'estate',
        sort: 'asc',
        width: 250
      },
      {
        label: 'Lot Number',
        field: 'grade',
        sort: 'asc',
        width: 250
      },
      {
        label: 'status',
        field: 'status',
        sort: 'asc',
        width: 250
      }
    ]
  }  

  
  const data = {
    columns: [
      {
        label: 'Lot id',
        field: 'estate',
        sort: 'asc',
        width: 250
      },
      {
        label: 'Lot Number',
        field: 'grade',
        sort: 'asc',
        width: 250
      },
      {
        label: 'status',
        field: 'status',
        sort: 'asc',
        width: 250
      },
      {
        label: 'Bags',
        field: 'bags',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Outturn',
        field: 'outturn',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Pockets',
        field: 'pockets',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Tare Weight',
        field: 'tare_weight',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Ticket',
        field: 'ticket',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Variance',
        field: 'variance',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Status',
        field: 'status',
        sort: 'asc',
        width: 100
      }
    ],
  
    rows: coffeeRecords
  
    
  }
  const handleSelect = (event) =>{
  
  
  };

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }
  
  return (
    <div className='main'>
    <div class="container">
      <div class="column column1">
        <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
        className='calendar'
        />       
      </div>
      <div className="column column2">
        <div className="lot">
          <div className="lot-header">
            Lots Available
          </div>
          <div className="lot-body">
          <MDBDataTable
            data={lotData}
            striped
            small
            searching={false}
            paging={false}
            />
          </div>
        </div>
      </div>
  </div>
    <div className='col-md-12'>
      <MDBDataTable
      hover
      data={data}
      striped
      small
      searching= {false}
      />
    </div>
  </div>
  );
}

const mapDsipatchToProps = { fetch_coffee_records }

const mapStateToProps = (state) =>{
  return {
    coffeeRecords: state.reducer.coffeeRecords
  }
}

export default connect(mapStateToProps, mapDsipatchToProps)(DataTable);