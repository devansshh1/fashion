import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import API from "../api/API";
import { AuthContext } from "../context/AuthContext";
import { authSession } from "../auth/sessionStorage";

function UserRegister() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    setError("");

    try {
      const resp = await API.post("/api/auth/user/register", {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
      });

      authSession.setUserToken(resp.data.token);
      setUser(resp.data);
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to register right now";
      setError(message);
    }
  };

  const fields = [
    { name: "name", type: "text", placeholder: "Name" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "password", type: "password", placeholder: "Password" }
  ];

  return (
    <AuthForm
      title="User Register"
      fields={fields}
      buttonText="Create Account"
      onSubmit={handleSubmit}
      error={error}
      footer={
        <p>
          Already signed in? <Link to="/user/login">Sign in</Link>
        </p>
      }
    />
  );
}

export default UserRegister;
