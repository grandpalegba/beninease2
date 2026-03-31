const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You need to add this to .env.local

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Talent data from the database
const talents = [
  { id: '2c2fde78-a8b6-4de1-a0a3-11d5e4a5f71e', prenom: 'Aïcha', nom: 'Hounkpatin' },
  { id: '146383ae-9a7b-421c-b630-776fc165e00a', prenom: 'Armand', nom: 'Tossou' },
  { id: '81e02120-75c5-4472-a46d-c29faa363698', prenom: 'Arnaud', nom: 'Zinsou' },
  { id: '0b5d458b-caf6-432f-b1d7-e15eb7663ad2', prenom: 'Basile', nom: 'Kora' },
  { id: '6adc3113-9ad1-4a55-bc6b-cb6b0bc99c31', prenom: 'Carine', nom: 'Adjovi' },
  { id: 'bc6c1141-efd5-4810-82d8-2c692b154dee', prenom: 'Grâce', nom: 'Houessou' },
  { id: 'a10e4e4c-026e-4ddb-9267-83f643b4a05b', prenom: 'Ibrahim', nom: 'Lawani' },
  { id: '75c86eda-0f05-4aea-b80b-3a1caf946d92', prenom: 'Jonas', nom: 'Ahodéhou' },
  { id: '4257d182-3e88-4ae4-a40b-82ff5a87ff14', prenom: 'Koffi', nom: 'Ahouansou' },
  { id: 'bc44555b-73a3-45a9-8516-dd1810567353', prenom: 'Koffi', nom: 'Adjakpa' },
  { id: '1b8ad3eb-bb8a-4d6e-b2c9-f3edcd52b8a2', prenom: 'Lionel', nom: 'Agossou' },
  { id: '9d3eaabc-06a9-4a56-a77c-058013abba85', prenom: 'Mireille', nom: 'Tognifodé' },
  { id: 'e6e06ee6-e6b0-4643-ad91-29b4aa1a1281', prenom: 'Nadège', nom: 'Kiki' },
  { id: '2f72f271-7a0a-42cd-a2da-47a6c6274d74', prenom: 'Romaric', nom: 'Hountondji' },
  { id: '7d217063-3bee-4dc9-addc-77a65ef4b9b6', prenom: 'Sènami', nom: 'Dossou' },
  { id: 'da6266d4-ceaa-4e73-9f55-703013b63495', prenom: 'Steve', nom: 'Kpadé' }
];

function generateEmail(prenom, nom) {
  // Remove accents and convert to lowercase
  const cleanPrenom = prenom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  
  const cleanNom = nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  
  return `${cleanPrenom}${cleanNom}@beninease.com`;
}

async function createTalentUsers() {
  const password = 'Beninease2026!';
  const results = [];
  
  console.log('Creating auth users for talents...\n');
  
  for (const talent of talents) {
    try {
      const email = generateEmail(talent.prenom, talent.nom);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          prenom: talent.prenom,
          nom: talent.nom,
          role: 'talent'
        }
      });
      
      if (authError) {
        console.error(`Error creating user for ${talent.prenom} ${talent.nom}:`, authError);
        results.push({
          talentName: `${talent.prenom} ${talent.nom}`,
          email: email,
          password: password,
          auth_user_id: 'ERROR',
          error: authError.message
        });
        continue;
      }
      
      // Update talent record with auth_user_id
      const { error: updateError } = await supabase
        .from('talents')
        .update({ auth_user_id: authData.user.id })
        .eq('id', talent.id);
      
      if (updateError) {
        console.error(`Error updating talent ${talent.prenom} ${talent.nom}:`, updateError);
        results.push({
          talentName: `${talent.prenom} ${talent.nom}`,
          email: email,
          password: password,
          auth_user_id: authData.user.id,
          error: updateError.message
        });
        continue;
      }
      
      results.push({
        talentName: `${talent.prenom} ${talent.nom}`,
        email: email,
        password: password,
        auth_user_id: authData.user.id,
        error: null
      });
      
      console.log(`✅ Created user: ${email} -> ${talent.prenom} ${talent.nom}`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Unexpected error for ${talent.prenom} ${talent.nom}:`, error);
      results.push({
        talentName: `${talent.prenom} ${talent.nom}`,
        email: generateEmail(talent.prenom, talent.nom),
        password: password,
        auth_user_id: 'ERROR',
        error: error.message
      });
    }
  }
  
  // Display results table
  console.log('\n=== RESULTS TABLE ===');
  console.log('| Talent Name | Email | Password | Auth User ID | Status |');
  console.log('|-------------|-------|----------|--------------|--------|');
  
  results.forEach(result => {
    const status = result.error ? 'ERROR' : 'SUCCESS';
    console.log(`| ${result.talentName} | ${result.email} | ${result.password} | ${result.auth_user_id} | ${status} |`);
  });
  
  // Save results to file
  const fs = require('fs');
  fs.writeFileSync('talent_auth_results.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to talent_auth_results.json');
}

createTalentUsers().catch(console.error);
