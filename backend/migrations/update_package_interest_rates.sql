-- Update package interest rates
-- Basic Help and Standard Help = 30%, Premium Help and Elite Help = 50%

UPDATE packages SET return_percentage = 30 WHERE id = 'pkg-1'; -- Basic Help
UPDATE packages SET return_percentage = 30 WHERE id = 'pkg-2'; -- Standard Help
UPDATE packages SET return_percentage = 50 WHERE id = 'pkg-3'; -- Premium Help
UPDATE packages SET return_percentage = 50 WHERE id = 'pkg-4'; -- Elite Help

-- Verify the changes
SELECT id, name, amount, return_percentage, duration_days FROM packages ORDER BY amount;
