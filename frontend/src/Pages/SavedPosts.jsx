import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

function SavedPosts() {
  const [posts, setPosts] = useState([]);

  const fetchSaved = async () => {
    const resp = await axios.get(
        

      "http://localhost:3000/api/posts/saved",
      { withCredentials: true }
    );
    setPosts(resp.data.posts);
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  return (
    <div className="premium-page">
      <h1>💾 Saved Posts</h1>

      <div className="premium-grid">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} refresh={fetchSaved} />
        ))}
      </div>
    </div>
  );
}

export default SavedPosts;