-- Fix the check constraint issue for played_status
-- Remove the problematic check constraint if it exists
ALTER TABLE public.song_requests DROP CONSTRAINT IF EXISTS song_requests_played_status_check;

-- Add a proper check constraint for played_status
ALTER TABLE public.song_requests 
ADD CONSTRAINT song_requests_played_status_check 
CHECK (played_status IN ('pending', 'playing', 'completed'));

-- Add constraint for payment_status  
ALTER TABLE public.song_requests 
ADD CONSTRAINT song_requests_payment_status_check 
CHECK (payment_status IN ('pending', 'paid', 'failed'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_song_requests_played_status ON public.song_requests(played_status);
CREATE INDEX IF NOT EXISTS idx_song_requests_payment_status ON public.song_requests(payment_status);
CREATE INDEX IF NOT EXISTS idx_song_requests_created_at ON public.song_requests(created_at DESC);