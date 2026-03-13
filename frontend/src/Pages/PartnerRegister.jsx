import React from "react";
import AuthForm from "../components/AuthForm";
import axios from "axios";
import Home from '../General/LandingPage';
import FoodHome from '../Pages/FoodPartnerHomePage';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PartnerRegister(){
    const navigate = useNavigate();
const [error, setError] = useState("");
    const fields = [
        {name:"name", type:"text", placeholder:"Name"},
        {name:"email", type:"email", placeholder:"College Email"},
        {name:"password", type:"password", placeholder:"Password"},
        {name:"image", type:"file", placeholder:"Upload Image "},{name:"InstagramHandle", type:"text", placeholder:"Enter Instagram User"},
    ];
   const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const password = formData.get("password");
  const image = formData.get("image");
  let instagramHandle = formData.get("InstagramHandle").replace("@", "").trim();
  if(name==='' || email === '' || password === '' || instagramHandle === ''|| !image) {
    setError("All fields are required.");
    return;
  }

  // NAME VALIDATION
  if (name.length < 2) {
    setError("Name must be at least 2 characters long.");
    return;
  }

  // EMAIL VALIDATION
  const emailRegex = /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/;

  if (!emailRegex.test(email)) {
    setError("Only valid VIT Bhopal emails (@vitbhopal.ac.in) allowed.");
    return;
  }


  // IMAGE VALIDATION
  if (!image || image.size === 0) {
    setError("Profile image is required.");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(image.type)) {
    setError("Only JPG, PNG or WEBP images allowed.");
    return;
  }

  // IMAGE SIZE LIMIT (2MB)
  if (image.size > 2 * 1024 * 1024) {
    setError("Image must be smaller than 2MB.");
    return;
  }

  // INSTAGRAM VALIDATION
  const instaRegex = /^[a-zA-Z0-9._]{3,30}$/;

  if (!instaRegex.test(instagramHandle)) {
    setError("Enter a valid Instagram username (letters, numbers, . or _)");
    return;
  }

  formData.set("InstagramHandle", instagramHandle);

  setError("");

  try {
    await axios.post(
      "http://localhost:3000/api/auth/partner/register",
      formData,
      { withCredentials: true }
    );

    navigate("/partner/login");

  } catch (err) {
    console.error("Registration failed:", err.response?.data);
    setError(err.response?.data?.message || "An error occurred during registration.");
  }
};

    return (
        <AuthForm
            title ="Model Register"
            fields={fields}
            buttonText="Register Model"
            onSubmit={handleSubmit}
            error={error}
        />
    );
}

export default PartnerRegister;
