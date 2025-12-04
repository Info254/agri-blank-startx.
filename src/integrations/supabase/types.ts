export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      affiliate_referrals: {
        Row: {
          commission_amount: number | null
          commission_paid: boolean | null
          conversion_status: string | null
          converted_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_user_id: string | null
          referrer_user_id: string
        }
        Insert: {
          commission_amount?: number | null
          commission_paid?: boolean | null
          conversion_status?: string | null
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_user_id?: string | null
          referrer_user_id: string
        }
        Update: {
          commission_amount?: number | null
          commission_paid?: boolean | null
          conversion_status?: string | null
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_user_id?: string | null
          referrer_user_id?: string
        }
        Relationships: []
      }
      animals: {
        Row: {
          birth_date: string | null
          breed: string | null
          created_at: string
          health_status: string | null
          id: string
          name: string
          species: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          health_status?: string | null
          id?: string
          name: string
          species: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string | null
          breed?: string | null
          created_at?: string
          health_status?: string | null
          id?: string
          name?: string
          species?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      api_access_logs: {
        Row: {
          endpoint: string
          id: string
          ip_address: unknown
          method: string
          request_count: number | null
          response_time_ms: number | null
          status_code: number | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          endpoint: string
          id?: string
          ip_address?: unknown
          method: string
          request_count?: number | null
          response_time_ms?: number | null
          status_code?: number | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          endpoint?: string
          id?: string
          ip_address?: unknown
          method?: string
          request_count?: number | null
          response_time_ms?: number | null
          status_code?: number | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_audit_trails: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_billing_records: {
        Row: {
          amount_due: number
          amount_paid: number | null
          api_key_id: string | null
          billable_calls: number
          billing_period_end: string
          billing_period_start: string
          created_at: string
          id: string
          invoice_number: string | null
          payment_status: string | null
          total_api_calls: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_due?: number
          amount_paid?: number | null
          api_key_id?: string | null
          billable_calls?: number
          billing_period_end: string
          billing_period_start: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          payment_status?: string | null
          total_api_calls?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          api_key_id?: string | null
          billable_calls?: number
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          payment_status?: string | null
          total_api_calls?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_billing_records_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      api_docs: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          endpoint_id: string | null
          id: string
          is_published: boolean | null
          order_index: number | null
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          endpoint_id?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          endpoint_id?: string | null
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_docs_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "api_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      api_endpoints: {
        Row: {
          created_at: string
          description: string | null
          documentation_url: string | null
          endpoint_path: string
          example_request: Json | null
          example_response: Json | null
          id: string
          is_active: boolean | null
          method: string
          parameters: Json | null
          required_tier: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          endpoint_path: string
          example_request?: Json | null
          example_response?: Json | null
          id?: string
          is_active?: boolean | null
          method: string
          parameters?: Json | null
          required_tier?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          endpoint_path?: string
          example_request?: Json | null
          example_response?: Json | null
          id?: string
          is_active?: boolean | null
          method?: string
          parameters?: Json | null
          required_tier?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hash: string
          key_name: string
          key_preview: string
          last_used_at: string | null
          monthly_request_limit: number | null
          rate_limit_per_minute: number | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash: string
          key_name: string
          key_preview: string
          last_used_at?: string | null
          monthly_request_limit?: number | null
          rate_limit_per_minute?: number | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hash?: string
          key_name?: string
          key_preview?: string
          last_used_at?: string | null
          monthly_request_limit?: number | null
          rate_limit_per_minute?: number | null
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      api_pricing_plans: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          is_active: boolean | null
          monthly_price: number
          monthly_request_limit: number
          plan_name: string
          rate_limit_per_minute: number
          tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          monthly_price?: number
          monthly_request_limit: number
          plan_name: string
          rate_limit_per_minute: number
          tier: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          monthly_price?: number
          monthly_request_limit?: number
          plan_name?: string
          rate_limit_per_minute?: number
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_response_times: {
        Row: {
          endpoint: string
          id: string
          method: string
          response_time_ms: number
          status_code: number
          timestamp: string
        }
        Insert: {
          endpoint: string
          id?: string
          method: string
          response_time_ms: number
          status_code: number
          timestamp?: string
        }
        Update: {
          endpoint?: string
          id?: string
          method?: string
          response_time_ms?: number
          status_code?: number
          timestamp?: string
        }
        Relationships: []
      }
      api_usage_logs: {
        Row: {
          api_key_id: string | null
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          ip_address: string | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number | null
          status_code: number
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code: number
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code?: number
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      bluetooth_connections: {
        Row: {
          connection_type: string
          created_at: string
          device_id: string
          device_name: string | null
          id: string
          last_seen: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          connection_type: string
          created_at?: string
          device_id: string
          device_name?: string | null
          id?: string
          last_seen?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          connection_type?: string
          created_at?: string
          device_id?: string
          device_name?: string | null
          id?: string
          last_seen?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bulk_orders: {
        Row: {
          buyer_id: string
          created_at: string
          delivery_date: string
          delivery_location: string
          id: string
          max_price: number | null
          product_type: string
          quantity: number
          rating: number | null
          requirements: string | null
          status: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          delivery_date: string
          delivery_location: string
          id?: string
          max_price?: number | null
          product_type: string
          quantity: number
          rating?: number | null
          requirements?: string | null
          status?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          delivery_date?: string
          delivery_location?: string
          id?: string
          max_price?: number | null
          product_type?: string
          quantity?: number
          rating?: number | null
          requirements?: string | null
          status?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      carbon_credit_providers: {
        Row: {
          certifications: string[] | null
          contact_email: string
          contact_phone: string
          counties_covered: string[] | null
          created_at: string | null
          description: string | null
          id: string
          is_verified: boolean | null
          minimum_carbon_credits: number | null
          organization_name: string
          price_per_ton: number | null
          registration_number: string | null
          service_type: string[] | null
          updated_at: string | null
          user_id: string | null
          verification_method: string | null
        }
        Insert: {
          certifications?: string[] | null
          contact_email: string
          contact_phone: string
          counties_covered?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          minimum_carbon_credits?: number | null
          organization_name: string
          price_per_ton?: number | null
          registration_number?: string | null
          service_type?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          verification_method?: string | null
        }
        Update: {
          certifications?: string[] | null
          contact_email?: string
          contact_phone?: string
          counties_covered?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_verified?: boolean | null
          minimum_carbon_credits?: number | null
          organization_name?: string
          price_per_ton?: number | null
          registration_number?: string | null
          service_type?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          verification_method?: string | null
        }
        Relationships: []
      }
      city_market_agents: {
        Row: {
          agent_name: string
          contact_email: string | null
          contact_phone: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          market_id: string
          specialization: string[] | null
          total_sales: number | null
          trust_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_name: string
          contact_email?: string | null
          contact_phone: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          market_id: string
          specialization?: string[] | null
          total_sales?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_name?: string
          contact_email?: string | null
          contact_phone?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          market_id?: string
          specialization?: string[] | null
          total_sales?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      city_market_auctions: {
        Row: {
          created_at: string
          current_price: number | null
          end_time: string
          id: string
          product_id: string
          seller_user_id: string
          starting_price: number
          status: string | null
          updated_at: string
          winner_bid_id: string | null
        }
        Insert: {
          created_at?: string
          current_price?: number | null
          end_time: string
          id?: string
          product_id: string
          seller_user_id: string
          starting_price: number
          status?: string | null
          updated_at?: string
          winner_bid_id?: string | null
        }
        Update: {
          created_at?: string
          current_price?: number | null
          end_time?: string
          id?: string
          product_id?: string
          seller_user_id?: string
          starting_price?: number
          status?: string | null
          updated_at?: string
          winner_bid_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_auctions_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "city_market_products"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_bids: {
        Row: {
          auction_id: string
          bid_amount: number
          bid_time: string
          bidder_user_id: string
          created_at: string
          id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          auction_id: string
          bid_amount: number
          bid_time?: string
          bidder_user_id: string
          created_at?: string
          id?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          auction_id?: string
          bid_amount?: number
          bid_time?: string
          bidder_user_id?: string
          created_at?: string
          id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bids_auction"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "city_market_auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          market_id: string
          price: number
          product_name: string
          quality_grade: string | null
          quantity: number
          rating: number | null
          seller_user_id: string
          status: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          market_id: string
          price: number
          product_name: string
          quality_grade?: string | null
          quantity: number
          rating?: number | null
          seller_user_id: string
          status?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          market_id?: string
          price?: number
          product_name?: string
          quality_grade?: string | null
          quantity?: number
          rating?: number | null
          seller_user_id?: string
          status?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_needs_assessments: {
        Row: {
          budget: number | null
          county: string | null
          created_at: string
          crop_interest: string[] | null
          email: string | null
          goals: string | null
          id: string
          name: string
          phone: string | null
          preferred_contact: string | null
          referral_source: string | null
          role: string | null
          status: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          county?: string | null
          created_at?: string
          crop_interest?: string[] | null
          email?: string | null
          goals?: string | null
          id?: string
          name: string
          phone?: string | null
          preferred_contact?: string | null
          referral_source?: string | null
          role?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          county?: string | null
          created_at?: string
          crop_interest?: string[] | null
          email?: string | null
          goals?: string | null
          id?: string
          name?: string
          phone?: string | null
          preferred_contact?: string | null
          referral_source?: string | null
          role?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_post_reposts: {
        Row: {
          id: string
          original_post_id: string | null
          repost_caption: string | null
          reposted_at: string | null
          reposted_by: string | null
        }
        Insert: {
          id?: string
          original_post_id?: string | null
          repost_caption?: string | null
          reposted_at?: string | null
          reposted_by?: string | null
        }
        Update: {
          id?: string
          original_post_id?: string | null
          repost_caption?: string | null
          reposted_at?: string | null
          reposted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_reposts_original_post_id_fkey"
            columns: ["original_post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_shares: {
        Row: {
          id: string
          post_id: string
          share_platform: string | null
          shared_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          post_id: string
          share_platform?: string | null
          shared_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          post_id?: string
          share_platform?: string | null
          shared_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          category: string | null
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          likes_count: number | null
          location: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          location?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          location?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      corridor_marketplaces: {
        Row: {
          contact_info: string | null
          county: string
          created_at: string
          facilities: Json | null
          gps_coordinates: string | null
          id: string
          is_active: boolean | null
          location: string
          market_days: string[] | null
          name: string
          specialties: string[] | null
          updated_at: string
        }
        Insert: {
          contact_info?: string | null
          county: string
          created_at?: string
          facilities?: Json | null
          gps_coordinates?: string | null
          id?: string
          is_active?: boolean | null
          location: string
          market_days?: string[] | null
          name: string
          specialties?: string[] | null
          updated_at?: string
        }
        Update: {
          contact_info?: string | null
          county?: string
          created_at?: string
          facilities?: Json | null
          gps_coordinates?: string | null
          id?: string
          is_active?: boolean | null
          location?: string
          market_days?: string[] | null
          name?: string
          specialties?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      data_sync_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_name: string
          metadata: Json | null
          records_failed: number | null
          records_processed: number | null
          source_system: string
          started_at: string | null
          status: string | null
          sync_type: string | null
          target_system: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_name: string
          metadata?: Json | null
          records_failed?: number | null
          records_processed?: number | null
          source_system: string
          started_at?: string | null
          status?: string | null
          sync_type?: string | null
          target_system: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_name?: string
          metadata?: Json | null
          records_failed?: number | null
          records_processed?: number | null
          source_system?: string
          started_at?: string | null
          status?: string | null
          sync_type?: string | null
          target_system?: string
        }
        Relationships: []
      }
      delivery_requests: {
        Row: {
          actual_cost: number | null
          cargo_type: string
          cargo_weight_tons: number
          created_at: string
          delivery_county: string
          delivery_date: string | null
          delivery_location: string
          estimated_cost: number | null
          id: string
          notes: string | null
          pickup_county: string
          pickup_date: string
          pickup_location: string
          provider_id: string | null
          provider_rating: number | null
          requester_id: string
          requester_rating: number | null
          special_requirements: string[] | null
          status: string | null
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          cargo_type: string
          cargo_weight_tons: number
          created_at?: string
          delivery_county: string
          delivery_date?: string | null
          delivery_location: string
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          pickup_county: string
          pickup_date: string
          pickup_location: string
          provider_id?: string | null
          provider_rating?: number | null
          requester_id: string
          requester_rating?: number | null
          special_requirements?: string[] | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          cargo_type?: string
          cargo_weight_tons?: number
          created_at?: string
          delivery_county?: string
          delivery_date?: string | null
          delivery_location?: string
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          pickup_county?: string
          pickup_date?: string
          pickup_location?: string
          provider_id?: string | null
          provider_rating?: number | null
          requester_id?: string
          requester_rating?: number | null
          special_requirements?: string[] | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "logistics_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_accounts: {
        Row: {
          api_tier: string | null
          company_name: string | null
          company_registration: string | null
          contact_email: string
          contact_person: string
          contact_phone: string | null
          created_at: string
          id: string
          is_verified: boolean | null
          total_api_calls: number | null
          updated_at: string
          user_id: string
          verified_at: string | null
          website_url: string | null
        }
        Insert: {
          api_tier?: string | null
          company_name?: string | null
          company_registration?: string | null
          contact_email: string
          contact_person: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          total_api_calls?: number | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
          website_url?: string | null
        }
        Update: {
          api_tier?: string | null
          company_name?: string | null
          company_registration?: string | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean | null
          total_api_calls?: number | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      developer_forum_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_answered: boolean | null
          is_pinned: boolean | null
          parent_post_id: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_answered?: boolean | null
          is_pinned?: boolean | null
          parent_post_id?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_answered?: boolean | null
          is_pinned?: boolean | null
          parent_post_id?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "developer_forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_payments: {
        Row: {
          amount: number
          billing_record_id: string | null
          created_at: string
          currency: string | null
          id: string
          payment_date: string
          payment_method: string | null
          payment_status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          billing_record_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          payment_date?: string
          payment_method?: string | null
          payment_status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          billing_record_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          payment_date?: string
          payment_method?: string | null
          payment_status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_payments_billing_record_id_fkey"
            columns: ["billing_record_id"]
            isOneToOne: false
            referencedRelation: "api_billing_records"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      equipment_marketplace: {
        Row: {
          available_for: string[] | null
          category: string
          contact_email: string | null
          contact_phone: string | null
          county: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          owner_id: string
          price: number | null
          updated_at: string
        }
        Insert: {
          available_for?: string[] | null
          category: string
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          owner_id: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          available_for?: string[] | null
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          owner_id?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          api_key_id: string | null
          created_at: string
          endpoint: string | null
          error_code: string | null
          error_message: string
          error_type: string
          id: string
          is_resolved: boolean | null
          request_payload: Json | null
          resolved_at: string | null
          severity: string | null
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          endpoint?: string | null
          error_code?: string | null
          error_message: string
          error_type: string
          id?: string
          is_resolved?: boolean | null
          request_payload?: Json | null
          resolved_at?: string | null
          severity?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          endpoint?: string | null
          error_code?: string | null
          error_message?: string
          error_type?: string
          id?: string
          is_resolved?: boolean | null
          request_payload?: Json | null
          resolved_at?: string | null
          severity?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      export_opportunities: {
        Row: {
          certifications_required: string[] | null
          commodity: string
          contact_info: Json | null
          created_at: string | null
          created_by: string | null
          deadline: string
          delivery_terms: string | null
          destination_country: string
          id: string
          opportunity_title: string
          payment_terms: string | null
          price_range: string | null
          specifications: string | null
          status: string | null
          unit: string
          updated_at: string | null
          volume: number
        }
        Insert: {
          certifications_required?: string[] | null
          commodity: string
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          deadline: string
          delivery_terms?: string | null
          destination_country: string
          id?: string
          opportunity_title: string
          payment_terms?: string | null
          price_range?: string | null
          specifications?: string | null
          status?: string | null
          unit: string
          updated_at?: string | null
          volume: number
        }
        Update: {
          certifications_required?: string[] | null
          commodity?: string
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string
          delivery_terms?: string | null
          destination_country?: string
          id?: string
          opportunity_title?: string
          payment_terms?: string | null
          price_range?: string | null
          specifications?: string | null
          status?: string | null
          unit?: string
          updated_at?: string | null
          volume?: number
        }
        Relationships: []
      }
      exporter_profiles: {
        Row: {
          business_license_number: string | null
          certifications: string[] | null
          commodities_handled: string[]
          company_description: string | null
          company_name: string
          company_registration_number: string | null
          contact_email: string
          contact_person_name: string
          contact_phone: string
          created_at: string
          documentation_services: boolean
          export_license_number: string | null
          export_markets: string[]
          financing_services: boolean
          id: string
          is_active: boolean
          is_verified: boolean
          logistics_services: boolean
          maximum_quantity_tons: number | null
          minimum_quantity_tons: number | null
          office_coordinates: Json | null
          office_county: string
          office_location: string
          quality_assurance_services: boolean
          rating: number
          services_offered: string[]
          successful_exports: number
          total_collaborations: number
          updated_at: string
          user_id: string
          verification_documents: string[] | null
          website_url: string | null
          years_in_business: number | null
        }
        Insert: {
          business_license_number?: string | null
          certifications?: string[] | null
          commodities_handled?: string[]
          company_description?: string | null
          company_name: string
          company_registration_number?: string | null
          contact_email: string
          contact_person_name: string
          contact_phone: string
          created_at?: string
          documentation_services?: boolean
          export_license_number?: string | null
          export_markets?: string[]
          financing_services?: boolean
          id?: string
          is_active?: boolean
          is_verified?: boolean
          logistics_services?: boolean
          maximum_quantity_tons?: number | null
          minimum_quantity_tons?: number | null
          office_coordinates?: Json | null
          office_county: string
          office_location: string
          quality_assurance_services?: boolean
          rating?: number
          services_offered?: string[]
          successful_exports?: number
          total_collaborations?: number
          updated_at?: string
          user_id: string
          verification_documents?: string[] | null
          website_url?: string | null
          years_in_business?: number | null
        }
        Update: {
          business_license_number?: string | null
          certifications?: string[] | null
          commodities_handled?: string[]
          company_description?: string | null
          company_name?: string
          company_registration_number?: string | null
          contact_email?: string
          contact_person_name?: string
          contact_phone?: string
          created_at?: string
          documentation_services?: boolean
          export_license_number?: string | null
          export_markets?: string[]
          financing_services?: boolean
          id?: string
          is_active?: boolean
          is_verified?: boolean
          logistics_services?: boolean
          maximum_quantity_tons?: number | null
          minimum_quantity_tons?: number | null
          office_coordinates?: Json | null
          office_county?: string
          office_location?: string
          quality_assurance_services?: boolean
          rating?: number
          services_offered?: string[]
          successful_exports?: number
          total_collaborations?: number
          updated_at?: string
          user_id?: string
          verification_documents?: string[] | null
          website_url?: string | null
          years_in_business?: number | null
        }
        Relationships: []
      }
      farm_budgets: {
        Row: {
          actual_amount: number | null
          category: string
          created_at: string
          id: string
          notes: string | null
          planned_amount: number
          subcategory: string | null
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          actual_amount?: number | null
          category: string
          created_at?: string
          id?: string
          notes?: string | null
          planned_amount: number
          subcategory?: string | null
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          actual_amount?: number | null
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          planned_amount?: number
          subcategory?: string | null
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      farm_input_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "farm_input_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_input_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "farm_input_products"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_orders: {
        Row: {
          buyer_id: string
          buyer_name: string | null
          buyer_phone: string | null
          created_at: string
          delivery_address: string | null
          delivery_county: string | null
          delivery_method: string | null
          id: string
          notes: string | null
          status: string | null
          supplier_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_county?: string | null
          delivery_method?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          buyer_name?: string | null
          buyer_phone?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_county?: string | null
          delivery_method?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_products: {
        Row: {
          availability_status: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          supplier_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          availability_status?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          supplier_id?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          availability_status?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_suppliers: {
        Row: {
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          is_verified: boolean | null
          location: string | null
          name: string
          phone: string | null
          products_offered: string[] | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          name: string
          phone?: string | null
          products_offered?: string[] | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          name?: string
          phone?: string | null
          products_offered?: string[] | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      farm_statistics: {
        Row: {
          active_alerts: number | null
          average_yield: number | null
          created_at: string
          id: string
          monthly_revenue: number | null
          total_area: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_alerts?: number | null
          average_yield?: number | null
          created_at?: string
          id?: string
          monthly_revenue?: number | null
          total_area?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_alerts?: number | null
          average_yield?: number | null
          created_at?: string
          id?: string
          monthly_revenue?: number | null
          total_area?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_tasks: {
        Row: {
          created_at: string
          crop: string | null
          date: string | null
          description: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop?: string | null
          date?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop?: string | null
          date?: string | null
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farmer_exporter_collaborations: {
        Row: {
          availability_period: string | null
          collaboration_status: string
          collaboration_type: string
          commodity_name: string
          commodity_variety: string | null
          created_at: string
          documentation_needs: string[] | null
          estimated_quantity: number
          expires_at: string | null
          exporter_id: string | null
          farm_size_acres: number | null
          farmer_certifications: string[] | null
          farmer_coordinates: Json | null
          farmer_county: string
          farmer_email: string | null
          farmer_experience_years: number | null
          farmer_id: string
          farmer_location: string
          farmer_name: string
          farmer_phone: string
          farmer_profile_description: string | null
          harvest_date: string | null
          has_export_documentation: boolean
          id: string
          is_active: boolean
          notes: string | null
          pricing_expectations: string | null
          quality_grade: string | null
          special_requirements: string[] | null
          target_markets: string[] | null
          unit: string
          updated_at: string
        }
        Insert: {
          availability_period?: string | null
          collaboration_status?: string
          collaboration_type: string
          commodity_name: string
          commodity_variety?: string | null
          created_at?: string
          documentation_needs?: string[] | null
          estimated_quantity: number
          expires_at?: string | null
          exporter_id?: string | null
          farm_size_acres?: number | null
          farmer_certifications?: string[] | null
          farmer_coordinates?: Json | null
          farmer_county: string
          farmer_email?: string | null
          farmer_experience_years?: number | null
          farmer_id: string
          farmer_location: string
          farmer_name: string
          farmer_phone: string
          farmer_profile_description?: string | null
          harvest_date?: string | null
          has_export_documentation?: boolean
          id?: string
          is_active?: boolean
          notes?: string | null
          pricing_expectations?: string | null
          quality_grade?: string | null
          special_requirements?: string[] | null
          target_markets?: string[] | null
          unit: string
          updated_at?: string
        }
        Update: {
          availability_period?: string | null
          collaboration_status?: string
          collaboration_type?: string
          commodity_name?: string
          commodity_variety?: string | null
          created_at?: string
          documentation_needs?: string[] | null
          estimated_quantity?: number
          expires_at?: string | null
          exporter_id?: string | null
          farm_size_acres?: number | null
          farmer_certifications?: string[] | null
          farmer_coordinates?: Json | null
          farmer_county?: string
          farmer_email?: string | null
          farmer_experience_years?: number | null
          farmer_id?: string
          farmer_location?: string
          farmer_name?: string
          farmer_phone?: string
          farmer_profile_description?: string | null
          harvest_date?: string | null
          has_export_documentation?: boolean
          id?: string
          is_active?: boolean
          notes?: string | null
          pricing_expectations?: string | null
          quality_grade?: string | null
          special_requirements?: string[] | null
          target_markets?: string[] | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      farmer_protection_warnings: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          message: string
          severity: string | null
          target_audience: string[] | null
          title: string
          warning_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message: string
          severity?: string | null
          target_audience?: string[] | null
          title: string
          warning_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          message?: string
          severity?: string | null
          target_audience?: string[] | null
          title?: string
          warning_type?: string
        }
        Relationships: []
      }
      food_rescue_heroes: {
        Row: {
          created_at: string | null
          hero_badge: string | null
          id: string
          impact_story: string | null
          is_featured: boolean | null
          total_deliveries: number | null
          total_donations: number | null
          total_recipients: number | null
          updated_at: string | null
          user_id: string
          user_name: string
          user_type: string
        }
        Insert: {
          created_at?: string | null
          hero_badge?: string | null
          id?: string
          impact_story?: string | null
          is_featured?: boolean | null
          total_deliveries?: number | null
          total_donations?: number | null
          total_recipients?: number | null
          updated_at?: string | null
          user_id: string
          user_name: string
          user_type: string
        }
        Update: {
          created_at?: string | null
          hero_badge?: string | null
          id?: string
          impact_story?: string | null
          is_featured?: boolean | null
          total_deliveries?: number | null
          total_donations?: number | null
          total_recipients?: number | null
          updated_at?: string | null
          user_id?: string
          user_name?: string
          user_type?: string
        }
        Relationships: []
      }
      food_rescue_requests: {
        Row: {
          county: string
          created_at: string
          description: string | null
          food_type: string
          id: string
          location: string
          pickup_before: string
          quantity: number
          requester_id: string
          status: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          county: string
          created_at?: string
          description?: string | null
          food_type: string
          id?: string
          location: string
          pickup_before: string
          quantity: number
          requester_id: string
          status?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          county?: string
          created_at?: string
          description?: string | null
          food_type?: string
          id?: string
          location?: string
          pickup_before?: string
          quantity?: number
          requester_id?: string
          status?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          request_type: string
          requested_data: Json | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          request_type: string
          requested_data?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          request_type?: string
          requested_data?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      input_group_order_participants: {
        Row: {
          id: string
          joined_at: string
          order_id: string
          payment_status: string | null
          quantity: number
          total_cost: number
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          order_id: string
          payment_status?: string | null
          quantity: number
          total_cost: number
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          order_id?: string
          payment_status?: string | null
          quantity?: number
          total_cost?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "input_group_order_participants_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "input_group_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      input_group_orders: {
        Row: {
          created_at: string
          current_participants: number | null
          current_quantity: number | null
          deadline: string
          delivery_county: string
          delivery_date: string | null
          delivery_location: string
          description: string | null
          group_price: number
          id: string
          is_active: boolean | null
          minimum_participants: number | null
          organizer_id: string
          product_category: string
          product_name: string
          savings_percentage: number | null
          status: string | null
          supplier_id: string | null
          target_quantity: number
          terms_conditions: string | null
          unit: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          current_quantity?: number | null
          deadline: string
          delivery_county: string
          delivery_date?: string | null
          delivery_location: string
          description?: string | null
          group_price: number
          id?: string
          is_active?: boolean | null
          minimum_participants?: number | null
          organizer_id: string
          product_category: string
          product_name: string
          savings_percentage?: number | null
          status?: string | null
          supplier_id?: string | null
          target_quantity: number
          terms_conditions?: string | null
          unit: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          current_quantity?: number | null
          deadline?: string
          delivery_county?: string
          delivery_date?: string | null
          delivery_location?: string
          description?: string | null
          group_price?: number
          id?: string
          is_active?: boolean | null
          minimum_participants?: number | null
          organizer_id?: string
          product_category?: string
          product_name?: string
          savings_percentage?: number | null
          status?: string | null
          supplier_id?: string | null
          target_quantity?: number
          terms_conditions?: string | null
          unit?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      input_prices: {
        Row: {
          availability_status: string | null
          category: string
          county: string
          created_at: string
          date: string
          id: string
          location: string | null
          price: number
          product_name: string
          quality_grade: string | null
          supplier_name: string | null
          unit: string
        }
        Insert: {
          availability_status?: string | null
          category: string
          county: string
          created_at?: string
          date: string
          id?: string
          location?: string | null
          price: number
          product_name: string
          quality_grade?: string | null
          supplier_name?: string | null
          unit: string
        }
        Update: {
          availability_status?: string | null
          category?: string
          county?: string
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          price?: number
          product_name?: string
          quality_grade?: string | null
          supplier_name?: string | null
          unit?: string
        }
        Relationships: []
      }
      integration_partners: {
        Row: {
          api_key_id: string | null
          contact_email: string
          contact_phone: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string
          id: string
          integration_status: string | null
          notes: string | null
          partner_name: string
          partner_type: string | null
          updated_at: string
        }
        Insert: {
          api_key_id?: string | null
          contact_email: string
          contact_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          id?: string
          integration_status?: string | null
          notes?: string | null
          partner_name: string
          partner_type?: string | null
          updated_at?: string
        }
        Update: {
          api_key_id?: string | null
          contact_email?: string
          contact_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string
          id?: string
          integration_status?: string | null
          notes?: string | null
          partner_name?: string
          partner_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_partners_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          id: string
          item_name: string
          location: string | null
          minimum_stock: number | null
          notes: string | null
          quantity: number
          status: string | null
          supplier: string | null
          total_value: number | null
          unit: string
          unit_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_name: string
          location?: string | null
          minimum_stock?: number | null
          notes?: string | null
          quantity?: number
          status?: string | null
          supplier?: string | null
          total_value?: number | null
          unit: string
          unit_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_name?: string
          location?: string | null
          minimum_stock?: number | null
          notes?: string | null
          quantity?: number
          status?: string | null
          supplier?: string | null
          total_value?: number | null
          unit?: string
          unit_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          item_id: string
          quantity: number
          reason: string | null
          reference_number: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          item_id: string
          quantity: number
          reason?: string | null
          reference_number?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          item_id?: string
          quantity?: number
          reason?: string | null
          reference_number?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_deadline: string | null
          applications_count: number | null
          contact_email: string
          contact_phone: string | null
          county: string
          created_at: string | null
          employer_id: string
          employment_type: string | null
          id: string
          is_active: boolean | null
          job_category: string
          job_description: string
          job_title: string
          location: string
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          application_deadline?: string | null
          applications_count?: number | null
          contact_email: string
          contact_phone?: string | null
          county: string
          created_at?: string | null
          employer_id: string
          employment_type?: string | null
          id?: string
          is_active?: boolean | null
          job_category: string
          job_description: string
          job_title: string
          location: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          application_deadline?: string | null
          applications_count?: number | null
          contact_email?: string
          contact_phone?: string | null
          county?: string
          created_at?: string | null
          employer_id?: string
          employment_type?: string | null
          id?: string
          is_active?: boolean | null
          job_category?: string
          job_description?: string
          job_title?: string
          location?: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      logistics_providers: {
        Row: {
          capacity_tons: number
          company_name: string
          contact_info: string
          coverage_areas: string[]
          created_at: string
          id: string
          is_active: boolean | null
          rates: Json | null
          rating: number | null
          service_type: string[]
          total_deliveries: number | null
          updated_at: string
          user_id: string
          vehicle_types: string[]
        }
        Insert: {
          capacity_tons: number
          company_name: string
          contact_info: string
          coverage_areas: string[]
          created_at?: string
          id?: string
          is_active?: boolean | null
          rates?: Json | null
          rating?: number | null
          service_type: string[]
          total_deliveries?: number | null
          updated_at?: string
          user_id: string
          vehicle_types: string[]
        }
        Update: {
          capacity_tons?: number
          company_name?: string
          contact_info?: string
          coverage_areas?: string[]
          created_at?: string
          id?: string
          is_active?: boolean | null
          rates?: Json | null
          rating?: number | null
          service_type?: string[]
          total_deliveries?: number | null
          updated_at?: string
          user_id?: string
          vehicle_types?: string[]
        }
        Relationships: []
      }
      market_forecasts: {
        Row: {
          commodity_name: string
          confidence_level: string | null
          county: string
          created_at: string
          forecast_price: number | null
          id: string
          period: string | null
        }
        Insert: {
          commodity_name: string
          confidence_level?: string | null
          county: string
          created_at?: string
          forecast_price?: number | null
          id?: string
          period?: string | null
        }
        Update: {
          commodity_name?: string
          confidence_level?: string | null
          county?: string
          created_at?: string
          forecast_price?: number | null
          id?: string
          period?: string | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          commodity: string
          county: string
          created_at: string
          date: string
          id: string
          market: string
          price: number
          unit: string
          updated_at: string
        }
        Insert: {
          commodity: string
          county: string
          created_at?: string
          date: string
          id?: string
          market: string
          price: number
          unit: string
          updated_at?: string
        }
        Update: {
          commodity?: string
          county?: string
          created_at?: string
          date?: string
          id?: string
          market?: string
          price?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_sentiment: {
        Row: {
          analysis_date: string
          commodity: string
          confidence_level: number | null
          county: string
          created_at: string
          factors: Json | null
          id: string
          sample_size: number | null
          sentiment_label: string
          sentiment_score: number
        }
        Insert: {
          analysis_date: string
          commodity: string
          confidence_level?: number | null
          county: string
          created_at?: string
          factors?: Json | null
          id?: string
          sample_size?: number | null
          sentiment_label: string
          sentiment_score: number
        }
        Update: {
          analysis_date?: string
          commodity?: string
          confidence_level?: number | null
          county?: string
          created_at?: string
          factors?: Json | null
          id?: string
          sample_size?: number | null
          sentiment_label?: string
          sentiment_score?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      oauth_clients: {
        Row: {
          allowed_scopes: string[] | null
          client_id: string
          client_name: string
          client_secret_hash: string
          created_at: string
          id: string
          is_active: boolean | null
          redirect_uris: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          allowed_scopes?: string[] | null
          client_id: string
          client_name: string
          client_secret_hash: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          redirect_uris: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          allowed_scopes?: string[] | null
          client_id?: string
          client_name?: string
          client_secret_hash?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          redirect_uris?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          beneficiary_count: number | null
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          organization_name: string
          organization_type: string
          physical_address: string
          registration_number: string | null
          sub_county: string | null
          total_donations_received: number | null
          trust_score: number | null
          updated_at: string | null
          user_id: string | null
          verification_documents: Json | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          beneficiary_count?: number | null
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          organization_name: string
          organization_type: string
          physical_address: string
          registration_number?: string | null
          sub_county?: string | null
          total_donations_received?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_documents?: Json | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          beneficiary_count?: number | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          county?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          organization_name?: string
          organization_type?: string
          physical_address?: string
          registration_number?: string | null
          sub_county?: string | null
          total_donations_received?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
          verification_documents?: Json | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      partner_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          image_url: string | null
          location: string | null
          partner_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          partner_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          partner_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          payment_provider: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          payment_provider?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          payment_provider?: string | null
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          likes_count: number | null
          parent_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          post_id: string
          post_type: string | null
          report_type: string
          reporter_id: string
          resolution_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          post_id: string
          post_type?: string | null
          report_type: string
          reporter_id: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          post_id?: string
          post_type?: string | null
          report_type?: string
          reporter_id?: string
          resolution_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_type: string | null
          commodity: string
          county: string | null
          created_at: string
          id: string
          is_active: boolean | null
          target_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type?: string | null
          commodity: string
          county?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          target_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string | null
          commodity?: string
          county?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          target_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          contact_number: string | null
          county: string | null
          created_at: string
          email: string | null
          experience_years: number | null
          farm_size: number | null
          farm_type: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          role: string | null
          specialization: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          farm_size?: number | null
          farm_type?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string | null
          specialization?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          farm_size?: number | null
          farm_type?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string | null
          specialization?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_logs: {
        Row: {
          api_key_id: string | null
          created_at: string
          current_count: number
          endpoint: string
          exceeded_by: number | null
          id: string
          ip_address: string | null
          limit_type: string | null
          limit_value: number
          user_id: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string
          current_count: number
          endpoint: string
          exceeded_by?: number | null
          id?: string
          ip_address?: string | null
          limit_type?: string | null
          limit_value: number
          user_id?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string
          current_count?: number
          endpoint?: string
          exceeded_by?: number | null
          id?: string
          ip_address?: string | null
          limit_type?: string | null
          limit_value?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rate_limit_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_points: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          points: number | null
          points_earned: number
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number | null
          points_earned: number
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          points?: number | null
          points_earned?: number
          user_id?: string
        }
        Relationships: []
      }
      route_based_markets: {
        Row: {
          active_listings: number | null
          created_at: string | null
          description: string | null
          distance_km: number | null
          end_location: string
          id: string
          is_active: boolean | null
          major_commodities: string[] | null
          market_points: Json[] | null
          peak_seasons: string[] | null
          route_code: string | null
          route_name: string
          start_location: string
          updated_at: string | null
        }
        Insert: {
          active_listings?: number | null
          created_at?: string | null
          description?: string | null
          distance_km?: number | null
          end_location: string
          id?: string
          is_active?: boolean | null
          major_commodities?: string[] | null
          market_points?: Json[] | null
          peak_seasons?: string[] | null
          route_code?: string | null
          route_name: string
          start_location: string
          updated_at?: string | null
        }
        Update: {
          active_listings?: number | null
          created_at?: string | null
          description?: string | null
          distance_km?: number | null
          end_location?: string
          id?: string
          is_active?: boolean | null
          major_commodities?: string[] | null
          market_points?: Json[] | null
          peak_seasons?: string[] | null
          route_code?: string | null
          route_name?: string
          start_location?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          category: string | null
          clicked_result_id: string | null
          clicked_result_type: string | null
          id: string
          query: string
          results_count: number | null
          search_date: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          clicked_result_id?: string | null
          clicked_result_type?: string | null
          id?: string
          query: string
          results_count?: number | null
          search_date?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          clicked_result_id?: string | null
          clicked_result_type?: string | null
          id?: string
          query?: string
          results_count?: number | null
          search_date?: string
          user_id?: string | null
        }
        Relationships: []
      }
      search_suggestions: {
        Row: {
          category: string | null
          created_at: string
          id: string
          last_searched: string
          query: string
          search_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          last_searched?: string
          query: string
          search_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          last_searched?: string
          query?: string
          search_count?: number | null
        }
        Relationships: []
      }
      service_providers: {
        Row: {
          availability_status: string | null
          base_rate: number | null
          business_name: string
          certifications: string[] | null
          contact_email: string | null
          contact_person: string
          contact_phone: string
          county: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          location: string
          pricing_model: string | null
          rating: number | null
          service_areas: string[] | null
          service_type: string
          specializations: string[] | null
          total_jobs: number | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          availability_status?: string | null
          base_rate?: number | null
          business_name: string
          certifications?: string[] | null
          contact_email?: string | null
          contact_person: string
          contact_phone: string
          county: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location: string
          pricing_model?: string | null
          rating?: number | null
          service_areas?: string[] | null
          service_type: string
          specializations?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          availability_status?: string | null
          base_rate?: number | null
          business_name?: string
          certifications?: string[] | null
          contact_email?: string | null
          contact_person?: string
          contact_phone?: string
          county?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location?: string
          pricing_model?: string | null
          rating?: number | null
          service_areas?: string[] | null
          service_type?: string
          specializations?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      subscription_box_deliveries: {
        Row: {
          box_id: string
          consumer_id: string
          created_at: string
          delivery_address: string | null
          delivery_date: string
          id: string
          status: string | null
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          box_id: string
          consumer_id: string
          created_at?: string
          delivery_address?: string | null
          delivery_date: string
          id?: string
          status?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          box_id?: string
          consumer_id?: string
          created_at?: string
          delivery_address?: string | null
          delivery_date?: string
          id?: string
          status?: string | null
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_box_deliveries_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "subscription_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_boxes: {
        Row: {
          available_slots: number | null
          contents: Json | null
          created_at: string
          delivery_frequency: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          producer_id: string
          updated_at: string
        }
        Insert: {
          available_slots?: number | null
          contents?: Json | null
          created_at?: string
          delivery_frequency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          producer_id: string
          updated_at?: string
        }
        Update: {
          available_slots?: number | null
          contents?: Json | null
          created_at?: string
          delivery_frequency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          producer_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_events: {
        Row: {
          certification_offered: boolean | null
          contact_email: string | null
          contact_phone: string
          cost: number | null
          county: string
          created_at: string
          current_participants: number | null
          description: string
          end_date: string
          event_type: string
          facilitator_credentials: string | null
          facilitator_name: string | null
          id: string
          is_active: boolean | null
          location: string
          materials_provided: string[] | null
          max_participants: number | null
          organizer_id: string
          prerequisites: string[] | null
          registration_deadline: string | null
          start_date: string
          status: string | null
          target_audience: string[] | null
          title: string
          training_category: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          certification_offered?: boolean | null
          contact_email?: string | null
          contact_phone: string
          cost?: number | null
          county: string
          created_at?: string
          current_participants?: number | null
          description: string
          end_date: string
          event_type: string
          facilitator_credentials?: string | null
          facilitator_name?: string | null
          id?: string
          is_active?: boolean | null
          location: string
          materials_provided?: string[] | null
          max_participants?: number | null
          organizer_id: string
          prerequisites?: string[] | null
          registration_deadline?: string | null
          start_date: string
          status?: string | null
          target_audience?: string[] | null
          title: string
          training_category: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          certification_offered?: boolean | null
          contact_email?: string | null
          contact_phone?: string
          cost?: number | null
          county?: string
          created_at?: string
          current_participants?: number | null
          description?: string
          end_date?: string
          event_type?: string
          facilitator_credentials?: string | null
          facilitator_name?: string | null
          id?: string
          is_active?: boolean | null
          location?: string
          materials_provided?: string[] | null
          max_participants?: number | null
          organizer_id?: string
          prerequisites?: string[] | null
          registration_deadline?: string | null
          start_date?: string
          status?: string | null
          target_audience?: string[] | null
          title?: string
          training_category?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      translation_cache: {
        Row: {
          created_at: string
          id: string
          source_language: string
          source_text: string
          target_language: string
          translated_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          source_language?: string
          source_text: string
          target_language: string
          translated_text: string
        }
        Update: {
          created_at?: string
          id?: string
          source_language?: string
          source_text?: string
          target_language?: string
          translated_text?: string
        }
        Relationships: []
      }
      transport_coordination: {
        Row: {
          coordinator_id: string
          cost_per_kg: number | null
          created_at: string
          current_bookings: number | null
          delivery_location: string
          id: string
          max_capacity: number
          pickup_location: string
          route_name: string
          scheduled_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          coordinator_id: string
          cost_per_kg?: number | null
          created_at?: string
          current_bookings?: number | null
          delivery_location: string
          id?: string
          max_capacity: number
          pickup_location: string
          route_name: string
          scheduled_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          coordinator_id?: string
          cost_per_kg?: number | null
          created_at?: string
          current_bookings?: number | null
          delivery_location?: string
          id?: string
          max_capacity?: number
          pickup_location?: string
          route_name?: string
          scheduled_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transport_requests: {
        Row: {
          agreed_cost: number | null
          cargo_description: string | null
          cargo_type: string
          cargo_weight_kg: number
          contact_name: string | null
          contact_phone: string
          created_at: string
          delivery_county: string
          delivery_date: string | null
          delivery_location: string
          estimated_cost: number | null
          id: string
          notes: string | null
          pickup_county: string
          pickup_date: string
          pickup_location: string
          provider_id: string | null
          requester_id: string
          special_handling: string[] | null
          status: string | null
          tracking_number: string | null
          updated_at: string
          vehicle_type_required: string | null
        }
        Insert: {
          agreed_cost?: number | null
          cargo_description?: string | null
          cargo_type: string
          cargo_weight_kg: number
          contact_name?: string | null
          contact_phone: string
          created_at?: string
          delivery_county: string
          delivery_date?: string | null
          delivery_location: string
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          pickup_county: string
          pickup_date: string
          pickup_location: string
          provider_id?: string | null
          requester_id: string
          special_handling?: string[] | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string
          vehicle_type_required?: string | null
        }
        Update: {
          agreed_cost?: number | null
          cargo_description?: string | null
          cargo_type?: string
          cargo_weight_kg?: number
          contact_name?: string | null
          contact_phone?: string
          created_at?: string
          delivery_county?: string
          delivery_date?: string | null
          delivery_location?: string
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          pickup_county?: string
          pickup_date?: string
          pickup_location?: string
          provider_id?: string | null
          requester_id?: string
          special_handling?: string[] | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string
          vehicle_type_required?: string | null
        }
        Relationships: []
      }
      warehouse_bookings: {
        Row: {
          contact_phone: string
          created_at: string
          end_date: string
          id: string
          notes: string | null
          produce_type: string
          quantity_tons: number
          special_requirements: string[] | null
          start_date: string
          status: string | null
          total_cost: number
          updated_at: string
          user_id: string
          warehouse_id: string
        }
        Insert: {
          contact_phone: string
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          produce_type: string
          quantity_tons: number
          special_requirements?: string[] | null
          start_date: string
          status?: string | null
          total_cost: number
          updated_at?: string
          user_id: string
          warehouse_id: string
        }
        Update: {
          contact_phone?: string
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          produce_type?: string
          quantity_tons?: number
          special_requirements?: string[] | null
          start_date?: string
          status?: string | null
          total_cost?: number
          updated_at?: string
          user_id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_bookings_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          availability_status: string | null
          capacity_tons: number
          certifications: string[] | null
          contact_info: string
          county: string
          created_at: string
          daily_rate_per_ton: number
          has_refrigeration: boolean | null
          has_security: boolean | null
          id: string
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          operating_hours: string | null
          owner_id: string
          rating: number | null
          storage_types: string[] | null
          total_bookings: number | null
          updated_at: string
        }
        Insert: {
          availability_status?: string | null
          capacity_tons: number
          certifications?: string[] | null
          contact_info: string
          county: string
          created_at?: string
          daily_rate_per_ton: number
          has_refrigeration?: boolean | null
          has_security?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          operating_hours?: string | null
          owner_id: string
          rating?: number | null
          storage_types?: string[] | null
          total_bookings?: number | null
          updated_at?: string
        }
        Update: {
          availability_status?: string | null
          capacity_tons?: number
          certifications?: string[] | null
          contact_info?: string
          county?: string
          created_at?: string
          daily_rate_per_ton?: number
          has_refrigeration?: boolean | null
          has_security?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          owner_id?: string
          rating?: number | null
          storage_types?: string[] | null
          total_bookings?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          is_active: boolean | null
          region: string
          severity: string | null
          start_date: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          is_active?: boolean | null
          region: string
          severity?: string | null
          start_date: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          region?: string
          severity?: string | null
          start_date?: string
          type?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string
          event_types: string[]
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          secret_key: string
          success_count: number | null
          updated_at: string
          user_id: string
          webhook_url: string
        }
        Insert: {
          created_at?: string
          event_types: string[]
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret_key: string
          success_count?: number | null
          updated_at?: string
          user_id: string
          webhook_url: string
        }
        Update: {
          created_at?: string
          event_types?: string[]
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret_key?: string
          success_count?: number | null
          updated_at?: string
          user_id?: string
          webhook_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
