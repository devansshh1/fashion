import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "../General/LandingPage";


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

    const handleUpload = () => {

        if (!videoFile || !title || !description) {
            alert("Please fill everything!");
            return;
        }

        // Later you will send this via FormData to backend
        console.log({
            videoFile,
            title,
            description
        });
        
        navigate('/');
       
    };
    const onsubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const formData=new FormData();
        formData.append('video',videoFile);
        formData.append('name',title);
        formData.append('description',description);
        const res=await axios.post('http://localhost:3000/api/food/add',formData,{
            withCredentials:true,
        })
    }

    const navigate = useNavigate();

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                <h1 style={styles.heading}>Upload Food Reel 🎥</h1>

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
                <textarea
                    placeholder="Enter description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    style={styles.textarea}
                />

                <button
                    onClick={(e) => { handleUpload(); onsubmit(e); }}
                    
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

const styles = {

    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6fb"
    },

    card: {
        width: "420px",
        padding: "30px",
        borderRadius: "18px",
        background: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },

    heading: {
        textAlign: "center",
        marginBottom: "10px"
    },

    video: {
        width: "100%",
        maxHeight: "240px",
        borderRadius: "12px",
        objectFit: "cover"
    },

    fileInput: {
        padding: "8px"
    },

    input: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        fontSize: "14px"
    },

    textarea: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        minHeight: "90px",
        resize: "none"
    },

    button: {
        padding: "14px",
        borderRadius: "12px",
        border: "none",
        background: "#4f46e5",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "15px"
    }
};
