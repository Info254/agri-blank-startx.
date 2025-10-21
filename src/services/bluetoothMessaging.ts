import { BleClient, BleDevice, numbersToDataView, dataViewToNumbers } from '@capacitor-community/bluetooth-le';
import { Capacitor } from '@capacitor/core';

export interface BluetoothMessage {
  id: string;
  content: string;
  timestamp: number;
  sender: string;
  recipient?: string;
  encrypted: boolean;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  lastSeen: number;
}

class BluetoothMeshMessaging {
  private isInitialized = false;
  private connectedDevices: Map<string, BleDevice> = new Map();
  private messageQueue: BluetoothMessage[] = [];
  private messageHandlers: ((message: BluetoothMessage) => void)[] = [];
  
  // Service UUIDs for our mesh messaging protocol
  private readonly SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
  private readonly MESSAGE_CHARACTERISTIC_UUID = '87654321-4321-4321-4321-cba987654321';
  private readonly DEVICE_INFO_CHARACTERISTIC_UUID = '11111111-2222-3333-4444-555555555555';

  async initialize(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.warn('Bluetooth messaging is only available on mobile devices');
      return false;
    }

    try {
      await BleClient.initialize();
      this.isInitialized = true;
      
      // Start advertising our service
      await this.startAdvertising();
      
      // Start scanning for other devices
      await this.startScanning();
      
      console.log('Bluetooth mesh messaging initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Bluetooth mesh messaging:', error);
      return false;
    }
  }

  private async startAdvertising() {
    // Note: Actual advertising implementation would depend on the specific
    // Capacitor BLE plugin capabilities. This is a conceptual implementation.
    console.log('Starting BLE advertising for mesh messaging');
  }

  private async startScanning() {
    try {
      await BleClient.requestLEScan(
        {
          services: [this.SERVICE_UUID],
        },
        (result) => {
          this.handleDeviceDiscovered(result.device);
        }
      );

      // Stop scanning after 30 seconds and restart
      setTimeout(() => {
        BleClient.stopLEScan();
        // Restart scanning for continuous discovery
        setTimeout(() => this.startScanning(), 5000);
      }, 30000);
    } catch (error) {
      console.error('Error starting BLE scan:', error);
    }
  }

  private async handleDeviceDiscovered(device: BleDevice) {
    if (!this.connectedDevices.has(device.deviceId)) {
      console.log('Discovered device:', device.name || device.deviceId);
      await this.connectToDevice(device);
    }
  }

  private async connectToDevice(device: BleDevice) {
    try {
      await BleClient.connect(device.deviceId);
      this.connectedDevices.set(device.deviceId, device);
      
      console.log('Connected to device:', device.name || device.deviceId);
      
      // Subscribe to message notifications
      await BleClient.startNotifications(
        device.deviceId,
        this.SERVICE_UUID,
        this.MESSAGE_CHARACTERISTIC_UUID,
        (value) => {
          this.handleReceivedMessage(value);
        }
      );

      // Process any queued messages for this device
      await this.processMessageQueue();
      
    } catch (error) {
      console.error('Failed to connect to device:', error);
    }
  }

  private handleReceivedMessage(dataView: DataView) {
    try {
      const messageBytes = dataViewToNumbers(dataView);
      const messageString = String.fromCharCode(...messageBytes);
      const message: BluetoothMessage = JSON.parse(messageString);
      
      console.log('Received message:', message);
      
      // Notify all message handlers
      this.messageHandlers.forEach(handler => handler(message));
      
      // Forward message to other connected devices (mesh behavior)
      this.forwardMessage(message);
      
    } catch (error) {
      console.error('Error processing received message:', error);
    }
  }

  private async forwardMessage(message: BluetoothMessage) {
    // Prevent message loops by checking if we've already forwarded this message
    const messageId = `${message.sender}-${message.timestamp}`;
    
    // Simple forwarding to all connected devices except sender
    for (const [deviceId, device] of this.connectedDevices) {
      if (deviceId !== message.sender) {
        await this.sendMessageToDevice(device, message);
      }
    }
  }

  async sendMessage(content: string, recipient?: string): Promise<boolean> {
    const message: BluetoothMessage = {
      id: `${Date.now()}-${Math.random()}`,
      content,
      timestamp: Date.now(),
      sender: await this.getDeviceId(),
      recipient,
      encrypted: false // TODO: Implement encryption
    };

    if (recipient) {
      // Send to specific recipient
      const targetDevice = Array.from(this.connectedDevices.values())
        .find(device => device.deviceId === recipient);
      
      if (targetDevice) {
        return await this.sendMessageToDevice(targetDevice, message);
      } else {
        // Queue message for when recipient comes online
        this.messageQueue.push(message);
        console.log('Recipient not connected, message queued');
        return false;
      }
    } else {
      // Broadcast to all connected devices
      let success = true;
      for (const device of this.connectedDevices.values()) {
        const result = await this.sendMessageToDevice(device, message);
        success = success && result;
      }
      return success;
    }
  }

  private async sendMessageToDevice(device: BleDevice, message: BluetoothMessage): Promise<boolean> {
    try {
      const messageString = JSON.stringify(message);
      const messageBytes = Array.from(messageString).map(char => char.charCodeAt(0));
      const dataView = numbersToDataView(messageBytes);
      
      await BleClient.writeWithoutResponse(
        device.deviceId,
        this.SERVICE_UUID,
        this.MESSAGE_CHARACTERISTIC_UUID,
        dataView
      );
      
      console.log('Message sent to device:', device.name || device.deviceId);
      return true;
    } catch (error) {
      console.error('Failed to send message to device:', error);
      return false;
    }
  }

  private async processMessageQueue() {
    const processedMessages: BluetoothMessage[] = [];
    
    for (const message of this.messageQueue) {
      if (message.recipient) {
        const targetDevice = Array.from(this.connectedDevices.values())
          .find(device => device.deviceId === message.recipient);
        
        if (targetDevice) {
          await this.sendMessageToDevice(targetDevice, message);
          processedMessages.push(message);
        }
      }
    }
    
    // Remove processed messages from queue
    this.messageQueue = this.messageQueue.filter(msg => !processedMessages.includes(msg));
  }

  onMessage(handler: (message: BluetoothMessage) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (message: BluetoothMessage) => void) {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  getConnectedDevices(): BluetoothDevice[] {
    return Array.from(this.connectedDevices.values()).map(device => ({
      id: device.deviceId,
      name: device.name || 'Unknown Device',
      rssi: 0, // Would need to be tracked separately
      lastSeen: Date.now()
    }));
  }

  private async getDeviceId(): Promise<string> {
    // In a real implementation, this would return a unique device identifier
    return 'device-' + Math.random().toString(36).substr(2, 9);
  }

  async disconnect() {
    for (const deviceId of this.connectedDevices.keys()) {
      try {
        await BleClient.disconnect(deviceId);
      } catch (error) {
        console.error('Error disconnecting from device:', error);
      }
    }
    this.connectedDevices.clear();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const bluetoothMessaging = new BluetoothMeshMessaging();