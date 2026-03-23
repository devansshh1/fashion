import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/API";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f172a,#020617)"
  },
  card: {
    width: "420px",
    maxWidth: "calc(100vw - 24px)",
    padding: "32px",
    borderRadius: "20px",
    background: "rgba(30,30,35,0.85)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    color: "white"
  },
  heading: {
    fontSize: "30px",
    fontWeight: "700",
    textAlign: "center"
  },
  input: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "white"
  },
  button: {
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#8d60a8,#5b3b8c)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px"
  },
  secondaryButton: {
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px"
  },
  video: {
    width: "100%",
    maxHeight: "420px",
    borderRadius: "16px",
    objectFit: "cover",
    background: "#000"
  },
  fileInput: {
    color: "white"
  },
  status: {
    color: "#d8b4fe",
    fontSize: "14px",
    textAlign: "center"
  }
};

function FoodPartnerRealHomePage() {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setVideoFile(file);
      setPreviewURL(URL.createObjectURL(file));
      setStatusMessage("");
    }
  };

  const onsubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      setStatusMessage("Please wait, your reel is still uploading.");
      return;
    }

    if (!videoFile || !title.trim()) {
      alert("Please fill everything!");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title.trim());

    try {
      setIsSubmitting(true);
      setStatusMessage("");

      await API.post("/api/food/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Video uploaded successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setStatusMessage("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Upload Reel</h1>

        {previewURL && (
          <video src={previewURL} controls style={styles.video} />
        )}

        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          style={styles.fileInput}
        />

        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={onsubmit}
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.75 : 1,
            cursor: isSubmitting ? "wait" : "pointer"
          }}
        >
          {isSubmitting ? "Uploading..." : "Upload Video"}
        </button>

        {statusMessage && <p style={styles.status}>{statusMessage}</p>}

        <button
          onClick={() => navigate("/")}
          style={styles.secondaryButton}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default FoodPartnerRealHomePage;
