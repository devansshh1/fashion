import AuthForm from "../components/AuthForm";
import React from "react";
import axios from "axios";    
import Home from '../General/LandingPage';
import { useNavigate } from "react-router-dom";   
           
function UserRegister(){
    const navigate = useNavigate(); // ⭐ ADD THIS
const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    };
   const resp= await axios.post('http://localhost:3000/api/auth/user/register'
,{
        name: data.name,
        email: data.email,
        password: data.password 
    }, { withCredentials: true })
    console.log("RESPONSE:", resp.data);
     // ⭐ NAVIGATE TO HOME AFTER REGISTRATION
     navigate('/login')
}
    const fields = [
        {name:"name", type:"text", placeholder:"Full Name"},
        {name:"email", type:"email", placeholder:"Email"},
        {name:"password", type:"password", placeholder:"Password"}

    ];

    return (
        <AuthForm
            title="User Register"
            fields={fields}
            buttonText="Create Account"
            onSubmit={handleSubmit}
        />
    );
}

export default UserRegister;
