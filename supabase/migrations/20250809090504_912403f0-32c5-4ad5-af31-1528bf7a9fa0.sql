-- Create farm_input_products table
CREATE TABLE public.farm_input_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  product_description TEXT,
  price_per_unit NUMERIC NOT NULL,
  unit_of_measure TEXT NOT NULL,
  brand_name TEXT,
  stock_quantity NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farm_input_suppliers table
CREATE TABLE public.farm_input_suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  location TEXT,
  business_registration TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farm_input_orders table
CREATE TABLE public.farm_input_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  supplier_id UUID NOT NULL,
  total_amount NUMERIC NOT NULL,
  delivery_method TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  delivery_county TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farm_input_order_items table
CREATE TABLE public.farm_input_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create produce_inventory table
CREATE TABLE public.produce_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  variety TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  harvest_date DATE,
  expiry_date DATE,
  price_per_unit NUMERIC,
  location TEXT NOT NULL,
  storage_conditions TEXT,
  organic_certified BOOLEAN NOT NULL DEFAULT false,
  quality_grade TEXT NOT NULL,
  available_for_sale BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bulk_orders table (for BulkOrderService)
CREATE TABLE public.bulk_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL,
  product_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  target_price NUMERIC,
  deadline DATE NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_participants INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.farm_input_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for farm_input_products
CREATE POLICY "Anyone can view active farm input products" 
ON public.farm_input_products 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Suppliers can manage their products" 
ON public.farm_input_products 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.farm_input_suppliers 
  WHERE id = farm_input_products.supplier_id
));

-- Create RLS policies for farm_input_suppliers  
CREATE POLICY "Anyone can view verified suppliers" 
ON public.farm_input_suppliers 
FOR SELECT 
USING (is_verified = true);

CREATE POLICY "Authenticated users can register as suppliers" 
ON public.farm_input_suppliers 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for farm_input_orders
CREATE POLICY "Users can view their orders" 
ON public.farm_input_orders 
FOR SELECT 
USING (buyer_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.farm_input_suppliers 
  WHERE id = farm_input_orders.supplier_id
));

CREATE POLICY "Users can create orders" 
ON public.farm_input_orders 
FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

-- Create RLS policies for farm_input_order_items
CREATE POLICY "Users can view order items for their orders" 
ON public.farm_input_order_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.farm_input_orders 
  WHERE id = farm_input_order_items.order_id 
  AND (buyer_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.farm_input_suppliers 
    WHERE id = farm_input_orders.supplier_id
  ))
));

CREATE POLICY "System can create order items" 
ON public.farm_input_order_items 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for produce_inventory
CREATE POLICY "Anyone can view available produce" 
ON public.produce_inventory 
FOR SELECT 
USING (available_for_sale = true OR farmer_id = auth.uid());

CREATE POLICY "Farmers can manage their produce" 
ON public.produce_inventory 
FOR ALL 
USING (auth.uid() = farmer_id);

-- Create RLS policies for bulk_orders
CREATE POLICY "Anyone can view active bulk orders" 
ON public.bulk_orders 
FOR SELECT 
USING (status = 'active' OR organizer_id = auth.uid());

CREATE POLICY "Users can create bulk orders" 
ON public.bulk_orders 
FOR INSERT 
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their bulk orders" 
ON public.bulk_orders 
FOR UPDATE 
USING (auth.uid() = organizer_id);

-- Add foreign key relationships
ALTER TABLE public.farm_input_products 
ADD CONSTRAINT fk_farm_input_products_supplier 
FOREIGN KEY (supplier_id) REFERENCES public.farm_input_suppliers(id);

ALTER TABLE public.farm_input_orders 
ADD CONSTRAINT fk_farm_input_orders_supplier 
FOREIGN KEY (supplier_id) REFERENCES public.farm_input_suppliers(id);

ALTER TABLE public.farm_input_order_items 
ADD CONSTRAINT fk_farm_input_order_items_order 
FOREIGN KEY (order_id) REFERENCES public.farm_input_orders(id);

ALTER TABLE public.farm_input_order_items 
ADD CONSTRAINT fk_farm_input_order_items_product 
FOREIGN KEY (product_id) REFERENCES public.farm_input_products(id);

-- Add triggers for updated_at
CREATE TRIGGER update_farm_input_products_updated_at
  BEFORE UPDATE ON public.farm_input_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_input_suppliers_updated_at
  BEFORE UPDATE ON public.farm_input_suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farm_input_orders_updated_at
  BEFORE UPDATE ON public.farm_input_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_produce_inventory_updated_at
  BEFORE UPDATE ON public.produce_inventory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bulk_orders_updated_at
  BEFORE UPDATE ON public.bulk_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();