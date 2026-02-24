import React from "react";

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-cards">
      <div className="stats-card">
        <strong>{stats.total}</strong>
        <span>Total Tasks</span>
      </div>
      <div className="stats-card">
        <strong>{stats.active}</strong>
        <span>Active</span>
      </div>
      <div className="stats-card">
        <strong>{stats.completed}</strong>
        <span>Completed</span>
      </div>
    </div>
  );
};

export default StatsCards;