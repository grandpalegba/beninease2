// Supabase Auth Admin API Reference
// Explanation of createUser method for talent accounts

// Complete createUser call with all parameters
const { data, error } = await supabase.auth.admin.createUser({
  email: "aichahounkpatin@beninease.com", // Generated email
  password: "Beninease2026!", // Standard password for all talents
  email_confirm: true, // Auto-confirm email (no verification needed)
  user_metadata: { // Additional user data
    prenom: "Aïcha", // Talent's first name
    nom: "Hounkpatin", // Talent's last name
    role: "talent" // User role for permissions
  }
});

// Response structure:
const responseExample = {
  data: {
    user: {
      id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Auth user ID (UUID)
      aud: "authenticated", // Audience
      role: "authenticated", // Role
      email: "aichahounkpatin@beninease.com", // Email
      email_confirmed_at: "2026-03-31T00:00:00Z", // When email was confirmed
      phone: "", // Phone (empty if not set)
      confirmed_at: "2026-03-31T00:00:00Z", // Account confirmation timestamp
      last_sign_in_at: null, // Last login (null for new users)
      created_at: "2026-03-31T00:00:00Z", // Account creation timestamp
      updated_at: "2026-03-31T00:00:00Z", // Last update timestamp
      app_metadata: { // Application-level metadata
        provider: "email", // Authentication provider
        providers: ["email"] // Available providers
      },
      user_metadata: { // Custom metadata (what we set)
        prenom: "Aïcha",
        nom: "Hounkpatin",
        role: "talent"
      },
      identities: [ // Authentication identities
        {
          id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          user_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          identity_data: { // Identity provider data
            email: "aichahounkpatin@beninease.com",
            provider_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          },
          provider: "email", // Provider type
          created_at: "2026-03-31T00:00:00Z",
          updated_at: "2026-03-31T00:00:00Z"
        }
      ],
      factors: [], // MFA factors (empty for now)
      is_anonymous: false // User is not anonymous
    }
  },
  error: null // Error object (null if successful)
};

// Key Benefits for Talents:
// 1. email_confirm: true → No email verification required
// 2. user_metadata.role: 'talent' → Used for permissions in app
// 3. user_metadata.prenom/nom → Available in frontend for personalization
// 4. Standard password → Easy to remember and distribute
// 5. Auto-generated emails → Consistent format

// Error Handling:
if (error) {
  console.error("Auth user creation failed:", error);
  // Common errors:
  // - "User already registered" → User with this email exists
  // - "Invalid email" → Email format is invalid
  // - "Password should be at least 6 characters" → Password too short
  // - "Database error saving new user" → Database issue
}

// Success Flow:
// 1. Create auth user → Get auth.user.id
// 2. Update talents table → Set auth_user_id = auth.user.id
// 3. Talent can now log in with email/password
// 4. Frontend can access user_metadata for personalization
