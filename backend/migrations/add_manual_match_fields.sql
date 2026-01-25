-- Add manual match support fields to help_activities table

ALTER TABLE help_activities 
ADD COLUMN IF NOT EXISTS manual_entry BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS matched_with_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS matched_with_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS matched_with_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_account TEXT,
ADD COLUMN IF NOT EXISTS payment_deadline TIMESTAMP,
ADD COLUMN IF NOT EXISTS matched_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN help_activities.manual_entry IS 'Indicates if this match was created manually by admin';
COMMENT ON COLUMN help_activities.matched_with_name IS 'Name of matched counterparty (for manual entries)';
COMMENT ON COLUMN help_activities.matched_with_email IS 'Email of matched counterparty (for manual entries)';
COMMENT ON COLUMN help_activities.matched_with_phone IS 'Phone of matched counterparty (for manual entries)';
COMMENT ON COLUMN help_activities.payment_account IS 'Payment account details for the match';
COMMENT ON COLUMN help_activities.payment_deadline IS '6-hour deadline for payment completion';
COMMENT ON COLUMN help_activities.matched_at IS 'Timestamp when match was created';
COMMENT ON COLUMN help_activities.admin_approved IS 'Whether match was approved by admin';
