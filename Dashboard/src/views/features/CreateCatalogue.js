import React, { useEffect, useState } from 'react';
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
  const [filteredRecords, setFilteredRecords] = useState([])
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  useEffect(() => {
    fetch_coffee_records();
  }, [fetch_coffee_records])

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

    rows: coffeeRecords


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


  const handleSelect = (event) => {

    
    const startDate = filterDate(String(event.selection.startDate));
    const endDate = filterDate(String(event.selection.endDate));
    
    if (coffeeRecords.length) {
      setFilteredRecords([])
      if (startDate == endDate) {
        const newRecords = coffeeRecords.map((record) => {
          if (record.created_at.split("T")[0] == startDate) {
            setFilteredRecords([...filteredRecords, record])
          } else {
            setFilteredRecords([...filteredRecords])

          }
        })
      } else {

      }
    } else {
      console.log(filteredData)
    }

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
          <MDBDataTable
            hover
            data={data}
            striped
            small
            searching={false}
          />
        </div>
      }
      {filteredRecords.length > 0 &&
        <div className='col-md-12'>
          <MDBDataTable
            hover
            data={filteredData}
            striped
            small
            searching={false}
          />
        </div>
      }
    </div>
  );
}

const mapDsipatchToProps = { fetch_coffee_records }

const mapStateToProps = (state) => {
  return {
    coffeeRecords: state.reducer.coffeeRecords
  }
}

export default connect(mapStateToProps, mapDsipatchToProps)(DataTable);