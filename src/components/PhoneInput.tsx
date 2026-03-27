"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (countryCode: string) => void;
  placeholder?: string;
  className?: string;
}

// Map for common flags (optional but better UX)
const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Generate all countries list from libphonenumber-js
const allCountries = getCountries()
  .map((country) => ({
    id: country,
    code: `+${getCountryCallingCode(country)}`,
    flag: getFlagEmoji(country),
    name: new Intl.DisplayNames(["fr"], { type: "region" }).of(country) || country,
  }))
  .sort((a, b) => {
    // Put Benin first
    if (a.id === "BJ") return -1;
    if (b.id === "BJ") return 1;
    return a.name.localeCompare(b.name);
  });

export default function PhoneInput({ value, onChange, onCountryChange, placeholder, className }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0]); // Default to Benin (BJ)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter countries based on search
  const filteredCountries = allCountries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizeBeninNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length === 8) {
      return "01" + cleaned;
    }
    if (cleaned.length === 10 && cleaned.startsWith("01")) {
      return cleaned;
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (selectedCountry.id === "BJ") {
      val = normalizeBeninNumber(val);
    } else {
      val = val.replace(/\D/g, "");
    }
    onChange(val);
  };

  const handleCountrySelect = (country: typeof allCountries[0]) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery("");
    if (onCountryChange) {
      onCountryChange(country.code);
    }
  };

  return (
    <div className={`relative flex items-center bg-white rounded-2xl border border-[#D9A036]/10 ${className}`}>
      {/* Country Selector */}
      <div className="relative h-full shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 h-full px-4 border-r border-[#D9A036]/10 bg-transparent hover:bg-gray-50 transition-colors rounded-l-2xl"
        >
          <span className="text-xl shrink-0">{selectedCountry.flag}</span>
          <span className="text-sm font-sans font-medium text-[#1A1A1A]">{selectedCountry.code}</span>
          <ChevronDown className={`w-4 h-4 text-[#D9A036] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#D9A036]/10 rounded-xl shadow-2xl z-[100] overflow-hidden animate-fade-in flex flex-col">
            {/* Search Bar */}
            <div className="p-2 border-b border-[#D9A036]/5 bg-gray-50/50 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un pays..."
                className="w-full bg-transparent border-0 text-sm outline-none font-sans p-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-[#D9A036]/20">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={`${country.id}-${country.code}`}
                    type="button"
                    className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-[#FDF8F1] transition-colors text-left ${
                      selectedCountry.id === country.id ? 'bg-[#FDF8F1]/50' : ''
                    }`}
                    onClick={() => handleCountrySelect(country)}
                  >
                    <span className="text-xl shrink-0">{country.flag}</span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-sans font-semibold text-[#1A1A1A] truncate">
                        {country.name}
                      </span>
                      <span className="text-xs text-gray-400">{country.code}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-400 font-sans">
                  Aucun pays trouvé
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <input
        type="tel"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || "Numéro WhatsApp"}
        className="flex-1 bg-transparent p-4 text-[#1A1A1A] placeholder:text-gray-400 outline-none font-sans text-sm h-full rounded-r-2xl"
      />
    </div>
  );
}
