import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API, { getAssetUrl } from "../api/API";

function PostCard({ post, refresh }) {
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

  const handleLike = async () => {
    if (!requireLogin()) return;

    await API.post(`/api/posts/${post._id}/like`);
    refresh();
  };

  const handleSave = async () => {
    if (!requireLogin()) return;

    await API.post(`/api/posts/${post._id}/save`);
    refresh();
  };

  const fetchComments = async () => {
    if (!requireLogin()) return;

    const resp = await API.get(`/api/posts/${post._id}/comments`);
    setComments(resp.data.comments);
    setShowComments(true);
  };

  const postComment = async () => {
    if (!requireLogin()) return;
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
      <div className="premium-card">
        <div className="image-wrapper">
        
          <img src={getImageUrl(post.image)} alt={post.name} />
        </div>

        <div className="card-content">
          <h3 className="text-lg font-bold text-white">{post.name}</h3>

          <div className="stats">
            <span onClick={handleLike}>❤️ {post.likesCount}</span>
            <span onClick={fetchComments}>💬 {post.commentsCount}</span>
            <span onClick={handleSave}>💾 {post.savesCount}</span>
          </div>
        </div>
      </div>

      {/* COMMENTS MODAL */}
     {/* COMMENTS MODAL */}
{showComments && (
  <div className="comment-modal">
    <div className="comment-box">

      <h3>Comments</h3>

      {/* COMMENT LIST */}
      <div className="comment-list">
        {comments.map((c) => (
          <div key={c._id} className="comment-item">
            <strong>{c.user.name}</strong> {c.text}
          </div>
        ))}
      </div>

      {/* INPUT ROW */}
      <div className="comment-input-row">
        <input
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />

        <button
          className="comment-post-btn"
          onClick={postComment}
        >
          Post
        </button>
      </div>

      {/* CLOSE */}
      <button
        className="comment-close-btn"
        onClick={() => setShowComments(false)}
      >
        Close
      </button>

    </div>
  </div>
)}
     </>
  );
}

export default PostCard;
