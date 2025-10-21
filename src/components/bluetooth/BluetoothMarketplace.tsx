import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, TrendingUp, TrendingDown, Users, MapPin, Phone, Star, Bluetooth, BluetoothConnected, Wifi, WifiOff } from 'lucide-react';
import { bluetoothMarketplace, MarketplacePrice, MarketplaceAlert, BluetoothTrader } from '@/services/bluetoothMarketplace';
import { toast } from 'sonner';

export function BluetoothMarketplace() {
  const [isConnected, setIsConnected] = useState(false);
  const [prices, setPrices] = useState<MarketplacePrice[]>([]);
  const [alerts, setAlerts] = useState<MarketplaceAlert[]>([]);
  const [traders, setTraders] = useState<BluetoothTrader[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeBluetooth();
    
    return () => {
      bluetoothMarketplace.disconnect();
    };
  }, []);

  const initializeBluetooth = async () => {
    setIsLoading(true);
    try {
      const success = await bluetoothMarketplace.initialize();
      setIsConnected(success);
      
      if (success) {
        // Set up listeners
        bluetoothMarketplace.onPricesUpdate(setPrices);
        bluetoothMarketplace.onAlertsUpdate(setAlerts);
        bluetoothMarketplace.onTradersUpdate(setTraders);
        
        toast.success('Bluetooth marketplace connected!');
      } else {
        toast.error('Failed to connect to Bluetooth marketplace');
      }
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
      toast.error('Bluetooth not available on this device');
    } finally {
      setIsLoading(false);
    }
  };

  const requestPrices = async (commodity: string) => {
    if (!isConnected) return;
    await bluetoothMarketplace.requestPrices(commodity);
    toast.info(`Requesting ${commodity} prices from nearby farmers...`);
  };

  const sharePrice = async () => {
    if (!isConnected) return;
    
    // Example price sharing
    await bluetoothMarketplace.broadcastPrice({
      commodity: 'Maize',
      price: 45,
      unit: 'kg',
      location: 'Nakuru Market',
      county: 'Nakuru',
      market: 'Nakuru Municipal Market',
      source: 'user',
      quality: 'Grade 1',
      contact: '+254700000000'
    });
    
    toast.success('Price shared with nearby devices!');
  };

  const sendAlert = async () => {
    if (!isConnected) return;
    
    await bluetoothMarketplace.broadcastAlert({
      type: 'high_demand',
      commodity: 'Beans',
      location: 'Nakuru',
      county: 'Nakuru',
      message: 'High demand for quality beans - good prices available!',
      user_id: 'user123',
      contact: '+254700000000'
    });
    
    toast.success('Alert sent to nearby traders!');
  };

  const filteredPrices = prices.filter(price =>
    price.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    price.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlerts = alerts.filter(alert =>
    alert.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTraders = traders.filter(trader =>
    trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.commodities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
    trader.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bluetooth Marketplace</h1>
          <p className="text-muted-foreground">
            Discover prices, find traders, and share alerts offline via Bluetooth
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <BluetoothConnected className="h-6 w-6 text-blue-500" />
          ) : (
            <Bluetooth className="h-6 w-6 text-gray-400" />
          )}
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
      </div>

      {!isConnected && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 pt-6">
            <WifiOff className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Bluetooth marketplace offline</p>
              <p className="text-sm text-yellow-600">
                Enable Bluetooth to discover nearby farmers, prices, and trading opportunities
              </p>
            </div>
            <Button 
              onClick={initializeBluetooth} 
              disabled={isLoading}
              className="ml-auto"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">{prices.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Live Prices Nearby</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold">{alerts.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{traders.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">Traders Online</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search commodities, locations, or traders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={sharePrice} disabled={!isConnected}>
          Share Price
        </Button>
        <Button onClick={sendAlert} disabled={!isConnected} variant="outline">
          Send Alert
        </Button>
      </div>

      <Tabs defaultValue="prices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prices">Live Prices ({prices.length})</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="traders">Traders ({traders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Commodity Prices Nearby</h3>
            <Button 
              size="sm" 
              onClick={() => requestPrices(searchQuery || 'maize')}
              disabled={!isConnected}
            >
              Request Latest Prices
            </Button>
          </div>
          
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredPrices.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No prices available. Connect to Bluetooth to discover nearby prices.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPrices.map((price) => (
                  <Card key={price.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{price.commodity}</h4>
                          <p className="text-2xl font-bold text-green-600">
                            KES {price.price}/{price.unit}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {price.market}, {price.location}
                          </div>
                          {price.quality && (
                            <Badge variant="secondary" className="mt-1">
                              {price.quality}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={price.source === 'verified' ? 'default' : 'secondary'}>
                            {price.source}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(price.timestamp).toLocaleTimeString()}
                          </p>
                          {price.contact && (
                            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                              <Phone className="h-3 w-3" />
                              Contact available
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <h3 className="text-lg font-semibold">Market Alerts</h3>
          
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredAlerts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No active alerts. Connect to Bluetooth to receive market alerts.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAlerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {alert.type === 'high_demand' && <TrendingUp className="h-5 w-5 text-green-500" />}
                          {alert.type === 'price_drop' && <TrendingDown className="h-5 w-5 text-red-500" />}
                          {alert.type === 'price_rise' && <TrendingUp className="h-5 w-5 text-green-500" />}
                          {alert.type === 'buyer_request' && <Users className="h-5 w-5 text-blue-500" />}
                          {alert.type === 'seller_offer' && <Users className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{alert.commodity}</h4>
                            <Badge variant="outline" className="text-xs">
                              {alert.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                            <MapPin className="h-3 w-3" />
                            {alert.location}, {alert.county}
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="traders" className="space-y-4">
          <h3 className="text-lg font-semibold">Active Traders Nearby</h3>
          
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {filteredTraders.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No traders found nearby. Connect to Bluetooth to discover traders.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTraders.map((trader) => (
                  <Card key={trader.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{trader.name}</h4>
                            <Badge variant="outline">
                              {trader.type}
                            </Badge>
                            {trader.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{trader.rating}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {trader.location}, {trader.county}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {trader.commodities.slice(0, 3).map((commodity) => (
                              <Badge key={commodity} variant="secondary" className="text-xs">
                                {commodity}
                              </Badge>
                            ))}
                            {trader.commodities.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{trader.commodities.length - 3} more
                              </Badge>
                            )}
                          </div>
                          
                          {trader.services && trader.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {trader.services.slice(0, 2).map((service) => (
                                <Badge key={service} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Online
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(trader.last_seen).toLocaleTimeString()}
                          </p>
                          {trader.contact && (
                            <Button size="sm" variant="outline" className="mt-2">
                              Contact
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}