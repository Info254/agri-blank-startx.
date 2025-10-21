import React from 'react';
import PartnerWithUsForm from '@/components/PartnerWithUsForm';
import PartnerEventsList from '@/components/PartnerEventsList';

const PartnerWithUs: React.FC = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-4">Partner With Us</h1>
    <p className="mb-6 text-muted-foreground">
      Submit your organization to collaborate, host events, and reach the agri-community. 
      For inquiries, contact us at{' '}
      <a href="mailto:sokoconnect@tenderzville-portal.co.ke" className="text-primary hover:underline">
        sokoconnect@tenderzville-portal.co.ke
      </a>
    </p>
    <PartnerWithUsForm />
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-2">Upcoming & Past Partner Events</h2>
      <PartnerEventsList />
    </div>
  </div>
);

export default PartnerWithUs;
