import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useContext } from "react";
import { useRef } from "react";
import ReelFeed from "../components/ReelFeed";
function LandingPage() {
const { user, loading } = useContext(AuthContext);
const videoRefs = useRef([]);
    const navigate = useNavigate();
    const [topPartners, setTopPartners] = useState([]);
    const [topReels, setTopReels] = useState([]);
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

        <div className="landing">

            {/* NAVBAR */}
           <nav className="navbar">
    <h2 className="logo">Cravings</h2>

    <div className="nav-buttons">
        {!user ? (
            <>
                <button
                    className="login-btn"
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
                <button
                    className="login-btn" style={{ background: "#ff4d4d" }}
                    onClick={() => navigate("/reels")}
                >
                    Reels
                </button>
            </>
        )}
    </div>
</nav>


            {/* HERO SECTION */}
            <div className="hero">

                <h1>
                    Discover What Everyone Is Eating Today 🔥
                </h1>

                <p>
                    Watch short food reels, explore trending dishes,
                    and save your next craving.
                </p>

                <button 
                    className="explore-btn"
                    onClick={() => navigate(user ? "/reels" : "/user/login")}
                >
                    Start Exploring →
                </button>

            </div>


            {/* PREVIEW SECTION */}
      <div className="top-partners">

  {topPartners.map((partner, index) => (
    
    <div key={partner._id} className="partner-circle">
       
     <img onClick={() => navigate(`/partner/${partner._id}/profile`)}
  src={partner.partnerDetails?.image}
  alt={partner.partnerDetails?.name}
  className="circle-img"
/>

      <p>#{index + 1}</p>
      <p>{partner.partnerDetails?.name}</p>

    </div>
  ))}
</div>

{/* 🔥 TOP 3 REELS SECTION */}
<div className="top-reels">

  <h2 className="section-title">🔥 Most Loved Reels</h2>

  <div className="reels-container">
    {topReels.map((reel, index) => (
      <div key={reel._id} className="reel-card">

        <video
  ref={(el) => (videoRefs.current[index] = el)}
  src={reel.video}
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

                <h2>Browse By Taste</h2>

                <div className="chips">
                    <span> Old Money</span>
                    <span>Street Wear</span>
                    <span>Traditional</span>
                    <span>Aesthetic</span>
                    <span>Minimal</span>
                    <span>Maximal</span>
                </div>

            </div>


            {/* PARTNER CTA */}
            <div className="partner">

                <h2>Own a Food Business?</h2>

                <p>
                    Upload reels and attract thousands of hungry customers.
                </p>

                <button className="register-btn"
                    onClick={() => navigate("/partner/register")}
                >
                    Join as Food Partner
                </button>

                <button className="login-btn2"
                    onClick={() => navigate("/partner/login")}
                >
                    Partner Login
                </button>

            </div>


        </div>
    );
}

export default LandingPage;
