import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Overview from "./pages/Overview";
import AddFarmers from "./pages/AddFarmers";
import ViewFarmers from "./pages/ViewFarmers";
import AddCoffee from "./pages/AddCoffee";
import ViewCoffee from "./pages/ViewCoffee";
import CreateCatalogue from "./pages/CreateCatalogue";
import ViewCatalogue from "./pages/ViewCatalogues";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginButton from "./components/auth/LoginButton";
import LogoutButton from "./components/auth/LogoutButton";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* Auth Buttons */}

      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="home" element={<AddFarmers />} />
        <Route
          path="/farmers/add"
          element={
            <ProtectedRoute>
              <AddFarmers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmers/view"
          element={
            <ProtectedRoute>
              <ViewFarmers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coffee/add"
          element={
            <ProtectedRoute>
              <AddCoffee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coffee/view"
          element={
            <ProtectedRoute>
              <ViewCoffee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalogue/create"
          element={
            <ProtectedRoute>
              <CreateCatalogue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalogue/view"
          element={
            <ProtectedRoute>
              <ViewCatalogue />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
