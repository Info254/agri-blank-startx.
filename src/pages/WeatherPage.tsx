import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  Gauge,
  MapPin,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Leaf
} from 'lucide-react';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';

interface WeatherData {
  id: string;
  location: string;
  county: string;
  forecast_date: string;
  temperature_min: number;
  temperature_max: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  wind_direction: string;
  weather_condition: string;
  weather_description: string;
  visibility: number;
  uv_index: number;
  pressure: number;
  agricultural_advisory: string;
  planting_recommendation: string;
  harvesting_recommendation: string;
  pest_disease_alert: string;
}

const WeatherPage: React.FC = () => {
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async (location?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('weather_forecasts')
        .select('*')
        .gte('forecast_date', new Date().toISOString().split('T')[0])
        .order('forecast_date');

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setWeatherData(data || []);

      // If no data found and we have a search term, try to fetch from external API
      if ((!data || data.length === 0) && location) {
        await fetchFromExternalAPI(location);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFromExternalAPI = async (location: string) => {
    // In a real implementation, you would call a weather API like OpenWeatherMap
    // For now, we'll create sample data
    const sampleWeatherData = {
      location: location,
      county: 'Sample County',
      forecast_date: new Date().toISOString().split('T')[0],
      temperature_min: 18,
      temperature_max: 26,
      humidity: 65,
      rainfall: 2.5,
      wind_speed: 15,
      wind_direction: 'NE',
      weather_condition: 'Partly Cloudy',
      weather_description: 'Partly cloudy with chance of light rain',
      visibility: 10,
      uv_index: 6,
      pressure: 1013,
      agricultural_advisory: 'Good conditions for field work. Monitor soil moisture levels.',
      planting_recommendation: 'Suitable for planting drought-resistant crops.',
      harvesting_recommendation: 'Good weather for harvesting mature crops.',
      pest_disease_alert: 'Moderate humidity may favor fungal diseases. Monitor crops closely.',
      coordinates: { lat: -1.2921, lng: 36.8219 }
    };

    try {
      const { error } = await supabase
        .from('weather_forecasts')
        .insert([sampleWeatherData]);

      if (error) throw error;

      toast({
        title: "Weather Data Added",
        description: `Weather forecast for ${location} has been added to the database.`,
      });

      fetchWeatherData();
    } catch (error: any) {
      console.error('Error adding weather data:', error);
    }
  };

  const handleSearch = () => {
    if (searchLocation.trim()) {
      setSelectedLocation(searchLocation);
      fetchWeatherData(searchLocation);
    } else {
      setSelectedLocation('');
      fetchWeatherData();
    }
  };

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain')) return <CloudRain className="h-6 w-6" />;
    if (conditionLower.includes('cloud')) return <Cloud className="h-6 w-6" />;
    if (conditionLower.includes('snow')) return <CloudSnow className="h-6 w-6" />;
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) return <Sun className="h-6 w-6" />;
    return <Cloud className="h-6 w-6" />;
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'bg-green-500';
    if (uvIndex <= 5) return 'bg-yellow-500';
    if (uvIndex <= 7) return 'bg-orange-500';
    if (uvIndex <= 10) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const groupedData = weatherData.reduce((acc, item) => {
    const location = item.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(item);
    return acc;
  }, {} as Record<string, WeatherData[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Cloud className="h-8 w-8 mr-3 text-blue-500" />
            Agricultural Weather Forecast
          </h1>
          <p className="text-muted-foreground">
            Get detailed weather forecasts with agricultural insights for better farming decisions
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Weather by Location</CardTitle>
            <CardDescription>
              Enter a location to get specific weather forecasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter location (e.g., Nairobi, Mombasa, Nakuru)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                Search
              </Button>
              <Button variant="outline" onClick={() => {
                setSearchLocation('');
                setSelectedLocation('');
                fetchWeatherData();
              }}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weather Cards */}
        {Object.entries(groupedData).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Weather Data Available</h3>
              <p className="text-muted-foreground mb-4">
                Try searching for a specific location to get weather forecasts.
              </p>
              <Button onClick={() => fetchFromExternalAPI('Nairobi')}>
                Load Sample Data
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedData).map(([location, forecasts]) => (
              <div key={location}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  {location}
                  {forecasts[0]?.county && (
                    <span className="text-sm text-muted-foreground ml-2">
                      , {forecasts[0].county}
                    </span>
                  )}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {forecasts.slice(0, 7).map((forecast) => (
                    <Card key={forecast.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              {getWeatherIcon(forecast.weather_condition)}
                              <span className="ml-2">{forecast.weather_condition}</span>
                            </CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(forecast.forecast_date).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {forecast.temperature_max}°C
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Min: {forecast.temperature_min}°C
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {forecast.weather_description}
                        </p>

                        {/* Weather Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center">
                            <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-muted-foreground">Humidity:</span>
                            <span className="ml-1 font-medium">{forecast.humidity}%</span>
                          </div>
                          
                          <div className="flex items-center">
                            <CloudRain className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="text-muted-foreground">Rainfall:</span>
                            <span className="ml-1 font-medium">{forecast.rainfall}mm</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Wind className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-muted-foreground">Wind:</span>
                            <span className="ml-1 font-medium">{forecast.wind_speed} km/h {forecast.wind_direction}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2 text-gray-600" />
                            <span className="text-muted-foreground">Visibility:</span>
                            <span className="ml-1 font-medium">{forecast.visibility} km</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Gauge className="h-4 w-4 mr-2 text-gray-700" />
                            <span className="text-muted-foreground">Pressure:</span>
                            <span className="ml-1 font-medium">{forecast.pressure} hPa</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                            <span className="text-muted-foreground">UV Index:</span>
                            <Badge className={`ml-1 ${getUVIndexColor(forecast.uv_index)} text-white text-xs`}>
                              {forecast.uv_index}
                            </Badge>
                          </div>
                        </div>

                        {/* Agricultural Insights */}
                        <div className="space-y-3 pt-4 border-t">
                          <h4 className="font-semibold text-sm flex items-center">
                            <Leaf className="h-4 w-4 mr-2 text-green-500" />
                            Agricultural Insights
                          </h4>
                          
                          {forecast.agricultural_advisory && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm">
                                <strong>Advisory:</strong> {forecast.agricultural_advisory}
                              </p>
                            </div>
                          )}
                          
                          {forecast.planting_recommendation && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm">
                                <strong>Planting:</strong> {forecast.planting_recommendation}
                              </p>
                            </div>
                          )}
                          
                          {forecast.harvesting_recommendation && (
                            <div className="bg-yellow-50 p-3 rounded-lg">
                              <p className="text-sm">
                                <strong>Harvesting:</strong> {forecast.harvesting_recommendation}
                              </p>
                            </div>
                          )}
                          
                          {forecast.pest_disease_alert && (
                            <div className="bg-red-50 p-3 rounded-lg">
                              <p className="text-sm flex items-start">
                                <AlertTriangle className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Alert:</strong> {forecast.pest_disease_alert}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weather Information Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Understanding Weather Forecasts for Agriculture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Temperature Guidelines</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Optimal growing: 20-30°C for most crops</li>
                  <li>• Below 10°C: Risk of frost damage</li>
                  <li>• Above 35°C: Heat stress for plants</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Rainfall Indicators</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 0-5mm: Light rain, good for irrigation</li>
                  <li>• 5-15mm: Moderate rain, ideal for most crops</li>
                  <li>• 15mm+: Heavy rain, possible flooding risk</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Humidity Effects</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 40-60%: Optimal for most crops</li>
                  <li>• Below 40%: Risk of water stress</li>
                  <li>• Above 80%: Increased disease risk</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">UV Index Guide</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 0-2: Low, minimal crop protection needed</li>
                  <li>• 3-5: Moderate, standard growing conditions</li>
                  <li>• 6-7: High, consider shade for sensitive crops</li>
                  <li>• 8+: Very high, protect crops from sun damage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default WeatherPage;