import React, { useEffect, useState } from "react";
import ReelCard from '../components/ReelCard'; // adjust path if needed
import API from "../api/API";

function Saved(){

    const [savedFoods, setSavedFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchSavedFoods = async () => {

            try{

                const res = await API.get("/api/food/saved");

                setSavedFoods(res.data);

            }catch(err){

                console.error(
                    err.response?.data || err.message
                );

            }finally{
                setLoading(false);
            }
        };

        fetchSavedFoods();

    }, []);

    // ⭐ Loading State
    if(loading){
        return <h2 style={{color:"white",background:"black"}}>Loading saved reels...</h2>;
    }

    // ⭐ Empty State (VERY important UX)
    if(savedFoods.length === 0){
        return <h2 style={{color:"white",background:"black"}}>No saved reels yet 🙂</h2>;
    }

    return (

        <div className="reel-container">

            {savedFoods.map(food => (
                <ReelCard
                    key={food._id}
                    videoData={food}
                />
            ))}

        </div>
    );
}

export default Saved;
