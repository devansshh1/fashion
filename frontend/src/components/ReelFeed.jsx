import React, { useEffect, useState } from "react";
import ReelCard from "./ReelCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
function ReelFeed() {
    const [foods, setFoods] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchFoods = async () => {
            try {

                const resp = await axios.get(
                    "http://localhost:3000/api/food",
                    { withCredentials: true }
                );
                console.log(resp.data);

                // Your API returns { foods: [...] }
                setFoods(resp.data.foods);

            } catch (err) {
                console.error("ERROR FETCHING FOOD:", err);
            }
        };

        fetchFoods();

    }, []);

    return (
        <div className="reel-container">
            {foods.map((food) => (
                <ReelCard
                    key={food._id}
                    onClick={() => {
                        navigate(`/partner/${food.foodPartnerId}`);
                    }}
                    videoData={food}
                />
            ))}
            <BottomNav />
            
        </div>

    );
}

export default ReelFeed;
