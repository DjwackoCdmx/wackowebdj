-- Add additional fields to user_profiles table for phone and nickname
ALTER TABLE public.user_profiles 
ADD COLUMN phone TEXT,
ADD COLUMN nickname TEXT;

-- Create a table to track user's saved songs
CREATE TABLE public.user_saved_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  song_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  genre TEXT,
  tip_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, song_name, artist_name)
);

-- Enable RLS for user_saved_songs
ALTER TABLE public.user_saved_songs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_saved_songs
CREATE POLICY "Users can view their own saved songs" 
ON public.user_saved_songs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved songs" 
ON public.user_saved_songs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved songs" 
ON public.user_saved_songs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved songs" 
ON public.user_saved_songs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for auto updating timestamps
CREATE TRIGGER update_user_saved_songs_updated_at
BEFORE UPDATE ON public.user_saved_songs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, name, phone, nickname)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'nickname', '')
    );
    RETURN NEW;
END;
$$;