-- Supabase trigger for push notifications on new donations
CREATE OR REPLACE FUNCTION notify_new_donation()
RETURNS trigger AS $$
BEGIN
  -- Example: Insert notification into a notifications table
  INSERT INTO notifications (user_id, title, body, created_at)
  VALUES (NEW.recipient_id, 'New Donation Received',
    CONCAT('You have received a donation for product ', NEW.product_id, ' from agent ', NEW.agent_id), now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_donation ON city_market_donations;
CREATE TRIGGER trigger_notify_new_donation
AFTER INSERT ON city_market_donations
FOR EACH ROW EXECUTE FUNCTION notify_new_donation();

-- You can extend this for other events (verification, review, etc.)
