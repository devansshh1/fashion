import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/API";

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
    await API.post("/api/posts/upload", formData);

    alert("Post uploaded successfully 🚀");
    navigate("/category/view");

  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.message;

    if (
      status === 401 ||
      message === "Unauthorized - No Token" ||
      message === "Unauthorized - Invalid Token" ||
      message === "Unauthorized - No User"
    ) {
      navigate("/user/login", { replace: true });
    } else if (message) {
      alert(message);
    } else {
      alert("Something went wrong. Please try again.");
    }

    console.error(err);
  }
};
  return (
    <div className="premium-page">

      <div className="upload-wrapper">

        <div className="upload-card text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 ">

          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 ">Upload Your Outfit</h1>
          <p className="font-bold">Share your style with the world</p>

          <form onSubmit={handleSubmit} className="upload-form">

            <div className="input-group">
              
              <input
                type="text"
                placeholder="Choose Your Caption"
                value={name}
                onChange={(e) => setName(e.target.value)}
          
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
  <label htmlFor="fileInput" className="choose-btn text-white">
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
