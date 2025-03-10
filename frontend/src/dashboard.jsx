import React from "react";
import ExchangeSkill from "./ExchangeSkill";  // ✅ Correct Import

const Dashboard = () => {
  const userId = 1; // Replace with actual logged-in user ID

  return (
    <div>
      <h1>Welcome to Skill Exchange</h1>
      <ExchangeSkill userId={userId} />  {/* ✅ This should render the component */}
    </div>
  );
};

export default Dashboard;
