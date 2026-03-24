import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useRef } from "react";
import ReelFeed from "../components/ReelFeed";
import category from '../Pages/CategoryPage';
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { BackgroundRippleEffect } from "@/components/ui/BackgroundRippleEffect";
import { HeroHighlight, Highlight } from "@/components/ui/HeroHighlight";
import { useLocation } from "react-router-dom";
import API, { getAssetUrl } from "../api/API";
import StartupLoader from "../components/StartupLoader";
function LandingPage() {
const { user, loading, logout } = useContext(AuthContext);
const [showMenu, setShowMenu] = useState(false);
const [initialFeedLoading, setInitialFeedLoading] = useState(true);
const [partnerSessionLoading, setPartnerSessionLoading] = useState(true);

const videoRefs = useRef([]);
    const navigate = useNavigate();
    const [topPartners, setTopPartners] = useState([]);
    const [topReels, setTopReels] = useState([]);
    const [isPartnerLoggedIn, setIsPartnerLoggedIn] = useState(() => localStorage.getItem("isPartnerLoggedIn") === "true");
    const [partnerId, setPartnerId] = useState(() => localStorage.getItem("partnerId"));
    const location = useLocation();
    
const getVideoUrl = (videoPath) => {
  return getAssetUrl(videoPath);
};

const clearPartnerSession = () => {
  localStorage.removeItem("isPartnerLoggedIn");
  localStorage.removeItem("partnerId");
  setIsPartnerLoggedIn(false);
  setPartnerId(null);
};



const handleUserLogout = async () => {
  if (!user) {
    alert("First login as user");
    return;
  }

  try {
    await logout();
    alert("User logged out");
  } catch (err) {
    console.log(err);
    alert("Unable to logout user");
  }
};
const handlePartnerLogout = async() => {
   try {
    await API.post("/api/auth/partner/logout");

    clearPartnerSession();

  alert("Model logged out");
  } catch (err) {
    console.log(err);
    alert("Unable to logout model");
  }
};

const handleCategoryClick = (category) => {
  const choice = window.confirm(
    `Do you want to VIEW posts in "${category}"?\n\nClick Cancel to UPLOAD your post.`
  );

  if (choice) {
    navigate(`/category/${category}`);
  } else {
    navigate(`/upload-post/${category}`);
  }
}
useEffect(() => {
  const fetchData = async () => {
    try {
      const [partnersRes, reelsRes] = await Promise.all([
        API.get("/api/food/top-partners"),
        API.get("/api/food/top-reels")
      ]);

      setTopPartners(partnersRes.data.partners);
      setTopReels(reelsRes.data.reels);

    } catch (err) {
      console.error(err);
    } finally {
      setInitialFeedLoading(false);
    }
  };

  fetchData();
}, [location]);

useEffect(() => {

    async function checkPartnerLogin(){

        try{

            const res = await API.get("/api/partner/check-auth");

            if(res.data.loggedIn){
                setIsPartnerLoggedIn(true);
              setPartnerId(res.data.partner?.id || null);
              localStorage.setItem("isPartnerLoggedIn", "true");
              if (res.data.partner?.id) {
                localStorage.setItem("partnerId", res.data.partner.id);
              }
            } else {
              clearPartnerSession();
            }

        }catch(err){
          if (err?.response?.status === 401) {
            clearPartnerSession();
            return;
          }

          clearPartnerSession();
        } finally {
          setPartnerSessionLoading(false);
        }
    }

    checkPartnerLogin();

}, [location]);

useEffect(() => {
  const handleClickOutside = () => setShowMenu(false);
  if (showMenu) {
    window.addEventListener("click", handleClickOutside);
  }
  return () => window.removeEventListener("click", handleClickOutside);
}, [showMenu]);

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
 

  videoRefs.current.forEach((video) => {
    if (video) observer.observe(video);
  });

  return () => {
    videoRefs.current.forEach((video) => {
      if (video) observer.unobserve(video);
    });
  };

}, [topReels]);

    if (loading || initialFeedLoading || partnerSessionLoading) {
    return <StartupLoader />;
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
                   Viewer Login
                </button>

                <button
                    className="register-btn"
                    onClick={() => navigate("/user/register")}
                >
                  Viewer  Register
                </button>
            </>
        ) : (
            <div className="flex items-center gap-4">
  <BackgroundGradient
    className="rounded-xl px-8 py-4 bg-black text-white font-semibold cursor-pointer ">
          <button
            className="bg-transparent text-white font-semibold cursor-pointer " 
            onClick={() => navigate("/reels")}
          >
            Model Drops
          </button>
</BackgroundGradient>  
          <button
    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
    className="text-white text-2xl px-2"
  >
    ⋮
  </button>

  {/* DROPDOWN */}
  {showMenu && (
    <div  onClick={(e) => e.stopPropagation()}  className="absolute right-0 top-18 bg-black border border-gray-700 rounded-lg shadow-lg w-48 z-50">

      <button
        onClick={handleUserLogout}
        className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-white"
      >
        User Logout
      </button>

      <button
        onClick={handlePartnerLogout}
        className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-white"
      >
        Model Logout
      </button>

    </div>
  )}

          
        </div>
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
    onClick={() => navigate("/category/Aesthetic/view")}
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
  src={getVideoUrl(reel.video)}
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
            <div className="landing-cta">
{!isPartnerLoggedIn ? (

<>
<button
className="register-btn font-satoshi landing-cta-btn"
style={{ background: "#8d60a8" }}
onClick={() => navigate("/partner/register")}
>
Creator Sign Up
</button>

<button
className="register-btn font-satoshi landing-cta-btn"
style={{ background: "#8d60a8" }}
onClick={() => navigate("/partner/login")}
>
Creator Login
</button>
</>

) : (

<button
className="upload-btn font-satoshi landing-cta-btn"
style={{ background: "#8d60a8" }}
onClick={() => navigate(partnerId ? `/partner/dashboard/${partnerId}` : "/partner/login")}
>
Upload Reel
</button>

)}
            </div>
            
</div>

</HeroHighlight>

     </div>
    
      </div>  
    );
}

export default LandingPage;
