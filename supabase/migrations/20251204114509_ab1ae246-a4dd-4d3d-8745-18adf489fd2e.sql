-- Create farm_input_orders table
CREATE TABLE IF NOT EXISTS public.farm_input_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL,
  supplier_id UUID REFERENCES public.farm_input_suppliers(id),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  delivery_method TEXT,
  buyer_name TEXT,
  buyer_phone TEXT,
  delivery_county TEXT,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farm_input_order_items table
CREATE TABLE IF NOT EXISTS public.farm_input_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.farm_input_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.farm_input_products(id),
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.farm_input_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_order_items ENABLE ROW LEVEL SECURITY;

-- Policies for farm_input_orders
CREATE POLICY "Users can view their own orders" ON public.farm_input_orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users can create orders" ON public.farm_input_orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Users can update their orders" ON public.farm_input_orders FOR UPDATE USING (auth.uid() = buyer_id);

-- Policies for farm_input_order_items
CREATE POLICY "Users can view their order items" ON public.farm_input_order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.farm_input_orders WHERE id = order_id AND buyer_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON public.farm_input_order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.farm_input_orders WHERE id = order_id AND buyer_id = auth.uid())
);

-- Triggers
CREATE TRIGGER update_farm_input_orders_updated_at
BEFORE UPDATE ON public.farm_input_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();