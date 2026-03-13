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
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 text-3xl">
        Saved Posts
      </h1>

      <div className="premium-grid">
          {posts.length === 0 ? (
            <p className="text-2xl font-bold">You haven't saved any posts yet. Start exploring and save your favorite looks!</p>
          ) : (
            posts.map((p) => (
              <PostCard key={p._id} post={p} refresh={fetchSaved} />
            ))
          )}
      </div>
    </div>
  );
}

export default SavedPosts;