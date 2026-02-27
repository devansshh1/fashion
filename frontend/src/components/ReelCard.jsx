import React, { useEffect, useRef ,useState} from "react";
import { FaHeart, FaRegCommentDots, FaBookmark } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";




async function likeFood(foodId) {
  try {
    const resp = await axios.post(
      `http://localhost:3000/api/food/${foodId}`,   // better route
      { contentType: "food" },                      // IMPORTANT
      { withCredentials: true }
    );

    return resp.data;
  } catch (err) {
    console.error("Error liking food:", err);
    throw err;
  }
}


async function saveFood(foodId) {
    try{
        const resp = await axios.post(
            `http://localhost:3000/api/food/${foodId}/save`,
            {},
            { withCredentials: true }
        );
        console.log("Saved food:", resp.data);
    }
    catch(err){
        console.error("Error saving food:", err);
    }
}
async function commentOnFood(foodId, comment) {
    try{
        const resp = await axios.post(
            `http://localhost:3000/api/food/${foodId}/comment`,
            { text: comment },
            { withCredentials: true }
        );
        console.log("Commented on food:", resp.data);
    }
    catch(err){
        console.error("Error commenting on food:", err);
    }
}

function ReelCard({ videoData }) {
const navigate = useNavigate();
const [showComments, setShowComments] = useState(false);
const [commentList, setCommentList] = useState([]);
const [newComment, setNewComment] = useState("");
const [likes, setLikes] = useState(videoData.likesCount);
const [saves, setSaves] = useState(videoData.savesCount);
const [saved, setSaved] = useState(false);
const [comments, setComments] = useState(videoData.commentsCount);
  const [liked, setLiked] = useState(false);  
    const videoRef = useRef(null);

    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play();
                    } else {
                        videoRef.current?.pause();
                    }
                });
            },
            { threshold: 0.7 }
        );

        if (videoRef.current) observer.observe(videoRef.current);

        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        };

    }, []);

  const openWebsite = () => {

    const partnerId =
        videoData.foodPartnerId?._id || videoData.foodPartnerId;

    if(!partnerId){
        console.error("Missing foodPartnerId", videoData);
        return;
    }

    navigate(`/partner/${partnerId}/profile`);
};



    return (
        <div className="reel">

            {/* VIDEO */}
            <video
                ref={videoRef}
                src={`http://localhost:3000${videoData.video}`}
                loop
                muted
                playsInline
                className="video"
            />

            {/* RIGHT ACTION BAR */}
            <div className="action-bar">

                <div className="action">
                   
<FaHeart
  size={28}
  color={liked ? "red" : "white"}
  onClick={async () => {

    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(prev => prev + (newLikedState ? 1 : -1));

    try {
      const resp = await likeFood(videoData._id);
      // optional: sync from backend if returning liked state
    } catch {
      // rollback if failed
      setLiked(!newLikedState);
      setLikes(prev => prev + (newLikedState ? -1 : 1));
    }

  }}
/>

                    <span>{likes}</span>
                </div>

                <div className="action">
                   
                   <FaBookmark
  size={26}
  color={saved ? "gold" : "white"}
  onClick={async () => {
    try {
      const resp = await axios.post(
        `http://localhost:3000/api/food/${videoData._id}/save`,
        {},
        { withCredentials: true }
      );

      setSaved(resp.data.saved);
      setSaves(resp.data.savesCount);

    } catch (err) {
      console.error("Save error:", err);
    }
  }}
/>
                    <span>{saves}</span>
                </div>

                <div className="action">
                   <FaRegCommentDots
  size={26}
  onClick={async () => {
    setShowComments(true);

    const resp = await axios.get(
      `http://localhost:3000/api/food/${videoData._id}/comments`
    );

    setCommentList(resp.data);
  }}
/>

                        <span>{comments}</span>
                </div>

            </div>

            {showComments && (
  <div className="comment-modal">
    <div className="comment-box">

      <h3>Comments</h3>

      {commentList.map(c => (
        <div key={c._id}>
          <strong>{c.user.name}</strong>: {c.text}
        </div>
      ))}

      <input
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write comment..."
      />

      <button
        onClick={async () => {
          await axios.post(
            `http://localhost:3000/api/food/${videoData._id}/comment`,
            { text: newComment },
            { withCredentials: true }
          );

          setNewComment("");

          const resp = await axios.get(
            `http://localhost:3000/api/food/${videoData._id}/comments`
          );

          setCommentList(resp.data);
          setComments(resp.data.length);
        }}
      >
        Post
      </button>

      <button onClick={() => setShowComments(false)}>
        Close
      </button>

    </div>
  </div>
)}

            {/* BOTTOM OVERLAY */}
            {/* TOP OVERLAY */}
<div className="top-overlay">

    <h3 className="item-name">
        {videoData.name || "d1"}
    </h3>

    <button className="visit-btn" onClick={openWebsite}>
        visit store
    </button>

</div>

        </div>
    );
}

export default ReelCard;
