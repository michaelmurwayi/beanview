import React, { useEffect } from 'react';
import { MDBDataTable } from 'mdbreact';
import { connect } from 'react-redux';
import { fetch_users_records } from 'components/State/action';

const UserRecords = (props) => {
  
  const { users, fetch_users_records } = props

  useEffect (()=>{
    fetch_users_records();
  },[fetch_users_records])

  console.log(users)  
  const data = {
    columns: [
      {
        label: 'First_name',
        field: 'first_name',
        sort: 'asc',
        width: 150
      },
      {
        label: 'Last_name',
        field: 'last_name',
        sort: 'asc',
        width: 270
      },
      {
        label: 'Email',
        field: 'email',
        sort: 'asc',
        width: 200
      },
      {
        label: 'Phonenumber',
        field: 'phonenumber',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Country',
        field: 'country',
        sort: 'asc',
        width: 150
      },
      {
        label: 'City',
        field: 'city',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Role',
        field: 'role',
        sort: 'asc',
        width: 100
      },
      {
        label: 'Created At',
        field: 'created_at',
        sort: 'asc',
        width: 150
      }
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

const mapDsipatchToProps = { fetch_users_records }

const mapStateToProps = (state) =>{
  return {
    users: state.reducer.users
  }
}

export default connect(mapStateToProps, mapDsipatchToProps)(UserRecords);