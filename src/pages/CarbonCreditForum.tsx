import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Users, TrendingUp } from 'lucide-react';
import carbonBg from '@/assets/carbon-credit-bg.png';

const CarbonCreditForum: React.FC = () => {
  const { user } = useAuth();
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Carbon Background */}
      <section 
        className="relative py-24 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${carbonBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Carbon Credits & Circular Economy Forum</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-md opacity-95">
            Earn from sustainable farming practices and contribute to a greener Kenya
          </p>
          <Button size="lg" variant="secondary" className="shadow-xl" onClick={() => setShowNewPostForm(!showNewPostForm)}>
            <Plus className="h-5 w-5 mr-2" />
            Start New Discussion
          </Button>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="h-5 w-5 text-green-500" />
                Active Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm text-muted-foreground">Posts this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-green-500" />
                Community Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,200+</div>
              <p className="text-sm text-muted-foreground">Active farmers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Carbon Credits Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,000</div>
              <p className="text-sm text-muted-foreground">Tons CO2 offset</p>
            </CardContent>
          </Card>
        </div>

        {showNewPostForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input type="text" placeholder="Discussion Title" className="w-full p-2 border rounded" />
                <textarea placeholder="Share your thoughts..." className="w-full p-2 border rounded h-32" />
                <div className="flex gap-2">
                  <Button onClick={() => setShowNewPostForm(false)}>Cancel</Button>
                  <Button variant="default">Post Discussion</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-semibold mb-2">How to Register for Carbon Credits</h3>
                  <p className="text-sm text-muted-foreground mb-2">A comprehensive guide to getting started with carbon credit programs in Kenya.</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>45 comments</span>
                    <span>•</span>
                    <span>2 days ago</span>
                  </div>
                </div>

                <div className="p-4 border rounded hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-semibold mb-2">Sustainable Farming Practices</h3>
                  <p className="text-sm text-muted-foreground mb-2">Share and learn about practices that qualify for carbon credits.</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>32 comments</span>
                    <span>•</span>
                    <span>4 days ago</span>
                  </div>
                </div>

                <div className="p-4 border rounded hover:bg-muted/50 cursor-pointer">
                  <h3 className="font-semibold mb-2">Circular Economy Success Stories</h3>
                  <p className="text-sm text-muted-foreground mb-2">Farmers share their experiences with waste reduction and resource efficiency.</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>28 comments</span>
                    <span>•</span>
                    <span>1 week ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CarbonCreditForum;
