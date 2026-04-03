"use client";

import { Search, Filter } from "lucide-react";

interface TalentHeaderProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  searchQuery: string;
}

export default function TalentHeader({ onSearch, onFilterToggle, searchQuery }: TalentHeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F2EDE4] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher un talent..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#008751] focus:border-transparent outline-none transition-all"
          />
        </form>
        
        {/* Filter button */}
        <button
          onClick={onFilterToggle}
          className="p-3 bg-[#008751] text-white rounded-xl hover:bg-[#006B3F] transition-colors shadow-md"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
