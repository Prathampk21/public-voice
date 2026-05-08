import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/api";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    option1: "",
    option2: "",
    option3: "",
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

    const options = [
      formData.option1,
      formData.option2,
      formData.option3
    ].filter((option) => option.trim() !== "");

    if (options.length < 2) {
      toast.error("At least two options are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/polls", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        options,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        expiresAt: formData.expiresAt || null
      });

      if (response.data.success) {
        toast.success("Poll created successfully");
        navigate("/polls");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create poll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <h1>Create Poll</h1>
        <p>Create a new public poll with multiple voting options.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Poll Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter poll title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter poll description"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Example: Civic Issue"
            />
          </div>

          <div className="form-group">
            <label>Option 1</label>
            <input
              name="option1"
              value={formData.option1}
              onChange={handleChange}
              placeholder="Enter option 1"
              required
            />
          </div>

          <div className="form-group">
            <label>Option 2</label>
            <input
              name="option2"
              value={formData.option2}
              onChange={handleChange}
              placeholder="Enter option 2"
              required
            />
          </div>

          <div className="form-group">
            <label>Option 3 Optional</label>
            <input
              name="option3"
              value={formData.option3}
              onChange={handleChange}
              placeholder="Enter option 3"
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
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
            />
          </div>

          <button className="primary-btn full-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Poll"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;