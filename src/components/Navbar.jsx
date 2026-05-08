import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Home,
  LogIn,
  LogOut,
  Menu,
  PenLine,
  User,
  UserPlus,
  Vote
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const closeMenu = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-icon">PV</span>
          <span>Public Voice</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          type="button"
          aria-label="Toggle navigation"
        >
          <Menu size={24} />
        </button>

        <nav className={open ? "nav-links show" : "nav-links"}>
          <NavLink to="/" onClick={closeMenu}>
            <Home size={18} />
            Home
          </NavLink>

          <NavLink to="/polls" onClick={closeMenu}>
            <Vote size={18} />
            Polls
          </NavLink>

          <NavLink to="/petitions" onClick={closeMenu}>
            <FileText size={18} />
            Petitions
          </NavLink>

          <NavLink to="/analytics" onClick={closeMenu}>
            <BarChart3 size={18} />
            Analytics
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/dashboard" onClick={closeMenu}>
              <PenLine size={18} />
              Dashboard
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" onClick={closeMenu}>
              <User size={18} />
              Admin
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                <LogIn size={18} />
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="nav-btn"
                onClick={closeMenu}
              >
                <UserPlus size={18} />
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" onClick={closeMenu}>
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
