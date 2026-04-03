import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import API from "../api/API";

function TopTrending() {
  const { category: routeCategory } = useParams();
  const normalizedRouteCategory =
    !routeCategory || routeCategory.toLowerCase() === "all" ? "" : routeCategory;
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(normalizedRouteCategory);

  useEffect(() => {
    setCategory(normalizedRouteCategory);
  }, [normalizedRouteCategory]);

  const fetchPosts = async () => {
    const resp = await API.get(`/api/posts/top?category=${category}`);
    setPosts(resp.data.posts);
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  return (
  <div className="premium-page">
    <div className="premium-header">

  <div className="header-text">
    
   
    <p className="premium-copy-accent font-bold text-6xl bg-gradient-to-r from-purple-500 to-pink-500 ">
      Discover the most admired looks
    </p>
  </div>

  <div className="header-filter ">
    <label className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Category</label>
    <select
      className="premium-select bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text"
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

export default TopTrending;
