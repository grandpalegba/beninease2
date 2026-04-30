"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  href?: string;
  className?: string;
  iconColor?: string;
}

export default function BackButton({ href, className, iconColor = "#008751" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <motion.button 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={handleBack}
      className={cn(
        "absolute top-6 left-6 z-50 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-2 shadow-sm border border-gray-100 active:scale-95 transition-all hover:bg-white group",
        className
      )}
    >
      <ChevronLeft 
        size={18} 
        style={{ color: iconColor }} 
        className="transition-transform group-hover:-translate-x-0.5" 
        strokeWidth={3} 
      />
      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">
        Retour
      </span>
    </motion.button>
  );
}
