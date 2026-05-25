create or replace view public.leaderboard
with (security_invoker = false)
as
select
  case
    when p.leaderboard_opt_in and nullif(p.display_name, '') is not null then p.display_name
    else 'anonymous-' || left(md5(p.id::text), 8)
  end as display_name,
  s.total_xp,
  s.lessons_completed,
  s.exam_readiness_pct,
  s.last_active_at
from public.profiles p
join public.user_stats s on s.user_id = p.id
order by s.exam_readiness_pct desc, s.total_xp desc
limit 100;

grant select on public.leaderboard to authenticated;
