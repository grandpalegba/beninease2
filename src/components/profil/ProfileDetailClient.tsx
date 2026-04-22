'use client';

import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, ShoppingBag, MapPin, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PROFILE_PHOTOS } from "@/assets/profiles";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  photoIndex: number;
  imageUrl?: string;
  products: string[];
  projects: string[];
  age?: number;
  archetype?: string;
}

/**
 * ProfileDetailClient - Premium profile view.
 * Features smooth animations, glassmorphism, and elegant typography.
 */
export default function ProfileDetailClient({ profile }: { profile: Profile }) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "Profil BeninEase";
  
  // Image path logic
  let profilePhoto = profile.imageUrl || "";
  if (profilePhoto && !profilePhoto.startsWith('http') && !profilePhoto.startsWith('/')) {
    profilePhoto = `/profiles/${profilePhoto}`;
  }
  if (!profilePhoto) {
    profilePhoto = PROFILE_PHOTOS[profile.photoIndex % PROFILE_PHOTOS.length];
  }

  return (
    <main className="min-h-screen bg-[#FDFCFB] text-[#1a1c1c] font-sans">
      {/* Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 h-20 px-6 flex items-center justify-between z-50 bg-white/50 backdrop-blur-md border-b border-zinc-100">
        <Link 
          href="/consultation" 
          className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5a5c5c] hover:text-[#1a1a1a] transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-white transition-all shadow-sm">
            <ArrowLeft size={14} />
          </div>
          Retour au Mur
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#008751]" />
          <span className="text-[10px] font-bold tracking-[0.1em] text-[#5a5c5c] uppercase">Détail du Profil</span>
        </div>
      </nav>

      <div className="pt-20 max-w-6xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* Left Column: Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 shadow-2xl relative">
            <motion.img 
              src={profilePhoto} 
              alt={fullName}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-8 left-8 text-white">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-80 mb-2 block">
                Bokônon de référence
              </span>
              <h2 className="text-3xl font-headline font-bold">
                {profile.archetype || "Sagesse Béninoise"}
              </h2>
            </div>
          </div>
          
          {/* Accent decoration */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#008751]/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#fcd116]/10 rounded-full blur-3xl -z-10" />
        </motion.div>

        {/* Right Column: Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col gap-10"
        >
          {/* Name Section */}
          <header>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-headline font-bold text-[#1a1a1a] tracking-tight mb-4"
            >
              {profile.firstName} <br />
              <span className="text-[#008751]">{profile.lastName}</span>
            </motion.h1>
            <div className="flex flex-wrap gap-4 text-[#5a5c5c] text-sm">
              {profile.age && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#008751]" />
                  <span>{profile.age} ans</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#008751]" />
                <span>Bénin, Afrique de l'Ouest</span>
              </div>
            </div>
          </header>

          {/* Bio / Products / Projects Section */}
          <section className="space-y-12">
            
            {/* Products */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#008751]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#5a5c5c]">Expertises & Produits</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.products.length > 0 ? profile.products.map((item, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                    className="px-4 py-2 bg-white border border-zinc-200 rounded-full text-[11px] font-medium text-[#1a1a1a] shadow-sm hover:border-[#008751] hover:text-[#008751] transition-colors cursor-default"
                  >
                    {item}
                  </motion.span>
                )) : (
                  <span className="text-sm text-zinc-400 italic">Aucune expertise répertoriée</span>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Briefcase size={20} className="text-[#008751]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#5a5c5c]">Projets Culturels</h3>
              </div>
              <div className="grid gap-3">
                {profile.projects.length > 0 ? profile.projects.map((project, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="group flex items-center justify-between p-4 bg-[#f9f9f8] rounded-xl hover:bg-white border border-transparent hover:border-zinc-200 transition-all cursor-pointer"
                  >
                    <span className="text-sm font-headline font-medium text-[#1a1a1a]">{project}</span>
                    <ExternalLink size={14} className="text-zinc-300 group-hover:text-[#008751] transition-colors" />
                  </motion.div>
                )) : (
                  <span className="text-sm text-zinc-400 italic">Aucun projet répertorié</span>
                )}
              </div>
            </div>
          </section>

          {/* Action Button */}
          <footer className="pt-6">
            <button 
              className="w-full md:w-auto px-10 py-5 bg-[#1a1a1a] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#008751] transition-all shadow-xl hover:shadow-[#008751]/20 active:scale-[0.98]"
            >
              Solliciter une consultation
            </button>
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
