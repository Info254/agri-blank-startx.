import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, MapPin, Phone, Mail, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Equipment {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  category: string;
  available_for: string[] | null;
  price: number | null;
  location: string | null;
  county: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  is_active: boolean;
  created_at: string;
}

const EquipmentMarketplace: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    description: '',
    category: 'Tractors',
    available_for: [] as string[],
    price: '',
    location: '',
    county: '',
    contact_phone: '',
    contact_email: ''
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function fetchEquipment() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('equipment_marketplace')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateEquipment = async () => {
    if (!user) {
      toast({ title: 'Please login to list equipment', variant: 'destructive' });
      return;
    }

    if (!newEquipment.name || !newEquipment.category) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('equipment_marketplace').insert({
        owner_id: user.id,
        name: newEquipment.name,
        description: newEquipment.description || null,
        category: newEquipment.category,
        available_for: newEquipment.available_for.length > 0 ? newEquipment.available_for : null,
        price: newEquipment.price ? parseFloat(newEquipment.price) : null,
        location: newEquipment.location || null,
        county: newEquipment.county || null,
        contact_phone: newEquipment.contact_phone || null,
        contact_email: newEquipment.contact_email || null,
        is_active: true
      });

      if (error) throw error;

      toast({ title: 'Equipment listed successfully!' });
      setIsDialogOpen(false);
      setNewEquipment({
        name: '', description: '', category: 'Tractors', available_for: [],
        price: '', location: '', county: '', contact_phone: '', contact_email: ''
      });
      fetchEquipment();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase.from('equipment_marketplace').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Equipment removed' });
      fetchEquipment();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const toggleAvailableFor = (type: string) => {
    setNewEquipment(prev => ({
      ...prev,
      available_for: prev.available_for.includes(type)
        ? prev.available_for.filter(t => t !== type)
        : [...prev.available_for, type]
    }));
  };

  const categories = ['Tractors', 'Harvesters', 'Irrigation', 'Plows', 'Sprayers', 'Storage', 'Transportation', 'Other'];
  const types = ['rental', 'lease', 'purchase'];

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesType = selectedType === 'all' || (e.available_for && e.available_for.includes(selectedType));
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 dark:from-amber-900 dark:via-amber-800 dark:to-orange-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Equipment Marketplace</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-md opacity-95">
            Find agricultural equipment for rental, lease, or purchase across Kenya
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="shadow-xl">
                <Plus className="h-5 w-5 mr-2" />
                List Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>List Your Equipment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Equipment Name *</Label>
                  <Input 
                    value={newEquipment.name}
                    onChange={e => setNewEquipment({...newEquipment, name: e.target.value})}
                    placeholder="e.g., John Deere Tractor 5075E"
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select value={newEquipment.category} onValueChange={v => setNewEquipment({...newEquipment, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={newEquipment.description}
                    onChange={e => setNewEquipment({...newEquipment, description: e.target.value})}
                    placeholder="Describe your equipment, condition, specifications..."
                  />
                </div>
                <div>
                  <Label>Available For</Label>
                  <div className="flex gap-4 mt-2">
                    {types.map(type => (
                      <div key={type} className="flex items-center gap-2">
                        <Checkbox 
                          id={type}
                          checked={newEquipment.available_for.includes(type)}
                          onCheckedChange={() => toggleAvailableFor(type)}
                        />
                        <label htmlFor={type} className="capitalize">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price (KES)</Label>
                    <Input 
                      type="number"
                      value={newEquipment.price}
                      onChange={e => setNewEquipment({...newEquipment, price: e.target.value})}
                      placeholder="Per day/week/month"
                    />
                  </div>
                  <div>
                    <Label>County</Label>
                    <Input 
                      value={newEquipment.county}
                      onChange={e => setNewEquipment({...newEquipment, county: e.target.value})}
                      placeholder="e.g., Nakuru"
                    />
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input 
                    value={newEquipment.location}
                    onChange={e => setNewEquipment({...newEquipment, location: e.target.value})}
                    placeholder="Specific location or area"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Phone</Label>
                    <Input 
                      value={newEquipment.contact_phone}
                      onChange={e => setNewEquipment({...newEquipment, contact_phone: e.target.value})}
                      placeholder="+254..."
                    />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input 
                      type="email"
                      value={newEquipment.contact_email}
                      onChange={e => setNewEquipment({...newEquipment, contact_email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <Button onClick={handleCreateEquipment} className="w-full" disabled={submitting}>
                  {submitting ? 'Listing...' : 'List Equipment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : filteredEquipment.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEquipment.map(eq => (
              <Card key={eq.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{eq.name}</CardTitle>
                    {user?.id === eq.owner_id && (
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteEquipment(eq.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary">{eq.category}</Badge>
                    {eq.available_for?.map(type => (
                      <Badge key={type} variant="outline" className="capitalize">{type}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {eq.description && (
                    <p className="text-sm text-muted-foreground">{eq.description}</p>
                  )}
                  {(eq.location || eq.county) && (
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      {eq.location || eq.county}
                    </div>
                  )}
                  {eq.price && (
                    <div className="text-lg font-semibold text-primary">
                      KES {eq.price.toLocaleString()}
                    </div>
                  )}
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {eq.contact_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {eq.contact_phone}
                      </div>
                    )}
                    {eq.contact_email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {eq.contact_email}
                      </div>
                    )}
                  </div>
                  <Button className="w-full">Contact Owner</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="font-semibold mb-2">No equipment found</h3>
              <p className="text-muted-foreground">Be the first to list your equipment!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EquipmentMarketplace;