-- Add confirmation fields to products for storing Hedera confirmation
ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS confirmed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS confirmation_tx text;

-- Optional: index on confirmation_tx
CREATE INDEX IF NOT EXISTS idx_products_confirmation_tx ON public.products(confirmation_tx);
