import React, { useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { connect } from 'react-redux';
import { fetch_farmers_records } from 'components/State/action';

const UserRecords = (props) => {
  
  const { users, fetch_users_records } = props

  useEffect (()=>{
    fetch_users_records();
  },[fetch_users_records])

  console.log(users)  
  const data = {
    columns: [
      {
        label: 'CBK Number',
        field: 'cbk_number',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Farmer_name',
        field: 'farmer_name',
        sort: 'asc',
        width: 270
      },
      {
        label: 'National ID',
        field: 'national_id',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Mark',
        field: 'mark',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Address',
        field: 'address',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Phonenumber',
        field: 'phonenumber',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Email',
        field: 'email',
        sort: 'asc',
        width: 100
      },
      {
        label: 'County',
        field: 'county',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Town',
        field: 'town',
        sort: 'asc',
        width: 150
      },
      ,
      {
        label: 'Bank',
        field: 'bank',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Branch',
        field: 'branch',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Account',
        field: 'account',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Currency',
        field: 'currency',
        sort: 'asc',
        width: 150
      },
    ],
    rows: users
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

const mapDsipatchToProps = { fetch_farmers_records }

const mapStateToProps = (state) =>{
  return {
    users: state.reducer.users
  }
}

export default connect(mapStateToProps, mapDsipatchToProps)(UserRecords);