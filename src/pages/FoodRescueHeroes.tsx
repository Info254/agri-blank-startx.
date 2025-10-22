import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Award, 
  Heart, 
  Truck, 
  Users,
  Trophy,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Hero {
  id: string;
  user_id: string;
  user_name: string;
  user_type: 'farmer' | 'transporter' | 'organization';
  total_donations: number;
  total_deliveries: number;
  total_recipients: number;
  impact_story?: string;
  hero_badge: 'bronze' | 'silver' | 'gold' | 'platinum';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const FoodRescueHeroes: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_rescue_heroes')
        .select('*')
        .order('total_donations', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHeroes(data || []);
    } catch (error) {
      console.error('Error fetching heroes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load heroes. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'platinum': return 'bg-gradient-to-br from-blue-400 to-purple-500';
      case 'gold': return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-br from-gray-300 to-gray-500';
      default: return 'bg-gradient-to-br from-orange-400 to-orange-600';
    }
  };

  const getUserIcon = (userType: string) => {
    switch (userType) {
      case 'transporter': return Truck;
      case 'organization': return Users;
      default: return Heart;
    }
  };

  const featuredHeroes = heroes.filter(h => h.is_featured).slice(0, 3);
  const regularHeroes = heroes.filter(h => !h.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="text-center">Loading heroes...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 dark:from-amber-900 dark:via-orange-900 dark:to-red-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Trophy className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Food Rescue Heroes</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">
            Celebrating those who turn surplus into sustenance and waste into hope
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{heroes.reduce((sum, h) => sum + h.total_donations, 0).toLocaleString()}</div>
              <div className="text-muted-foreground text-sm">Total Donations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{heroes.reduce((sum, h) => sum + h.total_deliveries, 0).toLocaleString()}</div>
              <div className="text-muted-foreground text-sm">Deliveries Made</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{heroes.reduce((sum, h) => sum + h.total_recipients, 0).toLocaleString()}</div>
              <div className="text-muted-foreground text-sm">Recipients Served</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold">{heroes.length}</div>
              <div className="text-muted-foreground text-sm">Total Heroes</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Heroes */}
        {featuredHeroes.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Heroes</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredHeroes.map((hero) => {
                const Icon = getUserIcon(hero.user_type);
                return (
                  <Card key={hero.id} className="relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${getBadgeColor(hero.hero_badge)} opacity-20 rounded-full -mr-16 -mt-16`} />
                    <CardHeader className="text-center pb-4">
                      <div className="relative inline-block mb-4">
                        <Avatar className="h-24 w-24 mx-auto">
                          <AvatarFallback className={`${getBadgeColor(hero.hero_badge)} text-white text-2xl`}>
                            {hero.user_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-2 -right-2 ${getBadgeColor(hero.hero_badge)} rounded-full p-2`}>
                          <Trophy className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{hero.user_name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        <Icon className="h-3 w-3 mr-1" />
                        {hero.user_type}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{hero.total_donations}</div>
                          <div className="text-xs text-muted-foreground">Donations</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">{hero.total_deliveries}</div>
                          <div className="text-xs text-muted-foreground">Deliveries</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">{hero.total_recipients}</div>
                          <div className="text-xs text-muted-foreground">Recipients</div>
                        </div>
                      </div>
                      {hero.impact_story && (
                        <p className="text-sm text-muted-foreground italic">
                          "{hero.impact_story}"
                        </p>
                      )}
                      <div className="flex justify-center">
                        <Badge className={`${getBadgeColor(hero.hero_badge)} text-white border-none capitalize`}>
                          <Star className="h-3 w-3 mr-1" />
                          {hero.hero_badge} Hero
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Heroes */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">All Heroes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularHeroes.map((hero) => {
              const Icon = getUserIcon(hero.user_type);
              return (
                <Card key={hero.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className={`${getBadgeColor(hero.hero_badge)} text-white`}>
                          {hero.user_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{hero.user_name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          <Icon className="h-3 w-3 mr-1" />
                          {hero.user_type}
                        </Badge>
                      </div>
                      <Badge className={`${getBadgeColor(hero.hero_badge)} text-white border-none capitalize text-xs`}>
                        {hero.hero_badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="font-bold text-primary">{hero.total_donations}</div>
                        <div className="text-xs text-muted-foreground">Donations</div>
                      </div>
                      <div>
                        <div className="font-bold text-primary">{hero.total_deliveries}</div>
                        <div className="text-xs text-muted-foreground">Deliveries</div>
                      </div>
                      <div>
                        <div className="font-bold text-primary">{hero.total_recipients}</div>
                        <div className="text-xs text-muted-foreground">Recipients</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {heroes.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No heroes yet</h3>
              <p className="text-muted-foreground">
                Be the first to make an impact through food rescue!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FoodRescueHeroes;
