create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text unique,
  avatar_url text,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  leaderboard_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_stats (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  total_xp int not null default 0,
  lessons_completed int not null default 0,
  flashcards_mastered int not null default 0,
  quiz_correct int not null default 0,
  quiz_total int not null default 0,
  streak_days int not null default 0,
  exam_readiness_pct int not null default 0 check (exam_readiness_pct between 0 and 100),
  last_active_at timestamptz
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index lesson_progress_user_id_idx on public.lesson_progress (user_id);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  scenario text not null,
  correct boolean not null,
  attempted_at timestamptz not null default now()
);

create index quiz_attempts_user_attempted_idx on public.quiz_attempts (user_id, attempted_at desc);

create table public.flashcard_mastery (
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_id text not null,
  mastered_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

create table public.lesson_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  parent_comment_id uuid references public.lesson_comments(id) on delete cascade,
  body text not null check (length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  flagged_count int not null default 0
);

create index lesson_comments_lesson_created_idx on public.lesson_comments (lesson_id, created_at desc);

create table public.comment_flags (
  comment_id uuid not null references public.lesson_comments(id) on delete cascade,
  flagger_id uuid not null references public.profiles(id) on delete cascade,
  reason text,
  flagged_at timestamptz not null default now(),
  primary key (comment_id, flagger_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_profile_created
after insert on public.profiles
for each row execute function public.handle_new_profile();

create or replace function public.enforce_comment_depth()
returns trigger
language plpgsql
as $$
declare
  parent_parent uuid;
begin
  if new.parent_comment_id is null then
    return new;
  end if;

  select parent_comment_id into parent_parent
  from public.lesson_comments
  where id = new.parent_comment_id;

  if parent_parent is not null then
    raise exception 'lesson comments support one reply level only';
  end if;

  return new;
end;
$$;

create trigger lesson_comments_depth_guard
before insert or update of parent_comment_id on public.lesson_comments
for each row execute function public.enforce_comment_depth();

create or replace function public.enforce_comment_update_rules()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  if old.user_id <> auth.uid() then
    raise exception 'only the author can update this comment';
  end if;

  if new.deleted_at is distinct from old.deleted_at then
    if old.deleted_at is not null
      or new.deleted_at is null
      or new.body is distinct from old.body
      or new.lesson_id is distinct from old.lesson_id
      or new.parent_comment_id is distinct from old.parent_comment_id
      or new.flagged_count is distinct from old.flagged_count
      or new.user_id is distinct from old.user_id
      or new.created_at is distinct from old.created_at then
      raise exception 'soft delete may only set deleted_at';
    end if;
    return new;
  end if;

  if new.body is distinct from old.body then
    if now() > old.created_at + interval '5 minutes' then
      raise exception 'comment edit window has expired';
    end if;
    new.edited_at = now();
    return new;
  end if;

  if new is distinct from old then
    raise exception 'only body edits or soft deletes are allowed';
  end if;

  return new;
end;
$$;

create trigger lesson_comments_update_guard
before update on public.lesson_comments
for each row execute function public.enforce_comment_update_rules();

create or replace function public.increment_comment_flag_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.lesson_comments
  set flagged_count = flagged_count + 1
  where id = new.comment_id;
  return new;
end;
$$;

create trigger comment_flags_increment_count
after insert on public.comment_flags
for each row execute function public.increment_comment_flag_count();
