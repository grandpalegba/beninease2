"use client";

import { useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Mail, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthButtonsProps {
  intent: 'talent' | 'voter';
}

export default function AuthButtons({ intent }: AuthButtonsProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogin = async (provider: 'google' | 'facebook' | 'email', emailAddress?: string) => {
    setLoading(provider);
    setMessage(null);

    const options = {
      data: { 
        registration_intent: intent === 'talent' ? 'candidat' : 'votant' 
      },
      redirectTo: `${window.location.origin}/auth/callback`,
    };

    try {
      if (provider === 'email' && emailAddress) {
        const { error } = await supabase.auth.signInWithOtp({ 
          email: emailAddress, 
          options 
        });
        if (error) throw error;
        setMessage({ type: 'success', text: "Un lien magique a été envoyé à votre adresse email." });
      } else if (provider !== 'email') {
        const { error } = await supabase.auth.signInWithOAuth({ 
          provider: provider as 'google' | 'facebook', 
          options 
        });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue lors de l'authentification.";
      console.error("Auth error:", err);
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(null);
    }
  };

  const buttonBaseClasses = "flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  return (
    <div className="w-full space-y-4">
      {/* Facebook Auth - Bleu #1877F2 */}
      <button
        onClick={() => handleLogin('facebook')}
        disabled={!!loading}
        className={cn(buttonBaseClasses, "bg-[#1877F2] text-white hover:bg-[#1877F2]/90")}
      >
        {loading === 'facebook' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )}
        Continuer avec Facebook
      </button>

      {/* Google Auth - Blanc/Bordure grise */}
      <button
        onClick={() => handleLogin('google')}
        disabled={!!loading}
        className={cn(buttonBaseClasses, "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50")}
      >
        {loading === 'google' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        )}
        Continuer avec Google
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
          <span className="px-4 bg-white">Ou par email</span>
        </div>
      </div>

      {/* Email OTP Auth */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin('email', email);
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="w-full px-6 py-4 rounded-2xl bg-[#F9F9F7] border-transparent focus:bg-white focus:border-[#008751] focus:ring-0 transition-all font-sans text-sm"
          />
        </div>
        
        <button
          type="submit"
          disabled={!!loading || !email}
          className={cn(buttonBaseClasses, "bg-[#008751] text-white hover:bg-[#008751]/90 shadow-[#008751]/20 shadow-lg")}
        >
          {loading === 'email' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
          Recevoir un lien magique
        </button>
      </form>

      {message && (
        <div className={cn(
          "p-4 rounded-2xl text-[11px] font-bold text-center animate-in fade-in slide-in-from-top-2",
          message.type === 'success' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
        )}>
          {message.text}
        </div>
      )}
    </div>
  );
}
