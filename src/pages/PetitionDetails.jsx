import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const PetitionDetails = () => {
  const { id } = useParams();

  const { isAuthenticated } = useAuth();

  const [petition, setPetition] = useState(null);
  const [comments, setComments] = useState([]);
  const [signComment, setSignComment] = useState("");
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPetition = async () => {
    try {
      const response = await api.get(`/petitions/${id}`);

      if (response.data.success) {
        setPetition(response.data.petition);
      }
    } catch (error) {
      toast.error("Failed to load petition");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(
        `/comments?targetType=petition&targetId=${id}`
      );

      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Fetch comments error:", error);
    }
  };

  useEffect(() => {
    fetchPetition();
    fetchComments();
  }, [id]);

  const handleSignPetition = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to sign petition");
      return;
    }

    try {
      const response = await api.post(`/petitions/${id}/sign`, {
        comment: signComment
      });

      if (response.data.success) {
        toast.success("Petition signed successfully");
        setSignComment("");
        setPetition(response.data.petition);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sign petition");
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
        targetType: "petition",
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
    return <div className="page-loader">Loading petition...</div>;
  }

  if (!petition) {
    return <div className="page-container">Petition not found.</div>;
  }

  const percent =
    petition.goal > 0
      ? Math.min(
          100,
          Math.round((petition.currentSignatures / petition.goal) * 100)
        )
      : 0;

  return (
    <div className="page-container">
      <div className="details-card">
        <span className="badge">{petition.category}</span>

        <h1>{petition.title}</h1>

        <p>{petition.description}</p>

        <div className="meta-row">
          <span>
            {petition.currentSignatures} / {petition.goal} signatures
          </span>
          <span>Status: {petition.status}</span>
        </div>

        <div className="progress-bar large-progress">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="sign-box">
          <textarea
            placeholder="Optional comment while signing..."
            value={signComment}
            onChange={(event) => setSignComment(event.target.value)}
          />

          <button className="primary-btn" onClick={handleSignPetition}>
            Sign Petition
          </button>
        </div>
      </div>

      <div className="details-card">
        <h2>Recent Signatures</h2>

        {petition.signatures?.length === 0 ? (
          <p>No signatures yet.</p>
        ) : (
          <div className="signature-list">
            {petition.signatures?.slice(-5).reverse().map((signature) => (
              <div className="signature-card" key={signature._id}>
                <strong>{signature.name}</strong>
                <p>{signature.comment || "Signed this petition"}</p>
                <span>
                  {signature.location?.city} {signature.location?.state}
                </span>
              </div>
            ))}
          </div>
        )}
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

export default PetitionDetails;