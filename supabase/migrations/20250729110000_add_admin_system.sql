-- Add role system to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Set djwacko@outlook.es as admin (this will be done after the user profile exists)
-- The user needs to log in first to create their profile, then we'll update their role

-- Create a function to set admin role by email (for initial setup)
CREATE OR REPLACE FUNCTION public.set_admin_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_profiles 
  SET role = 'admin' 
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$$;

-- Grant execute permission to authenticated users (only for initial setup)
GRANT EXECUTE ON FUNCTION public.set_admin_by_email(TEXT) TO authenticated;
