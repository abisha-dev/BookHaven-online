
/*
# BookHaven Schema Part 2 — RLS policies, is_admin helper, and seed data

## Changes
- Adds is_admin() helper function
- Enables RLS on all three tables
- Books: public SELECT, admin-only CUD
- Contacts: public INSERT, admin-only SELECT
- Profiles: owner or admin access
- Seeds 12 sample books
*/

-- ─── is_admin helper ────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ─── profiles RLS ───────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE
  TO authenticated USING (auth.uid() = id OR public.is_admin());

-- ─── books RLS ──────────────────────────────────
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "books_select_public" ON public.books;
CREATE POLICY "books_select_public" ON public.books FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "books_insert_admin" ON public.books;
CREATE POLICY "books_insert_admin" ON public.books FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "books_update_admin" ON public.books;
CREATE POLICY "books_update_admin" ON public.books FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "books_delete_admin" ON public.books;
CREATE POLICY "books_delete_admin" ON public.books FOR DELETE
  TO authenticated USING (public.is_admin());

-- ─── contacts RLS ───────────────────────────────
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contacts_insert_public" ON public.contacts;
CREATE POLICY "contacts_insert_public" ON public.contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "contacts_select_admin" ON public.contacts;
CREATE POLICY "contacts_select_admin" ON public.contacts FOR SELECT
  TO authenticated USING (public.is_admin());

-- ─── Seed books ─────────────────────────────────
INSERT INTO public.books (title, author, price, image, description, category, rating, stock) VALUES
  ('The Great Gatsby', 'F. Scott Fitzgerald', 14.99, 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg?auto=compress&cs=tinysrgb&w=400', 'A story of wealth, love, and the American Dream set in the roaring Jazz Age.', 'Fiction', 4.5, 42),
  ('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 18.99, 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400', 'A sweeping history of humankind from the Stone Age to the present day.', 'History', 4.8, 30),
  ('A Brief History of Time', 'Stephen Hawking', 16.99, 'https://images.pexels.com/photos/2228555/pexels-photo-2228555.jpeg?auto=compress&cs=tinysrgb&w=400', 'An exploration of cosmology, black holes, and the fundamental nature of time.', 'Science', 4.7, 25),
  ('Atomic Habits', 'James Clear', 19.99, 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=400', 'Build good habits and break bad ones with proven, actionable strategies.', 'Self-Help', 4.9, 60),
  ('1984', 'George Orwell', 12.99, 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=400', 'A dystopian novel about totalitarianism, surveillance, and the fight for freedom.', 'Fiction', 4.8, 55),
  ('The Power of Now', 'Eckhart Tolle', 15.99, 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400', 'A spiritual guide to enlightenment and the practice of living in the present.', 'Self-Help', 4.4, 38),
  ('Cosmos', 'Carl Sagan', 17.99, 'https://images.pexels.com/photos/1580993/pexels-photo-1580993.jpeg?auto=compress&cs=tinysrgb&w=400', 'A personal voyage through the wonders of the universe and the history of science.', 'Science', 4.6, 20),
  ('To Kill a Mockingbird', 'Harper Lee', 13.99, 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=400', 'A profound story of racial injustice and childhood innocence in the American South.', 'Fiction', 4.9, 48),
  ('Thinking, Fast and Slow', 'Daniel Kahneman', 21.99, 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400', 'Explores the two systems driving the way we think and make decisions every day.', 'Non-Fiction', 4.7, 35),
  ('Steve Jobs', 'Walter Isaacson', 22.99, 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400', 'The exclusive, riveting biography of Apple co-founder Steve Jobs.', 'Biography', 4.5, 28),
  ('Clean Code', 'Robert C. Martin', 29.99, 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400', 'A handbook of agile software craftsmanship for writing cleaner, better code.', 'Technology', 4.6, 40),
  ('Gone Girl', 'Gillian Flynn', 14.99, 'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg?auto=compress&cs=tinysrgb&w=400', 'A gripping psychological thriller about a marriage with chilling dark secrets.', 'Mystery', 4.3, 33)
ON CONFLICT DO NOTHING;
