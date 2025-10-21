import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  Mic, 
  MapPin, 
  FileText, 
  Bluetooth, 
  Wifi,
  Battery,
  Smartphone,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface Permission {
  name: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  status: 'granted' | 'denied' | 'not-requested' | 'checking';
  purpose: string;
}

export const MobilePermissions: React.FC = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      name: 'Camera',
      description: 'Take photos of crops, livestock, and agricultural equipment',
      icon: <Camera className="h-5 w-5" />,
      required: true,
      status: 'not-requested',
      purpose: 'Document farm activities, capture crop issues, and upload product images'
    },
    {
      name: 'Microphone',
      description: 'Voice recording for AI assistant interactions',
      icon: <Mic className="h-5 w-5" />,
      required: false,
      status: 'not-requested',
      purpose: 'Voice commands and audio notes for hands-free operation'
    },
    {
      name: 'Location',
      description: 'Access your location for weather, markets, and logistics',
      icon: <MapPin className="h-5 w-5" />,
      required: true,
      status: 'not-requested',
      purpose: 'Show nearby markets, weather forecasts, and optimize transport routes'
    },
    {
      name: 'Storage',
      description: 'Save files, photos, and offline data',
      icon: <FileText className="h-5 w-5" />,
      required: true,
      status: 'not-requested',
      purpose: 'Store agricultural records, offline market data, and user content'
    },
    {
      name: 'Bluetooth',
      description: 'Connect to nearby devices for peer-to-peer trading',
      icon: <Bluetooth className="h-5 w-5" />,
      required: false,
      status: 'not-requested',
      purpose: 'Bluetooth marketplace and mesh networking for offline trading'
    },
    {
      name: 'Network',
      description: 'Access internet for real-time data and sync',
      icon: <Wifi className="h-5 w-5" />,
      required: true,
      status: 'not-requested',
      purpose: 'Sync data, access real-time prices, and communicate with other users'
    }
  ]);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      const updatedPermissions = await Promise.all(
        permissions.map(async (permission) => {
          try {
            let result;
            switch (permission.name) {
              case 'Camera':
                result = await navigator.permissions.query({ name: 'camera' as PermissionName });
                break;
              case 'Microphone':
                result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                break;
              case 'Location':
                result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
                break;
              default:
                return { ...permission, status: 'not-requested' as const };
            }
            
            return {
              ...permission,
              status: result.state === 'granted' ? 'granted' as const :
                     result.state === 'denied' ? 'denied' as const :
                     'not-requested' as const
            };
          } catch (error) {
            return { ...permission, status: 'not-requested' as const };
          }
        })
      );
      
      setPermissions(updatedPermissions);
    }
  };

  const requestPermission = async (permissionName: string) => {
    setPermissions(prev => 
      prev.map(p => 
        p.name === permissionName ? { ...p, status: 'checking' } : p
      )
    );

    try {
      let granted = false;

      switch (permissionName) {
        case 'Camera':
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            granted = true;
          } catch (error) {
            granted = false;
          }
          break;

        case 'Microphone':
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            granted = true;
          } catch (error) {
            granted = false;
          }
          break;

        case 'Location':
          try {
            await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            granted = true;
          } catch (error) {
            granted = false;
          }
          break;

        case 'Storage':
          // For storage, we can check if localStorage is available
          try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            granted = true;
          } catch (error) {
            granted = false;
          }
          break;

        case 'Bluetooth':
          // Check if Web Bluetooth API is available
          if ('bluetooth' in navigator) {
            granted = true;
          } else {
            granted = false;
          }
          break;

        case 'Network':
          // Network is usually always available
          granted = navigator.onLine;
          break;

        default:
          granted = false;
      }

      setPermissions(prev => 
        prev.map(p => 
          p.name === permissionName 
            ? { ...p, status: granted ? 'granted' : 'denied' }
            : p
        )
      );

      if (granted) {
        toast({
          title: "Permission Granted",
          description: `${permissionName} access has been granted.`,
        });
      } else {
        toast({
          title: "Permission Denied",
          description: `${permissionName} access was denied. Some features may not work properly.`,
          variant: "destructive",
        });
      }

    } catch (error) {
      setPermissions(prev => 
        prev.map(p => 
          p.name === permissionName ? { ...p, status: 'denied' } : p
        )
      );

      toast({
        title: "Permission Error",
        description: `Failed to request ${permissionName} permission.`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'granted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'denied':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string, required: boolean) => {
    switch (status) {
      case 'granted':
        return <Badge className="bg-green-500 text-white">Granted</Badge>;
      case 'denied':
        return <Badge variant="destructive">Denied</Badge>;
      case 'checking':
        return <Badge variant="outline">Checking...</Badge>;
      default:
        return required ? 
          <Badge variant="destructive">Required</Badge> : 
          <Badge variant="outline">Optional</Badge>;
    }
  };

  const requestAllRequired = async () => {
    const requiredPermissions = permissions.filter(p => p.required && p.status !== 'granted');
    
    for (const permission of requiredPermissions) {
      await requestPermission(permission.name);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const deniedRequiredPermissions = permissions.filter(p => p.required && p.status === 'denied');
  const grantedPermissions = permissions.filter(p => p.status === 'granted');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Mobile App Permissions
          </CardTitle>
          <CardDescription>
            AgriConnect needs certain permissions to provide you with the best mobile experience.
            All permissions are used only for agricultural purposes and your data remains secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {grantedPermissions.length} Granted
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                {deniedRequiredPermissions.length} Required Denied
              </span>
            </div>
            
            <Button 
              onClick={requestAllRequired}
              disabled={deniedRequiredPermissions.length === 0}
              size="sm"
            >
              Grant Required Permissions
            </Button>
          </div>

          <div className="space-y-4">
            {permissions.map((permission) => (
              <Card key={permission.name} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="p-2 bg-muted rounded-lg">
                        {permission.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{permission.name}</h4>
                          {getStatusBadge(permission.status, permission.required)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {permission.description}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          <strong>Purpose:</strong> {permission.purpose}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(permission.status)}
                      
                      {permission.status !== 'granted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => requestPermission(permission.name)}
                          disabled={permission.status === 'checking'}
                        >
                          {permission.status === 'checking' ? 'Checking...' : 'Grant'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {deniedRequiredPermissions.length > 0 && (
            <Card className="mt-6 border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-700 mb-1">
                      Required Permissions Denied
                    </h4>
                    <p className="text-sm text-red-600 mb-3">
                      Some required permissions have been denied. This may limit app functionality. 
                      You can grant these permissions by:
                    </p>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• Going to your device Settings → Apps → AgriConnect → Permissions</li>
                      <li>• Or clearing the app data and trying again</li>
                      <li>• Or clicking the "Grant" button above to try again</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-700 mb-1">
                    Mobile App Store Requirements
                  </h4>
                  <p className="text-sm text-blue-600">
                    AgriConnect is designed to meet all requirements for Android Play Store and Apple App Store:
                  </p>
                  <ul className="text-sm text-blue-600 mt-2 space-y-1">
                    <li>• All permissions have clear justifications and agricultural purposes</li>
                    <li>• Data is encrypted and stored securely</li>
                    <li>• Privacy policy and terms of service are available</li>
                    <li>• App follows platform-specific design guidelines</li>
                    <li>• Offline functionality available for core features</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobilePermissions;