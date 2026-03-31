# Talent Login Credentials Preview

## Generated Email Addresses

| Talent Name | Email Address | Password |
|-------------|---------------|----------|
| Aïcha Hounkpatin | aichahounkpatin@beninease.com | Beninease2026! |
| Armand Tossou | armandtossou@beninease.com | Beninease2026! |
| Arnaud Zinsou | arnaudzinsou@beninease.com | Beninease2026! |
| Basile Kora | basilekora@beninease.com | Beninease2026! |
| Carine Adjovi | carineadjovi@beninease.com | Beninease2026! |
| Grâce Houessou | gracehouessou@beninease.com | Beninease2026! |
| Ibrahim Lawani | ibrahimlawani@beninease.com | Beninease2026! |
| Jonas Ahodéhou | jonasahodehou@beninease.com | Beninease2026! |
| Koffi Ahouansou | koffiahouansou@beninease.com | Beninease2026! |
| Koffi Adjakpa | koffiadjakpa@beninease.com | Beninease2026! |
| Lionel Agossou | lionelagossou@beninease.com | Beninease2026! |
| Mireille Tognifodé | mireilletognifode@beninease.com | Beninease2026! |
| Nadège Kiki | nadgekiki@beninease.com | Beninease2026! |
| Romaric Hountondji | romarichountondji@beninease.com | Beninease2026! |
| Sènami Dossou | senamidossou@beninease.com | Beninease2026! |
| Steve Kpadé | stevekpade@beninease.com | Beninease2026! |

## Email Format Logic

The emails are generated using:
1. Remove accents from first and last names
2. Convert to lowercase
3. Remove non-alphabetic characters
4. Concatenate first + last name
5. Add @beninease.com

Example:
- "Grâce Houessou" → "grace" + "houessou" → "gracehouessou@beninease.com"

## Next Steps

1. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
2. Run `node create_talent_auth_users.js`
3. Check `talent_auth_results.json` for results
4. Each talent can then log in with their credentials
