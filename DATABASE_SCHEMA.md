# AgriConnect Database Schema Documentation

## 📊 Database Overview

**Database Type:** PostgreSQL (via Supabase)  
**Total Tables:** 45+  
**Security:** Row-Level Security (RLS) enabled on all tables

---

## 🗄️ COMPLETE TABLES

### 1. User & Authentication

#### `profiles`
- **Status:** ✅ Complete
- **Purpose:** User profile information
- **Key Columns:** id, user_id, full_name, avatar_url, bio, location, phone
- **RLS Policies:** ✅ Users can view/update their own profiles

#### `auth_rate_limits`
- **Status:** ✅ Complete
- **Purpose:** Rate limiting for authentication attempts
- **Key Columns:** id, user_identifier, attempt_count, last_attempt, blocked_until
- **RLS Policies:** ✅ System-managed

---

### 2. Marketplace & Trading

#### `marketplace_listings`
- **Status:** ✅ Complete
- **Purpose:** Agricultural produce listings
- **Key Columns:** id, seller_id, product_id, quantity, unit_price, location, status, images
- **RLS Policies:** ✅ Users view active listings, manage own listings

#### `equipment_marketplace`
- **Status:** ✅ Complete
- **Purpose:** Equipment sales & rentals
- **Key Columns:** id, seller_id, equipment_name, brand, price, rental_price_per_day, condition
- **RLS Policies:** ✅ Public view, seller management

#### `my_trades`
- **Status:** ✅ Complete
- **Purpose:** Trade transactions between users
- **Key Columns:** id, buyer_id, seller_id, product_id, quantity, total_amount, status
- **RLS Policies:** ✅ Users view their own trades

#### `bulk_orders`
- **Status:** ✅ Complete
- **Purpose:** Bulk order coordination
- **Key Columns:** id, organizer_id, product_type, quantity, target_price, deadline, status
- **RLS Policies:** ✅ Public view active, organizer management

#### `bulk_order_bids`
- **Status:** ✅ Complete
- **Purpose:** Bids on bulk orders
- **Key Columns:** id, order_id, bidder_id, bid_price, quantity_offered, status
- **RLS Policies:** ✅ Bidders & organizers can view

#### `reverse_bulk_auctions`
- **Status:** ✅ Complete
- **Purpose:** Reverse auction system
- **Key Columns:** id, buyer_id, product_name, quantity, max_price, deadline, status
- **RLS Policies:** ✅ Public view, buyer management

#### `reverse_auction_bids`
- **Status:** ✅ Complete
- **Purpose:** Bids on reverse auctions
- **Key Columns:** id, auction_id, bidder_id, bid_price, delivery_timeframe, status
- **RLS Policies:** ✅ Bidders & buyers can view

#### `contract_farming`
- **Status:** ✅ Complete
- **Purpose:** Contract farming opportunities
- **Key Columns:** id, contractor_id, crop_type, required_quantity, contract_price, status
- **RLS Policies:** ✅ Public view open contracts

---

### 3. Farm Input Management

#### `farm_input_suppliers`
- **Status:** ✅ Complete
- **Purpose:** Farm input supplier directory
- **Key Columns:** id, supplier_name, contact_info, products_offered, counties_covered
- **RLS Policies:** ✅ Public view, supplier management

#### `farm_input_products`
- **Status:** ✅ Complete
- **Purpose:** Farm input products catalog
- **Key Columns:** id, supplier_id, product_name, category, price, unit, stock_quantity
- **RLS Policies:** ✅ Public view, supplier management

#### `farm_input_orders`
- **Status:** ✅ Complete
- **Purpose:** Farm input orders
- **Key Columns:** id, buyer_id, supplier_id, total_amount, delivery_address, status
- **RLS Policies:** ✅ Buyers & suppliers view their orders

#### `farm_input_product_bookmarks`
- **Status:** ✅ Complete
- **Purpose:** User bookmarks for products
- **Key Columns:** id, user_id, product_id
- **RLS Policies:** ✅ Users manage own bookmarks

#### `farm_input_supplier_likes`
- **Status:** ✅ Complete
- **Purpose:** User likes for suppliers
- **Key Columns:** id, user_id, supplier_id
- **RLS Policies:** ✅ Users manage own likes

#### `group_input_orders`
- **Status:** ✅ Complete
- **Purpose:** Group orders for farm inputs
- **Key Columns:** id, organizer_id, product_type, target_quantity, target_price, deadline
- **RLS Policies:** ✅ Public view, organizer management

#### `group_order_participants`
- **Status:** ✅ Complete
- **Purpose:** Participants in group orders
- **Key Columns:** id, order_id, participant_id, quantity
- **RLS Policies:** ✅ Participants view their involvement

---

### 4. Livestock Management

#### `animals`
- **Status:** ✅ Complete
- **Purpose:** Livestock tracking
- **Key Columns:** id, user_id, name, species, breed, birth_date, status, image_url
- **RLS Policies:** ✅ Users manage own animals

#### `animal_health_records`
- **Status:** ✅ Complete
- **Purpose:** Animal health tracking
- **Key Columns:** id, animal_id, record_date, record_type, diagnosis, treatment
- **RLS Policies:** ✅ Owners view records

---

### 5. Market Intelligence

#### `market_prices`
- **Status:** ✅ Complete
- **Purpose:** Real-time market prices
- **Key Columns:** id, market_name, county, commodity_name, price, unit, date_recorded
- **RLS Policies:** ✅ Public view, authenticated insert

#### `market_forecasts`
- **Status:** ✅ Complete
- **Purpose:** Price forecasts
- **Key Columns:** id, commodity_name, county, current_price, forecast_price, confidence_level
- **RLS Policies:** ✅ Public view

#### `market_linkages`
- **Status:** ✅ Complete
- **Purpose:** Market connections & opportunities
- **Key Columns:** id, buyer_id, seller_id, product_type, quantity, price, status
- **RLS Policies:** ✅ Parties view their linkages

---

### 6. Logistics & Transportation

#### `transporters`
- **Status:** ✅ Complete
- **Purpose:** Transporter directory
- **Key Columns:** id, name, vehicle_type, load_capacity, counties, has_refrigeration
- **RLS Policies:** ✅ Public view, authenticated insert

#### `transportation_requests`
- **Status:** ✅ Complete
- **Purpose:** Transportation service requests
- **Key Columns:** id, requester_id, pickup_location, delivery_location, cargo_type, status
- **RLS Policies:** ✅ Requesters manage own requests

#### `warehouses`
- **Status:** ✅ Complete
- **Purpose:** Warehouse directory
- **Key Columns:** id, name, location, capacity, storage_types, has_cold_storage
- **RLS Policies:** ✅ Public view

#### `warehouse_bookings`
- **Status:** ✅ Complete
- **Purpose:** Warehouse bookings
- **Key Columns:** id, user_id, warehouse_id, product_type, quantity_tons, storage_start_date
- **RLS Policies:** ✅ Users manage own bookings

---

### 7. Community & Social

#### `community_posts`
- **Status:** ✅ Complete
- **Purpose:** Community forum posts
- **Key Columns:** id, author_id, title, content, category, tags, upvotes, downvotes, status
- **RLS Policies:** ✅ Public view active, authors manage own

#### `community_comments`
- **Status:** ✅ Complete
- **Purpose:** Comments on community posts
- **Key Columns:** id, post_id, author_id, content, parent_comment_id
- **RLS Policies:** ✅ Public view, authors manage own

#### `community_post_likes`
- **Status:** ✅ Complete
- **Purpose:** Post likes
- **Key Columns:** id, post_id, user_id
- **RLS Policies:** ✅ Users manage own likes

#### `community_post_reports`
- **Status:** ✅ Complete
- **Purpose:** Content moderation reports
- **Key Columns:** id, post_id, reporter_id, reason, description, status
- **RLS Policies:** ✅ Users create reports, moderators manage

#### `success_stories`
- **Status:** ✅ Complete
- **Purpose:** User success stories
- **Key Columns:** id, author_id, title, story, category, is_published, is_featured
- **RLS Policies:** ✅ Public view published, authors manage own

---

### 8. Training & Events

#### `training_events`
- **Status:** ✅ Complete
- **Purpose:** Training events management
- **Key Columns:** id, organizer_id, title, description, start_date, end_date, location, fee, is_active, is_online, certificate_provided
- **RLS Policies:** ✅ Public view, organizers manage own
- **Auto-Cleanup:** ✅ Events marked inactive 3 days after end_date

#### `agricultural_events`
- **Status:** ✅ Complete
- **Purpose:** Agricultural events
- **Key Columns:** id, organizer_id, title, event_type, location, start_date, entry_fee
- **RLS Policies:** ✅ Public view upcoming, organizers manage own

---

### 9. Cooperative & Groups

#### `cooperative_groups`
- **Status:** ✅ Complete
- **Purpose:** Farmer cooperatives
- **Key Columns:** id, name, group_type, registration_number, member_count, activities
- **RLS Policies:** ✅ Public view active, leaders manage own

#### `group_members`
- **Status:** ✅ Complete
- **Purpose:** Group membership
- **Key Columns:** id, group_id, user_id, role, joined_at
- **RLS Policies:** ✅ Members view membership

#### `group_messages`
- **Status:** ✅ Complete
- **Purpose:** Group messaging
- **Key Columns:** id, group_id, sender_id, message_text, message_type
- **RLS Policies:** ✅ Members view/send messages

---

### 10. Reviews & Ratings

#### `reviews`
- **Status:** ✅ Complete
- **Purpose:** General reviews
- **Key Columns:** id, reviewer_id, reviewed_entity_type, reviewed_entity_id, rating, review_text
- **RLS Policies:** ✅ Public view, reviewers manage own

#### `input_supplier_reviews`
- **Status:** ✅ Complete
- **Purpose:** Farm input supplier reviews
- **Key Columns:** id, reviewer_id, supplier_name, rating, delivery_timeliness, product_quality
- **RLS Policies:** ✅ Public view, reviewers manage own

---

### 11. Bluetooth Offline Features

#### `bluetooth_devices`
- **Status:** ✅ Complete
- **Purpose:** Bluetooth mesh network devices
- **Key Columns:** id, device_id, device_name, last_seen, location
- **RLS Policies:** ✅ Public view active

#### `bluetooth_shared_prices`
- **Status:** ✅ Complete
- **Purpose:** Offline price sharing via Bluetooth
- **Key Columns:** id, commodity, price, unit, location, shared_by_device, expires_at
- **RLS Policies:** ✅ Users share & view prices

#### `bluetooth_alerts`
- **Status:** ✅ Complete
- **Purpose:** Offline alerts distribution
- **Key Columns:** id, alert_type, message, severity, expires_at
- **RLS Policies:** ✅ Public view active

#### `bluetooth_traders`
- **Status:** ✅ Complete
- **Purpose:** Trader discovery via Bluetooth
- **Key Columns:** id, trader_name, products, contact_method, last_announced
- **RLS Policies:** ✅ Public view active

---

### 12. Weather & Forecasting

#### `weather_forecasts`
- **Status:** ✅ Complete
- **Purpose:** Weather forecasts with agricultural advisory
- **Key Columns:** id, location, county, forecast_date, temperature_min/max, rainfall, agricultural_advisory
- **RLS Policies:** ✅ Public view, system managed

---

### 13. Food Rescue & Donations

#### `donations`
- **Status:** ✅ Complete
- **Purpose:** Donation tracking
- **Key Columns:** id, donor_id, recipient_id, donation_type, amount, items_description, status
- **RLS Policies:** ✅ Donors manage own donations

---

### 14. Partner System

#### `partners`
- **Status:** ✅ Complete
- **Purpose:** Platform partners
- **Key Columns:** id, user_id, company_name, contact_email, website, description, logo_url
- **RLS Policies:** ✅ Public view, partners manage own

#### `partner_events`
- **Status:** ✅ Complete
- **Purpose:** Partner-organized events
- **Key Columns:** id, partner_id, title, description, event_date, location, image_url
- **RLS Policies:** ✅ Public view, partners manage own

---

### 15. Farm-to-Consumer (F2C)

#### `subscription_boxes`
- **Status:** ✅ Complete (Table) / ❌ UI Incomplete
- **Purpose:** F2C subscription boxes
- **Key Columns:** id, farmer_id, box_name, description, price, delivery_frequency, items
- **RLS Policies:** ✅ Public view, farmers manage own

#### `subscription_box_deliveries`
- **Status:** ✅ Complete (Table) / ❌ UI Incomplete
- **Purpose:** Subscription deliveries
- **Key Columns:** id, subscription_id, subscriber_id, delivery_date, delivery_status
- **RLS Policies:** ✅ Subscribers & farmers view

---

## 🚧 INCOMPLETE / MISSING TABLES

### 1. Export Opportunities
- **Status:** ❌ Table Missing
- **Needed Columns:** id, opportunity_title, destination_country, commodity, volume, certifications_required, deadline, contact_info
- **Priority:** HIGH

### 2. Community Post Shares
- **Status:** ❌ Table Missing
- **Needed Columns:** id, post_id, user_id, shared_at
- **Priority:** MEDIUM

### 3. Community Post Reposts
- **Status:** ❌ Table Missing
- **Needed Columns:** id, original_post_id, reposted_by, repost_caption, reposted_at
- **Priority:** MEDIUM

### 4. Route-Based Markets
- **Status:** ❌ Table Missing
- **Needed Columns:** id, route_name, start_location, end_location, market_points, active_listings
- **Priority:** HIGH

### 5. API Access Logs
- **Status:** ❌ Table Missing
- **Needed Columns:** id, user_id, endpoint, request_count, response_time, timestamp
- **Priority:** MEDIUM

---

## 🔒 Security Features

- ✅ Row-Level Security (RLS) on all tables
- ✅ User authentication via Supabase Auth
- ✅ Rate limiting for authentication
- ✅ Secure foreign key relationships
- ✅ Triggers for updated_at timestamps
- ✅ Data validation via database constraints

---

## 📈 Database Health: 90%

**Total Tables:** 45+  
**Complete:** 42  
**Incomplete:** 3  
**Missing:** 5
