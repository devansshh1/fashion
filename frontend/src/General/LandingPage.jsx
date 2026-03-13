import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useContext } from "react";
import { useRef } from "react";
import ReelFeed from "../components/ReelFeed";
import category from '../Pages/CategoryPage';
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { BackgroundRippleEffect } from "@/components/ui/BackgroundRippleEffect";
import { HeroHighlight, Highlight } from "@/components/ui/HeroHighlight";

function LandingPage() {
const { user, loading } = useContext(AuthContext);

const handleCategoryClick = (category) => {
  const choice = window.confirm(
    `Do you want to VIEW posts in "${category}"?\n\nClick Cancel to UPLOAD your post.`
  );

  if (choice) {
    navigate(`/category/${category}`);
  } else {
    navigate(`/upload-post/${category}`);
  }
};

const videoRefs = useRef([]);
    const navigate = useNavigate();
    const [topPartners, setTopPartners] = useState([]);
    const [topReels, setTopReels] = useState([]);
    const [isCreatorLoggedIn, setIsCreatorLoggedIn] = useState(false);
useEffect(() => {
  const fetchData = async () => {
    try {
      const [partnersRes, reelsRes] = await Promise.all([
        axios.get("http://localhost:3000/api/food/top-partners"),
        axios.get("http://localhost:3000/api/food/top-reels")
      ]);

      setTopPartners(partnersRes.data.partners);
      setTopReels(reelsRes.data.reels);

    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, []);

useEffect(() => {
  if (!topReels.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.6
    }
  );
  /*
  useEffect(() => {

  async function checkCreatorLogin() {
    try {

      const res = await axios.get(
        "http://localhost:3000/partner/check-auth",
        { withCredentials: true }
      );

      if (res.data.loggedIn) {
        setIsCreatorLoggedIn(true);
      }

    } catch (err) {
      console.log(err);
    }
  }

  checkCreatorLogin();

}, []);

*/
  videoRefs.current.forEach((video) => {
    if (video) observer.observe(video);
  });

  return () => {
    videoRefs.current.forEach((video) => {
      if (video) observer.unobserve(video);
    });
  };

}, [topReels]);

    if(loading) {
    return <div className="loading">Loading...</div>;
}

    return (

      
<div className="relative min-h-screen w-full bg-black overflow-x-hidden">

 
<div className="relative z-10">
  <nav className="navbar relative z-[100]">
    <h2 className="logo z-[100] ">Flaunt</h2>

    <div className="nav-buttons">
        {!user ? (
            <>
                <button
                    className="login-btn "
                    onClick={() => navigate("/user/login")}
                >
                    Login
                </button>

                <button
                    className="register-btn"
                    onClick={() => navigate("/user/register")}
                >
                    Register
                </button>
            </>
        ) : (
            <>

            
<BackgroundGradient
  className="rounded-xl px-8 py-4 bg-black text-white font-semibold cursor-pointer">
                <button
                    className="bg-transparent text-white font-semibold cursor-pointer " 
                    onClick={() => navigate("/reels")}
                >
                    Model Drops
                </button>

            </BackgroundGradient>    
            </>
        )}
    </div>
</nav>
       
      <HeroHighlight className="relative z-0 ">
        <div className="landing z-90">
            {/* NAVBAR */}
         

            {/* HERO SECTION */}
            <div className="hero">

                <h1 className="tracking-tight md:px-8 md:py-4">
Where Style Goes Viral
                </h1>
<BackgroundGradient className="rounded-xl px-8 py-4">
  <button
    className="bg-transparent text-white font-semibold cursor-pointer tracking-tight"
    onClick={() => navigate(user ? "/reels" : "/user/login")}
  >
    Find Your Aesthetic →
  </button>
</BackgroundGradient>

            </div>
          


            {/* PREVIEW SECTION */}
      <div className="top-partners ">

  {topPartners.map((partner, index) => (
    
    <div key={partner._id} className="partner-circle ">
       
     <img onClick={() => navigate(`/partner/${partner._id}/profile`)}
  src={partner.partnerDetails?.image}
  alt={partner.partnerDetails?.name}
  className="circle-img border-[3px] border-[#8d60a8]"
/>

     

    </div>
  ))}
</div>

{/* 🔥 TOP 3 REELS SECTION */}
<div className="top-reels">

  <h2 className="section-title font-satoshi tracking-tight "> Today's Top Fit Checks</h2>

  <div className="reels-container">
    {topReels.map((reel, index) => (
      <div key={reel._id} className="reel-card">

        <video
  ref={(el) => (videoRefs.current[index] = el)}
  src={`http://localhost:3000${reel.video}`}
  className="top-reel-video"
  muted
  loop
  playsInline
/>

        

      </div>
    ))}
  </div>

</div>
{/* CATEGORIES */}
            <div className="categories">

                <h2 className="font-satoshi text-xl ">Browse By Style</h2>

               <div className="chips font-satoshi ">
  {["Old Money", "Street Wear", "Traditional", "Aesthetic", "Minimal", "Maximal"].map((cat) => (
    <span
      key={cat}
      onClick={() => navigate(`/category/${cat}`)}
      
    >
      {cat}
    </span>
  ))}
</div>

            </div>

            
            <div className="partner font-satoshi tracking-tight">

                <h2 className="font-bold font-xl font-satoshi" style={{color:"white"}}>Show Your Style to the World</h2>

            

                <p className="font-satoshi" style={{color:"white", marginBottom:"20px", marginTop:"20px", maxWidth:"300px", marginLeft:"auto", marginRight:"auto"}}>
                   Post your looks, share reels, and build your personal style audience.
                </p>
            
              

            </div>
            
</div>

</HeroHighlight>
<div>
    <button
      className="login-btn font-satoshi"
     
      onClick={() => navigate("/partner/register")}
    >
      Start Your Profile
    </button>

    <button
      className="login-btn font-satoshi"
      style={{ background: "#8d60a8" }}
      onClick={() => navigate("/partner/login")}
    >
      Creator Login
    </button>
  
     </div>   

     </div>
    
      </div>  
    );
}

export default LandingPage;
