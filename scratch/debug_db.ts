import { createClient } from '@supabase/supabase-client'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function debug() {
  const { data: ep } = await supabase.from('series_histoires').select('*').limit(1)
  console.log('Series Histoires row:', JSON.stringify(ep?.[0], null, 2))
  
  const { data: s } = await supabase.from('series').select('*').limit(1)
  console.log('Series row:', JSON.stringify(s?.[0], null, 2))
  
  const { data: p } = await supabase.from('profiles_histoires').select('*').limit(1)
  console.log('Profile row:', JSON.stringify(p?.[0], null, 2))
}

debug()
