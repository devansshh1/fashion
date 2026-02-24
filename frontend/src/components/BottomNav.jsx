import React from "react";
import { FaHome, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BottomNav() {

    const navigate = useNavigate();

    return (
        <div className="bottom-nav">

            <div onClick={() => navigate("/")}>
                <FaHome size={22} />
                <p>home</p>
            </div>

            <div onClick={() => navigate("/saved")}>
                <FaBookmark size={22} />
                <p>saved</p>
            </div>

        </div>
    );
}

export default BottomNav;
