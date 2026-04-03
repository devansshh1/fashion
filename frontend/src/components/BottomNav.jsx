import React from "react";
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BottomNav() {

    const navigate = useNavigate();

    return (
        <div className="bottom-nav">
            <button
                type="button"
                className="bottom-nav-button"
                onClick={() => navigate("/saved")}
                aria-label="Open saved reels"
            >
                <FaBookmark size={22} />
                <p>saved</p>
            </button>
        </div>
    );
}

export default BottomNav;
