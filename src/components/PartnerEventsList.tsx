import React, { useEffect, useState } from 'react';
import { getPartnerEvents } from '../services/partnerService';

interface PartnerEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url?: string;
  partner_id: string;
}

const PartnerEventsList: React.FC = () => {
  const [events, setEvents] = useState<PartnerEvent[]>([]);
  useEffect(() => {
    getPartnerEvents().then(({ data }) => {
      if (Array.isArray(data)) {
        const records = (data as any[]) || [];
        setEvents(records.map((e: any) => ({
          id: e.id,
          title: e.title ?? e.name ?? 'Partner Event',
          description: e.description ?? '',
          event_date: e.event_date ?? e.date ?? e.created_at ?? '',
          location: e.location ?? e.venue ?? '',
          image_url: e.image_url ?? e.featured_image_url ?? undefined,
          partner_id: e.partner_id ?? e.user_id ?? ''
        })));
      } else {
        setEvents([]);
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map(event => (
        <div key={event.id} className="border rounded-lg p-4 bg-white shadow">
          <h3 className="font-bold text-lg mb-1">{event.title}</h3>
          <div className="text-sm text-muted-foreground mb-2">{event.event_date} &bull; {event.location}</div>
          <p className="mb-2">{event.description}</p>
          {event.image_url && <img src={event.image_url} alt={event.title} className="h-32 object-cover rounded" />}
        </div>
      ))}
    </div>
  );
};

export default PartnerEventsList;
