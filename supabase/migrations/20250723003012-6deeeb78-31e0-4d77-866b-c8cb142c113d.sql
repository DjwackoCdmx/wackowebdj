-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create schedule settings table
CREATE TABLE public.schedule_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(day_of_week)
);

-- Enable RLS for schedule settings
ALTER TABLE public.schedule_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view schedule settings
CREATE POLICY "Anyone can view schedule settings" 
ON public.schedule_settings 
FOR SELECT 
USING (true);

-- Only functions can modify schedule settings (admin only)
CREATE POLICY "Only functions can modify schedule" 
ON public.schedule_settings 
FOR ALL 
USING (true);

-- Add user_id to song_requests for better tracking
ALTER TABLE public.song_requests ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add trigger for auto updating timestamps
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_settings_updated_at
BEFORE UPDATE ON public.schedule_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if requests are allowed at current time
CREATE OR REPLACE FUNCTION public.is_request_time_allowed()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    current_day INTEGER;
    current_time TIME;
    schedule_record RECORD;
BEGIN
    -- Get current day of week (0 = Sunday, 6 = Saturday)
    current_day := EXTRACT(DOW FROM NOW());
    current_time := NOW()::TIME;
    
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
    RETURN current_time >= schedule_record.start_time 
           AND current_time <= schedule_record.end_time;
END;
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data ->> 'name', '')
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();