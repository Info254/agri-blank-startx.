import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Building, 
  Star, 
  Phone, 
  Mail, 
  Globe,
  Plus,
  Eye,
  Edit,
  Camera
} from 'lucide-react';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';

interface FarmHost {
  id: string;
  farm_name: string;
  description: string;
  location: string;
  county: string;
  crops: string[];
  livestock: string[];
  business_type: string;
  contact_phone: string;
  contact_email: string;
  website_url: string;
  amenities: string[];
  rating: number;
  total_reviews: number;
  image_urls: string[];
}

interface AgriEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  location: string;
  county: string;
  start_date: string;
  end_date: string;
  entry_fee: number;
  currency: string;
  poster_url: string;
  contact_info: any;
  tags: string[];
}

interface Organization {
  id: string;
  name: string;
  description: string;
  organization_type: string;
  location: string;
  contact_phone: string;
  contact_email: string;
  website_url: string;
  services: string[];
  focus_areas: string[];
  logo_url: string;
  rating: number;
  total_reviews: number;
}

const FarmTourismPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('hosts');
  const [farmHosts, setFarmHosts] = useState<FarmHost[]>([]);
  const [events, setEvents] = useState<AgriEvent[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [farmForm, setFarmForm] = useState({
    farm_name: '',
    description: '',
    location: '',
    county: '',
    crops: '',
    livestock: '',
    business_type: '',
    contact_phone: '',
    contact_email: '',
    website_url: '',
    amenities: ''
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_type: '',
    location: '',
    county: '',
    start_date: '',
    end_date: '',
    entry_fee: 0,
    poster_url: '',
    contact_phone: '',
    contact_email: '',
    requirements: '',
    tags: ''
  });

  const [orgForm, setOrgForm] = useState({
    name: '',
    description: '',
    organization_type: '',
    location: '',
    contact_phone: '',
    contact_email: '',
    website_url: '',
    services: '',
    focus_areas: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch farm tourism hosts
      const { data: hostsData, error: hostsError } = await supabase
        .from('farm_tourism_hosts')
        .select('*')
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      if (hostsError) throw hostsError;
      setFarmHosts(hostsData || []);

      // Fetch agricultural events
      const { data: eventsData, error: eventsError } = await supabase
        .from('agricultural_events')
        .select('*')
        .eq('status', 'upcoming')
        .gte('start_date', new Date().toISOString())
        .order('start_date');

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Fetch agricultural organizations
      const { data: orgsData, error: orgsError } = await supabase
        .from('agricultural_organizations')
        .select('*')
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      if (orgsError) throw orgsError;
      setOrganizations(orgsData || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFarmHost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add your farm for tourism",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('farm_tourism_hosts')
        .insert({
          host_id: user.id,
          farm_name: farmForm.farm_name,
          description: farmForm.description,
          location: farmForm.location,
          county: farmForm.county,
          crops: farmForm.crops.split(',').map(c => c.trim()),
          livestock: farmForm.livestock.split(',').map(l => l.trim()),
          business_type: farmForm.business_type,
          contact_phone: farmForm.contact_phone,
          contact_email: farmForm.contact_email,
          website_url: farmForm.website_url,
          amenities: farmForm.amenities.split(',').map(a => a.trim())
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your farm has been submitted for verification. You'll be notified once approved.",
      });

      setShowAddForm(false);
      setFarmForm({
        farm_name: '',
        description: '',
        location: '',
        county: '',
        crops: '',
        livestock: '',
        business_type: '',
        contact_phone: '',
        contact_email: '',
        website_url: '',
        amenities: ''
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add farm",
        variant: "destructive",
      });
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add events",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('agricultural_events')
        .insert({
          organizer_id: user.id,
          title: eventForm.title,
          description: eventForm.description,
          event_type: eventForm.event_type,
          location: eventForm.location,
          county: eventForm.county,
          start_date: eventForm.start_date,
          end_date: eventForm.end_date,
          entry_fee: eventForm.entry_fee,
          poster_url: eventForm.poster_url,
          contact_info: {
            phone: eventForm.contact_phone,
            email: eventForm.contact_email
          },
          tags: eventForm.tags.split(',').map(t => t.trim()),
          requirements: eventForm.requirements
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your event has been added successfully!",
      });

      setShowAddForm(false);
      fetchData();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add event",
        variant: "destructive",
      });
    }
  };

  const handleAddOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to suggest organizations",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('agricultural_organizations')
        .insert({
          name: orgForm.name,
          description: orgForm.description,
          organization_type: orgForm.organization_type,
          location: orgForm.location,
          contact_phone: orgForm.contact_phone,
          contact_email: orgForm.contact_email,
          website_url: orgForm.website_url,
          services: orgForm.services.split(',').map(s => s.trim()),
          focus_areas: orgForm.focus_areas.split(',').map(f => f.trim())
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Organization has been submitted for verification. Thank you for your contribution!",
      });

      setShowAddForm(false);
      setOrgForm({
        name: '',
        description: '',
        organization_type: '',
        location: '',
        contact_phone: '',
        contact_email: '',
        website_url: '',
        services: '',
        focus_areas: ''
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add organization",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Agricultural Tourism & Resources</h1>
          <p className="text-muted-foreground">
            Discover farm tourism opportunities, agricultural events, and connect with organizations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hosts">Farm Tourism</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
          </TabsList>

          <TabsContent value="hosts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Farm Tourism Hosts</h2>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your Farm
              </Button>
            </div>

            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Your Farm for Tourism</CardTitle>
                  <CardDescription>
                    Share your farm experience with visitors and tourists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddFarmHost} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="farm_name">Farm Name *</Label>
                        <Input
                          id="farm_name"
                          value={farmForm.farm_name}
                          onChange={(e) => setFarmForm({...farmForm, farm_name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="business_type">Business Type *</Label>
                        <Input
                          id="business_type"
                          placeholder="e.g., Organic Farm, Dairy Farm, Agritourism"
                          value={farmForm.business_type}
                          onChange={(e) => setFarmForm({...farmForm, business_type: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={farmForm.location}
                          onChange={(e) => setFarmForm({...farmForm, location: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County *</Label>
                        <Input
                          id="county"
                          value={farmForm.county}
                          onChange={(e) => setFarmForm({...farmForm, county: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="crops">Crops (comma-separated)</Label>
                        <Input
                          id="crops"
                          placeholder="e.g., Maize, Beans, Coffee"
                          value={farmForm.crops}
                          onChange={(e) => setFarmForm({...farmForm, crops: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="livestock">Livestock (comma-separated)</Label>
                        <Input
                          id="livestock"
                          placeholder="e.g., Cattle, Poultry, Goats"
                          value={farmForm.livestock}
                          onChange={(e) => setFarmForm({...farmForm, livestock: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_phone">Contact Phone</Label>
                        <Input
                          id="contact_phone"
                          value={farmForm.contact_phone}
                          onChange={(e) => setFarmForm({...farmForm, contact_phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact_email">Contact Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={farmForm.contact_email}
                          onChange={(e) => setFarmForm({...farmForm, contact_email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your farm, activities, and what visitors can expect"
                        value={farmForm.description}
                        onChange={(e) => setFarmForm({...farmForm, description: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                      <Input
                        id="amenities"
                        placeholder="e.g., Parking, Restrooms, Guided Tours, Farm Store"
                        value={farmForm.amenities}
                        onChange={(e) => setFarmForm({...farmForm, amenities: e.target.value})}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Submit for Review</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmHosts.map((host) => (
                <Card key={host.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{host.farm_name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {host.location}, {host.county}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{host.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{host.business_type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {host.description}
                    </p>
                    
                    {host.crops.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Crops: </span>
                        <span className="text-sm text-muted-foreground">
                          {host.crops.slice(0, 3).join(', ')}
                          {host.crops.length > 3 && '...'}
                        </span>
                      </div>
                    )}
                    
                    {host.livestock.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm font-medium">Livestock: </span>
                        <span className="text-sm text-muted-foreground">
                          {host.livestock.slice(0, 3).join(', ')}
                          {host.livestock.length > 3 && '...'}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {host.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {host.contact_phone && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      )}
                      {host.contact_email && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Agricultural Events</h2>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>

            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Agricultural Event</CardTitle>
                  <CardDescription>
                    Share your agricultural event with the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event_title">Event Title *</Label>
                        <Input
                          id="event_title"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="event_type">Event Type *</Label>
                        <Input
                          id="event_type"
                          placeholder="e.g., Workshop, Conference, Field Day"
                          value={eventForm.event_type}
                          onChange={(e) => setEventForm({...eventForm, event_type: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="event_location">Location *</Label>
                        <Input
                          id="event_location"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="event_county">County *</Label>
                        <Input
                          id="event_county"
                          value={eventForm.county}
                          onChange={(e) => setEventForm({...eventForm, county: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="start_date">Start Date *</Label>
                        <Input
                          id="start_date"
                          type="datetime-local"
                          value={eventForm.start_date}
                          onChange={(e) => setEventForm({...eventForm, start_date: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_date">End Date *</Label>
                        <Input
                          id="end_date"
                          type="datetime-local"
                          value={eventForm.end_date}
                          onChange={(e) => setEventForm({...eventForm, end_date: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="entry_fee">Entry Fee (KES)</Label>
                        <Input
                          id="entry_fee"
                          type="number"
                          min="0"
                          value={eventForm.entry_fee}
                          onChange={(e) => setEventForm({...eventForm, entry_fee: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="poster_url">Poster Image URL</Label>
                        <Input
                          id="poster_url"
                          type="url"
                          value={eventForm.poster_url}
                          onChange={(e) => setEventForm({...eventForm, poster_url: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="event_description">Description *</Label>
                      <Textarea
                        id="event_description"
                        placeholder="Describe the event, agenda, and what participants will learn"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Add Event</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  {event.poster_url && (
                    <div className="h-48 bg-cover bg-center" style={{backgroundImage: `url(${event.poster_url})`}} />
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}, {event.county}
                    </CardDescription>
                    <Badge variant="outline">{event.event_type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </div>
                      {event.entry_fee > 0 && (
                        <div className="text-sm font-medium text-green-600">
                          Entry Fee: {event.currency} {event.entry_fee}
                        </div>
                      )}
                      {event.entry_fee === 0 && (
                        <div className="text-sm font-medium text-green-600">
                          Free Event
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Agricultural Organizations</h2>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Suggest Organization
              </Button>
            </div>

            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Suggest Agricultural Organization</CardTitle>
                  <CardDescription>
                    Help others discover valuable agricultural organizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddOrganization} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="org_name">Organization Name *</Label>
                        <Input
                          id="org_name"
                          value={orgForm.name}
                          onChange={(e) => setOrgForm({...orgForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="org_type">Organization Type *</Label>
                        <Input
                          id="org_type"
                          placeholder="e.g., NGO, Government Agency, Cooperative"
                          value={orgForm.organization_type}
                          onChange={(e) => setOrgForm({...orgForm, organization_type: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="org_location">Location *</Label>
                        <Input
                          id="org_location"
                          value={orgForm.location}
                          onChange={(e) => setOrgForm({...orgForm, location: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="org_phone">Contact Phone</Label>
                        <Input
                          id="org_phone"
                          value={orgForm.contact_phone}
                          onChange={(e) => setOrgForm({...orgForm, contact_phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="org_email">Contact Email</Label>
                        <Input
                          id="org_email"
                          type="email"
                          value={orgForm.contact_email}
                          onChange={(e) => setOrgForm({...orgForm, contact_email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="org_website">Website URL</Label>
                        <Input
                          id="org_website"
                          type="url"
                          value={orgForm.website_url}
                          onChange={(e) => setOrgForm({...orgForm, website_url: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="org_description">Description *</Label>
                      <Textarea
                        id="org_description"
                        placeholder="Describe the organization's mission and activities"
                        value={orgForm.description}
                        onChange={(e) => setOrgForm({...orgForm, description: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="org_services">Services (comma-separated)</Label>
                      <Input
                        id="org_services"
                        placeholder="e.g., Training, Funding, Technical Support"
                        value={orgForm.services}
                        onChange={(e) => setOrgForm({...orgForm, services: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="org_focus">Focus Areas (comma-separated)</Label>
                      <Input
                        id="org_focus"
                        placeholder="e.g., Crop Production, Livestock, Technology"
                        value={orgForm.focus_areas}
                        onChange={(e) => setOrgForm({...orgForm, focus_areas: e.target.value})}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">Submit for Review</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card key={org.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          {org.organization_type}
                        </CardDescription>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {org.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{org.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {org.description}
                    </p>
                    
                    {org.services.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm font-medium">Services: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {org.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {org.contact_phone && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      )}
                      {org.website_url && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Globe className="h-4 w-4 mr-1" />
                          Visit
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default FarmTourismPage;