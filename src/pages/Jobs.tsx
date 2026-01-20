import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Search,
  Plus,
  Calendar,
  Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Job {
  id: string;
  employer_id: string;
  job_title: string;
  job_description: string;
  job_category: string;
  location: string;
  county: string;
  salary_range?: string;
  employment_type?: string;
  requirements: string[];
  responsibilities: string[];
  application_deadline?: string;
  contact_email: string;
  contact_phone?: string;
  is_active: boolean;
  views_count: number;
  applications_count: number;
  created_at: string;
}

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [newJob, setNewJob] = useState({
    job_title: '',
    job_description: '',
    job_category: '',
    location: '',
    county: '',
    salary_range: '',
    employment_type: 'full_time',
    contact_email: '',
    contact_phone: '',
    requirements: '',
    application_deadline: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load jobs. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Please log in to post a job', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('jobs').insert({
        employer_id: user.id,
        job_title: newJob.job_title,
        job_description: newJob.job_description,
        job_category: newJob.job_category,
        location: newJob.location,
        county: newJob.county,
        salary_range: newJob.salary_range || null,
        employment_type: newJob.employment_type,
        contact_email: newJob.contact_email,
        contact_phone: newJob.contact_phone || null,
        requirements: newJob.requirements ? newJob.requirements.split(',').map(r => r.trim()) : [],
        responsibilities: [],
        application_deadline: newJob.application_deadline || null,
        is_active: true
      });
      if (error) throw error;
      toast({ title: 'Job posted successfully!' });
      setNewJob({ job_title: '', job_description: '', job_category: '', location: '', county: '', salary_range: '', employment_type: 'full_time', contact_email: '', contact_phone: '', requirements: '', application_deadline: '' });
      setShowForm(false);
      fetchJobs();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.job_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.job_category === selectedCategory;
    const matchesCounty = selectedCounty === 'all' || job.county === selectedCounty;
    
    return matchesSearch && matchesCategory && matchesCounty;
  });

  const categories = Array.from(new Set(jobs.map(j => j.job_category).filter(Boolean)));
  const counties = Array.from(new Set(jobs.map(j => j.county).filter(Boolean)));

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="text-center">Loading jobs...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 dark:from-green-900 dark:via-green-800 dark:to-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Briefcase className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Agricultural Jobs</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">
            Find opportunities in farming, agribusiness, and agricultural services across Kenya
          </p>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="shadow-xl">
                <Plus className="h-4 w-4 mr-2" />
                Post a Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input value={newJob.job_title} onChange={(e) => setNewJob({...newJob, job_title: e.target.value})} placeholder="e.g., Farm Manager" required />
                </div>
                <div>
                  <Label>Job Description *</Label>
                  <Textarea value={newJob.job_description} onChange={(e) => setNewJob({...newJob, job_description: e.target.value})} placeholder="Describe the role..." rows={3} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <Select value={newJob.job_category} onValueChange={(val) => setNewJob({...newJob, job_category: val})}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Farming">Farming</SelectItem>
                        <SelectItem value="Livestock">Livestock</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Employment Type</Label>
                    <Select value={newJob.employment_type} onValueChange={(val) => setNewJob({...newJob, employment_type: val})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="seasonal">Seasonal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location *</Label>
                    <Input value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Town/City" required />
                  </div>
                  <div>
                    <Label>County *</Label>
                    <Input value={newJob.county} onChange={(e) => setNewJob({...newJob, county: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <Label>Salary Range</Label>
                  <Input value={newJob.salary_range} onChange={(e) => setNewJob({...newJob, salary_range: e.target.value})} placeholder="e.g., KES 30,000 - 50,000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Email *</Label>
                    <Input type="email" value={newJob.contact_email} onChange={(e) => setNewJob({...newJob, contact_email: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input value={newJob.contact_phone} onChange={(e) => setNewJob({...newJob, contact_phone: e.target.value})} placeholder="+254..." />
                  </div>
                </div>
                <div>
                  <Label>Requirements (comma-separated)</Label>
                  <Input value={newJob.requirements} onChange={(e) => setNewJob({...newJob, requirements: e.target.value})} placeholder="e.g., 2 years experience, Agriculture degree" />
                </div>
                <div>
                  <Label>Application Deadline</Label>
                  <Input type="date" value={newJob.application_deadline} onChange={(e) => setNewJob({...newJob, application_deadline: e.target.value})} />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Posting...' : 'Post Job'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger>
                <SelectValue placeholder="County" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{job.job_title}</CardTitle>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}, {job.county}</span>
                      </div>
                      {job.employment_type && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span className="capitalize">{job.employment_type.replace('_', ' ')}</span>
                        </div>
                      )}
                      {job.salary_range && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary_range}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary">{job.job_category}</Badge>
                    <div className="text-xs text-muted-foreground">
                      Posted {getDaysAgo(job.created_at)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground line-clamp-3">{job.job_description}</p>
                  
                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {job.requirements.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.requirements.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {job.application_deadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedCounty('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Jobs;
