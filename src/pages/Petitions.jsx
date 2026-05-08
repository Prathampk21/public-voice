import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QrCode, Share2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/api";
import ShareQrModal from "../components/ShareQrModal";

const Petitions = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetition, setSelectedPetition] = useState(null);

  const fetchPetitions = async () => {
    try {
      const response = await api.get("/petitions");

      if (response.data.success) {
        setPetitions(response.data.petitions);
      }
    } catch (error) {
      console.error("Fetch petitions error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  const handleSharePetition = async (petition) => {
    const petitionUrl = `${window.location.origin}/petitions/${petition._id}`;
    const shareText = `Support this petition: ${petition.title}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: petition.title,
          text: shareText,
          url: petitionUrl
        });
      } else {
        await navigator.clipboard.writeText(petitionUrl);
        toast.success("Petition link copied to clipboard");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Unable to share petition");
      }
    }
  };

  const handleOpenQr = (petition) => {
    setSelectedPetition({
      title: petition.title,
      url: `${window.location.origin}/petitions/${petition._id}`
    });
  };

  const handleCloseQr = () => {
    setSelectedPetition(null);
  };

  return (
    <div className="page-container">
      <div className="page-header row-header">
        <div>
          <h1>Public Petitions</h1>
          <p>Support public causes and track signature progress.</p>
        </div>

        <Link to="/petitions/create" className="primary-btn">
          Create Petition
        </Link>
      </div>

      {loading ? (
        <div className="page-loader">Loading petitions...</div>
      ) : petitions.length === 0 ? (
        <div className="empty-box">No petitions found.</div>
      ) : (
        <div className="card-grid">
          {petitions.map((petition) => {
            const percent =
              petition.goal > 0
                ? Math.min(
                    100,
                    Math.round(
                      (petition.currentSignatures / petition.goal) * 100
                    )
                  )
                : 0;

            return (
              <div className="content-card" key={petition._id}>
                <span className="badge">{petition.category}</span>

                <h3>{petition.title}</h3>

                <p>{petition.description}</p>

                <div className="meta-row">
                  <span>
                    {petition.currentSignatures} / {petition.goal} signatures
                  </span>
                  <span>{petition.status}</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="card-actions">
                  <Link
                    to={`/petitions/${petition._id}`}
                    className="secondary-btn small-btn"
                  >
                    View Petition
                  </Link>

                  <button
                    type="button"
                    className="share-btn"
                    onClick={() => handleSharePetition(petition)}
                  >
                    <Share2 size={16} />
                    Share
                  </button>

                  <button
                    type="button"
                    className="share-btn"
                    onClick={() => handleOpenQr(petition)}
                  >
                    <QrCode size={16} />
                    QR Code
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ShareQrModal
        isOpen={!!selectedPetition}
        onClose={handleCloseQr}
        title={selectedPetition?.title || ""}
        url={selectedPetition?.url || ""}
        typeLabel="Petition"
      />
    </div>
  );
};

export default Petitions;
