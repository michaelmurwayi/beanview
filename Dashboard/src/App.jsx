import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview'
import AddFarmers from './pages/AddFarmers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/farmers/add" element={<AddFarmers />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}


export default App;