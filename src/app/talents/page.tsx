"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Talent } from "@/types";
import CandidateSwiper from "@/components/CandidateSwiper";
import { Loader2, AlertCircle, Search, Filter, X } from "lucide-react";
import TalentHeader from "@/components/TalentHeader";
import FilterPanel from "@/components/FilterPanel";

export default function TalentsPage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilter, setCurrentFilter] = useState({categorie: '', univers: ''});

  console.log('🔄 TalentsPage render - State:', { 
    talentsCount: talents.length, 
    loading, 
    error, 
    hasMore 
  });

  // Load 10 random talents on page entry
  const loadRandomTalents = useCallback(async () => {
    try {
      console.log('🔍 Testing Supabase connection and table...');
      setLoading(true);
      
      // Test 1: Vérifier si la table talents existe
      console.log('📋 Checking if talents table exists...');
      const { data: tableCheck, error: tableError } = await supabase
        .from('talents')
        .select('count')
        .limit(1);
      
      if (tableError) {
        console.error('❌ Table does not exist or not accessible:', tableError);
        throw new Error(`Table 'talents' not found: ${tableError.message}`);
      }
      
      console.log('✅ Talents table exists, loading data...');
      
      // Test 2: Charger les talents avec colonnes de base uniquement
      const { data, error } = await supabase
        .from('talents')
        .select('id, slug, prenom, nom, avatar_url, votes, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      console.log("📊 Supabase test:", { data, error });
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Talents found:', data?.length || 0);
      setTalents(data || []);
      setHasMore(true);
    } catch (err) {
      console.error('❌ Error loading talents:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more talents when approaching end
  const loadMoreTalents = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Remove duplicates and append
        const newTalents = data.filter(newTalent => 
          !talents.some(existing => existing.id === newTalent.id)
        );
        setTalents(prev => [...prev, ...newTalents]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more talents:', err);
    } finally {
      setLoading(false);
    }
  }, [talents, loading, hasMore]);

  // Search talents
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      loadRandomTalents();
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .or(`prenom.ilike.%${query}%,nom.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setTalents(data || []);
      setHasMore(true);
      setCurrentFilter({categorie: '', univers: ''});
    } catch (err) {
      console.error('Error searching talents:', err);
    } finally {
      setLoading(false);
    }
  }, [loadRandomTalents]);

  // Apply filters
  const applyFilters = useCallback(async (categorie: string, univers: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('talents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
      
      if (categorie) query = query.eq('categorie', categorie);
      if (univers) query = query.eq('univers', univers);
      
      const { data, error } = await query;
      
      if (error) throw error;
      setTalents(data || []);
      setHasMore(true);
      setCurrentFilter({categorie, univers});
    } catch (err) {
      console.error('Error filtering talents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial random talents
  useEffect(() => {
    loadRandomTalents();
  }, [loadRandomTalents]);

  if (loading && talents.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F7]">
      <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
      <p className="text-gray-600 animate-pulse">Chargement des Ambassadeurs...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
        <p className="text-gray-600 mb-4">
          Impossible de charger les talents. Vérifiez la console pour plus de détails.
        </p>
        <div className="bg-gray-100 p-3 rounded-lg mb-4 text-left">
          <p className="text-sm text-gray-500">
            Ouvrez les outils de développement (F12) et consultez l'onglet Console.
          </p>
        </div>
        <button 
          onClick={() => {
            setError(false);
            loadRandomTalents();
          }} 
          className="text-[#008751] font-bold hover:underline"
        >
          Réessayer
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      {/* Header with search and filter */}
      <TalentHeader 
        onSearch={handleSearch}
        onFilterToggle={() => setShowFilters(!showFilters)}
        searchQuery={searchQuery}
      />
      
      {/* Filter panel overlay */}
      {showFilters && (
        <FilterPanel 
          currentFilter={currentFilter}
          onFilterChange={applyFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
      
      {/* Swipe experience */}
      <CandidateSwiper 
        talents={talents}
        loading={loading}
        onScrollEnd={loadMoreTalents}
      />
    </div>
  );
}