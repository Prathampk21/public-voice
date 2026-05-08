import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";

import api from "../api/api";
import SharePopover from "../components/SharePopover";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openShareId, setOpenShareId] = useState(null);

  const fetchPolls = async () => {
    try {
      const response = await api.get("/polls");

      if (response.data.success) {
        setPolls(response.data.polls);
      }
    } catch (error) {
      console.error("Fetch polls error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const toggleShareBox = (pollId) => {
    setOpenShareId((prev) => (prev === pollId ? null : pollId));
  };

  return (
    <div className="page-container">
      <div className="page-header row-header">
        <div>
          <h1>Public Polls</h1>
          <p>Vote on important public and social issues.</p>
        </div>

        <Link to="/polls/create" className="primary-btn">
          Create Poll
        </Link>
      </div>

      {loading ? (
        <div className="page-loader">Loading polls...</div>
      ) : polls.length === 0 ? (
        <div className="empty-box">No polls found.</div>
      ) : (
        <div className="card-grid">
          {polls.map((poll) => (
            <div className="content-card" key={poll._id}>
              <span className="badge">{poll.category}</span>

              <h3>{poll.title}</h3>

              <p>{poll.description}</p>

              <div className="meta-row">
                <span>Total Votes: {poll.totalVotes}</span>
                <span>{poll.status}</span>
              </div>

              <div className="card-actions">
                <Link
                  to={`/polls/${poll._id}`}
                  className="secondary-btn small-btn"
                >
                  View Poll
                </Link>

                <div className="share-anchor">
                  <button
                    type="button"
                    className="share-btn"
                    onClick={() => toggleShareBox(poll._id)}
                  >
                    <Share2 size={16} />
                    Share
                  </button>

                  <SharePopover
                    isOpen={openShareId === poll._id}
                    onClose={() => setOpenShareId(null)}
                    title={poll.title}
                    url={`${window.location.origin}/polls/${poll._id}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Polls;
