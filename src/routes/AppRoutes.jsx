import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Polls from "../pages/Polls";
import CreatePoll from "../pages/CreatePoll";
import PollDetails from "../pages/PollDetails";
import Petitions from "../pages/Petitions";
import CreatePetition from "../pages/CreatePetition";
import PetitionDetails from "../pages/PetitionDetails";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";

import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="page-loader">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="page-loader">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route path="/polls" element={<Polls />} />

          <Route
            path="/polls/create"
            element={
              <PrivateRoute>
                <CreatePoll />
              </PrivateRoute>
            }
          />

          <Route path="/polls/:id" element={<PollDetails />} />

          <Route path="/petitions" element={<Petitions />} />

          <Route
            path="/petitions/create"
            element={
              <PrivateRoute>
                <CreatePetition />
              </PrivateRoute>
            }
          />

          <Route path="/petitions/:id" element={<PetitionDetails />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
};

export default AppRoutes;