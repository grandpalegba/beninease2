"use client";

import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Lock, Eye, EyeOff, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignupFormProps {
  intent: 'talent' | 'voter';
  onSuccess?: () => void;
}

export default function SignupForm({ intent, onSuccess }: SignupFormProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Les mots de passe ne correspondent pas." });
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setMessage({ type: 'error', text: "Le mot de passe doit contenir au moins 6 caractères." });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            registration_intent: intent === 'talent' ? 'candidat' : 'votant' 
          }
        }
      });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: "Compte créé avec succès! Vous pouvez maintenant vous connecter." 
      });

      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue lors de la création du compte.";
      console.error("Signup error:", err);
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  const buttonBaseClasses = "flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  return (
    <div className="w-full">
      <form onSubmit={handleSignup} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-2">
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#F9F9F7] border-transparent focus:bg-white focus:border-[#008751] focus:ring-0 transition-all font-sans text-sm"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              minLength={6}
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#F9F9F7] border-transparent focus:bg-white focus:border-[#008751] focus:ring-0 transition-all font-sans text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
              minLength={6}
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#F9F9F7] border-transparent focus:bg-white focus:border-[#008751] focus:ring-0 transition-all font-sans text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !email || !password || !confirmPassword}
          className={cn(buttonBaseClasses, "bg-[#008751] text-white hover:bg-[#008751]/90 shadow-[#008751]/20 shadow-lg")}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <User className="w-5 h-5" />}
          Créer un compte
        </button>
      </form>

      {/* Password Requirements */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>Le mot de passe doit contenir:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Au moins 6 caractères</li>
          <li>Recommandé: lettres, chiffres et symboles</li>
        </ul>
      </div>

      {/* Message Display */}
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
