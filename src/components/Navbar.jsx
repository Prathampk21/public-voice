import { Link, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, Home, LogOut, Menu, User, Vote } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-icon">PV</span>
          <span>Public Voice</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <Menu size={24} />
        </button>

        <nav className={open ? "nav-links show" : "nav-links"}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            <Home size={18} />
            Home
          </NavLink>

          <NavLink to="/polls" onClick={() => setOpen(false)}>
            <Vote size={18} />
            Polls
          </NavLink>

          <NavLink to="/petitions" onClick={() => setOpen(false)}>
            Petitions
          </NavLink>

          <NavLink to="/analytics" onClick={() => setOpen(false)}>
            <BarChart3 size={18} />
            Analytics
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="nav-btn"
                onClick={() => setOpen(false)}
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" onClick={() => setOpen(false)}>
                <User size={18} />
                {user?.name}
              </NavLink>

              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;