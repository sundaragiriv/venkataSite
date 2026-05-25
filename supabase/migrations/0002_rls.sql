alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.flashcard_mastery enable row level security;
alter table public.lesson_comments enable row level security;
alter table public.comment_flags enable row level security;

create policy "authenticated users can read profiles"
on public.profiles
for select
to authenticated
using (true);

create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "users can read own stats"
on public.user_stats
for select
to authenticated
using (user_id = auth.uid());

create policy "users can insert own stats"
on public.user_stats
for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can update own stats"
on public.user_stats
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can delete own stats"
on public.user_stats
for delete
to authenticated
using (user_id = auth.uid());

create policy "users can read own lesson progress"
on public.lesson_progress
for select
to authenticated
using (user_id = auth.uid());

create policy "users can insert own lesson progress"
on public.lesson_progress
for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can update own lesson progress"
on public.lesson_progress
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can delete own lesson progress"
on public.lesson_progress
for delete
to authenticated
using (user_id = auth.uid());

create policy "users can read own quiz attempts"
on public.quiz_attempts
for select
to authenticated
using (user_id = auth.uid());

create policy "users can insert own quiz attempts"
on public.quiz_attempts
for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can update own quiz attempts"
on public.quiz_attempts
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can delete own quiz attempts"
on public.quiz_attempts
for delete
to authenticated
using (user_id = auth.uid());

create policy "users can read own flashcard mastery"
on public.flashcard_mastery
for select
to authenticated
using (user_id = auth.uid());

create policy "users can insert own flashcard mastery"
on public.flashcard_mastery
for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can update own flashcard mastery"
on public.flashcard_mastery
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can delete own flashcard mastery"
on public.flashcard_mastery
for delete
to authenticated
using (user_id = auth.uid());

create policy "authenticated users can read live comments"
on public.lesson_comments
for select
to authenticated
using (deleted_at is null);

create policy "users can insert own comments"
on public.lesson_comments
for insert
to authenticated
with check (user_id = auth.uid());

create policy "users can update own comments"
on public.lesson_comments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can read own flags"
on public.comment_flags
for select
to authenticated
using (flagger_id = auth.uid());

create policy "users can insert own flags"
on public.comment_flags
for insert
to authenticated
with check (flagger_id = auth.uid());
