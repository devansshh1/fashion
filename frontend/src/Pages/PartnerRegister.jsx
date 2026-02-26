import React from "react";
import AuthForm from "../components/AuthForm";
import axios from "axios";
import Home from '../General/LandingPage';
import FoodHome from '../Pages/FoodPartnerHomePage';
import { useNavigate } from "react-router-dom";

function PartnerRegister(){
    const navigate = useNavigate();

    const fields = [
        {name:"name", type:"text", placeholder:"Restaurant Name"},
        {name:"email", type:"email", placeholder:"Business Email"},
        {name:"password", type:"password", placeholder:"Password"},
        {name:"customersServed", type:"number", placeholder:"Customers Served"},
        {name:"totalMeals", type:"number", placeholder:"Total Meals Donated"},
        {name:"address", type:"text", placeholder:"Business Address"},
        {name:"image", type:"file", placeholder:"Upload Image "}
    ];
    
   const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const resp = await axios.post(
            'http://localhost:3000/api/auth/partner/register',
            formData,
            {
                withCredentials: true
                
            }
        );

        navigate('/partner/login');

    } catch (err) {
        console.error("Registration failed:", err.response?.data);
    }
};
    return (
        <AuthForm
            title="Food Partner Register"
            fields={fields}
            buttonText="Register Partner"
            onSubmit={handleSubmit}
        />
    );
}

export default PartnerRegister;
