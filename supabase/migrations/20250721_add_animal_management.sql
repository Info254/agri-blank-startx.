-- Animal Management Tables for Agri-Tender Connect

CREATE TABLE IF NOT EXISTS animals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    name text NOT NULL,
    species text NOT NULL,
    breed text,
    birth_date date,
    acquisition_date date,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS animal_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
    record_type text NOT NULL, -- e.g. health, production, sale
    description text,
    record_date date NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS animal_health (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
    health_status text NOT NULL,
    notes text,
    recorded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS animal_sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
    sale_date date NOT NULL,
    buyer text,
    price numeric,
    notes text,
    created_at timestamptz DEFAULT now()
);
