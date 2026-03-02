import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadPost() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();  // always first

  // ✅ Basic empty field validation
  if (!name.trim() || !selectedCategory || !image) {
    alert("Please fill all fields and select an image.");
    return;
  }

  // ✅ File type validation (frontend safety)
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (!allowedTypes.includes(image.type)) {
    alert("Only JPG, PNG, or WEBP images are allowed.");
    return;
  }

  // ✅ File size validation (5MB example)
  if (image.size > 4 * 1024 * 1024) {
    alert("Image size must be less than 4MB.");
    return;
  }

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

    alert("Post uploaded successfully 🚀");
    navigate("/category/view");

  } catch (err) {
    // 🔥 Show backend error properly
    if (err.response && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("Something went wrong. Please try again.");
    }

    console.error(err);
  }
};
  return (
    <div className="premium-page">

      <div className="upload-wrapper">

        <div className="upload-card">

          <h1>Upload Your Outfit</h1>
          <p>Share your style with the world</p>

          <form onSubmit={handleSubmit} className="upload-form">

            <div className="input-group">
              
              <input
                type="text"
                placeholder="Enter outfit name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              
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
            </div>

           <div className="file-upload-row">
  <label htmlFor="fileInput" className="choose-btn">
    Choose File
  </label>

  <span className="file-name">
    {image ? image.name : "No file chosen"}
  </span>

  <input
    id="fileInput"
    type="file"
    accept="image/*"
    onChange={(e) => setImage(e.target.files[0])}
    hidden
    required
  />
</div>

            <button type="submit" className="upload-btn">
              Upload Post
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default UploadPost;