import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import API from "../api/API";

function PartnerLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    };

    try {
      setError("");

      const resp = await API.post("/api/auth/partner/login", {
        email: data.email,
        password: data.password
      });

      if (resp.status === 200) {
        const authRes = await API.get("/api/partner/check-auth");
        const verifiedPartnerId = authRes.data.partner?.id;

        if (!authRes.data.loggedIn || !verifiedPartnerId) {
          throw new Error("Partner session cookie was not created.");
        }

        localStorage.setItem("partnerId", verifiedPartnerId);
        localStorage.setItem("isPartnerLoggedIn", "true");
        navigate(`/partner/dashboard/${verifiedPartnerId}`);
      }
    } catch (err) {
      console.log("Partner login failed:", err);
      localStorage.removeItem("partnerId");
      localStorage.removeItem("isPartnerLoggedIn");
      setError(
        err.response?.data?.message ||
          "Login worked, but your partner session is not available yet. Please try again."
      );
    }
  };

  const fields = [
    { name: "email", type: "email", placeholder: "Business Email" },
    { name: "password", type: "password", placeholder: "Password" }
  ];

  return (
    <AuthForm
      title="Model Login"
      fields={fields}
      buttonText="Login"
      onSubmit={handleSubmit}
      error={error}
    />
  );
}

export default PartnerLogin;
