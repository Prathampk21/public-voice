import { Link } from "react-router-dom";
import { BarChart3, FileText, PlusCircle, Vote } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Manage your activity and participate in public issues.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <Vote />
          <h3>Polls Created</h3>
          <strong>{user?.activityCount?.pollsCreated || 0}</strong>
        </div>

        <div className="dashboard-card">
          <BarChart3 />
          <h3>Votes Given</h3>
          <strong>{user?.activityCount?.votesGiven || 0}</strong>
        </div>

        <div className="dashboard-card">
          <FileText />
          <h3>Petitions Created</h3>
          <strong>{user?.activityCount?.petitionsCreated || 0}</strong>
        </div>

        <div className="dashboard-card">
          <FileText />
          <h3>Petitions Signed</h3>
          <strong>{user?.activityCount?.petitionsSigned || 0}</strong>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/polls/create" className="primary-btn">
          <PlusCircle size={18} />
          Create Poll
        </Link>

        <Link to="/petitions/create" className="secondary-btn">
          <PlusCircle size={18} />
          Create Petition
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;