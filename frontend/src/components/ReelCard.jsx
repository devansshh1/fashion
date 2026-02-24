import React, { useEffect, useRef ,useState} from "react";
import { FaHeart, FaRegCommentDots, FaBookmark } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";




async function likeFood(foodId) {
    try{
        const resp = await axios.post(
            `http://localhost:3000/api/food/${foodId}/like`,
            {},
            { withCredentials: true }
        );
        console.log("Liked food:", resp.data);
    }
    catch(err){
        console.error("Error liking food:", err);
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

const [likes, setLikes] = useState(videoData.likesCount);
const [saves, setSaves] = useState(videoData.savesCount);
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
                src={videoData.video}
                loop
                muted
                playsInline
                className="video"
            />

            {/* RIGHT ACTION BAR */}
            <div className="action-bar">

                <div className="action">
                    <FaHeart size={28} onClick={async () => { if(liked){
    setLiked(prev => prev - 1);
}else{
    setLiked(prev => prev + 1);
}

setLiked(!liked);
setLikes(prev => prev + (liked ? -1 : 1)); // Optimistically update UI


    try{
        await likeFood(videoData._id);
    }
    catch{
        setLikes(prev => prev - 1); // rollback if failed
    }

}}
 />
                    <span>{likes}</span>
                </div>

                <div className="action">
                    <FaBookmark size={26} onClick={async () => {

    setSaves(prev => prev + 1);

    try{
        await saveFood(videoData._id);
    }
    catch{
        setSaves(prev => prev - 1);
    }

}}
 />
                    <span>{saves}</span>
                </div>

                <div className="action">
                    <FaRegCommentDots size={26} onClick={async () => {

    setComments(prev => prev + 1);

    try{
        await commentOnFood(videoData._id, "Nice food!");
    }
    catch{
        setComments(prev => prev - 1);
    }

}}
 />
                        <span>{comments}</span>
                </div>

            </div>

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
