import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('global');

  // Mock user data
  const mockUser = {
    stats: {
      ranking: 156,
      solved: 45,
      streak: 12
    },
    username: 'DemoUser'
  };

  // Mock leaderboard data
  const globalLeaderboard = [
    { rank: 1, username: 'CodeMaster2024', solved: 1247, streak: 89, rating: 2845, country: 'US', avatar: '🏆' },
    { rank: 2, username: 'AlgoNinja', solved: 1156, streak: 67, rating: 2734, country: 'IN', avatar: '🥷' },
    { rank: 3, username: 'PyProgrammer', solved: 1089, streak: 45, rating: 2623, country: 'CN', avatar: '🐍' },
    { rank: 4, username: 'JavaJedi', solved: 1034, streak: 78, rating: 2567, country: 'JP', avatar: '⭐' },
    { rank: 5, username: 'ReactRocket', solved: 987, streak: 23, rating: 2489, country: 'DE', avatar: '🚀' },
    ...Array.from({ length: 20 }, (_, i) => ({
      rank: i + 6,
      username: `User${i + 6}`,
      solved: Math.floor(Math.random() * 900) + 100,
      streak: Math.floor(Math.random() * 50) + 1,
      rating: Math.floor(Math.random() * 2000) + 1500,
      country: ['US', 'IN', 'CN', 'JP', 'DE', 'GB', 'FR', 'BR'][Math.floor(Math.random() * 8)],
      avatar: ['👨‍💻', '👩‍💻', '🤖', '💻', '⚡'][Math.floor(Math.random() * 5)]
    }))
  ];

  const contestLeaderboard = [
    { rank: 1, username: 'SpeedCoder', score: 3847, problems: 4, time: '47:23', penalty: 0 },
    { rank: 2, username: 'QuickSolver', score: 3756, problems: 4, time: '52:18', penalty: 20 },
    { rank: 3, username: 'FastTrack', score: 3689, problems: 3, time: '38:45', penalty: 0 },
    { rank: 4, username: 'CodeRacer', score: 3567, problems: 3, time: '41:32', penalty: 40 },
    { rank: 5, username: 'AlgoSpeed', score: 3456, problems: 3, time: '45:12', penalty: 60 },
  ];

  const tabs = [
    { id: 'global', label: 'Global Ranking', icon: Trophy },
    { id: 'contest', label: 'Contest Results', icon: Zap },
    { id: 'monthly', label: 'Monthly Leaders', icon: Medal },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />;
    return <div className="flex justify-center items-center w-6 h-6 font-bold text-gray-400">{rank}</div>;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-black';
    if (rank <= 10) return 'bg-electric-400/20 text-electric-400';
    if (rank <= 50) return 'bg-neon-500/20 text-neon-400';
    return 'bg-gray-700 text-gray-300';
  };

  return (
    <div className="py-8 min-h-screen bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-bold text-white">Leaderboard</h1>
          <p className="text-xl text-gray-400">Compete with the best coders worldwide</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4"
        >
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-white">#{mockUser.stats.ranking}</div>
                <div className="text-gray-400">Your Rank</div>
              </div>
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-white">{mockUser.stats.solved}</div>
                <div className="text-gray-400">Problems Solved</div>
              </div>
              <Zap className="w-8 h-8 text-electric-400" />
            </div>
          </div>
          
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-white">{mockUser.stats.streak}</div>
                <div className="text-gray-400">Day Streak</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-white">12.5K</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <Users className="w-8 h-8 text-neon-400" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 bg-gray-800 rounded-lg border border-gray-700">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-electric-400 border-b-2 border-electric-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Leaderboard Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'global' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              {/* Top 3 Podium */}
              <div className="p-8 border-b border-gray-700">
                <h2 className="mb-6 text-2xl font-bold text-center text-white">Hall of Fame</h2>
                <div className="flex justify-center items-end space-x-8">
                  {/* 2nd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <div className="flex justify-center items-center mb-4 w-20 h-20 text-3xl bg-gradient-to-r from-gray-300 to-gray-400 rounded-full">
                      {globalLeaderboard[1].avatar}
                    </div>
                    <div className="flex justify-center items-center w-32 h-20 bg-gray-300 rounded-t-lg">
                      <div className="text-center">
                        <div className="font-bold text-black">2nd</div>
                        <div className="text-sm text-black">{globalLeaderboard[1].username}</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 1st Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center"
                  >
                    <Crown className="mx-auto mb-2 w-8 h-8 text-yellow-400" />
                    <div className="flex justify-center items-center mb-4 w-24 h-24 text-4xl bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full">
                      {globalLeaderboard[0].avatar}
                    </div>
                    <div className="flex justify-center items-center w-32 h-28 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-t-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-black">1st</div>
                        <div className="font-medium text-black">{globalLeaderboard[0].username}</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 3rd Place */}
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="flex justify-center items-center mb-4 w-20 h-20 text-3xl bg-gradient-to-r from-orange-400 to-orange-500 rounded-full">
                      {globalLeaderboard[2].avatar}
                    </div>
                    <div className="flex justify-center items-center w-32 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-lg">
                      <div className="text-center">
                        <div className="font-bold text-black">3rd</div>
                        <div className="text-sm text-black">{globalLeaderboard[2].username}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Full Rankings */}
              <div className="p-6">
                <div className="space-y-2">
                  {globalLeaderboard.map((player, index) => (
                    <motion.div
                      key={player.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center p-4 rounded-lg transition-all duration-200 hover:bg-gray-700 ${
                        player.username === mockUser.username ? 'bg-electric-400/10 border border-electric-400/30' : 'hover:bg-gray-750'
                      }`}
                    >
                      <div className="flex justify-center w-12">
                        {getRankIcon(player.rank)}
                      </div>
                      
                      <div className="flex justify-center items-center mx-4 w-12 h-12 text-2xl bg-gradient-to-r rounded-full from-electric-400 to-neon-500">
                        {player.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-white">{player.username}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRankBadge(player.rank)}`}>
                            #{player.rank}
                          </span>
                          <span className="text-xs text-gray-400">{player.country}</span>
                        </div>
                        <div className="flex items-center mt-1 space-x-4 text-sm text-gray-400">
                          <span>Solved: {player.solved}</span>
                          <span>Streak: {player.streak}</span>
                          <span>Rating: {player.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {player.rank <= 3 && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <Trophy className={`w-5 h-5 ${
                              player.rank === 1 ? 'text-yellow-400' :
                              player.rank === 2 ? 'text-gray-300' : 'text-orange-400'
                            }`} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contest' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Weekly Contest #247</h2>
                <p className="text-gray-400">January 15, 2024 • Completed</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {contestLeaderboard.map((participant, index) => (
                    <motion.div
                      key={participant.rank}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-4 rounded-lg transition-colors bg-gray-750 hover:bg-gray-700"
                    >
                      <div className="w-8 font-bold text-center text-white">
                        {participant.rank}
                      </div>
                      <div className="flex-1 mx-4">
                        <h3 className="font-semibold text-white">{participant.username}</h3>
                        <div className="text-sm text-gray-400">
                          {participant.problems} problems • {participant.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-electric-400">{participant.score}</div>
                        <div className="text-sm text-gray-400">
                          {participant.penalty > 0 && `+${participant.penalty} penalty`}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monthly' && (
            <div className="py-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center items-center mx-auto mb-4 w-20 h-20 bg-gradient-to-r rounded-full from-electric-400 to-neon-500"
              >
                <Medal className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="mb-2 text-2xl font-bold text-white">Monthly Contest</h3>
              <p className="mb-6 text-gray-400">Coming Soon! Monthly competitions with special prizes.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 font-medium text-white bg-gradient-to-r rounded-lg transition-all duration-200 from-electric-400 to-neon-500 hover:from-electric-500 hover:to-neon-600"
              >
                Get Notified
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;