import React, { useContext, useEffect, useRef, useState } from "react";
import { FaBookmark, FaHeart, FaRegCommentDots } from "react-icons/fa";
import { useParams } from "react-router-dom";
import API, { getAssetUrl } from "../api/API";
import { AuthContext } from "../context/AuthContext";

function FoodProfile() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [foodPartner, setFoodPartner] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoLiked, setSelectedVideoLiked] = useState(false);
  const [selectedVideoSaved, setSelectedVideoSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [canEditProfile, setCanEditProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editInstagramHandle, setEditInstagramHandle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const videoRef = useRef();
  const isPartnerLoggedIn = localStorage.getItem("isPartnerLoggedIn") === "true";

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

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const getVideoUrl = (videoPath) => {
    return getAssetUrl(videoPath);
  };

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http") ? imagePath : getAssetUrl(imagePath);
  };

  const requireUserLogin = () => {
    if (user || isPartnerLoggedIn) {
      return true;
    }

    alert("Please login to like, comment, or save reels.");
    return false;
  };

  const syncVideoState = (videoId, updater) => {
    setVideos((prev) =>
      prev.map((video) => (video._id === videoId ? updater(video) : video))
    );

    setSelectedVideo((prev) => {
      if (!prev || prev._id !== videoId) return prev;
      return updater(prev);
    });
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setSelectedVideoLiked(false);
    setSelectedVideoSaved(false);
    setShowComments(false);
    setCommentList([]);
    setNewComment("");
    setCommentError("");
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setSelectedVideoLiked(false);
    setSelectedVideoSaved(false);
    setShowComments(false);
    setCommentList([]);
    setNewComment("");
    setCommentError("");
  };

  const handleLikeVideo = async () => {
    if (!selectedVideo || !requireUserLogin()) return;

    const optimisticLiked = !selectedVideoLiked;
    setSelectedVideoLiked(optimisticLiked);
    syncVideoState(selectedVideo._id, (video) => ({
      ...video,
      likesCount: Math.max(0, (video.likesCount || 0) + (optimisticLiked ? 1 : -1)),
    }));

    try {
      const resp = await API.post(`/api/food/${selectedVideo._id}`, {
        contentType: "food",
      });

      if (typeof resp.data?.liked === "boolean") {
        setSelectedVideoLiked(resp.data.liked);

        syncVideoState(selectedVideo._id, (video) => ({
          ...video,
          likesCount: Math.max(
            0,
            (video.likesCount || 0) + (resp.data.liked === optimisticLiked ? 0 : resp.data.liked ? 1 : -1)
          ),
        }));
      }
    } catch (err) {
      setSelectedVideoLiked(!optimisticLiked);
      syncVideoState(selectedVideo._id, (video) => ({
        ...video,
        likesCount: Math.max(0, (video.likesCount || 0) + (optimisticLiked ? -1 : 1)),
      }));
    }
  };

  const handleSaveVideo = async () => {
    if (!selectedVideo || !requireUserLogin()) return;

    try {
      const resp = await API.post(`/api/food/${selectedVideo._id}/save`);
      setSelectedVideoSaved(Boolean(resp.data?.saved));

      if (typeof resp.data?.savesCount === "number") {
        syncVideoState(selectedVideo._id, (video) => ({
          ...video,
          savesCount: resp.data.savesCount,
        }));
      }
    } catch (err) {
      setCommentError(err.response?.data?.message || "Unable to save reel.");
    }
  };

  const loadComments = async (videoId) => {
    const resp = await API.get(`/api/food/${videoId}/comments`);
    setCommentList(resp.data);
  };

  const openComments = async () => {
    if (!selectedVideo || !requireUserLogin()) return;

    try {
      setCommentError("");
      setShowComments(true);
      await loadComments(selectedVideo._id);
    } catch (err) {
      setCommentError("Unable to load comments.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!selectedVideo || !requireUserLogin()) return;

    const text = newComment.trim();

    if (!text) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    try {
      setCommentError("");
      await API.post(`/api/food/${selectedVideo._id}/comment`, { text });
      setNewComment("");
      await loadComments(selectedVideo._id);
      syncVideoState(selectedVideo._id, (video) => ({
        ...video,
        commentsCount: (video.commentsCount || 0) + 1,
      }));
    } catch (err) {
      setCommentError(err.response?.data?.message || "Unable to post comment.");
    }
  };

  const openEditModal = () => {
    setEditName(foodPartner?.name || "");
    setEditInstagramHandle(foodPartner?.InstagramHandle || "");
    setSelectedImage(null);
    setPreviewImage(foodPartner?.image ? getProfileImageUrl(foodPartner.image) : "");
    setSaveError("");
    setShowMenu(false);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    setShowEditModal(false);
    setSelectedImage(null);
    setPreviewImage("");
    setSaveError("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setSaveError("Only JPG, PNG or WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setSaveError("Profile photo must be 2MB or smaller.");
      event.target.value = "";
      return;
    }

    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
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
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("InstagramHandle", cleanHandle);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const res = await API.patch(`/api/partner/${id}`, formData);

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
                src={getProfileImageUrl(foodPartner.image)}
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
              onClick={() => openVideoModal(video)}
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
        <div className="profile-video-modal">
          <button
            type="button"
            onClick={closeVideoModal}
            className="profile-video-close"
          >
            x
          </button>

          <video
            src={getVideoUrl(selectedVideo.video)}
            autoPlay
            loop
            preload="metadata"
            className="profile-video-player"
          />

          <div className="profile-video-action-bar">
            <div className="action">
              <FaHeart
                size={28}
                color={selectedVideoLiked ? "red" : "white"}
                onClick={handleLikeVideo}
              />
              <span>{selectedVideo.likesCount || 0}</span>
            </div>

            <div className="action">
              <FaBookmark
                size={26}
                color={selectedVideoSaved ? "gold" : "white"}
                onClick={handleSaveVideo}
              />
              <span>{selectedVideo.savesCount || 0}</span>
            </div>

            <div className="action">
              <FaRegCommentDots
                size={26}
                onClick={openComments}
              />
              <span>{selectedVideo.commentsCount || 0}</span>
            </div>
          </div>

          {showComments && (
            <div className="comment-modal" onClick={() => setShowComments(false)}>
              <div className="comment-box" onClick={(e) => e.stopPropagation()}>
                <h3>Comments</h3>

                <div className="comment-list">
                  {commentList.length === 0 ? (
                    <p className="profile-comment-empty">No comments yet.</p>
                  ) : (
                    commentList.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <strong>{comment.user?.name || comment.partner?.name || "User"}</strong>: {comment.text}
                      </div>
                    ))
                  )}
                </div>

                <div className="comment-input-row">
                  <input
                    className="comment-input"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write comment..."
                  />
                </div>

                {commentError && <p className="profile-modal-error">{commentError}</p>}

                <div className="comment-actions">
                  <button
                    className="comment-post-btn"
                    onClick={handleCommentSubmit}
                  >
                    Post
                  </button>

                  <button
                    className="comment-close-btn"
                    onClick={() => setShowComments(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
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

            <label className="profile-modal-label">Profile Photo</label>
            <div className="profile-modal-photo-section">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile preview"
                  className="profile-modal-photo-preview"
                />
              ) : (
                <div className="profile-modal-photo-placeholder">No photo</div>
              )}

              <label className="profile-modal-upload" htmlFor="profile-photo-input">
                {selectedImage ? "Change photo" : "Upload photo"}
              </label>
              <input
                id="profile-photo-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="profile-modal-file-input"
              />
            </div>

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
