"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Upload, MapPin, Globe, Edit, Save, Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  title: string | null;
  description: string | null;
  city: string | null;
  updated_at: string | null;
};

type VideoRow = {
  candidate_id: string;
  video_type: string;
  video_url: string | null;
  thumbnail_url: string | null;
};

type VideosByType = Record<string, VideoRow>;

type ProfileUpdatableField = "full_name" | "avatar_url" | "title" | "description" | "city";

export default function CandidateProfile() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("Qui je suis");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [videos, setVideos] = useState<VideosByType>({});
  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const tabs = ["Qui je suis", "Mon histoire", "Mon service", "Pourquoi moi"];
  const dimensionsMapping: Record<string, string> = {
    "Qui je suis": "QUI JE SUIS",
    "Mon histoire": "MON HISTOIRE",
    "Mon service": "MON SERVICE",
    "Pourquoi moi": "POURQUOI MOI"
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        console.log("Utilisateur non connecté");
        return router.push("/login");
      }
      
      setUser(authUser);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!profileData) {
        const { data: createdProfile } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            title: "Mon Espace Talent",
            description: "Décrivez votre talent ici.",
            city: "Votre ville"
          })
          .select('*')
          .single();
        setProfile(createdProfile as unknown as ProfileRow);
      } else {
        setProfile(profileData as unknown as ProfileRow);
      }

      const { data: vids } = await supabase
        .from('videos')
        .select('*')
        .eq('candidate_id', authUser.id);
      
      const typedVids = (vids ?? []) as unknown as VideoRow[];
      const vidsObj = typedVids.reduce<VideosByType>((acc, v) => {
        acc[v.video_type] = v;
        return acc;
      }, {});
      setVideos(vidsObj || {});
    };
    fetchData();
  }, [supabase, router]);

  const handleProfileUpdate = async (field: ProfileUpdatableField, value: string) => {
    if (!user) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur lors de la mise à jour : " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    try {
      setLoading(true);
      const file = e.target.files[0];
      const filePath = `${user.id}/${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-avatars')
        .getPublicUrl(filePath);

      await handleProfileUpdate('avatar_url', publicUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur d'upload : " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setLoading(true);
      const file = e.target.files[0];
      const filePath = `${user?.id}/${type}_${Date.now()}.mp4`;

      const { error: uploadError } = await supabase.storage
        .from('candidate-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('candidate-videos')
        .getPublicUrl(filePath);

      await supabase.from('videos').upsert({
        candidate_id: user?.id,
        video_url: publicUrl,
        video_type: type
      }, { onConflict: 'candidate_id,video_type' });

      alert("Vidéo mise en ligne !");
      setVideos((prev) => ({
        ...prev,
        [type]: {
          ...(prev?.[type] ?? {}),
          video_type: type,
          video_url: publicUrl
        }
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur d'upload : " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setLoading(true);
      const file = e.target.files[0];
      const filePath = `${user?.id}/thumb_${type}_${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from('video-thumbnails')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('video-thumbnails')
        .getPublicUrl(filePath);

      await supabase.from('videos').upsert({
        candidate_id: user?.id,
        thumbnail_url: publicUrl,
        video_type: type
      }, { onConflict: 'candidate_id,video_type' });

      alert("Miniature mise en ligne !");
      setVideos((prev) => ({
        ...prev,
        [type]: {
          ...(prev?.[type] ?? {}),
          video_type: type,
          thumbnail_url: publicUrl
        }
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur d'upload : " + message);
    } finally {
      setLoading(false);
    }
  };

  const getStoragePathFromPublicUrl = (publicUrl: string, bucket: string): string | null => {
    try {
      const url = new URL(publicUrl);
      const marker = `/${bucket}/`;
      const idx = url.pathname.indexOf(marker);
      if (idx === -1) return null;
      return decodeURIComponent(url.pathname.slice(idx + marker.length));
    } catch {
      return null;
    }
  };

  const removeFromBucketByPublicUrl = async (bucket: string, publicUrl: string) => {
    const path = getStoragePathFromPublicUrl(publicUrl, bucket);
    if (!path) throw new Error("Impossible de retrouver le chemin du fichier dans le stockage.");
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  };

  const handleDeleteVideoAndThumbnail = async (type: string) => {
    if (!user) return;
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cet élément ?");
    if (!confirmed) return;

    const row = videos[type];
    if (!row) return;

    try {
      setLoading(true);

      if (row.video_url) {
        await removeFromBucketByPublicUrl("candidate-videos", row.video_url);
      }

      if (row.thumbnail_url) {
        await removeFromBucketByPublicUrl("video-thumbnails", row.thumbnail_url);
      }

      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("candidate_id", user.id)
        .eq("video_type", type);
      if (error) throw error;

      setVideos((prev) => {
        const next = { ...prev };
        delete next[type];
        return next;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur lors de la suppression : " + message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user) return;
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cet élément ?");
    if (!confirmed) return;
    if (!profile?.avatar_url) return;

    try {
      setLoading(true);

      if (profile.avatar_url.includes("/storage/v1/object/")) {
        await removeFromBucketByPublicUrl("profile-avatars", profile.avatar_url);
      }

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, avatar_url: null } : prev));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      alert("Erreur lors de la suppression : " + message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p className="text-orange-800 animate-pulse font-medium text-lg">
          Chargement de votre sanctuaire...
        </p>
      </div>
    );
  }

  const activeDimension = dimensionsMapping[activeTab];
  const activeVideo = videos[activeDimension];
  const activeVideoUrl = activeVideo?.video_url ?? undefined;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-[#F2EDE4]">
        
        {/* HEADER PREMIUM */}
        <div className="p-8 md:p-12 relative">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
            className="absolute top-6 right-6 bg-white/50 backdrop-blur-sm text-[#8E8E8E] hover:text-[#1A1A1A] p-2.5 rounded-full transition-all shadow-sm border border-white/80 active:scale-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="w-36 h-36 bg-[#F8F5F0] rounded-[25px] border-[6px] border-white shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02] relative">
                <Image 
                  src={profile.avatar_url || "/assets/profile-aicha.jpg"} 
                  alt="Profil" 
                  fill
                  className="object-cover"
                />
              </div>
              {isEditing && (
                <>
                  <button 
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={loading}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white rounded-[25px] opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 disabled:cursor-not-allowed"
                    title="Changer la photo de profil"
                    aria-label="Changer la photo de profil"
                  >
                    <Camera className="w-8 h-8" />
                    <input type="file" accept="image/*" hidden ref={avatarInputRef} onChange={handleAvatarUpload} />
                  </button>
                  {profile.avatar_url ? (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      disabled={loading}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm border border-white/80 text-red-600 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Supprimer la photo de profil"
                      aria-label="Supprimer la photo de profil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : null}
                </>
              )}
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              {isEditing ? (
                <input 
                  type="text" 
                  defaultValue={profile.title ?? ""}
                  onBlur={(e) => handleProfileUpdate('title', e.target.value)}
                  className="text-[34px] font-display font-bold text-[#1A1A1A] leading-tight bg-transparent border-b-2 border-amber-200 focus:border-amber-500 outline-none w-full"
                />
              ) : (
                <h1 className="text-[34px] font-display font-bold text-[#1A1A1A] leading-tight">
                  {profile.title}
                </h1>
              )}

              {isEditing ? (
                <input
                  type="text"
                  defaultValue={profile.description ?? ""}
                  onBlur={(e) => handleProfileUpdate('description', e.target.value)}
                  className="text-[#C5A267] font-medium text-sm mt-2 uppercase tracking-wider bg-transparent border-b-2 border-amber-200 focus:border-amber-500 outline-none w-full"
                />
              ) : (
                <p className="text-[#C5A267] font-medium text-sm mt-2 uppercase tracking-wider">{profile.description ?? ""}</p>
              )}

              <div className="flex items-center gap-4 text-[#8E8E8E] text-[11px] font-medium uppercase tracking-widest mt-4">
                {isEditing ? (
                  <input 
                    type="text" 
                    defaultValue={profile.city ?? ""}
                    onBlur={(e) => handleProfileUpdate('city', e.target.value)}
                    className="bg-transparent border-b-2 border-amber-200 focus:border-amber-500 outline-none w-48"
                  />
                ) : (
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {profile.city ?? ""}</span>
                )}
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> ID: {user.email?.split('@')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION DES ONGLETS */}
        <div className="px-8 md:px-12 border-b border-[#F2EDE4]">
          <div className="flex justify-between md:justify-start md:gap-16">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-semibold transition-all relative ${
                  activeTab === tab 
                  ? "text-[#C5A267]" 
                  : "text-[#8E8E8E] hover:text-[#555]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A267] animate-in fade-in slide-in-from-left-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION MINIATURES VIDÉOS */}
        <div className="p-8 md:p-12 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const dimension = dimensionsMapping[tab];
              const video = videos[dimension];
              return (
                <div key={tab} className="relative aspect-video rounded-[15px] overflow-hidden group">
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`w-full h-full transition-all duration-500 ${
                      activeTab === tab 
                      ? "ring-2 ring-[#C5A267] ring-offset-4 scale-[1.02] shadow-lg" 
                      : "opacity-70 hover:opacity-100 hover:scale-[1.02]"
                    }`}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                    {video?.thumbnail_url ? (
                      <Image
                        src={video.thumbnail_url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full bg-[#2A2A2A] flex items-center justify-center"
                        title="Ajouter une photo de couverture"
                      >
                        <ImageIcon className="w-7 h-7 text-[#C5A267]/45" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-[9px] font-bold text-white uppercase tracking-widest text-center">{dimension}</p>
                    </div>
                  </button>
                  {isEditing && (
                    <>
                      {video?.video_url || video?.thumbnail_url ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteVideoAndThumbnail(dimension)}
                          disabled={loading}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/85 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-white/80 text-red-600 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Supprimer vidéo et photo de couverture"
                          aria-label={`Supprimer la vidéo et la photo de couverture pour ${dimension}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                      <label
                        className="absolute top-2 right-2 cursor-pointer bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-black/60 hover:text-black transition-all"
                        style={{ right: video?.video_url || video?.thumbnail_url ? "2.75rem" : undefined }}
                        title="Uploader une photo de couverture"
                        aria-label={`Uploader une photo de couverture pour ${dimension}`}
                      >
                        <Upload className="w-3 h-3" />
                        <input type="file" accept="image/*" hidden onChange={(e) => handleThumbnailUpload(e, dimension)} />
                      </label>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ZONE DU GRAND LECTEUR */}
        <div className="px-8 md:px-12 pb-12">
          <div className="relative aspect-video bg-[#1A1A1A] rounded-[30px] overflow-hidden shadow-2xl group border-[8px] border-white ring-1 ring-[#F2EDE4]">
            {isEditing ? (
              <label className="absolute top-4 right-4 z-10 cursor-pointer bg-white/80 backdrop-blur-sm p-2 rounded-full text-black/60 hover:text-black transition-all shadow-sm">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => handleVideoUpload(e, activeDimension)}
                />
              </label>
            ) : null}
            {activeVideoUrl ? (
              <video 
                key={activeVideoUrl}
                src={activeVideoUrl} 
                controls 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#222] transition-colors group-hover:bg-[#282828]">
                <label className="cursor-pointer flex flex-col items-center justify-center text-center gap-3">
                  <Upload className="w-8 h-8 text-[#C5A267]" />
                  <span className="text-white text-xs font-semibold tracking-normal">
                    Uploader le clip « {activeDimension} »
                  </span>
                  <input type="file" accept="video/*" hidden onChange={(e) => handleVideoUpload(e, activeDimension)} />
                  <span className="text-white/40 text-[10px] font-medium uppercase tracking-[0.2em]">
                    Format MP4 • Max 50MB
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
