-- Contact messages submitted via the /contact/ form.
-- Anonymous users can insert (form is public). Only service role reads.
-- Spam mitigation: CHECK on email shape, length limits, optional IP capture
-- via Supabase's edge function or a future trigger.

create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text check (name is null or length(name) <= 80),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject     text check (subject is null or length(subject) <= 140),
  message     text not null check (length(message) between 5 and 5000),
  user_id     uuid references public.profiles(id) on delete set null,
  source      text,                          -- 'brand', 'az-footer', etc.
  user_agent  text,
  responded   boolean not null default false,
  responded_at timestamptz,
  created_at  timestamptz not null default now()
);

create index on public.contact_messages (created_at desc);
create index on public.contact_messages (responded) where responded = false;

alter table public.contact_messages enable row level security;

-- Anyone can submit. Only service role reads (via Supabase dashboard).
create policy "anyone can submit contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated users can see their own submissions.
create policy "users can see own submissions"
  on public.contact_messages
  for select
  to authenticated
  using (user_id = auth.uid());
