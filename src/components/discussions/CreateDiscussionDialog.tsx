import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PenSquare, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface CreateDiscussionDialogProps {
  onDiscussionCreated?: () => void;
}

export const CreateDiscussionDialog = ({ onDiscussionCreated }: CreateDiscussionDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'quality_standards',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { value: 'quality_standards', label: 'Quality Standards' },
    { value: 'verification', label: 'Product Verification' },
    { value: 'regulations', label: 'Regulations & Compliance' },
    { value: 'export_requirements', label: 'Export Requirements' },
    { value: 'pest_control', label: 'Pest & Disease Control' },
    { value: 'certification', label: 'Certification' },
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a discussion.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('community_posts').insert({
        author_id: user.id,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        post_type: 'discussion',
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your discussion has been created successfully!',
      });

      setFormData({
        title: '',
        content: '',
        category: 'quality_standards',
        tags: [],
      });

      setOpen(false);

      if (onDiscussionCreated) {
        onDiscussionCreated();
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({
        title: 'Error',
        description: 'Failed to create discussion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PenSquare className="mr-2 h-4 w-4" /> Start New Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>
            Share your thoughts, questions, or concerns about agricultural quality control
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What's your discussion about?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, questions, or experiences..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length}/5000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag (e.g., avocados, EU, pesticides)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Press Enter or click Add to add tags
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Discussion'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
