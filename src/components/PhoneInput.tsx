"use client";

import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { E164Number } from 'libphonenumber-js';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (countryCode: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PhoneInput({ value, onChange, placeholder, className }: PhoneInputProps) {
  const handlePhoneChange = (val?: E164Number) => {
    if (val) {
      // Nettoyage : Supprimer les espaces et les points avant l'envoi vers Supabase
      const cleaned = val.toString().replace(/[\s\.]/g, '');
      onChange(cleaned);
    } else {
      onChange('');
    }
  };

  return (
    <div className={`relative flex items-center bg-white rounded-2xl border border-[#008751]/10 ${className} overflow-hidden px-4 group focus-within:ring-2 focus-within:ring-[#008751] transition-all`}>
      <PhoneInputWithCountry
        international
        defaultCountry="BJ"
        value={value}
        onChange={handlePhoneChange}
        placeholder={placeholder || "Numéro WhatsApp"}
        className="w-full flex items-center gap-2 phone-input-prestige"
      />
      
      <style jsx global>{`
        .phone-input-prestige .PhoneInputInput {
          background: transparent;
          border: none;
          padding: 1rem 0.5rem;
          font-family: inherit;
          font-size: 0.875rem;
          color: #1A1A1A;
          outline: none;
          width: 100%;
          height: 56px;
        }
        .phone-input-prestige .PhoneInputCountry {
          margin-right: 0.5rem;
        }
        .phone-input-prestige .PhoneInputCountrySelectArrow {
          color: #008751;
          opacity: 0.6;
        }
        .phone-input-prestige .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
