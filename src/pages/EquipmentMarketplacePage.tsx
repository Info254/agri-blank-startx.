import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Settings,
  MapPin, 
  DollarSign,
  Calendar,
  Plus,
  Eye,
  Star,
  Phone,
  Mail
} from 'lucide-react';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';

interface Equipment {
  id: string;
  equipment_name: string;
  equipment_type: string;
  brand: string;
  model: string;
  year_manufactured: number;
  condition: string;
  price: number;
  currency: string;
  negotiable: boolean;
  location: string;
  county: string;
  description: string;
  specifications: any;
  images: string[];
  availability_status: string;
  rental_option: boolean;
  rental_price_per_day: number;
  contact_phone: string;
  contact_email: string;
  tags: string[];
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

const EquipmentMarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  const [equipmentForm, setEquipmentForm] = useState({
    equipment_name: '',
    equipment_type: 'Tractor',
    brand: '',
    model: '',
    year_manufactured: new Date().getFullYear(),
    condition: 'Good',
    price: 0,
    negotiable: true,
    location: '',
    county: '',
    description: '',
    specifications: '',
    rental_option: false,
    rental_price_per_day: 0,
    contact_phone: '',
    contact_email: '',
    tags: ''
  });

  const equipmentTypes = [
    'Tractor', 'Plough', 'Harvester', 'Planter', 'Cultivator', 'Sprayer',
    'Irrigation Equipment', 'Generator', 'Water Pump', 'Thresher',
    'Disc Harrow', 'Mower', 'Baler', 'Transplanter', 'Other'
  ];

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipment_marketplace')
        .select('*')
        .eq('availability_status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch equipment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to list equipment",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const specifications = equipmentForm.specifications ? 
        JSON.parse(equipmentForm.specifications) : {};

      const { error } = await supabase
        .from('equipment_marketplace')
        .insert({
          seller_id: user.id,
          equipment_name: equipmentForm.equipment_name,
          equipment_type: equipmentForm.equipment_type,
          brand: equipmentForm.brand,
          model: equipmentForm.model,
          year_manufactured: equipmentForm.year_manufactured,
          condition: equipmentForm.condition,
          price: equipmentForm.price,
          negotiable: equipmentForm.negotiable,
          location: equipmentForm.location,
          county: equipmentForm.county,
          description: equipmentForm.description,
          specifications,
          rental_option: equipmentForm.rental_option,
          rental_price_per_day: equipmentForm.rental_price_per_day,
          contact_phone: equipmentForm.contact_phone,
          contact_email: equipmentForm.contact_email,
          tags: equipmentForm.tags.split(',').map(t => t.trim())
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Equipment has been listed successfully!",
      });

      setShowAddForm(false);
      setEquipmentForm({
        equipment_name: '',
        equipment_type: 'Tractor',
        brand: '',
        model: '',
        year_manufactured: new Date().getFullYear(),
        condition: 'Good',
        price: 0,
        negotiable: true,
        location: '',
        county: '',
        description: '',
        specifications: '',
        rental_option: false,
        rental_price_per_day: 0,
        contact_phone: '',
        contact_email: '',
        tags: ''
      });
      
      fetchEquipment();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to list equipment",
        variant: "destructive",
      });
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = searchFilter === '' || 
      item.equipment_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.model.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesType = typeFilter === '' || item.equipment_type === typeFilter;
    
    const matchesLocation = locationFilter === '' ||
      item.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
      item.county.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Equipment Marketplace</h1>
          <p className="text-muted-foreground">
            Buy, sell, and rent agricultural equipment from trusted sellers
          </p>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search equipment, brand, or model..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Types</option>
            {equipmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            List Equipment
          </Button>
        </div>

        {/* Add Equipment Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>List Agricultural Equipment</CardTitle>
              <CardDescription>
                List your agricultural equipment for sale or rent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEquipment} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="equipment_name">Equipment Name *</Label>
                    <Input
                      id="equipment_name"
                      placeholder="e.g., John Deere 5045D Tractor"
                      value={equipmentForm.equipment_name}
                      onChange={(e) => setEquipmentForm({...equipmentForm, equipment_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="equipment_type">Equipment Type *</Label>
                    <select
                      id="equipment_type"
                      value={equipmentForm.equipment_type}
                      onChange={(e) => setEquipmentForm({...equipmentForm, equipment_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      {equipmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., John Deere, Massey Ferguson"
                      value={equipmentForm.brand}
                      onChange={(e) => setEquipmentForm({...equipmentForm, brand: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., 5045D, MF 385"
                      value={equipmentForm.model}
                      onChange={(e) => setEquipmentForm({...equipmentForm, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year_manufactured">Year Manufactured</Label>
                    <Input
                      id="year_manufactured"
                      type="number"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={equipmentForm.year_manufactured}
                      onChange={(e) => setEquipmentForm({...equipmentForm, year_manufactured: parseInt(e.target.value) || new Date().getFullYear()})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <select
                      id="condition"
                      value={equipmentForm.condition}
                      onChange={(e) => setEquipmentForm({...equipmentForm, condition: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="New">New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={equipmentForm.location}
                      onChange={(e) => setEquipmentForm({...equipmentForm, location: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Input
                      id="county"
                      value={equipmentForm.county}
                      onChange={(e) => setEquipmentForm({...equipmentForm, county: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Sale Price (KES) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={equipmentForm.price}
                      onChange={(e) => setEquipmentForm({...equipmentForm, price: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="negotiable"
                      checked={equipmentForm.negotiable}
                      onChange={(e) => setEquipmentForm({...equipmentForm, negotiable: e.target.checked})}
                    />
                    <Label htmlFor="negotiable">Price Negotiable</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="rental_option"
                      checked={equipmentForm.rental_option}
                      onChange={(e) => setEquipmentForm({...equipmentForm, rental_option: e.target.checked})}
                    />
                    <Label htmlFor="rental_option">Available for Rent</Label>
                  </div>
                </div>

                {equipmentForm.rental_option && (
                  <div>
                    <Label htmlFor="rental_price_per_day">Rental Price per Day (KES)</Label>
                    <Input
                      id="rental_price_per_day"
                      type="number"
                      min="0"
                      step="0.01"
                      value={equipmentForm.rental_price_per_day}
                      onChange={(e) => setEquipmentForm({...equipmentForm, rental_price_per_day: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                )}

                {/* Description and Specifications */}
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the equipment condition, features, and any additional information"
                    value={equipmentForm.description}
                    onChange={(e) => setEquipmentForm({...equipmentForm, description: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="specifications">Specifications (JSON format)</Label>
                  <Textarea
                    id="specifications"
                    placeholder='{"horsepower": "45 HP", "fuel_type": "Diesel", "transmission": "Manual"}'
                    value={equipmentForm.specifications}
                    onChange={(e) => setEquipmentForm({...equipmentForm, specifications: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., hydraulic, 4WD, low hours, serviced"
                    value={equipmentForm.tags}
                    onChange={(e) => setEquipmentForm({...equipmentForm, tags: e.target.value})}
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={equipmentForm.contact_phone}
                      onChange={(e) => setEquipmentForm({...equipmentForm, contact_phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={equipmentForm.contact_email}
                      onChange={(e) => setEquipmentForm({...equipmentForm, contact_email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">List Equipment</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.equipment_name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Settings className="h-4 w-4 mr-1" />
                      {item.equipment_type}
                    </CardDescription>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {item.location}, {item.county}
                    </CardDescription>
                  </div>
                  {item.is_featured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="text-lg font-semibold text-green-600">
                  KES {item.price.toLocaleString()}
                  {item.negotiable && <span className="text-sm text-muted-foreground ml-1">(Negotiable)</span>}
                </div>
                
                {item.rental_option && item.rental_price_per_day > 0 && (
                  <div className="text-sm text-blue-600">
                    Rent: KES {item.rental_price_per_day.toLocaleString()}/day
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {item.brand && (
                    <div>
                      <strong>Brand:</strong> {item.brand}
                    </div>
                  )}
                  {item.year_manufactured && (
                    <div>
                      <strong>Year:</strong> {item.year_manufactured}
                    </div>
                  )}
                </div>
                
                <div className="text-sm">
                  <strong>Condition:</strong> 
                  <Badge 
                    variant={item.condition === 'New' || item.condition === 'Excellent' ? 'default' : 'outline'}
                    className="ml-1"
                  >
                    {item.condition}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description}
                </p>
                
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {item.contact_phone && (
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Equipment Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchFilter || typeFilter || locationFilter ? 
                  'No equipment matches your search criteria. Try adjusting your filters.' :
                  'Be the first to list agricultural equipment!'
                }
              </p>
              {!searchFilter && !typeFilter && !locationFilter && (
                <Button onClick={() => setShowAddForm(true)}>
                  List First Equipment
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNavigation />
    </div>
  );
};

export default EquipmentMarketplacePage;