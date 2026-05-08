import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View your account and activity information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>

          <div className="profile-badges">
            <span>{user?.role}</span>
            <span>{user?.isVerified ? "Verified" : "Not Verified"}</span>
          </div>
        </div>
      </div>

      <div className="details-card">
        <h2>Location</h2>

        <div className="info-grid">
          <div>
            <label>City</label>
            <p>{user?.location?.city || "Not added"}</p>
          </div>

          <div>
            <label>State</label>
            <p>{user?.location?.state || "Not added"}</p>
          </div>

          <div>
            <label>Country</label>
            <p>{user?.location?.country || "Not added"}</p>
          </div>
        </div>
      </div>

      <div className="details-card">
        <h2>Activity</h2>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Polls Created</h3>
            <strong>{user?.activityCount?.pollsCreated || 0}</strong>
          </div>

          <div className="dashboard-card">
            <h3>Votes Given</h3>
            <strong>{user?.activityCount?.votesGiven || 0}</strong>
          </div>

          <div className="dashboard-card">
            <h3>Petitions Created</h3>
            <strong>{user?.activityCount?.petitionsCreated || 0}</strong>
          </div>

          <div className="dashboard-card">
            <h3>Petitions Signed</h3>
            <strong>{user?.activityCount?.petitionsSigned || 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;