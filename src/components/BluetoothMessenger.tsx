import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bluetooth, 
  Send, 
  Users, 
  Wifi, 
  WifiOff, 
  MessageCircle,
  Signal,
  SignalHigh,
  SignalLow
} from 'lucide-react';
import { bluetoothMessaging, BluetoothMessage, BluetoothDevice } from '@/services/bluetoothMessaging';
import { useToast } from '@/hooks/use-toast';

const BluetoothMessenger: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<BluetoothMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Set up message handler
    const messageHandler = (message: BluetoothMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Show notification for new messages
      toast({
        title: 'New Message',
        description: `From ${message.sender}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
      });
    };

    bluetoothMessaging.onMessage(messageHandler);

    // Update connected devices periodically
    const deviceUpdateInterval = setInterval(() => {
      setConnectedDevices(bluetoothMessaging.getConnectedDevices());
    }, 5000);

    return () => {
      bluetoothMessaging.removeMessageHandler(messageHandler);
      clearInterval(deviceUpdateInterval);
    };
  }, [toast]);

  const handleInitializeBluetooth = async () => {
    setIsInitializing(true);
    try {
      const success = await bluetoothMessaging.initialize();
      if (success) {
        setIsConnected(true);
        toast({
          title: 'Bluetooth Mesh Enabled',
          description: 'Now scanning for nearby devices...',
        });
      } else {
        toast({
          title: 'Bluetooth Unavailable',
          description: 'Bluetooth mesh messaging is only available on mobile devices.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to initialize Bluetooth mesh messaging.',
        variant: 'destructive'
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;

    try {
      const success = await bluetoothMessaging.sendMessage(newMessage.trim());
      
      if (success) {
        // Add our own message to the display
        const message: BluetoothMessage = {
          id: `local-${Date.now()}`,
          content: newMessage.trim(),
          timestamp: Date.now(),
          sender: 'You',
          encrypted: false
        };
        setMessages(prev => [...prev, message]);
        setNewMessage('');
      } else {
        toast({
          title: 'Message Queued',
          description: 'No devices connected. Message will be sent when devices come online.',
        });
      }
    } catch (error) {
      toast({
        title: 'Send Failed',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDisconnect = async () => {
    await bluetoothMessaging.disconnect();
    setIsConnected(false);
    setConnectedDevices([]);
    toast({
      title: 'Disconnected',
      description: 'Bluetooth mesh messaging disabled.',
    });
  };

  const getSignalIcon = (deviceCount: number) => {
    if (deviceCount === 0) return <WifiOff className="h-4 w-4" />;
    if (deviceCount <= 2) return <SignalLow className="h-4 w-4" />;
    if (deviceCount <= 5) return <Signal className="h-4 w-4" />;
    return <SignalHigh className="h-4 w-4" />;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5" />
            Offline Mesh Messaging
          </CardTitle>
          <div className="flex items-center gap-2">
            {getSignalIcon(connectedDevices.length)}
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? `${connectedDevices.length} devices` : 'Offline'}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Send messages via Bluetooth mesh network - no internet required
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center py-8">
            <Bluetooth className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enable Offline Messaging</h3>
            <p className="text-muted-foreground mb-4">
              Connect with nearby farmers even without internet access
            </p>
            <Button 
              onClick={handleInitializeBluetooth}
              disabled={isInitializing}
              size="lg"
            >
              {isInitializing ? (
                'Initializing...'
              ) : (
                <>
                  <Bluetooth className="h-4 w-4 mr-2" />
                  Enable Bluetooth Mesh
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            {/* Connected Devices */}
            {connectedDevices.length > 0 && (
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Connected Devices</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {connectedDevices.map(device => (
                    <Badge key={device.id} variant="outline">
                      {device.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="border rounded-lg">
              <ScrollArea className="h-64 p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'You'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="text-sm font-medium mb-1">
                            {message.sender}
                          </div>
                          <div className="text-sm mb-1">{message.content}</div>
                          <div className="text-xs opacity-70">
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Disconnect */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleDisconnect} size="sm">
                Disconnect Mesh
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BluetoothMessenger;