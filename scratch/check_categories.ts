import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getCategories() {
  const { data, error } = await supabase.from('talents').select('talent_categorie_id')
  if (error) {
    console.error(error)
    return
  }
  const ids = Array.from(new Set(data.map(t => t.talent_categorie_id)))
  console.log(JSON.stringify(ids))
}

getCategories()
