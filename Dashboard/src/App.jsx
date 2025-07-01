import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview';
import AddFarmers from './pages/AddFarmers';
import ViewFarmers from './pages/ViewFarmers';
import AddCoffee from './pages/AddCoffee';
import ViewCoffee from './pages/ViewCoffee';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/farmers/add" element={<AddFarmers />} />
        <Route path="/farmers/view" element={<ViewFarmers />} />
        <Route path="/coffee/add" element={<AddCoffee />} />
        <Route path='/coffee/view' element={<ViewCoffee />} />
        {/* Add more routes as needed */}
      </Routes>

      {/* Global toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
