'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ContactFormProps {
  recipientEmail: string;
  recipientName: string;
  onClose: () => void;
}

export default function ContactForm({ recipientEmail, recipientName, onClose }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    const senderName = formData.get('name') as string;

    const subject = encodeURIComponent(`YONYFA : Message de ${senderName}`);
    const body = encodeURIComponent(`Bonjour ${recipientName},\n\nVous avez reçu un message via votre profil YONYFA :\n\n---\n${message}\n---\n\nRépondre à : ${senderName}`);

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    setTimeout(() => setStatus('success'), 500);
  };

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-[#F5F5F4] rounded-xl">
        <div className="text-4xl mb-4">📩</div>
        <p className="text-stone-800 font-medium">Votre client mail s'est ouvert !</p>
        <button onClick={onClose} className="mt-6 text-amber-600 font-bold hover:underline">Fermer</button>
      </div>
    );
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">Votre Nom</label>
          <input 
            required 
            name="name" 
            type="text" 
            className="w-full mt-2 p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" 
            placeholder="Jean Dupont"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest">Message</label>
          <textarea 
            required 
            name="message" 
            rows={4} 
            className="w-full mt-2 p-4 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" 
            placeholder="Bonjour, je souhaiterais..."
          ></textarea>
        </div>
        <button 
          type="submit" 
          disabled={status === 'sending'}
          className="w-full py-5 bg-[#1a1a1a] text-white font-bold rounded-2xl hover:bg-amber-700 transition-all uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-[0.98]"
        >
          {status === 'sending' ? 'Ouverture...' : 'Ouvrir mon client mail'}
        </button>
      </form>
    </div>
  );
}
