import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../General/LandingPage";
import UserLogin from "../Pages/UserLogin";
import FoodPartnerHomePage from "../Pages/FoodPartnerHomePage";
import FoodProfile from "../General/FoodProfile";
import PartnerLogin from "../Pages/PartnerLogin";
import PartnerRegister from "../Pages/PartnerRegister";
import UserRegister from "../Pages/UserRegister";
import FoodPartnerRealHomePage from "../Pages/FoodPartnerRealHomePage";
import ReelFeed from "../components/ReelFeed";
import Saved from "../General/saved";   
function AppRouter() {
    return (
        <Router>
            <Routes>

                {/* Landing */}
                <Route path="/" element={<Home />} />

                {/* USER */}
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/dashboard/:id" element={<FoodPartnerHomePage />} />

               <Route path='/login' element={<UserLogin />} />

                {/* PARTNER AUTH */}
                <Route path="/partner/login" element={<PartnerLogin />} />
                <Route path="/partner/register" element={<PartnerRegister />} />

                {/* ⭐ PRIVATE PARTNER DASHBOARD */}
                <Route
                    path="/partner/dashboard/:id"
                    element={<FoodPartnerRealHomePage />}
                />
                <Route path="/saved" element={<Saved />} />
                <Route path="/reels" element={<ReelFeed />} />
<Route 
   path="/partner/:id/profile" 
   element={<FoodProfile />} 
/>


            </Routes>
        </Router>
    );
}
export default AppRouter;
