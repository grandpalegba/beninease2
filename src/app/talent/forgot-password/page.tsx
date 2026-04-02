'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/talent/reset-password`,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        return;
      }

      setMessage({ 
        type: 'success', 
        text: "Un email de réinitialisation a été envoyé à votre adresse." 
      });

    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: "Une erreur est survenue. Veuillez réessayer." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[20px] shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/talent/login"
            className="inline-flex items-center text-[#008751] hover:text-[#006B40] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la connexion
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mot de passe oublié
          </h1>
          <p className="text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008751] focus:border-[#008751] focus:outline-none"
              placeholder="prenomnom@beninease.com"
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-[#008751] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#006B40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008751] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 inline mr-2" />
                Envoyer le lien
              </>
            )}
          </button>
        </form>

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous vous souvenez de votre mot de passe?{' '}
            <Link href="/talent/login" className="text-[#008751] hover:text-[#006B40] font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
