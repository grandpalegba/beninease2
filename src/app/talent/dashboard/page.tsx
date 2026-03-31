'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Users, Trophy, ExternalLink, Share2, TrendingUp, User, Mail } from 'lucide-react';

interface Talent {
  id: string;
  prenom: string;
  nom: string;
  avatar_url: string | null;
  votes: number;
  bio: string | null;
  categorie: string | null;
  univers: string | null;
  slug: string;
  email?: string;
}

interface DashboardStats {
  totalVotes: number;
  ranking: number;
  totalTalents: number;
  isTop3?: boolean;
  top3Position?: number;
  top3Talents?: Array<{id: string, prenom: string, nom: string, voteCount: number}>;
}

export default function TalentDashboardPage() {
  const [talent, setTalent] = useState<Talent | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalVotes: 0,
    ranking: 0,
    totalTalents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchTalentData = async () => {
      try {
        // Step 1: Get Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.push('/talent/login');
          return;
        }

        // Step 2: Fetch talent data with votes
        const { data: talentData, error: talentError } = await supabase
          .from('talents')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();

        if (talentError || !talentData) {
          setError('Talent data not found');
          return;
        }

        // Step 3: Efficient single query for votes and ranking
        const { data: votesAndRanking, error: statsError } = await supabase
          .from('votes')
          .select(`
            id,
            talent_id,
            talents!inner(
              id,
              prenom,
              nom,
              votes
            )
          `)
          .order('created_at', { ascending: false });

        if (statsError) {
          console.error('Error fetching stats:', statsError);
        }

        // Count votes for current talent
        const talentVotes = votesAndRanking?.filter(v => v.talent_id === talentData.id) || [];
        const totalVotes = talentVotes.length;

        // Calculate ranking from talents data
        const allTalentsWithVotes = votesAndRanking?.reduce((acc: Array<{id: string, prenom: string, nom: string, voteCount: number}>, vote) => {
          const talent = vote.talents as any;
          const existing = acc.find(t => t.id === talent.id);
          if (existing) {
            existing.voteCount++;
          } else {
            acc.push({
              id: talent.id,
              prenom: talent.prenom,
              nom: talent.nom,
              voteCount: 1
            });
          }
          return acc;
        }, [] as Array<{id: string, prenom: string, nom: string, voteCount: number}>);

        // Add talents with zero votes
        const { data: allTalents } = await supabase
          .from('talents')
          .select('id, prenom, nom');

        const completeTalentsList = allTalents?.map(talent => {
          const found = allTalentsWithVotes?.find(t => t.id === talent.id);
          return {
            id: talent.id,
            prenom: talent.prenom,
            nom: talent.nom,
            voteCount: found?.voteCount || 0
          };
        }) || [];

        // Sort by votes descending
        const sortedTalents = completeTalentsList.sort((a, b) => b.voteCount - a.voteCount);
        const ranking = sortedTalents.findIndex(t => t.id === talentData.id) + 1;
        const totalTalents = sortedTalents.length;

        // Get top 3 for badge display
        const top3 = sortedTalents.slice(0, 3);
        const isTop3 = top3.some(t => t.id === talentData.id);
        const top3Position = top3.findIndex(t => t.id === talentData.id) + 1;

        // Step 4: Get user email
        const userEmail = session.user.email || '';

        setTalent({ ...talentData, email: userEmail });
        setStats({
          totalVotes,
          ranking,
          totalTalents,
          isTop3,
          top3Position,
          top3Talents: top3
        });

      } catch (err) {
        setError('Failed to load talent data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTalentData();
  }, [router, supabase]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      router.push('/talent/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/talents/${talent?.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vote for ${talent?.prenom} ${talent?.nom} on Beninease`,
          text: talent?.bio || `Support ${talent?.prenom} ${talent?.nom} in the Beninease competition`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="min-h-screen bg-[#F9F9F7] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-[20px] shadow-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            {error || 'Talent data not found'}
          </div>
          <Link
            href="/talent/login"
            className="text-[#008751] hover:text-[#006B40] font-medium"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  const fullName = `${talent.prenom} ${talent.nom}`;
  const avatarUrl = talent.avatar_url || `/talents/default-talent.jpg`;
  const publicProfileUrl = `/talents/${talent.slug}`;
  const shareUrl = `${window.location.origin}${publicProfileUrl}`;

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {fullName}
                </h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {talent.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {logoutLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to your Dashboard, {talent.prenom}!
          </h2>
          <p className="text-gray-600">
            Track your performance and engage with your supporters
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Votes Card */}
          <div className="bg-white rounded-[20px] shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#008751]/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#008751]" />
              </div>
              <span className="text-sm text-gray-500">Total Votes</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.totalVotes.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              People supporting you
            </div>
          </div>

          {/* Ranking Card */}
          <div className="bg-white rounded-[20px] shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Ranking</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              #{stats.ranking}
              {stats.isTop3 && (
                <span className="ml-2 text-lg">
                  {stats.top3Position === 1 && '🥇'}
                  {stats.top3Position === 2 && '🥈'}
                  {stats.top3Position === 3 && '🥉'}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              of {stats.totalTalents} talents
              {stats.isTop3 && (
                <span className="block text-yellow-600 font-medium mt-1">
                  Top 3 Position!
                </span>
              )}
            </div>
          </div>

          {/* Public Profile Card */}
          <div className="bg-white rounded-[20px] shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Public Page</span>
            </div>
            <Link
              href={publicProfileUrl}
              target="_blank"
              className="block w-full text-center bg-[#008751] text-white px-4 py-2 rounded-lg hover:bg-[#006B40] transition-colors"
            >
              View Profile
            </Link>
          </div>

          {/* Share Card */}
          <div className="bg-white rounded-[20px] shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Share</span>
            </div>
            <button
              onClick={handleShare}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Share Profile
            </button>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[20px] shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Profile Overview
              </h3>
              
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900">{fullName}</h4>
                  {talent.categorie && (
                    <p className="text-sm text-[#008751] font-medium mt-1">
                      {talent.categorie}
                    </p>
                  )}
                  {talent.univers && (
                    <p className="text-sm text-gray-600 mt-1">
                      {talent.univers}
                    </p>
                  )}
                </div>
                
                {talent.bio && (
                  <div className="pt-4 border-t">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Bio</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">{talent.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[20px] shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Performance Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vote Performance */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Vote Performance</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalVotes}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Total votes received
                  </div>
                </div>

                {/* Ranking Performance */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Ranking</span>
                    <Trophy className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    #{stats.ranking}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Position out of {stats.totalTalents} talents
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href={publicProfileUrl}
                    target="_blank"
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Public Page
                  </Link>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Competition Progress
                </h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#008751] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (stats.totalVotes / Math.max(1, stats.totalTalents * 10)) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {stats.isTop3 ? (
                    <span className="text-yellow-600 font-medium">
                      🎉 Congratulations! You're in the Top 3!
                    </span>
                  ) : (
                    `Keep campaigning to improve your ranking! You're ${stats.ranking} of ${stats.totalTalents}`
                  )}
                </p>
              </div>

              {/* Top 3 Display */}
              {stats.top3Talents && stats.top3Talents.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    🏆 Current Top 3
                  </h4>
                  <div className="space-y-2">
                    {stats.top3Talents.map((topTalent, index) => (
                      <div 
                        key={topTalent.id}
                        className={`flex justify-between items-center p-2 rounded-lg ${
                          topTalent.id === talent?.id 
                            ? 'bg-[#008751]/10 border border-[#008751]/20' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                          </span>
                          <span className="text-sm font-medium">
                            {topTalent.prenom} {topTalent.nom}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#008751]">
                          {topTalent.voteCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
