import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Partner {
  id: string;
  company_name: string;
  logo_url?: string;
  website?: string;
  description?: string;
}

interface PartnerCarouselProps {
  partners?: Partner[];
}

const PartnerCarousel: React.FC<PartnerCarouselProps> = ({ partners: externalPartners }) => {
  const [partners, setPartners] = useState<Partner[]>([]);

  // Default demo partners if none provided
  const demoPartners: Partner[] = [
    {
      id: '1',
      company_name: 'Kenya Seed Company',
      logo_url: 'https://via.placeholder.com/200x100?text=Kenya+Seed+Co',
      website: 'https://kenyaseed.com',
      description: 'Leading seed supplier in East Africa'
    },
    {
      id: '2',
      company_name: 'Equity Bank',
      logo_url: 'https://via.placeholder.com/200x100?text=Equity+Bank',
      website: 'https://equitybank.co.ke',
      description: 'Agricultural financing partner'
    },
    {
      id: '3',
      company_name: 'Safaricom',
      logo_url: 'https://via.placeholder.com/200x100?text=Safaricom',
      website: 'https://safaricom.co.ke',
      description: 'M-Pesa integration partner'
    },
    {
      id: '4',
      company_name: 'Ministry of Agriculture',
      logo_url: 'https://via.placeholder.com/200x100?text=Ministry+Agric',
      website: 'https://kilimo.go.ke',
      description: 'Government strategic partner'
    },
    {
      id: '5',
      company_name: 'Kenya Agricultural Research',
      logo_url: 'https://via.placeholder.com/200x100?text=KALRO',
      website: 'https://kalro.org',
      description: 'Research and development partner'
    },
    {
      id: '6',
      company_name: 'Twiga Foods',
      logo_url: 'https://via.placeholder.com/200x100?text=Twiga+Foods',
      website: 'https://twiga.com',
      description: 'Distribution network partner'
    }
  ];

  useEffect(() => {
    // Use provided partners or fall back to demo
    setPartners(externalPartners && externalPartners.length > 0 ? externalPartners : demoPartners);
  }, [externalPartners]);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Our Trusted Partners</h2>
          <p className="text-muted-foreground">
            Working together to transform agriculture in Kenya
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {partners.map((partner) => (
              <CarouselItem key={partner.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt={partner.company_name}
                        className="h-20 w-auto object-contain mb-4"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/200x100?text=${encodeURIComponent(partner.company_name)}`;
                        }}
                      />
                    ) : (
                      <div className="h-20 w-full bg-muted rounded flex items-center justify-center mb-4">
                        <span className="text-lg font-bold text-muted-foreground">
                          {partner.company_name}
                        </span>
                      </div>
                    )}
                    <h3 className="font-semibold text-lg text-center mb-2">
                      {partner.company_name}
                    </h3>
                    {partner.description && (
                      <p className="text-sm text-muted-foreground text-center line-clamp-2">
                        {partner.description}
                      </p>
                    )}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2"
                      >
                        Visit Website
                      </a>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => window.location.href = '/partner-with-us'}>
            Become a Partner
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PartnerCarousel;
