import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import { AuthContext } from "../context/AuthContext";
import { useContext, useRef } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { HeroHighlight } from "@/components/ui/HeroHighlight";
import { useLocation } from "react-router-dom";
import API, { getAssetUrl } from "../api/API";
import StartupLoader from "../components/StartupLoader";
import { authSession } from "../auth/sessionStorage";
import { Button } from "@/components/ui/moving-border";
import { POST_CATEGORIES } from "../constants/postCategories";

function LandingPage() {
const { user, loading, logout } = useContext(AuthContext);
const [showMenu, setShowMenu] = useState(false);
const [showAuthModal, setShowAuthModal] = useState(false);
const [initialFeedLoading, setInitialFeedLoading] = useState(true);
const [partnerSessionLoading, setPartnerSessionLoading] = useState(true);

const videoRefs = useRef([]);
    const navigate = useNavigate();
    const [topPartners, setTopPartners] = useState([]);
    const [topReels, setTopReels] = useState([]);
    const [isPartnerLoggedIn, setIsPartnerLoggedIn] = useState(() => localStorage.getItem("isPartnerLoggedIn") === "true");
    const [partnerId, setPartnerId] = useState(() => localStorage.getItem("partnerId"));
    const location = useLocation();
    const hasAnySession = Boolean(user || isPartnerLoggedIn);
    
const getVideoUrl = (videoPath) => {
  return getAssetUrl(videoPath);
};

const clearPartnerSession = () => {
  authSession.clearPartnerToken();
  localStorage.removeItem("isPartnerLoggedIn");
  localStorage.removeItem("partnerId");
  setIsPartnerLoggedIn(false);
  setPartnerId(null);
};

const openAuthModal = () => setShowAuthModal(true);
const closeAuthModal = () => setShowAuthModal(false);

const handleViewerStart = () => {
  closeAuthModal();
  navigate("/user/register");
};

const handleCreatorStart = () => {
  closeAuthModal();
  navigate("/partner/register");
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
    clearPartnerSession();
    alert("Unable to logout model");
  }
};
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    try {
      const [partnersRes, reelsRes] = await Promise.allSettled([
        API.get("/api/food/top-partners"),
        API.get("/api/food/top-reels")
      ]);

      if (!isMounted) {
        return;
      }

      if (partnersRes.status === "fulfilled") {
        setTopPartners(partnersRes.value.data.partners);
      } else {
        setTopPartners([]);
        console.error("Top partners request failed", partnersRes.reason);
      }

      if (reelsRes.status === "fulfilled") {
        setTopReels(reelsRes.value.data.reels);
      } else {
        setTopReels([]);
        console.error("Top reels request failed", reelsRes.reason);
      }
    } finally {
      if (isMounted) {
        setInitialFeedLoading(false);
      }
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };
}, [location]);

useEffect(() => {
    let isMounted = true;

    async function checkPartnerLogin(){

        try{
            const res = await API.get("/api/partner/check-auth");

            if (!isMounted) {
              return;
            }

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
          if (!isMounted) {
            return;
          }

          if (err?.response?.status === 401) {
            clearPartnerSession();
            return;
          }

          clearPartnerSession();
        } finally {
          if (isMounted) {
            setPartnerSessionLoading(false);
          }
        }
    }

    checkPartnerLogin();

    return () => {
      isMounted = false;
    };

}, [location]);

useEffect(() => {
  const handleClickOutside = () => setShowMenu(false);
  if (showMenu) {
    window.addEventListener("click", handleClickOutside);
  }
  return () => window.removeEventListener("click", handleClickOutside);
}, [showMenu]);

useEffect(() => {
  if (!showAuthModal) return undefined;

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      closeAuthModal();
    }
  };

  window.addEventListener("keydown", handleEscape);
  return () => window.removeEventListener("keydown", handleEscape);
}, [showAuthModal]);

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

      
<div
  className="relative w-full overflow-x-hidden bg-black"
  style={{ minHeight: "100dvh", backgroundColor: "#000000" }}
>

<div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-black" />

 
<div className="relative z-10">
  <nav className="navbar relative z-[100]">
    <h2 className="logo z-[100] ">Flaunt</h2>

    <div className="nav-buttons">
      {!hasAnySession ? (
            <>
                <button
                    className="login-btn nav-auth-btn"
                    onClick={openAuthModal}
                >
                   <span className="nav-auth-btn__label">Get Started</span>
                </button>
            </>
        ) : (
            <div className="nav-user-actions">
  <BackgroundGradient
    className="nav-reels-btn rounded-xl flex justify-end bg-black text-white font-semibold cursor-pointer">
          <button
            className="nav-reels-btn__inner bg-transparent text-white font-semibold cursor-pointer" 
            onClick={() => navigate("/reels")}
          >
            Model Reels
          </button>
</BackgroundGradient>  
          <button
    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
    className="nav-menu-trigger text-white text-2xl px-2"
  >
    ⋮
  </button>

  {/* DROPDOWN */}
  {showMenu && (
    <div  onClick={(e) => e.stopPropagation()}  className="absolute right-0 top-18 bg-black border border-gray-700 rounded-lg shadow-lg w-48 z-50">

      {user && (
        <button
          onClick={handleUserLogout}
          className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-white"
        >
          User Logout
        </button>
      )}

      {isPartnerLoggedIn && (
        <button
          onClick={handlePartnerLogout}
          className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-white"
        >
          Model Logout
        </button>
      )}

    </div>
  )}

          
        </div>
        )}
    </div>
</nav>
       
      <HeroHighlight className="relative z-0 " containerClassName="bg-black">
        <div className="landing z-90">
            {/* NAVBAR */}
         

            {/* HERO SECTION */}
            <div className="hero">

                <h1 className="tracking-tight md:px-8 md:py-4">
Where Style Goes Viral
                </h1>
               <Button
  borderRadius="999px"
  duration={2600}
  containerClassName="mx-auto mt-4"
  borderClassName="h-60 w-60 bg-[radial-gradient(circle,_rgba(125,211,252,1)_0%,_rgba(129,140,248,0.96)_26%,_rgba(217,70,239,0.86)_52%,_rgba(236,72,153,0)_76%)]"
  className="font-satoshi px-9 py-3.5 text-[1.05rem] font-semibold tracking-[0.01em] text-white"
  onClick={() => navigate("/category/all")}
>
  <span className="relative z-[1]">Find Your Style</span>
  <span
    aria-hidden="true"
    className="relative z-[1] text-lg transition-transform duration-300 group-hover:translate-x-1"
  >
    →
  </span>
</Button>
 
            </div>
          
 <h2 className=" tt font-satoshi tracking-tight  flex  justify-center ">Today's Top Creators</h2>

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

{/* 🔥 TOP 5 REELS SECTION */}
<div className="top-reels">

  <h2 className="section-title font-satoshi tracking-tight  "> Today's Top Fit Checks</h2>

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

                <h2 className="font-satoshi text-3xl ">Browse By Style</h2>

               <div className="chips font-satoshi ">
  {POST_CATEGORIES.map((cat) => (
    <Button
      key={cat}
      borderRadius="999px"
      duration={2200}
      containerClassName="w-full max-w-none overflow-hidden"
      borderClassName="h-20 w-20 bg-[radial-gradient(circle,_rgba(125,211,252,0.92)_0%,_rgba(129,140,248,0.82)_30%,_rgba(217,70,239,0.62)_56%,_rgba(236,72,153,0)_78%)]"
      className="w-full min-h-[58px] justify-center px-4 py-4 text-[1rem] font-semibold tracking-[0.01em] text-white"
      onClick={() => navigate(`/category/${cat}`)}
    >
      <span className="relative z-[1]">{cat}</span>
    </Button>
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

<button
className="register-btn font-satoshi landing-cta-btn"
style={{ background: "#8d60a8" }}
onClick={openAuthModal}
>
Login / Get Started
</button>

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

      {showAuthModal && (
        <div className="auth-choice-overlay" onClick={closeAuthModal}>
          <div
            className="auth-choice-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="auth-choice-close"
              onClick={closeAuthModal}
              aria-label="Close role selection"
            >
              x
            </button>

            
            <h3 className="auth-choice-title">Choose how you want to use Flaunt</h3>

            <div className="auth-choice-grid">
              <button
                type="button"
                className="auth-choice-card"
                onClick={handleViewerStart}
              >
                <span className="auth-choice-icon" aria-hidden="true">VIEWER</span>
                
                <span className="auth-choice-copy">Browse & like outfits</span>
              </button>

              <button
                type="button"
                className="auth-choice-card"
                onClick={handleCreatorStart}
              >
                <span className="auth-choice-icon" aria-hidden="true">CREATOR</span>
               
                <span className="auth-choice-copy">Upload & share your style</span>
              </button>
            </div>
          </div>
        </div>
      )}

     </div>
    
      </div>  
    );
}

export default LandingPage;
