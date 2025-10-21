import React from 'react';
import PartnerEventsList from '../components/PartnerEventsList';

const PartnerDashboard: React.FC = () => {
  // TODO: Fetch partner info, allow editing company details, add/edit events
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Partner Dashboard</h1>
      <p className="mb-6 text-muted-foreground">Manage your company profile and events.</p>
      {/* TODO: Add PartnerProfileForm for editing company details */}
      {/* TODO: Add PartnerEventForm for adding/editing events */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Your Events</h2>
        <PartnerEventsList />
      </div>
    </div>
  );
};

export default PartnerDashboard;
