import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";

const CreatePetition = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    goal: 100,
    city: "",
    state: "",
    country: "India",
    expiresAt: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (Number(formData.goal) <= 0) {
      toast.error("Goal must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/petitions", {
        title: formData.title,
        description: formData.description,
        category: formData.category || "General",
        goal: Number(formData.goal),
        city: formData.city,
        state: formData.state,
        country: formData.country,
        expiresAt: formData.expiresAt || null
      });

      if (response.data.success) {
        toast.success("Petition created successfully");
        navigate("/petitions");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create petition"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Create Petition</h1>
        <p>Create a public petition and collect digital signatures.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Petition Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter petition title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain your petition clearly"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Example: Road Safety"
            />
          </div>

          <div className="form-group">
            <label>Signature Goal</label>
            <input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
            />
          </div>

          <button className="primary-btn full-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Petition"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePetition;