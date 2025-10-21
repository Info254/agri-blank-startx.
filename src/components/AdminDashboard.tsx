import React from 'react';

interface AdminDashboardProps {
  isAdmin?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isAdmin }) => {
  return (
    <section aria-labelledby="admin-dashboard-title">
      <h1 id="admin-dashboard-title">Admin Dashboard</h1>
      <p>{isAdmin ? 'You have admin access.' : 'Admin view placeholder.'}</p>
    </section>
  );
};

export default AdminDashboard;
