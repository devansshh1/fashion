import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

function LandingPage() {

    const navigate = useNavigate();

    return (

        <div className="landing">

            {/* NAVBAR */}
            <nav className="navbar">
                <h2 className="logo">Cravings </h2>

                <div className="nav-buttons">
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
                    onClick={() => navigate("/user/login")}
                >
                    Start Exploring →
                </button>

            </div>


            {/* PREVIEW SECTION */}
            <div className="preview">

                <h2>Trending Today</h2>

                <div className="reel-preview">

    <video 
        src="/videos/v1.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="preview-video"
    />

    <video 
        src="/videos/v2.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="preview-video"
    />

    <video 
        src="/videos/v3.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="preview-video"
    />

</div>


            </div>


            {/* CATEGORIES */}
            <div className="categories">

                <h2>Browse By Taste</h2>

                <div className="chips">
                    <span>🍕 Pizza</span>
                    <span>🍔 Burgers</span>
                    <span>🍜 Street Food</span>
                    <span>🍰 Desserts</span>
                    <span>🥗 Healthy</span>
                </div>

            </div>


            {/* PARTNER CTA */}
            <div className="partner">

                <h2>Own a Food Business?</h2>

                <p>
                    Upload reels and attract thousands of hungry customers.
                </p>

                <button
                    onClick={() => navigate("/partner/register")}
                >
                    Join as Food Partner
                </button>

            </div>


        </div>
    );
}

export default LandingPage;
