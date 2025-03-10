import React, { useState, useEffect } from "react";
import axios from "axios";

const ExchangeSkill = ({ userId }) => {
    const [skills, setSkills] = useState([]); // All available skills
    const [selectedSkill, setSelectedSkill] = useState(""); // Selected skill for exchange
    const [receiverId, setReceiverId] = useState(""); // Receiver's ID
    const [message, setMessage] = useState(""); // Success/error message
    const [loading, setLoading] = useState(false); // Loading state
    const [userProfile, setUserProfile] = useState({}); // User's profile data (name, skills, credits)

    // Fetch user profile and skills on component mount
    useEffect(() => {
        // Fetch user profile data
        axios.get(`/api/user/${userId}/`)
            .then(response => {
                console.log("User Profile API Response:", response.data);
                setUserProfile(response.data);
            })
            .catch(error => {
                console.error("Error fetching user profile:", error);
                setUserProfile({});
            });

        // Fetch all available skills
        axios.get("/api/skills/")
            .then(response => {
                console.log("Skills API Response:", response.data);
                setSkills(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => {
                console.error("Error fetching skills:", error);
                setSkills([]);
            });
    }, [userId]);

    // Handle skill exchange
    const handleExchange = () => {
        if (!selectedSkill || !receiverId) {
            setMessage("❌ Please select a skill and enter a receiver ID.");
            return;
        }

        setLoading(true);
        axios.post("/exchange-skill/", {
            skill_id: selectedSkill,
            receiver_id: receiverId
        }, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
        .then(response => {
            setMessage(`✅ Transaction Successful! ${response.data.message}`);
            // Refresh user profile data after transaction
            axios.get(`/api/user/${userId}/`)
                .then(res => setUserProfile(res.data))
                .catch(err => console.error("Error updating user profile:", err));
            setSelectedSkill("");
            setReceiverId("");
        })
        .catch(error => {
            setMessage(`❌ Transaction Failed: ${error.response?.data?.error || "Server error"}`);
        })
        .finally(() => setLoading(false));
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-center mb-4">Exchange a Skill</h2>

            {/* Display User's Profile Information */}
            <div className="text-center mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="font-semibold"> Name: <span className="text-blue-600">{userProfile.username || "Loading..."}</span></p>
                <p className="font-semibold"> Credits: <span className="text-blue-600">{userProfile.profile?.credits || 0}</span></p>
                <p className="font-semibold"> Skills:</p>
                <ul className="list-disc list-inside">
                    {userProfile.profile?.skills?.map((skill, index) => (
                        <li key={index}>{skill.name} ({skill.points_cost} credits)</li>
                    ))}
                </ul>
            </div>

            {/* Skill Selection */}
            <label className="block font-medium">Select Skill:</label>
            <select 
                className="w-full p-2 border rounded mb-3"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
            >
                <option value=""> Choose Skill </option>
                {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                        {skill.name} ({skill.points_cost} points)
                    </option>
                ))}
            </select>

            {/* Receiver's ID Input */}
            <label className="block font-medium">Receiver's ID:</label>
            <input
                type="text"
                className="w-full p-2 border rounded mb-3"
                placeholder="Receiver ID"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
            />

            {/* Exchange Button */}
            <button 
                onClick={handleExchange} 
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                disabled={loading}
            >
                {loading ? "Processing..." : "Exchange Skill"}
            </button>

            {/* Success/Error Message */}
            {message && <p className="mt-4 text-center font-medium">{message}</p>}
        </div>
    );
};

export default ExchangeSkill;