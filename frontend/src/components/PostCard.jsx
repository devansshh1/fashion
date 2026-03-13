import axios from "axios";
import { useState } from "react";

function PostCard({ post, refresh }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleLike = async () => {
    await axios.post(
      `http://localhost:3000/api/posts/${post._id}/like`,
      {},
      { withCredentials: true }
    );
    refresh();
  };

  const handleSave = async () => {
    await axios.post(
      `http://localhost:3000/api/posts/${post._id}/save`,
      {},
      { withCredentials: true }
    );
    refresh();
  };

  const fetchComments = async () => {
    const resp = await axios.get(
      `http://localhost:3000/api/posts/${post._id}/comments`
    );
    setComments(resp.data.comments);
    setShowComments(true);
  };

  const postComment = async () => {
    if (!newComment.trim()) return;

    await axios.post(
      `http://localhost:3000/api/posts/${post._id}/comment`,
      { text: newComment },
      { withCredentials: true }
    );

    setNewComment("");
    fetchComments();
    refresh();
  };
  const getImageUrl = (image) => {
  if (!image || typeof image !== "string") return "";

  return image.startsWith("http")
    ? image
    : `http://localhost:3000${image}`;
};

  return (
    <>
      <div className="premium-card">
        <div className="image-wrapper">
        
          <img src={getImageUrl(post.image)} alt={post.name} />
        </div>

        <div className="card-content">
          <h3>{post.name}</h3>

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