import React,{useState,useEffect} from "react";
import {useParams} from 'react-router-dom';
import API from '../api/API';
function FoodProfile() {
    const {id} = useParams();
   const [foodPartner,setFoodPartner] = useState(null);
const [videos,setVideos] = useState([]);

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

    return (
        <div className="profile-container">

            {/* HEADER */}
            <div className="profile-header">

                <div className="profile-top">
                    <div className="profile-avatar"></div>

                    <div className="profile-info">
                        <h2>{foodPartner ? foodPartner.name : "Loading..."}</h2>
                        <p>{foodPartner ? foodPartner.address : "Loading address..."}</p>
                    </div>
                </div>

                {/* STATS */}
                <div className="profile-stats">
                    <div>
                        <h3>{foodPartner ? foodPartner.totalMeals : "Loading..."}</h3>
                        <span>Total Meals</span>
                    </div>

                    <div>
                        <h3>{foodPartner ? foodPartner.customersServed : "Loading..."}</h3>
                        <span>Customers Served</span>
                    </div>
                </div>

            </div>

            {/* DIVIDER */}
            <div className="divider"></div>

            {/* VIDEO GRID */}
           <div className="video-grid">

    {videos.length === 0 && (
        <p>No videos uploaded yet.</p>
    )}
<div className="flex-wrap gap-5 w-[20%] h-50vh overflow-y-auto flex items-start justify-start"> 
       {videos.map(video => (

        <div key={video._id} className="video-card w-[48%] ">

            <video
                src={video.video}
                controls
                preload="metadata"
                width="100%"
            />

        </div>



    ))}
</div>


</div>


        </div>
    );
}

export default FoodProfile;
