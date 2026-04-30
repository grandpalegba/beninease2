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
        "absolute top-4 left-4 z-50 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-sm border border-gray-100 active:scale-95 transition-all hover:bg-white group",
        className
      )}
    >
      <ChevronLeft 
        size={14} 
        style={{ color: iconColor }} 
        className="transition-transform group-hover:-translate-x-0.5" 
        strokeWidth={3} 
      />
      <span className="text-[9px] font-black uppercase tracking-wider text-gray-900">
        Retour
      </span>
    </motion.button>
  );
}
