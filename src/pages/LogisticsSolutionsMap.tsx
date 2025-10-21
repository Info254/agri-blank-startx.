
import React, { useState, useEffect } from 'react';
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { fetchServiceProviders } from '@/services/serviceProvidersAPI';

// Import new components
import ServiceProvidersMap from '@/components/logistics/ServiceProvidersMap';
import MapLegend from '@/components/logistics/MapLegend';
import ProviderFilters from '@/components/logistics/ProviderFilters';
import ProvidersList from '@/components/logistics/ProvidersList';
import RegistrationPrompt from '@/components/logistics/RegistrationPrompt';

const LogisticsSolutionsMap: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceProviderType | 'all'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true);
        const data = await fetchServiceProviders();
        setProviders(data);
        setFilteredProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load service providers. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProviders();
  }, [toast]);
  
  useEffect(() => {
    let filtered = [...providers];
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(provider => provider.businessType === selectedType);
    }
    
    if (selectedCounty !== 'all') {
      filtered = filtered.filter(provider => 
        provider.location.county.toLowerCase() === selectedCounty.toLowerCase()
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(term) || 
        provider.description.toLowerCase().includes(term) ||
        provider.services.some(service => service.toLowerCase().includes(term)) ||
        provider.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, selectedType, selectedCounty, searchTerm]);

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedCounty('all');
    setSearchTerm('');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Logistics Solutions Map</h1>
          <p className="text-muted-foreground">
            Find service providers near you on the interactive map
          </p>
        </div>
        
        <ProviderFilters 
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredProvidersCount={filteredProviders.length}
        />
        
        <MapLegend />
        
        <ServiceProvidersMap 
          providers={filteredProviders}
          selectedType={selectedType}
        />
        
        <ProvidersList 
          providers={filteredProviders}
          isLoading={isLoading}
          resetFilters={resetFilters}
        />
        
        {!isLoading && filteredProviders.length > 9 && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              Show More ({filteredProviders.length - 9} remaining)
            </Button>
          </div>
        )}
        
        <RegistrationPrompt />
      </main>
    </div>
  );
};

export default LogisticsSolutionsMap;
