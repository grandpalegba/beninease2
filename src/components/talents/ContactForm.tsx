"use client";

import { useState } from "react";
import { supabase } from '@/utils/supabase/client';
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  receiverId: string;
  talentName: string;
}

export function ContactForm({ receiverId, talentName }: ContactFormProps) {
    const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Anti-spam check
    if (!isHuman || honeypot !== "") {
      console.warn("Spam detected or human certification missing");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_name: formData.name,
          sender_email: formData.email,
          subject: formData.subject,
          content: formData.message,
          receiver_id: receiverId,
          status: "unread"
        });

      if (error) throw error;
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsHuman(false); // Reset for next time
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Une erreur est survenue lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#008751]/5 border border-[#008751]/20 rounded-[32px] p-10 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-[#008751] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#008751]/20">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-display font-bold text-black">Message envoyé !</h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          Votre message a bien été transmis au talent. Il pourra le consulter dans son espace personnel.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-[#008751] font-bold text-sm uppercase tracking-widest hover:underline pt-4"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const inputClasses = "w-full px-6 py-4 rounded-2xl bg-[#F9F9F7] border-2 border-transparent focus:bg-white focus:border-[#008751]/20 focus:ring-0 transition-all font-sans text-sm outline-none";
  const labelClasses = "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-2 mb-1.5 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field (hidden from humans) */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className={labelClasses}>Votre Nom</label>
          <input
            type="text"
            required
            placeholder="Jean Dupont"
            className={inputClasses}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className={labelClasses}>Votre Email</label>
          <input
            type="email"
            required
            placeholder="jean@exemple.com"
            className={inputClasses}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Objet du message</label>
        <input
          type="text"
          required
          placeholder="Demande de collaboration, etc."
          className={inputClasses}
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>Message</label>
        <textarea
          required
          rows={5}
          placeholder="Bonjour, je souhaiterais vous contacter pour..."
          className={cn(inputClasses, "resize-none")}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-3 px-2">
        <input
          type="checkbox"
          id="isHuman"
          required
          checked={isHuman}
          onChange={(e) => setIsHuman(e.target.checked)}
          className="w-5 h-5 rounded-md border-2 border-[#008751]/20 text-[#008751] focus:ring-[#008751]/20 cursor-pointer"
        />
        <label htmlFor="isHuman" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
          Je certifie être un humain
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !isHuman}
        className="w-full py-5 bg-[#008751] text-white rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#008751]/20 hover:bg-[#004d3d] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
