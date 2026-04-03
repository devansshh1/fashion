import React, { useContext, useEffect, useRef ,useState} from "react";
import { FaHeart, FaRegCommentDots, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API, { getAssetUrl } from "../api/API";
import BottomNav from "./BottomNav";




async function likeFood(foodId) {
  try {
    const resp = await API.post(`/api/food/${foodId}`, { contentType: "food" });

    return resp.data;
  } catch (err) {
    console.error("Error liking food:", err);
    throw err;
  }
}


async function saveFood(foodId) {
    try{
        const resp = await API.post(`/api/food/${foodId}/save`);
        console.log("Saved food:", resp.data);
    }
    catch(err){
        console.error("Error saving food:", err);
    }
}
async function commentOnFood(foodId, comment) {
    try{
        const resp = await API.post(`/api/food/${foodId}/comment`, { text: comment });
        console.log("Commented on food:", resp.data);
    }
    catch(err){
        console.error("Error commenting on food:", err);
    }
}

function ReelCard({ videoData, isActive }) {
const { user } = useContext(AuthContext);
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
const isPartnerLoggedIn = localStorage.getItem("isPartnerLoggedIn") === "true";

const requireLogin = () => {
  if (user || isPartnerLoggedIn) {
    return true;
  }

  alert("Please login");
  return false;
};

    useEffect(() => {
        const player = videoRef.current;

        if (!player) {
            return undefined;
        }

        if (typeof isActive === "boolean") {
            if (isActive) {
                player.play().catch(() => {});
            } else {
                player.pause();
            }

            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        player.play().catch(() => {});
                    } else {
                        player.pause();
                    }
                });
            },
            { threshold: 0.7 }
        );

        observer.observe(player);

        return () => {
            observer.unobserve(player);
        };

    }, [isActive]);

  const openWebsite = () => {

    const partnerId =
        videoData.foodPartnerId?._id || videoData.foodPartnerId;

    if(!partnerId){
        console.error("Missing foodPartnerId", videoData);
        return;
    }

    navigate(`/partner/${partnerId}/profile`);
};

 const videoSrc = videoData.video?.startsWith("http")
  ? videoData.video
  : getAssetUrl(videoData.video);

    return (
        <div className="reel">
            <video
                ref={videoRef}
                src={videoSrc}
                loop
                muted
                playsInline
                className="video"
            />

            <div className="reel-gradient reel-gradient-top" />
            <div className="reel-gradient reel-gradient-bottom" />

            {/* RIGHT ACTION BAR */}
            <div className="action-bar">

                <div className="action">
                   
<FaHeart
  size={28}
  color={liked ? "red" : "white"}
  onClick={async () => {
    if (!requireLogin()) return;

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
    if (!requireLogin()) return;

    try {
      const resp = await API.post(`/api/food/${videoData._id}/save`);

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
    if (!requireLogin()) return;

    setShowComments(true);

    const resp = await API.get(`/api/food/${videoData._id}/comments`);

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

      <div className="comment-list">
        {commentList.map(c => (
          <div key={c._id} className="comment-item">
            <strong>{c.user?.name || c.partner?.name || "User"}</strong>: {c.text}
          </div>
        ))}
      </div>

      <div className="comment-input-row">
        <input
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write comment..."
        />
      </div>

      <div className="comment-actions">
        <button
          className="comment-post-btn"
          onClick={async () => {
            if (!requireLogin()) return;

            await API.post(`/api/food/${videoData._id}/comment`, { text: newComment });

            setNewComment("");

            const resp = await API.get(`/api/food/${videoData._id}/comments`);

            setCommentList(resp.data);
            setComments(resp.data.length);
          }}
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

            {/* BOTTOM OVERLAY */}
            {/* TOP OVERLAY */}
<div className="top-overlay">

   
    <button className="visit-btn" onClick={openWebsite}>
        Model Profile
    </button>

</div>

            <BottomNav />

        </div>
    );
}

export default ReelCard;
