export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-amber-900 mb-4">Trésors en Maintenance</h1>
        <p className="text-gray-600 mb-6">
          L'expérience des Trésors est temporairement indisponible.<br />
          Nous travaillons à l'améliorer pour vous offrir la meilleure aventure.
        </p>
        <div className="text-amber-600">
          <span className="animate-pulse">🔧</span>
          <span className="ml-2">Retour prochainement...</span>
        </div>
      </div>
    </div>
  );
}
