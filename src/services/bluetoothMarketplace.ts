import { bluetoothMessaging, BluetoothMessage } from './bluetoothMessaging';
import { BluetoothSecurity } from './security/bluetoothSecurity';

export interface MarketplacePrice {
  id: string;
  commodity: string;
  price: number;
  unit: string;
  location: string;
  county: string;
  market: string;
  timestamp: number;
  source: 'user' | 'verified' | 'market_data';
  quality?: string;
  seller_id?: string;
  contact?: string;
}

export interface MarketplaceAlert {
  id: string;
  type: 'price_drop' | 'price_rise' | 'high_demand' | 'low_supply' | 'buyer_request' | 'seller_offer';
  commodity: string;
  location: string;
  county: string;
  message: string;
  threshold?: number;
  timestamp: number;
  user_id: string;
  contact?: string;
}

export interface BluetoothTrader {
  id: string;
  name: string;
  type: 'buyer' | 'seller' | 'transporter' | 'service_provider';
  location: string;
  county: string;
  commodities: string[];
  services?: string[];
  contact: string;
  rating?: number;
  last_seen: number;
  device_id: string;
}

class BluetoothMarketplaceService {
  private prices: Map<string, MarketplacePrice> = new Map();
  private alerts: Map<string, MarketplaceAlert> = new Map();
  private traders: Map<string, BluetoothTrader> = new Map();
  private priceListeners: ((prices: MarketplacePrice[]) => void)[] = [];
  private alertListeners: ((alerts: MarketplaceAlert[]) => void)[] = [];
  private traderListeners: ((traders: BluetoothTrader[]) => void)[] = [];

  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    const bluetoothReady = await bluetoothMessaging.initialize();
    if (!bluetoothReady) return false;

    // Listen for incoming marketplace messages
    bluetoothMessaging.onMessage(this.handleMarketplaceMessage.bind(this));

    // Start periodic discovery and data sharing
    this.startPeriodicDiscovery();
    this.startPeriodicDataShare();

    this.isInitialized = true;
    console.log('Bluetooth Marketplace initialized');
    return true;
  }

  // PRICE DISCOVERY AND SHARING
  async broadcastPrice(price: Omit<MarketplacePrice, 'id' | 'timestamp'>): Promise<void> {
    const priceData: MarketplacePrice = {
      ...price,
      id: `price-${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    };

    // Add to local cache
    this.prices.set(priceData.id, priceData);
    
    // Broadcast to nearby devices
    await this.broadcastMessage('price_update', priceData);
    
    // Notify listeners
    this.notifyPriceListeners();
  }

  async requestPrices(commodity: string, location?: string): Promise<void> {
    const request = {
      type: 'price_request',
      commodity,
      location,
      timestamp: Date.now(),
      requester_id: await this.getDeviceId()
    };

    await this.broadcastMessage('price_request', request);
  }

  getPricesNearby(commodity?: string, location?: string): MarketplacePrice[] {
    const allPrices = Array.from(this.prices.values());
    
    return allPrices
      .filter(price => {
        // Filter by commodity if specified
        if (commodity && !price.commodity.toLowerCase().includes(commodity.toLowerCase())) {
          return false;
        }
        
        // Filter by location if specified
        if (location && !price.location.toLowerCase().includes(location.toLowerCase()) &&
            !price.county.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }
        
        // Only show prices from last 24 hours
        return Date.now() - price.timestamp < 24 * 60 * 60 * 1000;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // ALERT SYSTEM
  async broadcastAlert(alert: Omit<MarketplaceAlert, 'id' | 'timestamp'>): Promise<void> {
    const alertData: MarketplaceAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    };

    // Add to local cache
    this.alerts.set(alertData.id, alertData);
    
    // Broadcast to nearby devices
    await this.broadcastMessage('marketplace_alert', alertData);
    
    // Notify listeners
    this.notifyAlertListeners();
  }

  getAlertsNearby(commodity?: string, location?: string): MarketplaceAlert[] {
    const allAlerts = Array.from(this.alerts.values());
    
    return allAlerts
      .filter(alert => {
        // Filter by commodity if specified
        if (commodity && !alert.commodity.toLowerCase().includes(commodity.toLowerCase())) {
          return false;
        }
        
        // Filter by location if specified
        if (location && !alert.location.toLowerCase().includes(location.toLowerCase()) &&
            !alert.county.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }
        
        // Only show alerts from last 6 hours
        return Date.now() - alert.timestamp < 6 * 60 * 60 * 1000;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // TRADER DISCOVERY
  async announceTrader(trader: Omit<BluetoothTrader, 'id' | 'last_seen' | 'device_id'>): Promise<void> {
    const traderData: BluetoothTrader = {
      ...trader,
      id: `trader-${Date.now()}-${Math.random()}`,
      last_seen: Date.now(),
      device_id: await this.getDeviceId()
    };

    // Add to local cache
    this.traders.set(traderData.device_id, traderData);
    
    // Broadcast to nearby devices
    await this.broadcastMessage('trader_announcement', traderData);
    
    // Notify listeners
    this.notifyTraderListeners();
  }

  findTraders(type?: string, commodity?: string, location?: string): BluetoothTrader[] {
    const allTraders = Array.from(this.traders.values());
    
    return allTraders
      .filter(trader => {
        // Filter by type if specified
        if (type && trader.type !== type) {
          return false;
        }
        
        // Filter by commodity if specified
        if (commodity && !trader.commodities.some(c => 
          c.toLowerCase().includes(commodity.toLowerCase()))) {
          return false;
        }
        
        // Filter by location if specified
        if (location && !trader.location.toLowerCase().includes(location.toLowerCase()) &&
            !trader.county.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }
        
        // Only show traders seen in last 30 minutes
        return Date.now() - trader.last_seen < 30 * 60 * 1000;
      })
      .sort((a, b) => b.last_seen - a.last_seen);
  }

  // MESSAGING AND COMMUNICATION
  private async broadcastMessage(type: string, data: any): Promise<void> {
    const message = {
      type: 'marketplace',
      subtype: type,
      data,
      timestamp: Date.now(),
      sender: await this.getDeviceId()
    };

    await bluetoothMessaging.sendMessage(JSON.stringify(message));
  }

  private handleMarketplaceMessage(message: BluetoothMessage): void {
    try {
      const parsed = JSON.parse(message.content);
      
      if (parsed.type !== 'marketplace') return;
      
      switch (parsed.subtype) {
        case 'price_update':
          this.handlePriceUpdate(parsed.data);
          break;
        case 'price_request':
          this.handlePriceRequest(parsed.data);
          break;
        case 'marketplace_alert':
          this.handleMarketplaceAlert(parsed.data);
          break;
        case 'trader_announcement':
          this.handleTraderAnnouncement(parsed.data);
          break;
      }
    } catch (error) {
      console.error('Error processing marketplace message:', error);
    }
  }

  private handlePriceUpdate(priceData: MarketplacePrice): void {
    // Validate and store price update
    if (this.validatePriceData(priceData)) {
      this.prices.set(priceData.id, priceData);
      this.notifyPriceListeners();
    }
  }

  private async handlePriceRequest(request: any): Promise<void> {
    // Find relevant prices and send back
    const relevantPrices = this.getPricesNearby(request.commodity, request.location);
    
    if (relevantPrices.length > 0) {
      for (const price of relevantPrices.slice(0, 5)) { // Send top 5 prices
        await this.broadcastMessage('price_update', price);
      }
    }
  }

  private handleMarketplaceAlert(alertData: MarketplaceAlert): void {
    // Validate and store alert
    if (this.validateAlertData(alertData)) {
      this.alerts.set(alertData.id, alertData);
      this.notifyAlertListeners();
    }
  }

  private handleTraderAnnouncement(traderData: BluetoothTrader): void {
    // Validate and store trader info
    if (this.validateTraderData(traderData)) {
      this.traders.set(traderData.device_id, traderData);
      this.notifyTraderListeners();
    }
  }

  // PERIODIC OPERATIONS
  private startPeriodicDiscovery(): void {
    // Announce self every 5 minutes
    setInterval(async () => {
      // This would be populated from user profile
      const userTrader = await this.getUserTraderProfile();
      if (userTrader) {
        await this.announceTrader(userTrader);
      }
    }, 5 * 60 * 1000);
  }

  private startPeriodicDataShare(): void {
    // Share recent prices every 10 minutes
    setInterval(async () => {
      const recentPrices = Array.from(this.prices.values())
        .filter(price => Date.now() - price.timestamp < 60 * 60 * 1000) // Last hour
        .slice(0, 3); // Top 3 recent prices
      
      for (const price of recentPrices) {
        await this.broadcastMessage('price_update', price);
      }
    }, 10 * 60 * 1000);
  }

  // VALIDATION
  private validatePriceData(price: MarketplacePrice): boolean {
    return !!(price.commodity && price.price > 0 && price.unit && price.location);
  }

  private validateAlertData(alert: MarketplaceAlert): boolean {
    return !!(alert.commodity && alert.message && alert.location && alert.type);
  }

  private validateTraderData(trader: BluetoothTrader): boolean {
    return !!(trader.name && trader.type && trader.location && trader.commodities?.length);
  }

  // LISTENERS
  onPricesUpdate(listener: (prices: MarketplacePrice[]) => void): void {
    this.priceListeners.push(listener);
  }

  onAlertsUpdate(listener: (alerts: MarketplaceAlert[]) => void): void {
    this.alertListeners.push(listener);
  }

  onTradersUpdate(listener: (traders: BluetoothTrader[]) => void): void {
    this.traderListeners.push(listener);
  }

  private notifyPriceListeners(): void {
    const prices = Array.from(this.prices.values());
    this.priceListeners.forEach(listener => listener(prices));
  }

  private notifyAlertListeners(): void {
    const alerts = Array.from(this.alerts.values());
    this.alertListeners.forEach(listener => listener(alerts));
  }

  private notifyTraderListeners(): void {
    const traders = Array.from(this.traders.values());
    this.traderListeners.forEach(listener => listener(traders));
  }

  // UTILITY
  private async getDeviceId(): Promise<string> {
    // This would get actual device ID
    return 'device-' + Math.random().toString(36).substr(2, 9);
  }

  private async getUserTraderProfile(): Promise<Omit<BluetoothTrader, 'id' | 'last_seen' | 'device_id'> | null> {
    // This would get from user profile/settings
    return {
      name: 'John Farmer',
      type: 'seller',
      location: 'Nakuru',
      county: 'Nakuru',
      commodities: ['maize', 'beans', 'potatoes'],
      contact: '+254700000000',
      rating: 4.5
    };
  }

  // CLEANUP
  async disconnect(): Promise<void> {
    await bluetoothMessaging.disconnect();
    this.prices.clear();
    this.alerts.clear();
    this.traders.clear();
    this.isInitialized = false;
  }
}

export const bluetoothMarketplace = new BluetoothMarketplaceService();