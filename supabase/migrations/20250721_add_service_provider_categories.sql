-- Add new service provider categories for Agri-Tender Connect

CREATE TABLE IF NOT EXISTS service_provider_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamptz DEFAULT now()
);

INSERT INTO service_provider_categories (name, description) VALUES
  ('Veterinary Services', 'Animal health, veterinary clinics, and mobile vets'),
  ('Feed & Nutrition Companies', 'Animal feed, nutrition, supplements, and advisory'),
  ('Genetics & Breeding Services', 'Livestock genetics, breeding, and AI services'),
  ('Farm Construction', 'Farm buildings, sheds, greenhouses, and infrastructure'),
  ('Consultancies', 'Agricultural, business, and technical consultancies');
