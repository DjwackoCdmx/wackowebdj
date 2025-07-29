-- Fix search path for is_request_time_allowed function
CREATE OR REPLACE FUNCTION public.is_request_time_allowed()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    current_day INTEGER;
    current_time_var TIME;
    schedule_record RECORD;
BEGIN
    -- Get current day of week (0 = Sunday, 6 = Saturday)
    current_day := EXTRACT(DOW FROM NOW());
    current_time_var := NOW()::TIME;
    
    -- Check if there's an active schedule for today
    SELECT * INTO schedule_record
    FROM public.schedule_settings
    WHERE day_of_week = current_day
    AND is_active = true;
    
    -- If no schedule found, allow requests (default behavior)
    IF NOT FOUND THEN
        RETURN true;
    END IF;
    
    -- Check if current time is within allowed range
    RETURN current_time_var >= schedule_record.start_time 
           AND current_time_var <= schedule_record.end_time;
END;
$$;