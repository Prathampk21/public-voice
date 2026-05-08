import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState({
    polls: [],
    petitions: [],
    comments: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [statsResponse, usersResponse, contentResponse] =
        await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users"),
          api.get("/admin/content")
        ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      if (usersResponse.data.success) {
        setUsers(usersResponse.data.users);
      }

      if (contentResponse.data.success) {
        setContent(contentResponse.data.content);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleRole = async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/toggle-role`);

      if (response.data.success) {
        toast.success("User role updated");
        fetchAdminData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await api.delete(`/admin/users/${userId}`);

      if (response.data.success) {
        toast.success("User deleted");
        fetchAdminData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleComment = async (commentId) => {
    try {
      const response = await api.put(`/comments/${commentId}/toggle-hide`);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAdminData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comment");
    }
  };

  if (loading) {
    return <div className="page-loader">Loading admin dashboard...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, monitor activity, and moderate platform content.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <strong>{stats?.totalUsers || 0}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Total Polls</h3>
          <strong>{stats?.totalPolls || 0}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Total Petitions</h3>
          <strong>{stats?.totalPetitions || 0}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Total Comments</h3>
          <strong>{stats?.totalComments || 0}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Total Votes</h3>
          <strong>{stats?.totalVotes || 0}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Total Signatures</h3>
          <strong>{stats?.totalSignatures || 0}</strong>
        </div>
      </div>

      <div className="details-card">
        <h2>User Management</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isVerified ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="table-btn"
                      onClick={() => handleToggleRole(user._id)}
                    >
                      Toggle Role
                    </button>

                    <button
                      className="table-btn danger"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="5">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="details-card">
        <h2>Content Moderation</h2>

        <div className="moderation-grid">
          <div className="moderation-box">
            <h3>Polls</h3>
            <p>{content.polls.length} total polls</p>
          </div>

          <div className="moderation-box">
            <h3>Petitions</h3>
            <p>{content.petitions.length} total petitions</p>
          </div>

          <div className="moderation-box">
            <h3>Comments</h3>
            <p>{content.comments.length} total comments</p>
          </div>
        </div>
      </div>

      <div className="details-card">
        <h2>Recent Comments</h2>

        <div className="comments-list">
          {content.comments.length === 0 ? (
            <p>No comments found.</p>
          ) : (
            content.comments.slice(0, 8).map((comment) => (
              <div className="comment-card" key={comment._id}>
                <strong>{comment.user?.name || "Unknown User"}</strong>
                <p>{comment.text}</p>
                <span>
                  {comment.targetType} | {comment.isHidden ? "Hidden" : "Visible"}
                </span>

                <button
                  className="secondary-btn small-btn"
                  onClick={() => handleToggleComment(comment._id)}
                >
                  {comment.isHidden ? "Unhide" : "Hide"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;