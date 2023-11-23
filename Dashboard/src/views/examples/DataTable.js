import React, { useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { connect } from 'react-redux';
import { fetch_coffee_records } from 'components/State/action';

const DataTable = (props) => {
  
  const { coffeeRecords, fetch_coffee_records } = props

  useEffect (()=>{
    fetch_coffee_records();
  },[fetch_coffee_records])

  
  const data = {
    columns: [
      {
        label: 'Estate',
        field: 'estate',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Grade',
        field: 'grade',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Net_weight',
        field: 'net_weight',
        sort: 'asc',
        width: 200
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
  };

  return (
    <div className='container-fluid'>

    <MDBDataTable
      data={data}
      striped
      searching={false}
      />
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