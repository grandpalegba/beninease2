"use client";

import { useState, useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

interface FilterPanelProps {
  currentFilter: { categorie: string; univers: string };
  onFilterChange: (categorie: string, univers: string) => void;
  onClose: () => void;
}

export default function FilterPanel({ currentFilter, onFilterChange, onClose }: FilterPanelProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [univers, setUnivers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(currentFilter.categorie);
  const [selectedUnivers, setSelectedUnivers] = useState(currentFilter.univers);
  const [loading, setLoading] = useState(false);

  // Fetch categories and univers from Supabase
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data, error } = await supabase
          .from('talents')
          .select('categorie, univers');
        
        if (error) throw error;
        
        const uniqueCategories = [...new Set(data?.map(t => t.categorie).filter(Boolean))];
        const uniqueUnivers = [...new Set(data?.map(t => t.univers).filter(Boolean))];
        
        setCategories(uniqueCategories);
        setUnivers(uniqueUnivers);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, []);

  const handleApplyFilters = async () => {
    setLoading(true);
    await onFilterChange(selectedCategory, selectedUnivers);
    setLoading(false);
    onClose();
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedUnivers('');
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">Filtrer les talents</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Univers filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Univers</label>
            <select
              value={selectedUnivers}
              onChange={(e) => setSelectedUnivers(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008751] focus:border-transparent outline-none"
            >
              <option value="">Tous les univers</option>
              {univers.map(uni => (
                <option key={uni} value={uni}>{uni}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008751] focus:border-transparent outline-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#008751] text-white rounded-lg hover:bg-[#006B3F] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Application...' : 'Appliquer'}
          </button>
        </div>
      </div>
    </div>
  );
}
