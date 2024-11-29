
import './App.css';
import Login from './pages/Login';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProtectedRoute from './routes/ProtectedRoutes';

function App() {


  return (
    <Router>
      <Routes>
     
        {/* Login Page */}
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
