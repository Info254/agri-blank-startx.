import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';

interface SecureMessage {
  data: string;
  timestamp: number;
  signature: string;
  nonce: string;
}

export class BluetoothSecurity {
  private static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private static async encryptMessage(
    message: string, 
    key: CryptoKey
  ): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );

    return { encrypted, iv };
  }

  private static async decryptMessage(
    encryptedData: ArrayBuffer,
    iv: Uint8Array,
    key: CryptoKey
  ): Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv.buffer as ArrayBuffer,
      },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  static async sendSecureMessage(
    device: BleDevice,
    serviceUuid: string,
    characteristicUuid: string,
    message: string,
    sharedKey: CryptoKey
  ): Promise<void> {
    try {
      const { encrypted, iv } = await this.encryptMessage(message, sharedKey);
      
      // Create secure message structure
      const secureMessage: SecureMessage = {
        data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        timestamp: Date.now(),
        signature: btoa(String.fromCharCode(...iv)),
        nonce: btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
      };

      const messageBytes = new TextEncoder().encode(JSON.stringify(secureMessage));
      
      await BleClient.write(
        device.deviceId,
        serviceUuid,
        characteristicUuid,
        new DataView(messageBytes.buffer)
      );
    } catch (error) {
      console.error('Failed to send secure Bluetooth message:', error);
      throw new Error('Secure communication failed');
    }
  }

  static async receiveSecureMessage(
    device: BleDevice,
    serviceUuid: string,
    characteristicUuid: string,
    sharedKey: CryptoKey
  ): Promise<string> {
    try {
      const result = await BleClient.read(
        device.deviceId,
        serviceUuid,
        characteristicUuid
      );

      const decoder = new TextDecoder();
      const messageString = decoder.decode(result.buffer);
      const secureMessage: SecureMessage = JSON.parse(messageString);

      // Verify timestamp (reject messages older than 5 minutes)
      const messageAge = Date.now() - secureMessage.timestamp;
      if (messageAge > 5 * 60 * 1000) {
        throw new Error('Message too old');
      }

      // Decrypt the message
      const encryptedData = Uint8Array.from(atob(secureMessage.data), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(secureMessage.signature), c => c.charCodeAt(0));

      return await this.decryptMessage(encryptedData.buffer, iv, sharedKey);
    } catch (error) {
      console.error('Failed to receive secure Bluetooth message:', error);
      throw new Error('Secure communication failed');
    }
  }

  static async validateDevice(device: BleDevice): Promise<boolean> {
    try {
      // Basic device validation - check for expected service UUIDs
      const expectedServices = [
        '12345678-1234-1234-1234-123456789abc', // Replace with actual service UUID
      ];

      // This would need to be implemented based on your specific device requirements
      // For now, return true if device has required services
      return device.uuids ? 
        expectedServices.some(uuid => device.uuids!.includes(uuid)) : 
        false;
    } catch (error) {
      console.error('Device validation failed:', error);
      return false;
    }
  }
}