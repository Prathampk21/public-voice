import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page-container center-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="primary-btn">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;