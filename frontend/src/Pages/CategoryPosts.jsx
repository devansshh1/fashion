import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CategoryPosts() {
  const { category } = useParams();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:3000/api/posts/top/${category}`
        );
        setPosts(resp.data.posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <div className="posts-container">
      <h2>Top 5 in {category}</h2>

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">

            <img
              src={`${post.image}?tr=w-800`}
              alt={post.name}
            />

            <h4>{post.name}</h4>

            <div className="actions">

              {/* LIKE */}
              <span
               onClick={async () => {
  const resp = await axios.post(
    `http://localhost:3000/api/posts/${post._id}/like`,
    {},
    { withCredentials: true }
  );

  console.log("LIKE RESPONSE:", resp.data);  // 🔥 ADD THIS

  setPosts(prev =>
    prev.map(p =>
      p._id === post._id
        ? { ...p, likesCount: resp.data.likesCount }
        : p
    )
  );
}}>

                ❤️ {post.likesCount}
              </span>

              {/* SAVE */}
              <span
                onClick={async () => {
                  const resp = await axios.post(
                    `http://localhost:3000/api/posts/post/${post._id}/save`,
                    {},
                    { withCredentials: true }
                  );

                setPosts(prev =>
  prev.map(p =>
    p._id === post._id
      ? { ...p, savesCount: resp.data.savesCount }
      : p
  )
);  
                }}
              >
                💾 {post.savesCount}
              </span>

              {/* COMMENT */}
              <span
                onClick={async () => {
                  setSelectedPost(post);

                  const resp = await axios.get(
                    `http://localhost:3000/api/posts/post/${post._id}/comments`
                  );

                  setComments(resp.data.comments);
                }}
              >
                💬 {post.commentsCount}
              </span>

            </div>
          </div>
        ))}
      </div>

      {/* COMMENT MODAL */}
      {selectedPost && (
        <div className="comment-modal">
          <div className="comment-box">

            <h3>Comments</h3>

            {comments.map((c) => (
              <div key={c._id}>
                <strong>{c.user.name}</strong>: {c.text}
              </div>
            ))}

            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write comment..."
            />

            <button onClick={async () => {
  await axios.post(
    `http://localhost:3000/api/posts/post/${selectedPost._id}/comment`,
    { text: newComment },
    { withCredentials: true }
  );

  setNewComment("");

  const resp = await axios.get(
    `http://localhost:3000/api/posts/post/${selectedPost._id}/comments`
  );

  setComments(resp.data.comments);

  // 🔥 UPDATE COMMENTS COUNT IN POSTS STATE
  setPosts(prev =>
    prev.map(p =>
      p._id === selectedPost._id
        ? { ...p, commentsCount: resp.data.comments.length }
        : p
    )
  );
}}
></button>

            <button onClick={() => setSelectedPost(null)}>
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPosts;