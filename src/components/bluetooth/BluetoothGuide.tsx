import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bluetooth, Smartphone, Wifi, Shield, Users, TrendingUp } from 'lucide-react';

export const BluetoothGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="h-6 w-6 text-blue-600" />
            How to Use Bluetooth Marketplace
          </CardTitle>
          <CardDescription>
            Connect with nearby farmers, traders, and service providers even without internet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold">Enable Bluetooth</h3>
                <p className="text-sm text-muted-foreground">
                  Turn on Bluetooth in your device settings and allow AgriConnect to access Bluetooth
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold">Start Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  The app automatically scans for nearby AgriConnect users within Bluetooth range (up to 100 meters)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold">Share & Discover</h3>
                <p className="text-sm text-muted-foreground">
                  Share prices, send alerts, and find traders. Data spreads through the mesh network automatically
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Features Available Offline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm">Price Discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Trader Discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Market Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm">Secure Messaging</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Security & Privacy</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">End-to-End Encryption</Badge>
                <span className="text-sm">All Bluetooth communications are encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Anonymous by Default</Badge>
                <span className="text-sm">Personal data is protected in the mesh network</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Device Verification</Badge>
                <span className="text-sm">Only verified AgriConnect devices can connect</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Mesh Network Benefits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Messages relay through other devices to extend range</li>
              <li>• Network becomes stronger with more participants</li>
              <li>• Works completely offline - no internet required</li>
              <li>• Automatic data synchronization when online</li>
              <li>• Self-healing network adapts to device availability</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};