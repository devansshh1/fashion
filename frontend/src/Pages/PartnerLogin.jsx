import React from "react";
import AuthForm from "../components/AuthForm";
import Home from '../General/LandingPage';
import { useNavigate } from "react-router-dom";
import API from "../api/API";

function PartnerLogin(){
    const navigate = useNavigate();
     // ⭐ ADD THIS



     const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
   const resp= await API.post('/api/auth/partner/login'
,{
        email: data.email,
        password: data.password 
    })
    if (resp.status === 200) {
        localStorage.setItem("partnerId", resp.data._id);
        localStorage.setItem("isPartnerLoggedIn", "true");
        navigate(`/partner/dashboard/${resp.data._id}`); // Redirect to dashboard with the actual partner id
    }
    console.log("RESPONSE:", resp.data);
}



    const fields = [
        {name:"email", type:"email", placeholder:"Business Email"},
        {name:"password", type:"password", placeholder:"Password"}
    ];

    return (
        <AuthForm
            title="Model Login"
            fields={fields}
            buttonText="Login"
            onSubmit={handleSubmit}
        />
    );
}

export default PartnerLogin;
