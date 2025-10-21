import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PhoneAuth } from '@/components/auth/PhoneAuth';
import { Mail, Phone, Leaf } from 'lucide-react';
import heroImage from '@/assets/hero-farming-team.jpg';

const Auth: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "You have been logged in successfully!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Your account has been created! Please check your email to verify your account.",
      });
      
      // Navigate to login tab
      setActiveTab('login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuthSuccess = () => {
    toast({
      title: "Success",
      description: "You have been logged in successfully!",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/src/assets/sokoconnect-logo.png" 
                alt="SokoConnect Logo" 
                className="h-20 w-20"
              />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-white">Soko</span>
              <span className="text-green-400">Connect</span>
            </h1>
            <p className="text-gray-200 text-base font-medium">
              SOKOCONNECT | <span className="text-green-400">Tustawi</span>
            </p>
            <p className="text-gray-300 text-sm mt-3 max-w-md mx-auto">
              Connecting farmers, traders & markets - Empowering the entire agri-supply chain
            </p>
          </div>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-white">Welcome to SokoConnect</CardTitle>
              <CardDescription className="text-gray-200">
                Sign in or create an account to access all features
                <br />
                <span className="text-sm text-gray-300">
                  Karibu SokoConnect - Ingia au fungua akaunti
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Authentication method selector */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={authMethod === 'email' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('email')}
                  className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  size="sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant={authMethod === 'phone' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('phone')}
                  className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Phone / Simu
                </Button>
              </div>

              {authMethod === 'phone' ? (
                <div className="mt-4">
                  <PhoneAuth onSuccess={handlePhoneAuthSuccess} />
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/20">
                    <TabsTrigger value="login" className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900">
                      Register Now
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-login" className="text-white">Email</Label>
                        <Input
                          id="email-login"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-login" className="text-white">Password</Label>
                        <Input
                          id="password-login"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3" 
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname-signup" className="text-white">Full Name</Label>
                        <Input
                          id="fullname-signup"
                          placeholder="Your Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-signup" className="text-white">Email</Label>
                        <Input
                          id="email-signup"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-signup" className="text-white">Password</Label>
                        <Input
                          id="password-signup"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                          required
                        />
                        <p className="text-xs text-gray-300">
                          Password must be at least 6 characters long
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3" 
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Register Now"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-4">
              <p className="text-sm text-gray-300 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                <br />
                <span className="text-xs">Kwa kuendelea, unakubali Sheria na Sera yetu ya Faragha.</span>
              </p>
              
              {/* Branding Footer */}
              <div className="flex items-center text-white text-sm">
                <div className="flex items-center">
                  <span className="font-bold">SOKOCONNECT</span>
                  <span className="mx-2">|</span>
                  <span className="text-xs text-green-400">Tustawi</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Version 1.6.2.0*</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;