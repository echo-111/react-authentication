import React from 'react';
import { Navigate } from 'react-router-dom';

const Dashboard = function Dashboard({
  user,
}) {
  if (!user) {
    return (
      <Navigate to="*" />
    );
  }

  return (
    <div>{user.email}</div>
  );
};

export default Dashboard;