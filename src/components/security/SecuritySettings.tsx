import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SecurityAudit } from '@/services/security/securityAudit';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Eye, AlertTriangle, Clock } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const [securityLog, setSecurityLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    dataAccessAlerts: true,
    securityEmails: true
  });

  useEffect(() => {
    if (user) {
      loadSecurityLog();
    }
  }, [user]);

  const loadSecurityLog = async () => {
    if (!user) return;
    
    try {
      const log = await SecurityAudit.getUserSecurityLog(user.id);
      setSecurityLog(log || []);
    } catch (error) {
      console.error('Failed to load security log:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'successful_login':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'data_access':
        return <Eye className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatEventTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please log in to view security settings.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="login-notifications">Login Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified of new login attempts
              </p>
            </div>
            <Switch
              id="login-notifications"
              checked={settings.loginNotifications}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, loginNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-alerts">Data Access Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Alert when your data is accessed
              </p>
            </div>
            <Switch
              id="data-alerts"
              checked={settings.dataAccessAlerts}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, dataAccessAlerts: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="security-emails">Security Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive security updates via email
              </p>
            </div>
            <Switch
              id="security-emails"
              checked={settings.securityEmails}
              onCheckedChange={(checked) =>
                setSettings(prev => ({ ...prev, securityEmails: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Activity</CardTitle>
          <CardDescription>
            View your recent security events and login attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Loading security log...</p>
          ) : securityLog.length === 0 ? (
            <p className="text-center text-muted-foreground">No security events recorded</p>
          ) : (
            <div className="space-y-3">
              {securityLog.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getEventIcon(event.event_type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium capitalize">
                      {event.event_type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatEventTime(event.created_at)}
                    </p>
                    {event.event_details?.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {event.event_details.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {securityLog.length > 10 && (
            <Button variant="outline" className="w-full mt-4" onClick={loadSecurityLog}>
              Load More Events
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;