import { verifyTalentAuth } from '@/lib/auth/talent-guard'
import TalentAuthGuard from '@/components/auth/TalentAuthGuard'

export default async function TalentProfilePage() {
  // Server-side auth verification
  const { talent, session } = await verifyTalentAuth()

  return (
    <TalentAuthGuard>
      <div className="min-h-screen bg-[#F9F9F7]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Talent Profile
          </h1>
          
          <div className="bg-white rounded-[20px] shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Welcome, {talent.prenom} {talent.nom}
            </h2>
            <p className="text-gray-600">
              This is your protected profile page. Only authenticated talents can access this.
            </p>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Account Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> {session.user.email}</p>
                <p><span className="font-medium">Talent ID:</span> {talent.id}</p>
                <p><span className="font-medium">Category:</span> {talent.categorie || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TalentAuthGuard>
  );
}
