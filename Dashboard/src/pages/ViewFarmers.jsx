import {useState} from 'react';
import Sidebar from '../components/sidebar/Sidebar';


const ViewFarmers = () => {
  const [farmers, setFarmers] = useState([
    { id: 1, name: 'John Doe', location: 'Farm A', crops: 'Coffee' },
    { id: 2, name: 'Jane Smith', location: 'Farm B', crops: 'Tea' },
    // Add more farmers as needed
  ]);

  return (
    <div>
        <Sidebar />
    </div>
  );
}


export default ViewFarmers;