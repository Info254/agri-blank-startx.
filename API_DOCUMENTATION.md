# AgriConnect API Documentation

## 🔌 API Overview

**Base URL:** `https://xgtmpfginlxrntixpqim.supabase.co`  
**Authentication:** Bearer Token (API Key)  
**Format:** JSON  
**Rate Limiting:** Tier-based (see Pricing section)

---

## 🔐 Authentication

All API requests require authentication using an API key in the Authorization header:

```bash
Authorization: Bearer YOUR_API_KEY
```

### Get API Key
1. Sign up at agriconnect.co.ke
2. Navigate to API Settings
3. Generate your API key
4. Available tiers: Free, Premium, Enterprise

---

## 📊 AVAILABLE API ENDPOINTS

### 1. Market Prices API

#### GET /rest/v1/market_prices
**Description:** Retrieve real-time market prices  
**Authentication:** Required  
**Tier Access:** Free (limited), Premium, Enterprise

**Query Parameters:**
- `county` (optional): Filter by county name
- `commodity_name` (optional): Filter by commodity
- `date_recorded` (optional): Filter by date
- `limit` (optional): Number of results (default: 100)

**Example Request:**
```bash
curl -X GET "https://xgtmpfginlxrntixpqim.supabase.co/rest/v1/market_prices?county=eq.Nairobi&limit=10" \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**
```json
[
  {
    "id": "uuid",
    "market_name": "Gikomba Market",
    "county": "Nairobi",
    "commodity_name": "Maize",
    "price": 4500,
    "unit": "90kg bag",
    "date_recorded": "2025-10-15",
    "created_at": "2025-10-15T10:30:00Z"
  }
]
```

**Rate Limits:**
- Free: 100 requests/day
- Premium: 10,000 requests/day
- Enterprise: Unlimited

---

### 2. Market Forecasts API

#### GET /rest/v1/market_forecasts
**Description:** Access price forecasts and predictions  
**Authentication:** Required  
**Tier Access:** Premium, Enterprise

**Query Parameters:**
- `county` (optional): Filter by county
- `commodity_name` (optional): Filter by commodity
- `period` (optional): Forecast period (week, month, quarter)

**Example Request:**
```bash
curl -X GET "https://xgtmpfginlxrntixpqim.supabase.co/rest/v1/market_forecasts?commodity_name=eq.Tomatoes" \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**
```json
[
  {
    "id": "uuid",
    "commodity_name": "Tomatoes",
    "county": "Kiambu",
    "current_price": 8000,
    "forecast_price": 9500,
    "confidence_level": 0.85,
    "period": "month",
    "created_at": "2025-10-15T10:30:00Z"
  }
]
```

**Rate Limits:**
- Premium: 5,000 requests/day
- Enterprise: Unlimited

---

### 3. Marketplace Listings API

#### GET /rest/v1/marketplace_listings
**Description:** Access agricultural produce listings  
**Authentication:** Required  
**Tier Access:** Free (limited), Premium, Enterprise

**Query Parameters:**
- `status` (optional): Filter by status (active, sold, expired)
- `location` (optional): Filter by location
- `seller_id` (optional): Filter by seller
- `product_id` (optional): Filter by product

**Example Request:**
```bash
curl -X GET "https://xgtmpfginlxrntixpqim.supabase.co/rest/v1/marketplace_listings?status=eq.active&limit=20" \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Example Response:**
```json
[
  {
    "id": "uuid",
    "title": "Fresh Organic Tomatoes",
    "seller_id": "uuid",
    "quantity": 500,
    "unit_price": 80,
    "location": "Kiambu",
    "quality_grade": "Grade A",
    "status": "active",
    "images": ["url1", "url2"],
    "created_at": "2025-10-15T08:00:00Z"
  }
]
```

**Rate Limits:**
- Free: 200 requests/day
- Premium: 15,000 requests/day
- Enterprise: Unlimited

---

### 4. Equipment Marketplace API

#### GET /rest/v1/equipment_marketplace
**Description:** Access agricultural equipment listings  
**Authentication:** Required  
**Tier Access:** Free (limited), Premium, Enterprise

**Query Parameters:**
- `equipment_type` (optional): Filter by type
- `availability_status` (optional): available, sold, rented
- `county` (optional): Filter by county

**Example Response:**
```json
[
  {
    "id": "uuid",
    "equipment_name": "John Deere Tractor",
    "equipment_type": "Tractor",
    "price": 2500000,
    "rental_option": true,
    "rental_price_per_day": 5000,
    "condition": "Excellent",
    "county": "Nakuru"
  }
]
```

---

### 5. Bulk Orders API

#### GET /rest/v1/bulk_orders
**Description:** Access bulk order opportunities  
**Authentication:** Required  
**Tier Access:** Premium, Enterprise

**Query Parameters:**
- `status` (optional): active, completed, expired
- `product_type` (optional): Filter by product
- `location` (optional): Filter by location

**Example Response:**
```json
[
  {
    "id": "uuid",
    "organizer_id": "uuid",
    "product_type": "Maize",
    "quantity": 10000,
    "target_price": 40,
    "deadline": "2025-11-01",
    "current_participants": 25,
    "status": "active"
  }
]
```

---

### 6. Contract Farming API

#### GET /rest/v1/contract_farming
**Description:** Access contract farming opportunities  
**Authentication:** Required  
**Tier Access:** Premium, Enterprise

**Query Parameters:**
- `status` (optional): open, closed, completed
- `crop_type` (optional): Filter by crop
- `county` (optional): Filter by county

**Example Response:**
```json
[
  {
    "id": "uuid",
    "contractor_name": "Kenya Seed Company",
    "crop_type": "Hybrid Maize",
    "required_quantity": 50000,
    "contract_price": 45,
    "application_deadline": "2025-10-30",
    "county": "Trans Nzoia",
    "status": "open"
  }
]
```

---

### 7. Weather Forecasts API

#### GET /rest/v1/weather_forecasts
**Description:** Access weather forecasts with agricultural advisory  
**Authentication:** Required  
**Tier Access:** Free (limited), Premium, Enterprise

**Query Parameters:**
- `county` (optional): Filter by county
- `location` (optional): Filter by location
- `forecast_date` (optional): Specific date

**Example Response:**
```json
[
  {
    "id": "uuid",
    "location": "Eldoret",
    "county": "Uasin Gishu",
    "forecast_date": "2025-10-16",
    "temperature_min": 12,
    "temperature_max": 24,
    "rainfall": 15,
    "weather_condition": "Partly Cloudy",
    "agricultural_advisory": "Good conditions for planting maize",
    "planting_recommendation": "Recommended for cereals"
  }
]
```

---

### 8. Transporters API

#### GET /rest/v1/transporters
**Description:** Access transporter directory  
**Authentication:** Required  
**Tier Access:** Free (limited), Premium, Enterprise

**Query Parameters:**
- `counties` (optional): Filter by service counties
- `vehicle_type` (optional): Filter by vehicle type
- `has_refrigeration` (optional): Filter by cold storage

**Example Response:**
```json
[
  {
    "id": "uuid",
    "name": "Swift Transport Ltd",
    "vehicle_type": "10-ton Truck",
    "load_capacity": "10 tons",
    "counties": ["Nairobi", "Mombasa", "Nakuru"],
    "has_refrigeration": true,
    "contact_info": "+254 700 123 456"
  }
]
```

---

### 9. Training Events API

#### GET /rest/v1/training_events
**Description:** Access agricultural training events  
**Authentication:** Required  
**Tier Access:** Free, Premium, Enterprise

**Query Parameters:**
- `is_active` (optional): Filter by active status
- `is_online` (optional): Filter online/offline events
- `county` (optional): Filter by location

**Example Response:**
```json
[
  {
    "id": "uuid",
    "title": "Modern Dairy Farming Techniques",
    "description": "Learn modern dairy farming...",
    "start_date": "2025-11-05T09:00:00Z",
    "end_date": "2025-11-05T16:00:00Z",
    "location": "Kiambu Agricultural Center",
    "county": "Kiambu",
    "cost": 500,
    "is_online": false,
    "certificate_provided": true,
    "is_active": true
  }
]
```

---

### 10. Cooperative Groups API

#### GET /rest/v1/cooperative_groups
**Description:** Access farmer cooperative directory  
**Authentication:** Required  
**Tier Access:** Premium, Enterprise

**Query Parameters:**
- `status` (optional): active, inactive
- `county` (optional): Filter by county
- `group_type` (optional): Filter by type

**Example Response:**
```json
[
  {
    "id": "uuid",
    "name": "Kiambu Farmers Cooperative",
    "group_type": "Farming Cooperative",
    "registration_number": "KC/2020/456",
    "member_count": 150,
    "county": "Kiambu",
    "activities": ["Dairy", "Coffee", "Tea"],
    "status": "active"
  }
]
```

---

### 11. Farm Input Suppliers API

#### GET /rest/v1/farm_input_suppliers
**Description:** Access farm input supplier directory  
**Authentication:** Required  
**Tier Access:** Free (limited), Premium, Enterprise

**Example Response:**
```json
[
  {
    "id": "uuid",
    "supplier_name": "AgroVet Kenya",
    "contact_info": "+254 700 999 888",
    "products_offered": ["Seeds", "Fertilizers", "Pesticides"],
    "counties_covered": ["Nairobi", "Kiambu", "Machakos"],
    "rating": 4.5,
    "verified": true
  }
]
```

---

### 12. Community Posts API

#### GET /rest/v1/community_posts
**Description:** Access community discussions  
**Authentication:** Required  
**Tier Access:** Premium, Enterprise

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): active, archived
- `tags` (optional): Filter by tags

**Example Response:**
```json
[
  {
    "id": "uuid",
    "author_id": "uuid",
    "title": "Best practices for tomato farming",
    "content": "I've been farming tomatoes...",
    "category": "Crop Management",
    "tags": ["tomatoes", "best-practices"],
    "upvotes": 45,
    "status": "active",
    "created_at": "2025-10-14T14:20:00Z"
  }
]
```

---

## 💰 API PRICING TIERS

### Free Tier
- **Cost:** KES 0/month
- **Rate Limit:** 500 requests/day
- **Access:** Market Prices (limited), Marketplace Listings (limited), Weather, Training Events
- **Support:** Community Support

### Premium Tier
- **Cost:** KES 9,999/month
- **Rate Limit:** 50,000 requests/day
- **Access:** All endpoints except Enterprise-only
- **Support:** Email Support (24hr response)
- **Features:** Historical data (1 year), Webhooks, Advanced filters

### Enterprise Tier
- **Cost:** Custom pricing
- **Rate Limit:** Unlimited
- **Access:** All endpoints
- **Support:** Dedicated account manager, Priority support
- **Features:** Custom integrations, Bulk data exports, Real-time webhooks, Historical data (unlimited)

---

## 🔔 Webhooks (Premium & Enterprise)

Configure webhooks to receive real-time updates:

**Available Events:**
- `market_price.updated`
- `marketplace_listing.created`
- `bulk_order.created`
- `contract_farming.new_opportunity`

**Webhook Configuration:**
```bash
POST /rest/v1/rpc/configure_webhook
{
  "url": "https://your-domain.com/webhook",
  "events": ["market_price.updated"],
  "secret": "your_webhook_secret"
}
```

---

## 📈 Usage Analytics (Premium & Enterprise)

Track your API usage:

#### GET /rest/v1/api_usage_stats
**Description:** View your API usage statistics  
**Authentication:** Required

**Response:**
```json
{
  "period": "month",
  "total_requests": 15432,
  "requests_by_endpoint": {
    "market_prices": 8500,
    "marketplace_listings": 4200,
    "weather_forecasts": 2732
  },
  "rate_limit_remaining": 34568
}
```

---

## 🛡️ Security Best Practices

1. **Never expose API keys** in client-side code
2. **Rotate API keys** regularly (every 90 days recommended)
3. **Use environment variables** to store keys
4. **Implement rate limiting** on your side
5. **Validate webhook signatures** for security
6. **Use HTTPS** for all API calls

---

## 🔄 Data Freshness

| Endpoint | Update Frequency |
|----------|------------------|
| Market Prices | Real-time (5 min intervals) |
| Market Forecasts | Daily (6 AM EAT) |
| Weather Forecasts | Every 6 hours |
| Marketplace Listings | Real-time |
| Training Events | Real-time |

---

## 📞 API Support

**Contact:** sokoconnect@tenderzville-portal.co.ke  
**Developer Portal:** api.agriconnect.co.ke  
**Status Page:** status.agriconnect.co.ke

---

## 🚀 Coming Soon

- GraphQL API
- Mobile SDK (iOS & Android)
- Python SDK
- Real-time notifications via WebSocket
- Machine learning endpoints (crop recommendations, yield prediction)
