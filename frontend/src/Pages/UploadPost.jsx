import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UploadPost() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", selectedCategory);
    formData.append("image", image);

    try {
      await axios.post(
        "http://localhost:3000/api/posts/upload",
        formData,
        { withCredentials: true }
      );

      alert("Post Uploaded Successfully 🚀");
      navigate(`/category/${selectedCategory}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Outfit</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option>Old Money</option>
          <option>Street Wear</option>
          <option>Traditional</option>
          <option>Aesthetic</option>
          <option>Minimal</option>
          <option>Maximal</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <button type="submit">Upload Post</button>
      </form>
    </div>
  );
}

export default UploadPost;