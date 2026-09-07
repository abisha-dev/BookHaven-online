
/*
# BookHaven Schema Part 1 — profiles, books, contacts tables

Creates the three core tables and a trigger to auto-create a profile on sign-up.

## Tables

### profiles
- id (uuid PK, FK auth.users)
- name (text)
- role (text 'user'|'admin')
- created_at

### books
- id, title, author, price, image, description, category, rating, stock, created_at

### contacts
- id, name, email, message, submitted_at

## Notes
- is_admin() helper function added AFTER profiles table exists (in Part 2)
- Triggers auto-create a profile row when a new auth user is created
*/

-- ─── profiles ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- ─── books ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image text DEFAULT '',
  description text DEFAULT '',
  category text DEFAULT 'Fiction',
  rating numeric(3,1) DEFAULT 0,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ─── contacts ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

-- ─── Auto-create profile on sign-up ─────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
