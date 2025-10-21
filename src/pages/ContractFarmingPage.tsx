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
  Calendar,
  MapPin, 
  Users, 
  DollarSign,
  FileText,
  Plus,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';

interface ContractFarming {
  id: string;
  contractor_name: string;
  contractor_type: string;
  crop_type: string;
  variety: string;
  required_quantity: number;
  unit: string;
  contract_price: number;
  currency: string;
  location: string;
  county: string;
  planting_season: string;
  harvest_period: string;
  contract_duration: string;
  requirements: string;
  benefits_offered: string;
  support_provided: string[];
  payment_terms: string;
  quality_standards: string;
  delivery_terms: string;
  contact_phone: string;
  contact_email: string;
  application_deadline: string;
  status: string;
  max_farmers: number;
  current_applications: number;
  created_at: string;
}

const ContractFarmingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contracts, setContracts] = useState<ContractFarming[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  const [contractForm, setContractForm] = useState({
    contractor_name: '',
    contractor_type: 'Company',
    crop_type: '',
    variety: '',
    required_quantity: 0,
    unit: 'kg',
    contract_price: 0,
    location: '',
    county: '',
    planting_season: '',
    harvest_period: '',
    contract_duration: '',
    requirements: '',
    benefits_offered: '',
    support_provided: '',
    payment_terms: '',
    quality_standards: '',
    delivery_terms: '',
    contact_phone: '',
    contact_email: '',
    application_deadline: '',
    max_farmers: 0
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contract_farming')
        .select('*')
        .eq('status', 'open')
        .gte('application_deadline', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch contracts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post contract farming opportunities",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('contract_farming')
        .insert({
          contractor_id: user.id,
          contractor_name: contractForm.contractor_name,
          contractor_type: contractForm.contractor_type,
          crop_type: contractForm.crop_type,
          variety: contractForm.variety,
          required_quantity: contractForm.required_quantity,
          unit: contractForm.unit,
          contract_price: contractForm.contract_price,
          location: contractForm.location,
          county: contractForm.county,
          planting_season: contractForm.planting_season,
          harvest_period: contractForm.harvest_period,
          contract_duration: contractForm.contract_duration,
          requirements: contractForm.requirements,
          benefits_offered: contractForm.benefits_offered,
          support_provided: contractForm.support_provided.split(',').map(s => s.trim()),
          payment_terms: contractForm.payment_terms,
          quality_standards: contractForm.quality_standards,
          delivery_terms: contractForm.delivery_terms,
          contact_phone: contractForm.contact_phone,
          contact_email: contractForm.contact_email,
          application_deadline: contractForm.application_deadline,
          max_farmers: contractForm.max_farmers
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract farming opportunity has been posted successfully!",
      });

      setShowAddForm(false);
      setContractForm({
        contractor_name: '',
        contractor_type: 'Company',
        crop_type: '',
        variety: '',
        required_quantity: 0,
        unit: 'kg',
        contract_price: 0,
        location: '',
        county: '',
        planting_season: '',
        harvest_period: '',
        contract_duration: '',
        requirements: '',
        benefits_offered: '',
        support_provided: '',
        payment_terms: '',
        quality_standards: '',
        delivery_terms: '',
        contact_phone: '',
        contact_email: '',
        application_deadline: '',
        max_farmers: 0
      });
      
      fetchContracts();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post contract",
        variant: "destructive",
      });
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = searchFilter === '' || 
      contract.crop_type.toLowerCase().includes(searchFilter.toLowerCase()) ||
      contract.contractor_name.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesLocation = locationFilter === '' ||
      contract.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
      contract.county.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Contract Farming</h1>
          <p className="text-muted-foreground">
            Connect with contractors for guaranteed market opportunities and agricultural support
          </p>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by crop type or contractor..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="flex-1"
          />
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Post Contract
          </Button>
        </div>

        {/* Add Contract Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Post Contract Farming Opportunity</CardTitle>
              <CardDescription>
                Create a contract farming opportunity for farmers in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddContract} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contractor_name">Contractor Name *</Label>
                    <Input
                      id="contractor_name"
                      value={contractForm.contractor_name}
                      onChange={(e) => setContractForm({...contractForm, contractor_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractor_type">Contractor Type</Label>
                    <select
                      id="contractor_type"
                      value={contractForm.contractor_type}
                      onChange={(e) => setContractForm({...contractForm, contractor_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Company">Company</option>
                      <option value="Cooperative">Cooperative</option>
                      <option value="Government">Government Agency</option>
                      <option value="NGO">NGO</option>
                      <option value="Individual">Individual</option>
                    </select>
                  </div>
                </div>

                {/* Crop Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="crop_type">Crop Type *</Label>
                    <Input
                      id="crop_type"
                      placeholder="e.g., Maize, Rice, Coffee"
                      value={contractForm.crop_type}
                      onChange={(e) => setContractForm({...contractForm, crop_type: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="variety">Variety</Label>
                    <Input
                      id="variety"
                      placeholder="e.g., H614, Basmati"
                      value={contractForm.variety}
                      onChange={(e) => setContractForm({...contractForm, variety: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="required_quantity">Required Quantity *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="required_quantity"
                        type="number"
                        min="1"
                        value={contractForm.required_quantity}
                        onChange={(e) => setContractForm({...contractForm, required_quantity: parseFloat(e.target.value) || 0})}
                        required
                      />
                      <select
                        value={contractForm.unit}
                        onChange={(e) => setContractForm({...contractForm, unit: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="kg">kg</option>
                        <option value="tonnes">tonnes</option>
                        <option value="bags">bags</option>
                        <option value="crates">crates</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Financial Terms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contract_price">Contract Price per Unit (KES) *</Label>
                    <Input
                      id="contract_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={contractForm.contract_price}
                      onChange={(e) => setContractForm({...contractForm, contract_price: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_farmers">Maximum Farmers</Label>
                    <Input
                      id="max_farmers"
                      type="number"
                      min="1"
                      value={contractForm.max_farmers}
                      onChange={(e) => setContractForm({...contractForm, max_farmers: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="application_deadline">Application Deadline *</Label>
                    <Input
                      id="application_deadline"
                      type="date"
                      value={contractForm.application_deadline}
                      onChange={(e) => setContractForm({...contractForm, application_deadline: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Location and Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={contractForm.location}
                      onChange={(e) => setContractForm({...contractForm, location: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Input
                      id="county"
                      value={contractForm.county}
                      onChange={(e) => setContractForm({...contractForm, county: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="planting_season">Planting Season *</Label>
                    <Input
                      id="planting_season"
                      placeholder="e.g., March-April 2024"
                      value={contractForm.planting_season}
                      onChange={(e) => setContractForm({...contractForm, planting_season: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="harvest_period">Expected Harvest Period *</Label>
                    <Input
                      id="harvest_period"
                      placeholder="e.g., July-August 2024"
                      value={contractForm.harvest_period}
                      onChange={(e) => setContractForm({...contractForm, harvest_period: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Contract Terms */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="requirements">Requirements *</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Describe farmer requirements, land size, experience, etc."
                      value={contractForm.requirements}
                      onChange={(e) => setContractForm({...contractForm, requirements: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="benefits_offered">Benefits Offered *</Label>
                    <Textarea
                      id="benefits_offered"
                      placeholder="Describe benefits: guaranteed purchase, price security, technical support, etc."
                      value={contractForm.benefits_offered}
                      onChange={(e) => setContractForm({...contractForm, benefits_offered: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="support_provided">Support Provided (comma-separated)</Label>
                    <Input
                      id="support_provided"
                      placeholder="e.g., Seeds, Fertilizers, Technical Training, Equipment"
                      value={contractForm.support_provided}
                      onChange={(e) => setContractForm({...contractForm, support_provided: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="payment_terms">Payment Terms *</Label>
                      <Textarea
                        id="payment_terms"
                        placeholder="When and how payments will be made"
                        value={contractForm.payment_terms}
                        onChange={(e) => setContractForm({...contractForm, payment_terms: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quality_standards">Quality Standards *</Label>
                      <Textarea
                        id="quality_standards"
                        placeholder="Describe quality requirements and standards"
                        value={contractForm.quality_standards}
                        onChange={(e) => setContractForm({...contractForm, quality_standards: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery_terms">Delivery Terms *</Label>
                      <Textarea
                        id="delivery_terms"
                        placeholder="How and where crops should be delivered"
                        value={contractForm.delivery_terms}
                        onChange={(e) => setContractForm({...contractForm, delivery_terms: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={contractForm.contact_phone}
                      onChange={(e) => setContractForm({...contractForm, contact_phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={contractForm.contact_email}
                      onChange={(e) => setContractForm({...contractForm, contact_email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Post Contract</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{contract.crop_type}</CardTitle>
                    {contract.variety && (
                      <CardDescription>{contract.variety}</CardDescription>
                    )}
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {contract.location}, {contract.county}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{contract.contractor_type}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="text-lg font-semibold text-green-600">
                  KES {contract.contract_price.toLocaleString()} per {contract.unit}
                </div>
                
                <div className="text-sm">
                  <strong>Contractor:</strong> {contract.contractor_name}
                </div>
                
                <div className="text-sm">
                  <strong>Quantity Needed:</strong> {contract.required_quantity.toLocaleString()} {contract.unit}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Planting: {contract.planting_season}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Harvest: {contract.harvest_period}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  Apply by: {new Date(contract.application_deadline).toLocaleDateString()}
                </div>
                
                {contract.max_farmers > 0 && (
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    {contract.current_applications}/{contract.max_farmers} farmers
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Benefits:</strong>
                    <p className="text-muted-foreground line-clamp-2">
                      {contract.benefits_offered}
                    </p>
                  </div>
                  
                  {contract.support_provided.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contract.support_provided.slice(0, 3).map((support, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {support}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Contract Farming Opportunities</h3>
              <p className="text-muted-foreground mb-4">
                {searchFilter || locationFilter ? 
                  'No contracts match your search criteria. Try adjusting your filters.' :
                  'Be the first to post a contract farming opportunity!'
                }
              </p>
              {!searchFilter && !locationFilter && (
                <Button onClick={() => setShowAddForm(true)}>
                  Post First Contract
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

export default ContractFarmingPage;