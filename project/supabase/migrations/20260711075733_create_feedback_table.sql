/*
# Create feedback table for user reviews

## Purpose
Stores user-submitted book reviews and feedback (name, star rating, message).
This is public/shared data — the feedback form is accessible to all visitors
without signing in, so policies allow both anon and authenticated roles.

## New Table: feedback
- `id` (uuid, primary key, auto-generated)
- `name` (text, not null) — reviewer's display name
- `rating` (integer, not null, check 1–5) — star rating
- `message` (text, not null) — review text
- `created_at` (timestamptz, default now()) — submission timestamp

## Security
- RLS enabled on feedback table.
- 4 separate policies (SELECT, INSERT, UPDATE, DELETE) scoped to
  TO anon, authenticated — the feedback form is public, no sign-in required.
- USING (true) / WITH CHECK (true) is acceptable here because all feedback
  is intentionally public/shared (single-tenant, no ownership concept).

## Notes
1. The existing `contacts` table remains unchanged — it serves a different
   purpose (general contact form submissions without ratings).
2. This table is independent and does not reference auth.users.
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_feedback" ON feedback;
CREATE POLICY "anon_select_feedback"
ON feedback FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback"
ON feedback FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_feedback" ON feedback;
CREATE POLICY "anon_update_feedback"
ON feedback FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_feedback" ON feedback;
CREATE POLICY "anon_delete_feedback"
ON feedback FOR DELETE
TO anon, authenticated USING (true);

-- Index for ordering by most recent
CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback (created_at DESC);
