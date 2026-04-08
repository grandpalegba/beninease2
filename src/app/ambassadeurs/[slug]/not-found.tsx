import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F9F7] px-4 text-center">
      <h2 className="font-display text-2xl font-bold text-black mb-4">
        Talent introuvable
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Désolé, nous n'avons pas pu trouver le profil que vous recherchez.
      </p>
      <Link
        href="/talents"
        className="rounded-full bg-[#008751] px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[#006B3F] active:scale-95 shadow-lg"
      >
        Retour aux talents
      </Link>
    </div>
  )
}
