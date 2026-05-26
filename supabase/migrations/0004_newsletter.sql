-- Newsletter subscribers
-- Anonymous users can insert (signup form). Only service role can read/update/delete.
-- Email validated by client; CHECK constraint enforces basic shape on the DB side too.

create table public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source        text,                          -- 'footer', 'install-section', etc.
  user_id       uuid references public.profiles(id) on delete set null,
  unsubscribed  boolean not null default false,
  unsubscribed_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index on public.newsletter_subscribers (created_at desc);
create index on public.newsletter_subscribers (user_id) where user_id is not null;

create trigger newsletter_subscribers_set_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

alter table public.newsletter_subscribers enable row level security;

-- Anyone (including anon) can insert a subscription.
-- This is safe because the table has a UNIQUE constraint on email
-- and a CHECK on shape; abuse mitigation lives at the rate-limit layer
-- (Supabase project settings) and at the form layer (client validation).
create policy "anyone can subscribe"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated users can see / update their own subscription row.
create policy "users can see own subscription"
  on public.newsletter_subscribers
  for select
  to authenticated
  using (user_id = auth.uid() or email = (select email from auth.users where id = auth.uid()));

create policy "users can update own subscription"
  on public.newsletter_subscribers
  for update
  to authenticated
  using (user_id = auth.uid() or email = (select email from auth.users where id = auth.uid()))
  with check (user_id = auth.uid() or email = (select email from auth.users where id = auth.uid()));
