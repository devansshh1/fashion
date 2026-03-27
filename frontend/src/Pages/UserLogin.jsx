import React, { useContext } from "react";
import AuthForm from "../components/AuthForm";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/API";

function UserLogin(){

    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useContext(AuthContext);
    const redirectTo = location.state?.redirectTo || "/";

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

            setUser(resp.data);

            navigate(redirectTo, { replace: true });
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
            footer={
                <p>
                    New User ? <Link to="/user/register">Register</Link> 
                    <br />
                   Model ? <Link to="/partner/login" state={{ redirectTo }}>Log In</Link> | <Link to="/partner/register"> Register</Link>
                </p>
            }
        />
    );
}

export default UserLogin;
