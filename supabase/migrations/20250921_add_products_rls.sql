-- Enable Row Level Security and create policies to allow authenticated users to insert products
-- Run this using psql in your Supabase database or via the Supabase SQL editor.

-- Enable RLS on products table
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to INSERT into products table
CREATE POLICY "Allow authenticated insert" ON public.products
  FOR INSERT
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Optionally allow authenticated users to UPDATE their own products if you store owner id
-- CREATE POLICY "Allow authenticated update own" ON public.products
--   FOR UPDATE
--   USING (auth.role() = 'authenticated' AND owner_id = auth.uid());

-- Optionally allow authenticated users to DELETE their own products
-- CREATE POLICY "Allow authenticated delete own" ON public.products
--   FOR DELETE
--   USING (auth.role() = 'authenticated' AND owner_id = auth.uid());

-- NOTE: Adjust policies as needed (e.g., require user to be admin or set owner_id on insert).
