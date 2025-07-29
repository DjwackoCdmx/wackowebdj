-- Fix the conflicting check constraints for played_status
-- Remove all existing check constraints for played_status and payment_status
ALTER TABLE public.song_requests DROP CONSTRAINT IF EXISTS song_requests_played_status_check;
ALTER TABLE public.song_requests DROP CONSTRAINT IF EXISTS song_requests_payment_status_check;

-- Add the correct check constraints with the right values
ALTER TABLE public.song_requests 
ADD CONSTRAINT song_requests_played_status_check 
CHECK (played_status IN ('pending', 'playing', 'completed'));

ALTER TABLE public.song_requests 
ADD CONSTRAINT song_requests_payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'verified', 'cancelled', 'failed'));