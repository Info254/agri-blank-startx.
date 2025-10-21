DROP VIEW IF EXISTS public.app_market_selection CASCADE;

CREATE VIEW public.app_market_selection AS
SELECT
  market_details.id,
  market_details.market_name,
  market_details.city
FROM market_details
WHERE (market_details.is_active = true); 