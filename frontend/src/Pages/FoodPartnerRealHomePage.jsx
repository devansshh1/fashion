import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "../General/LandingPage";


const styles = {
page: {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg,#0f172a,#020617)"
}
, card: {
  width: "420px",
  padding: "32px",
  borderRadius: "20px",
  background: "rgba(30,30,35,0.85)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  color: "white"
},input: {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "white"
},textarea: {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  minHeight: "90px",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  resize: "none"
},button: {
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#8d60a8,#5b3b8c)",
  color: "white",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "16px"
}
};


function FoodPartnerRealHomePage() {

    const [videoFile, setVideoFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleVideoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setVideoFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    
const onsubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !title || !description) {
        alert("Please fill everything!");
        return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);        // MUST match backend upload.single("video")
    formData.append("name", title);
    formData.append("description", description);

    try {
        await axios.post(
            "http://localhost:3000/api/food/add",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            }
        );

        alert("Video uploaded successfully 🚀");
        navigate("/");

    } catch (err) {
        console.error(err);
        alert("Upload failed ❌");
    }
};

    const navigate = useNavigate();

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                <h1 style={styles.heading}>Upload  Reel 🎥</h1>

                {/* Video Preview */}
                {previewURL && (
                    <video
                        src={previewURL}
                        controls
                        style={styles.video}
                    />
                )}

                {/* File Input */}
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    style={styles.fileInput}
                />

                {/* Title */}
                <input
                    type="text"
                    placeholder="Enter video title"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    style={styles.input}
                />

                {/* Description */}
                
                <button
    onClick={onsubmit}
    style={styles.button}
>
    Upload Video
</button>


              
            </div>
        </div>
    );
}

export default FoodPartnerRealHomePage;
/* ---------------- STYLES ---------------- */

