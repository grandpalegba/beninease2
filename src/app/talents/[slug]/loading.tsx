export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F7]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#008751]/20 border-t-[#008751] rounded-full animate-spin" />
        <p className="text-[#008751] font-medium font-display">Chargement du sanctuaire...</p>
      </div>
    </div>
  );
}
