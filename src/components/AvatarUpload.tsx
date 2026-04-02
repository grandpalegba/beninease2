"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { supabase } from '@/utils/supabase/client';

type AvatarUploadProps = {
  talentId: string;
  initialAvatarUrl?: string | null;
  onUploadSuccess?: (newUrl: string) => void;
  onDeleteSuccess?: () => void;
};

export default function AvatarUpload({ 
  talentId, 
  initialAvatarUrl, 
  onUploadSuccess,
  onDeleteSuccess 
}: AvatarUploadProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2Mo
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 1. Client-side validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Format invalide. Utilisez JPG ou PNG.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("L'image est trop lourde (max 2Mo).");
      return;
    }

    try {
      setIsUploading(true);

      // 2. Upload to 'talents' bucket
      // Format: talent_id/timestamp.jpg
      const fileExt = file.type.split('/')[1];
      const filePath = `${talentId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("talents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("talents")
        .getPublicUrl(filePath);

      // 4. Update talents table
      const { error: updateError } = await supabase
        .from("talents")
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", talentId);

      if (updateError) throw updateError;

      // 5. Success
      setAvatarUrl(publicUrl);
      if (onUploadSuccess) onUploadSuccess(publicUrl);
      
    } catch (err) {
      console.error("Upload error:", err);
      setError("Une erreur est survenue lors de l'envoi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!avatarUrl || !window.confirm("Supprimer cette photo ?")) return;

    try {
      setIsUploading(true);
      setError(null);

      // Extract storage path from URL
      const url = new URL(avatarUrl);
      const marker = "/talents/";
      const idx = url.pathname.indexOf(marker);
      if (idx !== -1) {
        const path = decodeURIComponent(url.pathname.slice(idx + marker.length));
        await supabase.storage.from("talents").remove([path]);
      }

      // Update database
      const { error: updateError } = await supabase
        .from("talents")
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq("id", talentId);

      if (updateError) throw updateError;

      setAvatarUrl(null);
      if (onDeleteSuccess) onDeleteSuccess();

    } catch (err) {
      console.error("Delete error:", err);
      setError("Erreur lors de la suppression.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 group">
        <div className="w-full h-full rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center relative">
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt="Avatar" 
              fill 
              className="object-cover"
            />
          ) : (
            <Camera className="w-8 h-8 text-gray-400" />
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-2 -right-2 bg-[#008751] text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
          title="Modifier la photo"
        >
          <Upload className="w-4 h-4" />
        </button>

        {avatarUrl && !isUploading && (
          <button
            type="button"
            onClick={handleDelete}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
            title="Supprimer la photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg,image/png" 
        className="hidden" 
      />

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs font-medium animate-shake">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {!error && !isUploading && avatarUrl && (
        <div className="flex items-center gap-1.5 text-[#008751] text-[10px] font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3" />
          Photo synchronisée
        </div>
      )}
    </div>
  );
}
