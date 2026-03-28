'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F9F7] px-4 text-center">
      <h2 className="font-display text-2xl font-bold text-black mb-4">
        Oups ! Une erreur est survenue.
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        {error.message || "Nous n'avons pas pu charger cette page."}
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-[#008751] px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[#006B3F] active:scale-95 shadow-lg"
      >
        Réessayer
      </button>
    </div>
  )
}
