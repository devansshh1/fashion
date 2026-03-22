import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/API";

function FoodProfile() {
  const { id } = useParams();
  const [foodPartner, setFoodPartner] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [canEditProfile, setCanEditProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editInstagramHandle, setEditInstagramHandle] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await API.get(`/api/partner/${id}/profile`);
        setFoodPartner(res.data.partner);
        setVideos(res.data.videos);
      } catch (err) {
        console.log(err);
      }
    }

    fetchProfile();
  }, [id]);

  useEffect(() => {
    async function checkEditAccess() {
      try {
        const res = await API.get("/api/partner/check-auth");
        const loggedInPartnerId = res.data?.partner?.id?.toString();
        setCanEditProfile(loggedInPartnerId === id);
      } catch (err) {
        setCanEditProfile(false);
      }
    }

    checkEditAccess();
  }, [id]);

  useEffect(() => {
    if (selectedVideo || showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedVideo, showEditModal]);

  useEffect(() => {
    if (!showMenu) return;

    const handleOutsideClick = () => setShowMenu(false);
    window.addEventListener("click", handleOutsideClick);

    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showMenu]);

  const getVideoUrl = (videoPath) => {
    if (!videoPath) return "";
    return videoPath.startsWith("http")
      ? videoPath
      : `http://localhost:3000${videoPath}`;
  };

  const openEditModal = () => {
    setEditName(foodPartner?.name || "");
    setEditInstagramHandle(foodPartner?.InstagramHandle || "");
    setSaveError("");
    setShowMenu(false);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSaveError("");
  };

  const handleProfileUpdate = async () => {
    const trimmedName = editName.trim();
    const cleanHandle = editInstagramHandle.replace("@", "").trim();
    const instaRegex = /^[a-zA-Z0-9._]{3,30}$/;

    if (trimmedName.length < 2) {
      setSaveError("Name must be at least 2 characters.");
      return;
    }

    if (!instaRegex.test(cleanHandle)) {
      setSaveError("Enter a valid Instagram username.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");

      const res = await API.patch(`/api/partner/${id}`, {
        name: trimmedName,
        InstagramHandle: cleanHandle,
      });

      setFoodPartner((prev) => ({
        ...prev,
        ...res.data.partner,
      }));
      localStorage.setItem("partnerId", res.data.partner._id);
      setShowEditModal(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        {canEditProfile && (
          <div className="profile-actions">
            <button
              type="button"
              className="profile-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              aria-label="Profile options"
            >
              ...
            </button>

            {showMenu && (
              <div
                className="profile-menu-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={openEditModal}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        <div className="profile-top">
          <div className="profile-avatar">
            {foodPartner?.image && (
              <img
                src={
                  foodPartner.image.startsWith("http")
                    ? foodPartner.image
                    : `http://localhost:3000${foodPartner.image}`
                }
                alt={foodPartner.name}
              />
            )}
          </div>

          <div className="profile-info">
            <h2>{foodPartner ? foodPartner.name : "Loading..."}</h2>

            <a
              href={`https://instagram.com/${foodPartner?.InstagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="username"
            >
              @{foodPartner?.InstagramHandle}
            </a>
          </div>
        </div>

        <div className="profile-stats">
          <div>
            <h3>{(foodPartner?.totalPosts ?? 0) || "Loading"}</h3>
            <span>Posts</span>
          </div>

          <div>
            <h3>{foodPartner ? foodPartner.totalLikes : "Loading..."}</h3>
            <span>Total Likes</span>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="video-grid">
        {videos.length === 0 ? (
          <p className="empty-msg">No uploads yet.</p>
        ) : (
          videos.map((video) => (
            <div
              key={video._id}
              className="video-card"
              onClick={() => setSelectedVideo(video)}
            >
              <video
                ref={videoRef}
                src={getVideoUrl(video.video)}
                muted
                playsInline
                preload="metadata"
                onClick={() => {
                  if (videoRef.current.paused) videoRef.current.play();
                  else videoRef.current.pause();
                }}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        )}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setSelectedVideo(null)}
            className="absolute top-5 right-5 text-white text-3xl z-50"
          >
            x
          </button>

          <video
            src={getVideoUrl(selectedVideo.video)}
            autoPlay
            loop
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {showEditModal && (
        <div className="profile-modal-overlay" onClick={closeEditModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Profile</h3>

            <label className="profile-modal-label">Username</label>
            <input
              className="profile-modal-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter your username"
            />

            <label className="profile-modal-label">Instagram Handle</label>
            <input
              className="profile-modal-input"
              value={editInstagramHandle}
              onChange={(e) => setEditInstagramHandle(e.target.value)}
              placeholder="Enter Instagram handle"
            />

            {saveError && <p className="profile-modal-error">{saveError}</p>}

            <div className="profile-modal-actions">
              <button
                type="button"
                className="profile-modal-cancel"
                onClick={closeEditModal}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="profile-modal-save"
                onClick={handleProfileUpdate}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodProfile;
