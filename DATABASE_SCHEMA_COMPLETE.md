# SokoConnect Complete Database Schema

**Total Tables:** 111  
**Last Updated:** January 20, 2026  
**Security:** 100% Row Level Security (RLS) enabled

---

## Table Categories

### 1. User & Authentication (8 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| profiles | User profile information | ✅ |
| notifications | User notifications | ✅ |
| gdpr_requests | GDPR compliance requests | ✅ |
| oauth_clients | OAuth client applications | ✅ |
| translation_cache | Cached translations | ✅ |
| stakeholder_profiles | Stakeholder type profiles | ✅ |
| user_bookmarks | Saved items/listings | ✅ |
| reward_points | User reward points | ✅ |

### 2. Marketplace & Trading (18 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| market_prices | Commodity prices | ✅ |
| market_sentiment | Market sentiment analysis | ✅ |
| market_forecasts | Price forecasts | ✅ |
| city_market_products | City market product listings | ✅ |
| city_market_auctions | City market auctions | ✅ |
| city_market_bids | Auction bids | ✅ |
| city_market_agents | Market agents | ✅ |
| corridor_marketplaces | Corridor markets | ✅ |
| equipment_marketplace | Equipment listings | ✅ |
| barter_offers | Barter trade offers | ✅ |
| bulk_orders | Group buying orders | ✅ |
| reverse_auctions | Buyer-driven auctions | ✅ |
| reverse_auction_bids | Reverse auction bids | ✅ |
| road_markets | Highway markets | ✅ |
| road_market_products | Road market products | ✅ |
| route_based_markets | Route-based markets | ✅ |
| buy_requests | Buyer requests | ✅ |
| imperfect_produce | Surplus/imperfect produce | ✅ |

### 3. Farm Management (12 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| animals | Livestock records | ✅ |
| farm_tasks | Farm task management | ✅ |
| farm_statistics | Farm stats | ✅ |
| farm_budgets | Budget planning | ✅ |
| inventory_items | Farm inventory | ✅ |
| inventory_transactions | Inventory movements | ✅ |
| batch_tracking | Product batch tracking | ✅ |
| batch_movements | Batch movement history | ✅ |
| contract_farming_agreements | Farming contracts | ✅ |
| farmer_networks | Farmer network groups | ✅ |
| farmer_network_members | Network membership | ✅ |
| farmer_success_stories | Success stories | ✅ |

### 4. API Developer Portal (12 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| api_keys | API key management | ✅ |
| api_endpoints | API endpoint registry | ✅ |
| api_docs | API documentation | ✅ |
| api_usage_logs | Usage tracking | ✅ |
| api_billing_records | Billing records | ✅ |
| api_pricing_plans | Pricing tiers | ✅ |
| api_access_logs | Access logs | ✅ |
| api_audit_trails | Audit trails | ✅ |
| api_response_times | Performance metrics | ✅ |
| developer_accounts | Developer accounts | ✅ |
| developer_forum_posts | Dev forum posts | ✅ |
| developer_tickets | Support tickets | ✅ |

### 5. Logistics & Transport (8 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| logistics_providers | Transport providers | ✅ |
| delivery_requests | Delivery requests | ✅ |
| transport_requests | Transport requests | ✅ |
| transport_coordination | Shared transport | ✅ |
| warehouses | Warehouse listings | ✅ |
| warehouse_bookings | Storage bookings | ✅ |
| processing_facilities | Processing centers | ✅ |

### 6. Farm Inputs & Supplies (8 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| farm_input_suppliers | Input suppliers | ✅ |
| farm_input_products | Input products | ✅ |
| farm_input_orders | Input orders | ✅ |
| farm_input_order_items | Order line items | ✅ |
| input_group_orders | Group buying | ✅ |
| input_group_order_participants | Group participants | ✅ |
| input_prices | Input price tracking | ✅ |
| price_alerts | Price alert notifications | ✅ |

### 7. Export & International (4 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| exporter_profiles | Exporter profiles | ✅ |
| export_opportunities | Export opportunities | ✅ |
| farmer_exporter_collaborations | Farmer-exporter matching | ✅ |

### 8. Community & Social (10 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| community_posts | Forum posts | ✅ |
| post_comments | Post comments | ✅ |
| post_reports | Content reports | ✅ |
| community_post_shares | Post shares | ✅ |
| community_post_reposts | Reposts | ✅ |
| quality_control_discussions | Quality discussions | ✅ |
| cooperatives | Farmer cooperatives | ✅ |
| cooperative_members | Cooperative membership | ✅ |
| recipes | Agricultural recipes | ✅ |
| product_reviews | Product reviews | ✅ |

### 9. Services & Providers (4 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| service_providers | Service providers | ✅ |
| service_provider_reviews | Provider reviews | ✅ |
| partners | Business partners | ✅ |
| integration_partners | API partners | ✅ |

### 10. Training & Events (4 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| training_events | Training events | ✅ |
| partner_events | Partner events | ✅ |
| workshops | Workshop events | ✅ |
| workshop_registrations | Workshop signups | ✅ |

### 11. Food Rescue & Donations (4 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| food_rescue_requests | Rescue requests | ✅ |
| food_rescue_heroes | Hero profiles | ✅ |
| organizations | Recipient orgs | ✅ |

### 12. Subscriptions & F2C (3 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| subscription_boxes | F2C subscription boxes | ✅ |
| subscription_box_deliveries | Delivery tracking | ✅ |

### 13. Carbon & Sustainability (2 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| carbon_credit_providers | Carbon providers | ✅ |

### 14. Tourism & Experiences (2 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| farm_tourism_listings | Farm tourism | ✅ |
| farm_tourism_bookings | Tourism bookings | ✅ |

### 15. System & Operations (12 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| data_sync_jobs | Data sync jobs | ✅ |
| error_logs | Error logging | ✅ |
| webhooks | Webhook configs | ✅ |
| weather_alerts | Weather alerts | ✅ |
| bluetooth_connections | BLE connections | ✅ |
| search_analytics | Search tracking | ✅ |
| search_suggestions | Search suggestions | ✅ |
| rate_limit_logs | Rate limiting | ✅ |
| contact_submissions | Contact forms | ✅ |
| faq_items | FAQ content | ✅ |
| market_suggestions | Market suggestions | ✅ |

### 16. Payments & Billing (4 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| payment_transactions | Payment records | ✅ |
| developer_payments | Dev payments | ✅ |
| affiliate_referrals | Referral tracking | ✅ |

### 17. Jobs & Careers (2 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| jobs | Job listings | ✅ |
| client_needs_assessments | Client assessments | ✅ |

### 18. Business & Advertising (2 tables)
| Table | Description | RLS |
|-------|-------------|-----|
| business_advertisements | Business ads | ✅ |
| farmer_protection_warnings | Protection warnings | ✅ |

---

## Database Functions

| Function | Purpose |
|----------|---------|
| `update_updated_at_column()` | Auto-update timestamps |
| `handle_new_user()` | Create profile on signup |

---

## Security Summary
- **100% RLS Coverage** - All 111 tables have Row Level Security enabled
- **Granular Policies** - Separate SELECT, INSERT, UPDATE, DELETE policies
- **User-scoped Access** - Most data tied to user_id
- **Public Read** - Marketplace data readable by all
- **Authenticated Write** - All writes require authentication
