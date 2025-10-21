import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different provider types
const createCustomIcon = (type: ServiceProviderType) => {
  const colors = {
    'storage': '#3b82f6',
    'transport': '#f59e0b',
    'quality-control': '#ef4444',
    'market-linkage': '#8b5cf6',
    'training': '#10b981',
    'input-supplier': '#6366f1',
    'inspector': '#f97316',
    'insurance-provider': '#06b6d4',
    'soil-testing-provider': '#84cc16',
    'drone-satellite-imagery-provider': '#ec4899',
    'iot-sensor-data-provider': '#14b8a6',
    'export-transporters': '#f59e0b',
    'shippers': '#8b5cf6'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${colors[type]}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

interface ServiceProvidersMapProps {
  providers: ServiceProvider[];
  selectedType: ServiceProviderType | 'all';
}

const ServiceProvidersMap: React.FC<ServiceProvidersMapProps> = ({ providers, selectedType }) => {
  const { toast } = useToast();

  // Kenya bounds
  const kenyaBounds: [number, number] = [-1.2921, 36.8219]; // Nairobi coordinates as center
  
  // Get provider coordinates or fallback to random Kenya location
  const getProviderCoordinates = (provider: ServiceProvider): [number, number] => {
    if (provider.location.coordinates?.latitude && provider.location.coordinates?.longitude) {
      return [provider.location.coordinates.latitude, provider.location.coordinates.longitude];
    }
    
    // Fallback coordinates for different counties in Kenya
    const countyCoordinates: Record<string, [number, number]> = {
      'Nairobi': [-1.2921, 36.8219],
      'Mombasa': [-4.0435, 39.6682],
      'Kisumu': [-0.0917, 34.7680],
      'Nakuru': [-0.3031, 36.0800],
      'Eldoret': [0.5143, 35.2698],
      'Thika': [-1.0332, 37.0692],
      'Malindi': [-3.2194, 40.1169],
      'Kitale': [1.0153, 35.0006],
      'Garissa': [-0.4536, 39.6401],
      'Kakamega': [0.2827, 34.7519]
    };
    
    return countyCoordinates[provider.location.county] || [-1.2921, 36.8219];
  };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        center={kenyaBounds}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Major roads in Kenya (A1-A9) */}
        {/* A1: Nairobi to Mombasa */}
        <Marker position={[-1.2921, 36.8219]} icon={createCustomIcon('transport')}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">A1 Highway Hub</h3>
              <p className="text-sm">Nairobi - Mombasa Corridor</p>
            </div>
          </Popup>
        </Marker>
        
        <Marker position={[-4.0435, 39.6682]} icon={createCustomIcon('transport')}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">Port of Mombasa</h3>
              <p className="text-sm">Major freight gateway</p>
            </div>
          </Popup>
        </Marker>
        
        {/* A2: Nairobi to Nakuru */}
        <Marker position={[-0.3031, 36.0800]} icon={createCustomIcon('storage')}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">A2 Distribution Center</h3>
              <p className="text-sm">Nakuru Agricultural Hub</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Service provider markers */}
        {providers.map((provider, index) => {
          const position = getProviderCoordinates(provider);
          return (
            <Marker
              key={provider.id || index}
              position={position}
              icon={createCustomIcon(provider.businessType)}
            >
              <Popup maxWidth={300}>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {provider.businessType} • {provider.location.county}
                    </p>
                  </div>
                  
                  <p className="text-sm">{provider.description}</p>
                  
                  {provider.services && provider.services.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.services.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {service}
                          </span>
                        ))}
                        {provider.services.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{provider.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {provider.contactInfo && (
                    <div className="text-sm">
                      <p>📞 {provider.contactInfo}</p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {providers.length > 0 && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md z-[1000]">
          <p className="font-medium text-sm">
            Showing {providers.length} providers
            {selectedType !== 'all' ? ` of type ${selectedType}` : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceProvidersMap;