import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("");

  const fetchPosts = async () => {
    const resp = await axios.get(
      `http://localhost:3000/api/posts?category=${category}`
    );
    setPosts(resp.data.posts);
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  return (
    <div className="premium-page">

      <div className="premium-header">

        <div className="header-text">
          <span className="flame">📂</span>
          <h1>All Posts</h1>
          <p>Explore looks from every category</p>
        </div>

        <div className="header-filter">
          <label>Choose Category</label>
          <select
            className="premium-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option>Old Money</option>
            <option>Street Wear</option>
            <option>Traditional</option>
            <option>Aesthetic</option>
            <option>Minimal</option>
            <option>Maximal</option>
          </select>
        </div>

      </div>

      <div className="premium-grid">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} refresh={fetchPosts} />
        ))}
      </div>

    </div>
  );
}

export default ViewPosts;