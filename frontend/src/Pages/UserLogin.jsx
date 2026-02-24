import React from "react";
import AuthForm from "../components/AuthForm";
import axios from "axios";  
import Home from '../General/LandingPage';
import { useNavigate } from "react-router-dom";

function UserLogin(){
    const navigate = useNavigate(); 
    // ⭐ ADD THIS
   
const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
   const resp= await axios.post('http://localhost:3000/api/auth/user/login'
,{
        email: data.email,
        password: data.password 
    }, { withCredentials: true })

                    if (resp.status === 200) {

                              navigate('/user/dashboard/' + resp.data._id); // Redirect to user dashboard on successful login
    }
    console.log("RESPONSE:", resp.data);
}

    const fields = [
    {name:"email", type:"email", placeholder:"Email"},
    {name:"password", type:"password", placeholder:"Password"}
];


    return (
        <AuthForm
            title="User Login"
            fields={fields}
            buttonText="Login"
            onSubmit={handleSubmit}
        />
    );
}


export default UserLogin;
