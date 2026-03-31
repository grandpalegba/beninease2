import { verifyTalentAuth } from '@/lib/auth/talent-guard'
import TalentAuthGuard from '@/components/auth/TalentAuthGuard'

export default async function TalentStatsPage() {
  // Server-side auth verification
  const { talent, supabase } = await verifyTalentAuth()

  // Fetch talent statistics
  const { data: votes } = await supabase
    .from('votes')
    .select('created_at, univers, categorie')
    .eq('talent_id', talent.id)
    .order('created_at', { ascending: false })

  const { data: ranking } = await supabase
    .from('talents')
    .select('id, votes, prenom, nom')
    .order('votes', { ascending: false })

  const currentPosition = (ranking || []).findIndex(t => t.id === talent.id) + 1 || 0

  return (
    <TalentAuthGuard>
      <div className="min-h-screen bg-[#F9F9F7]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Talent Statistics
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[20px] shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-[#008751]/10 rounded-lg">
                    <div className="text-2xl font-bold text-[#008751]">
                      {votes?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Votes</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-100 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      #{currentPosition}
                    </div>
                    <div className="text-sm text-gray-600">Ranking</div>
                  </div>
                  <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700">
                      {ranking?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Talents</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[20px] shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Votes</h2>
                <div className="space-y-2">
                  {votes && votes.length > 0 ? (
                    votes.slice(0, 10).map((vote, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium">Vote received</span>
                          <div className="text-xs text-gray-500">
                            {vote.univers} • {vote.categorie}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(vote.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No votes yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Ranking List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[20px] shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Top 10 Rankings</h2>
                <div className="space-y-2">
                  {ranking?.slice(0, 10).map((t, index) => (
                    <div 
                      key={t.id} 
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        t.id === talent.id 
                          ? 'bg-[#008751]/10 border border-[#008751]/20' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">
                          {t.prenom} {t.nom}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#008751]">
                        {t.votes || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TalentAuthGuard>
  );
}
