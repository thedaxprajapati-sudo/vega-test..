/*
# Create messages table for chat app

1. New Tables
- `messages`
  - `id` (uuid, primary key)
  - `content` (text, not null) — the chat message text
  - `user_id` (uuid, not null, defaults to authenticated user) — who sent it
  - `username` (text, not null) — display name of sender
  - `created_at` (timestamptz, defaults to now) — when the message was sent

2. Security
- Enable RLS on `messages`.
- Owner-scoped INSERT: authenticated users can only insert messages with their own user_id.
- Public SELECT: any authenticated user can read all messages (it's a shared chat room).
- No UPDATE or DELETE — messages are immutable once sent.

3. Important Notes
- `user_id` defaults to `auth.uid()` so frontend inserts that omit it still satisfy RLS.
- All authenticated users can see all messages (shared chat room, not DMs).
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read all messages (shared chat room)
DROP POLICY IF EXISTS "authenticated_select_messages" ON messages;
CREATE POLICY "authenticated_select_messages"
ON messages FOR SELECT
TO authenticated USING (true);

-- Allow authenticated users to insert only their own messages
DROP POLICY IF EXISTS "authenticated_insert_own_messages" ON messages;
CREATE POLICY "authenticated_insert_own_messages"
ON messages FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create index for efficient ordering by time
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);
