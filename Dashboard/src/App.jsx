import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview'
import AddFarmers from './pages/AddFarmers';
import ViewFarmers from './pages/ViewFarmers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/overview" element={<Overview />} />
        <Route path="/farmers/add" element={<AddFarmers />} />
        <Route path="/farmers/view" element={<ViewFarmers />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}


export default App;