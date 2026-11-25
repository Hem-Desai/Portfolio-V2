-- Kudos lockdown: visitors can read counts and add +1, nothing else.
-- Run this once in the Supabase dashboard (SQL Editor) for this project.
-- Safe to re-run.

begin;

-- 1. Remove the old wide-open policy (it let anyone update or delete any row).
drop policy if exists "Allow public insert/update on reactions" on public.reactions;

-- 2. Keep public read access.
drop policy if exists "Allow public read access on reactions" on public.reactions;
create policy "Allow public read access on reactions"
  on public.reactions
  for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies for anon: with RLS on, direct writes are denied.
alter table public.reactions enable row level security;
revoke insert, update, delete, truncate on public.reactions from anon, authenticated;

-- 3. One row per emoji, so the RPC can upsert.
--    If this fails with a duplicate error, merge duplicate rows first (see note at bottom).
create unique index if not exists reactions_emoji_key on public.reactions (emoji);

-- 4. The only write path: add exactly +1 to one of the allowed emojis.
create or replace function public.increment_reaction(p_emoji text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_emoji not in ('❤️', '👍', '🎉', '🚀', '🔥', '👏', '🌟', '💡') then
    raise exception 'emoji not allowed';
  end if;

  insert into public.reactions (emoji, count)
  values (p_emoji, 1)
  on conflict (emoji) do update set count = public.reactions.count + 1;
end;
$$;

revoke all on function public.increment_reaction(text) from public;
grant execute on function public.increment_reaction(text) to anon, authenticated;

commit;

-- Optional: run this BEFORE the script above if step 3 fails because
-- an emoji has more than one row. It sums the counts into the oldest row
-- and deletes the extras.
--
--   update public.reactions r
--   set count = t.total
--   from (select emoji, sum(count) as total, min(id) as keep_id
--         from public.reactions group by emoji) t
--   where r.id = t.keep_id;
--
--   delete from public.reactions r
--   using (select emoji, min(id) as keep_id from public.reactions group by emoji) t
--   where r.emoji = t.emoji and r.id <> t.keep_id;
