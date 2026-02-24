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
    ];
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            customersServed:formData.get('customersServed'),
            totalMeals:formData.get('totalMeals'),
             address:formData.get('address')

        };
        const resp = await axios.post('http://localhost:3000/api/auth/partner/register', data, { withCredentials: true });
        if (resp.status === 400||resp.status === 500) {
           console.error("Registration failed:", resp.data);
            return;
             // Redirect to food partner home page on successful registration
        }
        navigate('/partner/login');
        console.log("RESPONSE:", resp.data);
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
