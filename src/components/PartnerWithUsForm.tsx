import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createPartner } from '../services/partnerService';

const PartnerWithUsForm: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    description: '',
    logo_url: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { error } = await createPartner(form);
      if (error) {
        setError(error.message);
      } else {
        toast({ title: 'Application Submitted', description: 'We will contact you soon.' });
        setForm({ company_name: '', contact_email: '', contact_phone: '', website: '', description: '', logo_url: '' });
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    }
    setSubmitting(false);
  };

  return (
    <Card className="max-w-xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>Become a Partner</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Company Name" required />
          <Input name="contact_email" value={form.contact_email} onChange={handleChange} placeholder="Contact Email" type="email" required />
          <Input name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="Contact Phone" />
          <Input name="website" value={form.website} onChange={handleChange} placeholder="Website" />
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your organization and partnership goals" rows={3} required />
          <Input name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="Logo URL (optional)" />
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </CardContent>
    </Card>
  );
};

export default PartnerWithUsForm;
