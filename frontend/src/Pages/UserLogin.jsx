import React, { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/API";

function UserLogin(){

    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);   // 🔥 ADD THIS

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const resp = await API.post(
            '/api/auth/user/login',
            {
                email: formData.get('email'),
                password: formData.get('password')
            }
        );

        if (resp.status === 200) {

            setUser(resp.data);   // 🔥 VERY IMPORTANT LINE

            navigate('/');        // Go to home
        }
    };

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
