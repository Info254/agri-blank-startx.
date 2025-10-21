import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Users, Plus, MapPin, Phone, Mail, TrendingUp, Calendar } from 'lucide-react';

interface CooperativeGroup {
  id: string;
  name: string;
  description: string;
  group_type: string;
  location: string;
  county: string;
  member_count: number;
  contact_person: string;
  contact_phone: string;
  activities: string[];
  status: string;
  created_at: string;
}

export default function CooperativeGroupsPage() {
  const [groups, setGroups] = useState<CooperativeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    group_type: 'cooperative',
    location: '',
    county: '',
    contact_person: '',
    contact_phone: '',
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('cooperative_groups')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cooperative groups',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to create a group',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase.from('cooperative_groups').insert({
        ...formData,
        group_leader_id: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Cooperative group created successfully!',
      });

      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        group_type: 'cooperative',
        location: '',
        county: '',
        contact_person: '',
        contact_phone: '',
      });
      fetchGroups();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create group',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Cooperative Groups
            </h1>
            <p className="text-muted-foreground mt-1">
              Join or create farming cooperatives and groups
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Cooperative Group</CardTitle>
              <CardDescription>Start a new farming cooperative or group</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Group Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g., Nakuru Farmers Cooperative"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Group Type</label>
                  <Select
                    value={formData.group_type}
                    onValueChange={(value) => setFormData({ ...formData, group_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cooperative">Cooperative</SelectItem>
                      <SelectItem value="farmers_group">Farmers Group</SelectItem>
                      <SelectItem value="savings_group">Savings Group</SelectItem>
                      <SelectItem value="marketing_group">Marketing Group</SelectItem>
                      <SelectItem value="women_group">Women Group</SelectItem>
                      <SelectItem value="youth_group">Youth Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your group's purpose and activities"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Town/Village"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">County</label>
                    <Input
                      value={formData.county}
                      onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                      placeholder="County"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Contact Person</label>
                    <Input
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact Phone</label>
                    <Input
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+254..."
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Create Group</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">Loading groups...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {group.group_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {group.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{group.location}, {group.county}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{group.member_count} members</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{group.contact_phone}</span>
                    </div>

                    {group.activities && group.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {group.activities.slice(0, 3).map((activity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button className="w-full mt-4" size="sm">
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && groups.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No cooperative groups found</p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create First Group
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <MobileNavigation />
    </div>
  );
}
