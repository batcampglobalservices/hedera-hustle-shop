-- Add owner_id to products and tighten RLS policies so only owners can modify their products
-- Run this in Supabase SQL editor or via psql against your DB

-- Add owner_id column (uuid) to products
ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS owner_id uuid;

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;

-- Remove the permissive insert policy if it exists
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.products;

-- Create a policy that enforces owner_id matches auth.uid() on inserts
CREATE POLICY "Allow owner insert" ON public.products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND owner_id = auth.uid());

-- Allow owners to update their products
DROP POLICY IF EXISTS "Allow authenticated update" ON public.products;
CREATE POLICY "Allow owner update" ON public.products
  FOR UPDATE
  USING (owner_id = auth.uid());

-- Allow owners to delete their products
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.products;
CREATE POLICY "Allow owner delete" ON public.products
  FOR DELETE
  USING (owner_id = auth.uid());

-- Optional: allow SELECT for everyone (if you want public product listing)
DROP POLICY IF EXISTS "Public select" ON public.products;
CREATE POLICY "Public select" ON public.products
  FOR SELECT
  USING (true);

-- Note: If your application inserts products without owner_id, the insert will fail after
-- applying this policy. Ensure the client sets owner_id = auth.uid() on insert (AdminNewProduct does this if signed-in).
