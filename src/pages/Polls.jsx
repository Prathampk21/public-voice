import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QrCode, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/api";
import ShareQrModal from "../components/ShareQrModal";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState(null);

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

  const handleSharePoll = async (poll) => {
    const pollUrl = `${window.location.origin}/polls/${poll._id}`;
    const shareText = `Vote on this poll: ${poll.title}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: poll.title,
          text: shareText,
          url: pollUrl
        });
      } else {
        await navigator.clipboard.writeText(pollUrl);
        toast.success("Poll link copied to clipboard");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Unable to share poll");
      }
    }
  };

  const handleOpenQr = (poll) => {
    setSelectedPoll({
      title: poll.title,
      url: `${window.location.origin}/polls/${poll._id}`
    });
  };

  const handleCloseQr = () => {
    setSelectedPoll(null);
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

                <button
                  type="button"
                  className="share-btn"
                  onClick={() => handleSharePoll(poll)}
                >
                  <Share2 size={16} />
                  Share
                </button>

                <button
                  type="button"
                  className="share-btn"
                  onClick={() => handleOpenQr(poll)}
                >
                  <QrCode size={16} />
                  QR Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ShareQrModal
        isOpen={!!selectedPoll}
        onClose={handleCloseQr}
        title={selectedPoll?.title || ""}
        url={selectedPoll?.url || ""}
        typeLabel="Poll"
      />
    </div>
  );
};

export default Polls;
