import React,{useState,useEffect} from "react";
import {useParams} from 'react-router-dom';
import API from '../api/API';
function FoodProfile() {
    const {id} = useParams();
   const [foodPartner,setFoodPartner] = useState(null);
const [videos,setVideos] = useState([]);
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
  ) : (
    videos.map(video => (
      <div key={video._id} className="video-card">
        <video className="video-grid-video"
          src={getVideoUrl(video.video)}
          controls
          playsInline
        />
      </div>
    ))
  )}
</div>


        </div>
    );
}

export default FoodProfile;
