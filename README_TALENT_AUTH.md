# Creating Auth Users for Talents

## Overview
This script creates Supabase authentication accounts for all 16 talents and links them to their talent records.

## Prerequisites

1. **Get Supabase Service Role Key**:
   - Go to Supabase Dashboard → Project Settings → API
   - Copy the `service_role` key (NOT the `anon` key)
   - Add it to your `.env.local` file

2. **Update .env.local**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://wtjhkqkqmexddroqwawk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. **Install dependencies**:
```bash
npm install @supabase/supabase-js dotenv
```

## Running the Script

```bash
node create_talent_auth_users.js
```

## Generated Emails

The script generates emails using the format: `prenomnom@beninease.com`

Examples:
- Aïcha Hounkpatin → `aichahounkpatin@beninease.com`
- Grâce Houessou → `gracehouessou@beninease.com`
- Jonas Ahodéhou → `jonasahodehou@beninease.com`

## Password
All talent accounts use the same password: `Beninease2026!`

## Output

The script will:
1. Create 16 auth users with email confirmation
2. Link each auth user to their talent record via `auth_user_id`
3. Display a results table
4. Save detailed results to `talent_auth_results.json`

## Results Table Format

| Talent Name | Email | Password | Auth User ID | Status |
|-------------|-------|----------|--------------|--------|
| Aïcha Hounkpatin | aichahounkpatin@beninease.com | Beninease2026! | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | SUCCESS |

## Post-Creation

After running the script:
1. Each talent can log in with their email and password
2. They will have access to their dashboard
3. The `auth_user_id` field in the `talents` table will be populated

## Troubleshooting

- **Missing Service Role Key**: Ensure you've added `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- **Rate Limiting**: The script includes delays to avoid rate limiting
- **Duplicate Users**: If a user already exists, the script will show an error but continue

## Security Notes

- The service role key has admin privileges - keep it secure
- Change passwords after initial setup if needed
- The script sets `email_confirm: true` so no email verification is needed
