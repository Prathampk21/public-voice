import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const PollDetails = () => {
  const { id } = useParams();

  const { isAuthenticated } = useAuth();

  const [poll, setPoll] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPoll = async () => {
    try {
      const response = await api.get(`/polls/${id}`);

      if (response.data.success) {
        setPoll(response.data.poll);
      }
    } catch (error) {
      toast.error("Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(
        `/comments?targetType=poll&targetId=${id}`
      );

      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Fetch comments error:", error);
    }
  };

  useEffect(() => {
    fetchPoll();
    fetchComments();
  }, [id]);

  const handleVote = async (optionId) => {
    if (!isAuthenticated) {
      toast.error("Please login to vote");
      return;
    }

    try {
      const response = await api.post(`/polls/${id}/vote`, {
        optionId
      });

      if (response.data.success) {
        toast.success("Vote submitted successfully");
        setPoll(response.data.poll);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Vote failed");
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment is required");
      return;
    }

    try {
      const response = await api.post("/comments", {
        targetType: "poll",
        targetId: id,
        text: commentText,
        stance: "neutral"
      });

      if (response.data.success) {
        toast.success("Comment added");
        setCommentText("");
        fetchComments();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  if (loading) {
    return <div className="page-loader">Loading poll...</div>;
  }

  if (!poll) {
    return <div className="page-container">Poll not found.</div>;
  }

  return (
    <div className="page-container">
      <div className="details-card">
        <span className="badge">{poll.category}</span>
        <h1>{poll.title}</h1>
        <p>{poll.description}</p>

        <div className="meta-row">
          <span>Total Votes: {poll.totalVotes}</span>
          <span>Status: {poll.status}</span>
        </div>

        <div className="options-list">
          {poll.options.map((option) => {
            const percent =
              poll.totalVotes > 0
                ? Math.round((option.votes / poll.totalVotes) * 100)
                : 0;

            return (
              <div className="option-box" key={option._id}>
                <div className="option-top">
                  <strong>{option.text}</strong>
                  <span>
                    {option.votes} votes ({percent}%)
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <button
                  className="secondary-btn small-btn"
                  onClick={() => handleVote(option._id)}
                >
                  Vote
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="details-card">
        <h2>Discussion</h2>

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            placeholder="Write your comment..."
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />

          <button className="primary-btn">Add Comment</button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div className="comment-card" key={comment._id}>
                <strong>{comment.user?.name}</strong>
                <p>{comment.text}</p>
                <span>{comment.stance}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PollDetails;