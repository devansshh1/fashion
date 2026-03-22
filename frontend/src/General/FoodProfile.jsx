import React,{useState,useEffect} from "react";
import {useParams} from 'react-router-dom';
import {useRef} from 'react';
import API from '../api/API';
function FoodProfile() {
    const {id} = useParams();
   const [foodPartner,setFoodPartner] = useState(null);
const [videos,setVideos] = useState([]);
const videoRef = useRef();
const [selectedVideo, setSelectedVideo] = useState(null);
const instaUrl = `https://instagram.com/${foodPartner?.InstagramHandle}`;

useEffect(()=>{

    async function fetchProfile(){

        try{

            const res = await API.get(
                `/api/partner/${id}/profile`
            );

            setFoodPartner(res.data.partner);
            setVideos(res.data.videos);

        }catch(err){
            console.log(err);
        }
    }

    fetchProfile();

},[id]);

useEffect(() => {
  if (selectedVideo) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}, [selectedVideo]);

const getVideoUrl = (videoPath) => {
  if (!videoPath) return "";
  return videoPath.startsWith("http")
    ? videoPath
    : `http://localhost:3000${videoPath}`;
};

    return (
        <div className="profile-container">

            {/* HEADER */}
            <div className="profile-header">

                <div className="profile-top">
                    <div className="profile-avatar">
                         {foodPartner?.image && (
    <img
      src={
        foodPartner.image.startsWith("http")
          ? foodPartner.image
          : `http://localhost:3000${foodPartner.image}`
      }
      alt={foodPartner.name}
    />
  )}
                    </div>

                    <div className="profile-info">
                        <h2>{foodPartner ? foodPartner.name : "Loading..."}</h2>

                   <a 
  href={`https://instagram.com/${foodPartner?.InstagramHandle}`}
  target="_blank"
  rel="noopener noreferrer"
  className="username"
>
  @{foodPartner?.InstagramHandle}
</a>
                    </div>
                </div>

                {/* STATS */}
                <div className="profile-stats">
                    <div>
                       <h3>{(foodPartner?.totalPosts ?? 0)||'Loading'}</h3>
                        <span>Posts</span>
                    </div>

                    <div>
                        <h3>{foodPartner ? foodPartner.totalLikes : "Loading..."}</h3>
                        <span>Total Likes</span>
                    </div>
                </div>

            </div>

            {/* DIVIDER */}
            <div className="divider"></div>

            {/* VIDEO GRID */}
          <div className="video-grid">
  {videos.length === 0 ? (
    <p className="empty-msg">No uploads yet.</p>
  ) : videos.map(video => (
  <div
    key={video._id}
    className="video-card"
    onClick={() => setSelectedVideo(video)}
  >
   <video
  ref={videoRef}
   
  src={getVideoUrl(video.video)}
  muted
  playsInline
  preload="metadata"
  onClick={() => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  }}
  className="w-full h-full object-cover"
/>
  </div>
))}
</div>
{selectedVideo && (
  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">

    {/* CLOSE BUTTON */}
    <button
      onClick={() => setSelectedVideo(null)}
      className="absolute top-5 right-5 text-white text-3xl z-50"
    >
      ✕
    </button>

    {/* VIDEO */}
    <video
      src={getVideoUrl(selectedVideo.video)}
      autoPlay
      loop
      preload="metadata"
      className="w-full h-full object-cover"
    />
  </div>
)}

        </div>
    );
}

export default FoodProfile;
