import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import api from "../api/api";

const Analytics = () => {
  const [polls, setPolls] = useState([]);
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    try {
      const [pollResponse, petitionResponse] = await Promise.all([
        api.get("/polls"),
        api.get("/petitions")
      ]);

      if (pollResponse.data.success) {
        setPolls(pollResponse.data.polls);
      }

      if (petitionResponse.data.success) {
        setPetitions(petitionResponse.data.petitions);
      }
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);

  const totalSignatures = petitions.reduce(
    (sum, petition) => sum + petition.currentSignatures,
    0
  );

  const pollChartData = polls.slice(0, 6).map((poll) => ({
    name:
      poll.title.length > 16 ? `${poll.title.substring(0, 16)}...` : poll.title,
    votes: poll.totalVotes
  }));

  const petitionChartData = petitions.slice(0, 6).map((petition) => ({
    name:
      petition.title.length > 16
        ? `${petition.title.substring(0, 16)}...`
        : petition.title,
    signatures: petition.currentSignatures
  }));

  const statusData = [
    {
      name: "Active Polls",
      value: polls.filter((poll) => poll.status === "active").length
    },
    {
      name: "Closed Polls",
      value: polls.filter((poll) => poll.status === "closed").length
    },
    {
      name: "Active Petitions",
      value: petitions.filter((petition) => petition.status === "active")
        .length
    },
    {
      name: "Under Review",
      value: petitions.filter((petition) => petition.status === "under_review")
        .length
    },
    {
      name: "Closed Petitions",
      value: petitions.filter((petition) => petition.status === "closed")
        .length
    }
  ];

  if (loading) {
    return <div className="page-loader">Loading analytics...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Track voting trends, petition progress, and platform activity.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Polls</h3>
          <strong>{polls.length}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Total Votes</h3>
          <strong>{totalVotes}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Total Petitions</h3>
          <strong>{petitions.length}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Total Signatures</h3>
          <strong>{totalSignatures}</strong>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h2>Poll Vote Trends</h2>

          {pollChartData.length === 0 ? (
            <p>No poll data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pollChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2>Petition Signature Trends</h2>

          {petitionChartData.length === 0 ? (
            <p>No petition data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={petitionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="signatures" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card full-chart">
          <h2>Platform Status Overview</h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#2563eb",
                        "#64748b",
                        "#16a34a",
                        "#f59e0b",
                        "#dc2626"
                      ][index % 5]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;