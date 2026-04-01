"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Loader2, Calendar, ArrowRight, Target, Globe, Heart,
  Flame, Zap, CheckCircle2, Timer, Star, ShieldCheck, 
  GraduationCap, Crown, Trophy, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { universes } from "@/lib/data/universes";
import { cn } from "@/lib/utils";

// --- CONFIGURATION DES 8 GRADES BÉNINOIS ---
const GRADES = [
  { name: "Votant", votes: 0, univers: 0, categories: 0, icon: Star, color: "text-gray-400", hex: "#9ca3af" },
  { name: "Électeur", votes: 5, univers: 2, categories: 3, icon: Zap, color: "text-[#008751]", hex: "#008751" },
  { name: "Grand Électeur", votes: 15, univers: 4, categories: 8, icon: Trophy, color: "text-[#FCD116]", hex: "#FCD116" },
  { name: "Citoyen", votes: 35, univers: 6, categories: 15, icon: Heart, color: "text-[#E8112D]", hex: "#E8112D" },
  { name: "Citoyen Engagé", votes: 70, univers: 9, categories: 25, icon: ShieldCheck, color: "text-green-400", hex: "#4ade80" },
  { name: "Citoyen Conscient", votes: 120, univers: 12, categories: 40, icon: GraduationCap, color: "text-yellow-400", hex: "#facc15" },
  { name: "Référent", votes: 180, univers: 14, categories: 55, icon: Target, color: "text-red-400", hex: "#f87171" },
  { name: "Gardien", votes: 250, univers: 16, categories: 64, icon: Crown, color: "text-amber-500", hex: "#f59e0b" },
];

export default function VoterDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  
  const [user, setUser] = useState<any>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  // Filtres
  const [selectedUniverse, setSelectedUniverse] = useState("Tous les univers");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);

    // Correction de la requête Supabase (Ajout de .from("votes"))
    const { data: votesData } = await supabase
      .from("votes")
      .select(`
        id, created_at, talent_id, categorie, univers,
        talents ( id, slug, prenom, nom, image_url )
      `)
      .eq("voter_id", user.id)
      .order("created_at", { ascending: false });

    if (votesData) {
      setVotes(votesData);
      
      // Calcul du quota 16 votes / 24h
      const last24h = votesData.filter(v => new Date(v.created_at) > new Date(Date.now() - 24*60*60*1000));
      if (last24h.length >= 16) {
        const oldest = new Date(last24h[last24h.length - 1].created_at);
        const next = new Date(oldest.getTime() + 24*60*60*1000);
        const diff = next.getTime() - Date.now();
        if (diff > 0) {
          setTimeRemaining(`${Math.floor(diff/(1000*60*60))}h ${Math.floor((diff%(1000*60*60))/(1000*60))}min`);
        }
      }
    }
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { loadData(); }, [loadData]);

  // Stats & Grade Logic
  const stats = useMemo(() => {
    const uCount = new Set(votes.map(v => v.univers).filter(Boolean)).size;
    const cCount = new Set(votes.map(v => v.categorie).filter(Boolean)).size;
    
    let currentGrade = GRADES[0];
    for (const g of GRADES) {
      if (votes.length >= g.votes && uCount >= g.univers && cCount >= g.categories) {
        currentGrade = g;
      } else break;
    }

    return { total: votes.length, univers: uCount, categories: cCount, currentGrade };
  }, [votes]);

  const nextGrade = GRADES[GRADES.indexOf(stats.currentGrade) + 1] || null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c]">
      <Loader2 className="w-12 h-12 text-[#008751] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pb-20 selection:bg-[#008751]/30">
      {/* EFFETS DE FOND CYBER */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#008751]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E8112D]/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#FCD116]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-12">
        {/* HEADER HOLOGRAPHIQUE */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-4 mb-2">
              <div className={cn("p-2 rounded-xl bg-white/5 border border-white/10", stats.currentGrade.color)}>
                <stats.currentGrade.icon size={24} />
              </div>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Statut Citoyen</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase italic">
              {stats.currentGrade.name}
            </h1>
          </motion.div>

          {timeRemaining && (
            <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl backdrop-blur-md flex items-center gap-3">
              <Timer className="text-red-500 w-5 h-5" />
              <div className="text-[10px] font-bold uppercase leading-tight text-red-500">
                Quota 24h atteint<br/>Prochain vote dans {timeRemaining}
              </div>
            </motion.div>
          )}
        </header>

        {/* GRILLE DE PROGRESSION CYBER-BÉNIN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Impact (Votes)" current={stats.total} target={nextGrade?.votes || 250} color="#008751" icon={<Flame size={16}/>} />
          <StatCard label="Exploration" current={stats.univers} target={16} color="#FCD116" icon={<Globe size={16}/>} />
          <StatCard label="Profondeur" current={stats.categories} target={64} color="#E8112D" icon={<Target size={16}/>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* PROVERBE DU JOUR */}
            <motion.div className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl relative group">
              <Zap className="absolute top-6 right-6 text-[#FCD116] opacity-20 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-[#FCD116] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Proverbe du jour</h3>
              <p className="text-2xl font-display italic font-light leading-relaxed">
                "La forêt est immense, on n'y finit jamais de faire des découvertes. Chaque vote est un nouveau chemin pour le Bénin."
              </p>
              <Link href="/talents" className="mt-8 inline-flex items-center gap-2 text-[#008751] font-black text-xs uppercase tracking-widest group">
                Voter maintenant <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
              </Link>
            </motion.div>

            {/* LISTE DES VOTES FILTRÉE */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Archives Citoyennes</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                  <input 
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer..." className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[10px] focus:outline-none focus:border-[#008751] transition-all"
                  />
                </div>
              </div>
              
              <div className="grid gap-3">
                {votes.filter(v => `${v.talents?.prenom} ${v.talents?.nom}`.toLowerCase().includes(searchQuery.toLowerCase())).map((vote, i) => (
                  <motion.div key={vote.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="group flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/10">
                      <Image src={vote.talents?.image_url || "/placeholder.jpg"} alt="" fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{vote.talents?.prenom} {vote.talents?.nom}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[8px] font-black uppercase bg-[#008751]/20 text-[#008751] px-2 py-0.5 rounded-full">{vote.univers}</span>
                        <span className="text-[8px] font-medium text-white/30 uppercase tracking-tighter">{new Date(vote.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/talents/${vote.talents?.slug}`}>
                      <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#008751] transition-colors">
                        <ChevronRight size={14} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR : UNIVERS & GRADE */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md text-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Niveau d'Exploration</h3>
              <div className="grid grid-cols-4 gap-3">
                {universes.map((u) => {
                  const isDone = votes.some(v => v.univers === u.name);
                  const Icon = u.icon;
                  return (
                    <div key={u.name} className={cn("aspect-square rounded-xl flex items-center justify-center transition-all", isDone ? "bg-[#FCD116] text-black shadow-[0_0_15px_rgba(252,209,22,0.3)]" : "bg-white/5 text-white/20")}>
                      <Icon size={16} />
                    </div>
                  );
                })}
              </div>
              <p className="mt-8 text-[10px] text-white/30 font-medium leading-relaxed">
                {nextGrade ? `Plus que ${nextGrade.univers - stats.univers} univers à découvrir pour devenir ${nextGrade.name}.` : "Vous avez exploré tout le Bénin !"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, current, target, color, icon }: any) {
  const progress = Math.min((current / target) * 100, 100);
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-white/40 uppercase font-black text-[9px] tracking-widest">
          {icon} {label}
        </div>
        <div className="text-xl font-mono font-bold">{current}<span className="text-white/20 text-xs">/{target}</span></div>
      </div>
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>;
}