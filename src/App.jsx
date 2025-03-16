import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SupplierDashboard from "./Supplier/SupplierDashboard";
import ManagerDashboard from "./Manager/ManagerDashboard";
import BuyerDashboard from "./Buyer/BuyerDashboard";
import Login from "./Register/Login";
import Register from "./Register/Register";
import AuthGuard from "./AuthGuard";
import PublicRoute from "./PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/supplier"
          element={
            <AuthGuard>
              <SupplierDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/manager"
          element={
            <AuthGuard>
              <ManagerDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/buyer"
          element={
            <AuthGuard>
              <BuyerDashboard />
            </AuthGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
