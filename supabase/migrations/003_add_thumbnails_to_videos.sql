
-- Add thumbnail_url to videos table
alter table public.videos
  add column if not exists thumbnail_url text;

-- Create a new bucket for video thumbnails
insert into storage.buckets (id, name, public)
  values ('video-thumbnails', 'video-thumbnails', true)
  on conflict (id) do nothing;

-- Set up access controls for storage
drop policy if exists "Thumbnail images are publicly accessible." on storage.objects;
create policy "Thumbnail images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'video-thumbnails' );

drop policy if exists "Anyone can upload a thumbnail." on storage.objects;
create policy "Anyone can upload a thumbnail."
  on storage.objects for insert
  with check ( bucket_id = 'video-thumbnails' );

drop policy if exists "Anyone can update their own thumbnail." on storage.objects;
create policy "Anyone can update their own thumbnail."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'video-thumbnails' );

drop policy if exists "Anyone can delete their own thumbnail." on storage.objects;
create policy "Anyone can delete their own thumbnail."
  on storage.objects for delete
  using ( bucket_id = 'video-thumbnails' and auth.uid() = owner );

drop policy if exists "Anyone can delete their own video." on storage.objects;
create policy "Anyone can delete their own video."
  on storage.objects for delete
  using ( bucket_id = 'candidate-videos' and auth.uid() = owner );
