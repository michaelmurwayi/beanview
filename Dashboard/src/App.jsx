import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/overview" element={<Overview />} />
      </Routes>
    </Router>
  );
}


export default App;