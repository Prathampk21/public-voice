import { Link } from "react-router-dom";
import { BarChart3, MapPin, ShieldCheck, Users, Vote } from "lucide-react";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">MERN Polling & Petition Platform</span>

          <h1>
            Raise Your Voice. <br />
            Create Change.
          </h1>

          <p>
            Public Voice helps citizens create polls, launch petitions, discuss
            public issues, and track real-time civic opinions with transparency.
          </p>

          <div className="hero-actions">
            <Link to="/polls" className="primary-btn">
              Explore Polls
            </Link>

            <Link to="/petitions" className="secondary-btn">
              View Petitions
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <h2>Live Platform Preview</h2>

          <div className="mini-stat">
            <span>Polls</span>
            <strong>Real-time Voting</strong>
          </div>

          <div className="mini-stat">
            <span>Petitions</span>
            <strong>Signature Tracking</strong>
          </div>

          <div className="mini-stat">
            <span>Community</span>
            <strong>Discussion & Debate</strong>
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="feature-card">
          <Vote />
          <h3>Poll Management</h3>
          <p>Create polls, vote securely, and view live results.</p>
        </div>

        <div className="feature-card">
          <Users />
          <h3>Petition System</h3>
          <p>Launch petitions with goals and track public support.</p>
        </div>

        <div className="feature-card">
          <ShieldCheck />
          <h3>Verified Participation</h3>
          <p>JWT authentication helps prevent duplicate participation.</p>
        </div>

        <div className="feature-card">
          <MapPin />
          <h3>Location Based Issues</h3>
          <p>Filter public issues by city, state, and region.</p>
        </div>

        <div className="feature-card">
          <BarChart3 />
          <h3>Analytics</h3>
          <p>Understand public opinion using charts and insights.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;