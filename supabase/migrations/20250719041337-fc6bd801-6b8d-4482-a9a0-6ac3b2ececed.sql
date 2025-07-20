-- Crear tabla para solicitudes de canciones
CREATE TABLE public.song_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_name TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  genre TEXT,
  requester_name TEXT,
  telegram_username TEXT,
  tip_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'verified', 'cancelled')),
  played_status TEXT NOT NULL DEFAULT 'pending' CHECK (played_status IN ('pending', 'played', 'skipped')),
  priority_score INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN payment_status = 'verified' THEN FLOOR(tip_amount * 100)
      ELSE 0
    END
  ) STORED,
  stripe_session_id TEXT,
  payment_verified_at TIMESTAMP WITH TIME ZONE,
  played_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para tracking de pagos
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_request_id UUID REFERENCES public.song_requests(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled')),
  payment_method TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Crear políticas para song_requests (público puede insertar, admin puede ver todo)
CREATE POLICY "Cualquiera puede insertar solicitudes" 
ON public.song_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Todos pueden ver solicitudes" 
ON public.song_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Solo funciones pueden actualizar solicitudes" 
ON public.song_requests 
FOR UPDATE 
USING (true);

-- Crear políticas para payments (solo funciones edge pueden manipular)
CREATE POLICY "Solo funciones pueden insertar pagos" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Solo funciones pueden ver pagos" 
ON public.payments 
FOR SELECT 
USING (true);

CREATE POLICY "Solo funciones pueden actualizar pagos" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Crear función para actualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar timestamps automáticamente
CREATE TRIGGER update_song_requests_updated_at
    BEFORE UPDATE ON public.song_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Crear índices para mejor rendimiento
CREATE INDEX idx_song_requests_priority ON public.song_requests(priority_score DESC, created_at ASC) WHERE payment_status = 'verified';
CREATE INDEX idx_song_requests_payment_status ON public.song_requests(payment_status);
CREATE INDEX idx_song_requests_played_status ON public.song_requests(played_status);
CREATE INDEX idx_payments_stripe_session ON public.payments(stripe_session_id);
CREATE INDEX idx_payments_status ON public.payments(status);