"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Mail, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  intent: "talent" | "voter";
}

export default function AuthButtons({ intent }: AuthButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (
    provider: "google" | "facebook" | "email",
    emailAddress?: string,
    userPassword?: string
  ) => {
    setLoading(provider);

    try {
      const redirectUrl =
        intent === "talent"
          ? `${window.location.origin}/dashboard/talent`
          : `${window.location.origin}/dashboard/votant`;

      // 🔥 LOGIN EMAIL
      if (provider === "email" && emailAddress && userPassword) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailAddress,
          password: userPassword,
        });

        if (error) throw error;

        if (data.user) {
          window.location.href =
            intent === "talent"
              ? "/dashboard/talent"
              : "/dashboard/votant";
        }
      }

      // 🔥 LOGIN GOOGLE / FACEBOOK
      if (provider !== "email") {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider as "google" | "facebook",
          options: {
            redirectTo: redirectUrl,
          },
        });

        if (error) throw error;
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Erreur de connexion");
    } finally {
      setLoading(null);
    }
  };

  const buttonBaseClasses =
    "flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50";

  return (
    <div className="w-full space-y-4">
      {/* Facebook */}
      <button
        onClick={() => handleLogin("facebook")}
        disabled={!!loading}
        className={cn(buttonBaseClasses, "bg-[#1877F2] text-white")}
      >
        {loading === "facebook" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Continuer avec Facebook"
        )}
      </button>

      {/* Google */}
      <button
        onClick={() => handleLogin("google")}
        disabled={!!loading}
        className={cn(buttonBaseClasses, "bg-white border text-black")}
      >
        {loading === "google" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Continuer avec Google"
        )}
      </button>

      {/* Email */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin("email", email, password);
        }}
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!!loading}
          className={cn(buttonBaseClasses, "bg-green-600 text-white")}
        >
          {loading === "email" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Se connecter"
          )}
        </button>
      </form>
    </div>
  );
}