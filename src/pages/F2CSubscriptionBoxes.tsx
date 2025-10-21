import React, { useEffect, useState } from 'react';
import { subscribeBox, getSubscriptionBoxes, updateSubscriptionBox, getBoxDeliveries, markBoxDeliveryDelivered } from '@/services/f2cSubscriptionService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { Package, Truck, Calendar, Check, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const F2CSubscriptionBoxes: React.FC = () => {
  const { user } = useAuth();
  const [boxSize, setBoxSize] = useState('');
  const [boxWeight, setBoxWeight] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [duration, setDuration] = useState('1');
  const [farmerId, setFarmerId] = useState('');
  const [boxes, setBoxes] = useState<any[]>([]);
  const [selectedBoxId, setSelectedBoxId] = useState('');
  const [deliveries, setDeliveries] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) getSubscriptionBoxes(user.id).then(({ data }) => setBoxes(data || []));
    if (selectedBoxId) getBoxDeliveries(selectedBoxId).then(({ data }) => setDeliveries(data || []));
  }, [user?.id, selectedBoxId]);

  const handleSubscribe = async () => {
    if (!user?.id) return;
    const boxType = `${boxSize}-${boxWeight}`;
    await subscribeBox({ 
      consumer_id: user.id, 
      farmer_id: farmerId, 
      box_type: boxType, 
      frequency,
      duration_months: parseInt(duration)
    });
    getSubscriptionBoxes(user.id).then(({ data }) => setBoxes(data || []));
  };

  const handleMarkDelivered = async (delivery_id: string) => {
    await markBoxDeliveryDelivered(delivery_id);
    getBoxDeliveries(selectedBoxId).then(({ data }) => setDeliveries(data || []));
  };

  return (
    <AppLayout title="Farm-to-Consumer Boxes">
      <div className="container mx-auto px-4 py-6 max-w-6xl pb-24">
        {/* Explanation Section */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-primary mt-1" />
              <div>
                <CardTitle className="text-2xl">What is Farmer-to-Consumer (F2C)?</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Connect directly with local farmers and get fresh, seasonal produce delivered to your door
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Our Farm-to-Consumer subscription service eliminates the middleman, bringing you fresh, 
              locally-grown produce straight from the farm to your home. Support local farmers, eat healthier, 
              and reduce your carbon footprint all at once!
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-background rounded-lg p-4 border">
                <Package className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Fresh & Seasonal</h4>
                <p className="text-sm text-muted-foreground">
                  Handpicked produce harvested at peak freshness
                </p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <Truck className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Direct Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  From farm to your doorstep in 24-48 hours
                </p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <Check className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Support Farmers</h4>
                <p className="text-sm text-muted-foreground">
                  Your purchase directly supports local farming communities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="subscribe" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscribe">Subscribe to a Box</TabsTrigger>
            <TabsTrigger value="myboxes">My Subscriptions</TabsTrigger>
          </TabsList>

          {/* Subscribe Tab */}
          <TabsContent value="subscribe">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Custom Subscription</CardTitle>
                <CardDescription>
                  Choose your preferred box size, delivery frequency, and subscription duration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Box Type */}
                  <div className="space-y-2">
                    <Label htmlFor="boxSize">Container Type</Label>
                    <Select value={boxSize} onValueChange={setBoxSize}>
                      <SelectTrigger id="boxSize">
                        <SelectValue placeholder="Select container type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small-box">Small Box</SelectItem>
                        <SelectItem value="medium-box">Medium Box</SelectItem>
                        <SelectItem value="large-box">Large Box</SelectItem>
                        <SelectItem value="carton">Carton</SelectItem>
                        <SelectItem value="crate">Crate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="boxWeight">Weight</Label>
                    <Select value={boxWeight} onValueChange={setBoxWeight}>
                      <SelectTrigger id="boxWeight">
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10kg">10 kg</SelectItem>
                        <SelectItem value="20kg">20 kg</SelectItem>
                        <SelectItem value="30kg">30 kg</SelectItem>
                        <SelectItem value="40kg">40 kg</SelectItem>
                        <SelectItem value="50kg">50 kg</SelectItem>
                        <SelectItem value="60kg">60 kg</SelectItem>
                        <SelectItem value="70kg">70 kg</SelectItem>
                        <SelectItem value="80kg">80 kg</SelectItem>
                        <SelectItem value="90kg">90 kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Delivery Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly (Every 2 weeks)</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Subscription Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Month</SelectItem>
                        <SelectItem value="3">3 Months (5% discount)</SelectItem>
                        <SelectItem value="6">6 Months (10% discount)</SelectItem>
                        <SelectItem value="12">12 Months (15% discount)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Farmer ID */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="farmerId">Farmer/Cooperative (Optional)</Label>
                    <Input 
                      id="farmerId"
                      type="text" 
                      placeholder="Enter farmer ID or leave empty for automatic matching" 
                      value={farmerId} 
                      onChange={e => setFarmerId(e.target.value)} 
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave empty to be automatically matched with a nearby farmer
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold">Your Selection:</h4>
                  <p className="text-sm text-muted-foreground">
                    {boxSize && boxWeight ? (
                      <>
                        <span className="font-medium text-foreground">{boxSize.replace('-', ' ')} ({boxWeight})</span>
                        {' delivered '}
                        <span className="font-medium text-foreground">{frequency}</span>
                        {' for '}
                        <span className="font-medium text-foreground">{duration} month(s)</span>
                      </>
                    ) : (
                      'Please select your preferences above'
                    )}
                  </p>
                </div>

                <Button 
                  onClick={handleSubscribe} 
                  className="w-full" 
                  size="lg"
                  disabled={!boxSize || !boxWeight}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Boxes Tab */}
          <TabsContent value="myboxes">
            <Card>
              <CardHeader>
                <CardTitle>My Active Subscriptions</CardTitle>
                <CardDescription>
                  Manage your subscription boxes and track deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {boxes.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No active subscriptions yet</p>
                    <p className="text-sm text-muted-foreground">
                      Subscribe to your first box to start receiving fresh farm produce!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {boxes.map(box => (
                      <Card key={box.id} className="border-2">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{box.box_type}</CardTitle>
                              <CardDescription>
                                {box.frequency} deliveries • Farmer: {box.farmer_id}
                              </CardDescription>
                            </div>
                            <Badge variant={box.status === 'active' ? 'default' : 'secondary'}>
                              {box.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            onClick={() => setSelectedBoxId(box.id)} 
                            variant="outline"
                            className="w-full"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            View Delivery Schedule
                          </Button>

                          {selectedBoxId === box.id && deliveries.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <h4 className="font-semibold text-sm">Upcoming & Past Deliveries:</h4>
                              {deliveries.map(delivery => (
                                <div 
                                  key={delivery.id}
                                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {new Date(delivery.delivery_date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {delivery.delivered ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                      <Check className="h-3 w-3 mr-1" />
                                      Delivered
                                    </Badge>
                                  ) : (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleMarkDelivered(delivery.id)}
                                    >
                                      Mark as Delivered
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default F2CSubscriptionBoxes;
