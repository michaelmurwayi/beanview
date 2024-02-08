import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { connect } from 'react-redux';
import { fetch_coffee_records, fetch_lots_records } from 'components/State/action';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import "./catalogue.css"

const DataTable = (props) => {
  const { coffeeRecords, fetch_coffee_records, lots, fetch_lots_records } = props
  const [filteredRecords, setFilteredRecords] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetch_coffee_records();
    fetch_lots_records();
  }, [fetch_coffee_records, fetch_lots_records])
  
  const lotData = {
    columns: [
      {
        label: 'ID',
        field: 'id',
        sort: 'asc',
        width: 250
      },
      {
        label: 'Number',
        field: 'number',
        sort: 'asc',
        width: 250
      },

      {
        label: 'status',
        field: 'status',
        sort: 'asc',
        width: 250
      }
    ],
    rows: lots,
  }


  const data = {
    columns: [
      {
        label: 'ID',
        field: 'id',
        sort: 'asc',
        width: 250
      },
      {
        label: 'Estate',
        field: 'estate',
        sort: 'asc',
        width: 250
      },
      {
        label: 'Grade',
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

    ],

    rows: coffeeRecords.filter(record => record.status === 'RECIEVED')


  }
  const filteredData = {
    columns: [
      {
        label: 'Estate',
        field: 'estate',
        sort: 'asc',
        width: 250
      },
      {
        label: 'Grade',
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

    ],

    rows: filteredRecords


  }


  function monthNameToNumber(monthName) {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };

    return months[monthName];
  }


  const filterDate = (date) => {
    const month = monthNameToNumber(date.split(" ").slice(1, 4)[0])
    const dates = date.split(" ").slice(1, 4)[1]
    const year = date.split(" ").slice(1, 4)[2]

    const newDate = year + "-" + month + "-" + dates

    return (newDate)
  }
  useEffect( () =>{
    
      if (startDate == endDate) {
        const newRecords = coffeeRecords.filter((record) => {
          return record.created_at.split("T")[0] === startDate;
        });
        setFilteredRecords(newRecords)
      }else{
        const newRecords = coffeeRecords.filter((record) => {
          return record.created_at.split("T")[0]  >=  startDate && record.created_at.split("T")[0]  <=  endDate;
        });
        setFilteredRecords(newRecords)
      }
      
    }
  )

  const handleSelect = (event) => {
    // Filter for Single day records
    setStartDate(filterDate(String(event.selection.startDate)));
    setEndDate(filterDate(String(event.selection.endDate)));

  };
  
  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }


  return (
    <div className='main'>
      <div className="container">
        <div className="column column1">
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleSelect}
            className='calendar'
            showTimeSelect={true}

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
      {filteredRecords.length === 0 &&
        <div className='col-md-12'>
           <p><b> Showing All records </b> </p>
          <MDBDataTable
            hover
            data={data}
            striped
            small
            searching={false}
            paging={false}
          />
        </div>
      }
      {filteredRecords.length > 0 &&
        <div className='col-md-12'>
          <p><b><i>Showing records from {startDate} to {endDate}</i></b></p>
          <MDBDataTable
            hover
            data={filteredData}
            striped
            small
            searching={false}
            paging={false}
          />
        </div>
      }
    </div>
  );
}

const mapDsipatchToProps = { fetch_coffee_records, fetch_lots_records }

const mapStateToProps = (state) => {
  return {
    coffeeRecords: state.reducer.coffeeRecords,
    lots: state.reducer.lots
  }
}

export default connect(mapStateToProps, mapDsipatchToProps)(DataTable);