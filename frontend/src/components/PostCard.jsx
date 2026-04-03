import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API, { getAssetUrl } from "../api/API";

function PostCard({
  post,
  refresh,
  isDeleteMode = false,
  canDeletePost = false,
  isSelected = false,
  onToggleSelect,
}) {
  const { user } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const isPartnerLoggedIn = localStorage.getItem("isPartnerLoggedIn") === "true";

  const requireLogin = () => {
    if (user || isPartnerLoggedIn) {
      return true;
    }

    alert("Please login");
    return false;
  };

  const handleCardClick = () => {
    if (!isDeleteMode || !canDeletePost) {
      return;
    }

    onToggleSelect?.();
  };

  const handleLike = async () => {
    if (!requireLogin() || isDeleteMode) return;

    await API.post(`/api/posts/${post._id}/like`);
    refresh();
  };

  const handleSave = async () => {
    if (!requireLogin() || isDeleteMode) return;

    await API.post(`/api/posts/${post._id}/save`);
    refresh();
  };

  const fetchComments = async () => {
    if (!requireLogin() || isDeleteMode) return;

    const resp = await API.get(`/api/posts/${post._id}/comments`);
    setComments(resp.data.comments);
    setShowComments(true);
  };

  const postComment = async () => {
    if (!requireLogin() || isDeleteMode) return;
    if (!newComment.trim()) return;

    await API.post(`/api/posts/${post._id}/comment`, { text: newComment });

    setNewComment("");
    fetchComments();
    refresh();
  };

  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") return "";

    return image.startsWith("http")
      ? image
      : getAssetUrl(image);
  };

  return (
    <>
      <div
        className={`premium-card${isDeleteMode ? " premium-card--selectable" : ""}${isSelected ? " premium-card--selected" : ""}${isDeleteMode && !canDeletePost ? " premium-card--locked" : ""}`}
        onClick={handleCardClick}
      >
        <div className="image-wrapper">
          <img src={getImageUrl(post.image)} alt={post.name} />

          {isDeleteMode && canDeletePost && (
            <div className="premium-card-selection-pill">
              {isSelected ? "Selected" : "Select"}
            </div>
          )}

          {isDeleteMode && !canDeletePost && (
            <div className="premium-card-selection-note">
              Not yours
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="text-lg font-bold text-white">{post.name}</h3>

          <div className="stats">
            <span
              onClick={(event) => {
                event.stopPropagation();
                handleLike();
              }}
            >
              ❤️ {post.likesCount}
            </span>
            <span
              onClick={(event) => {
                event.stopPropagation();
                fetchComments();
              }}
            >
              💬 {post.commentsCount}
            </span>
            <span
              onClick={(event) => {
                event.stopPropagation();
                handleSave();
              }}
            >
              💾 {post.savesCount}
            </span>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="comment-modal">
          <div className="comment-box">

            <h3>Comments</h3>

            <div className="comment-list">
              {comments.map((c) => (
                <div key={c._id} className="comment-item">
                  <strong>{c.user?.name || c.partner?.name || "User"}</strong> {c.text}
                </div>
              ))}
            </div>

            <div className="comment-input-row">
              <input
                className="comment-input"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
            </div>

            <div className="comment-actions">
              <button
                className="comment-post-btn"
                onClick={postComment}
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
    </>
  );
}

export default PostCard;
