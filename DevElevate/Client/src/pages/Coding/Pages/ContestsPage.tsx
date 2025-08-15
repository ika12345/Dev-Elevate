import React, { useState } from 'react';
import { Calendar, Clock, Users, Trophy, Zap, Play, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const ContestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingContests = [
    {
      id: '1',
      title: 'Weekly Contest 248',
      description: 'Solve algorithmic problems and climb the leaderboard',
      date: '2024-01-22',
      time: '10:00 AM PST',
      duration: '90 minutes',
      participants: 2847,
      prize: '$500 Cash Prize',
      difficulty: 'Medium',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Algorithm Sprint',
      description: 'Fast-paced coding challenge with multiple languages',
      date: '2024-01-24',
      time: '2:00 PM PST',
      duration: '60 minutes',
      participants: 1543,
      prize: 'Premium Subscription',
      difficulty: 'Easy',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Monthly Championship',
      description: 'The ultimate coding competition of the month',
      date: '2024-01-28',
      time: '12:00 PM PST',
      duration: '120 minutes',
      participants: 5672,
      prize: '$2000 Cash Prize',
      difficulty: 'Hard',
      status: 'upcoming'
    }
  ];

  const liveContests = [
    {
      id: '4',
      title: 'Speed Coding Challenge',
      description: 'Real-time coding battle',
      timeLeft: '45:32',
      participants: 1234,
      problems: 4,
      yourRank: 156
    }
  ];

  const pastContests = [
    {
      id: '5',
      title: 'Weekly Contest 247',
      date: '2024-01-15',
      participants: 3456,
      winner: 'CodeMaster2024',
      yourRank: 42,
      problems: 4,
      score: 3245
    },
    {
      id: '6',
      title: 'Data Structure Marathon',
      date: '2024-01-08',
      participants: 2189,
      winner: 'AlgoNinja',
      yourRank: 89,
      problems: 5,
      score: 2876
    }
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcomingContests.length },
    { id: 'live', label: 'Live', count: liveContests.length },
    { id: 'past', label: 'Past Results', count: pastContests.length }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-400/20 text-green-400';
      case 'Medium': return 'bg-yellow-400/20 text-yellow-400';
      case 'Hard': return 'bg-red-400/20 text-red-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Contests</h1>
          <p className="text-xl text-gray-400">Compete with developers worldwide and win amazing prizes</p>
        </motion.div>

        {/* Featured Contest Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-electric-400/20 via-neon-500/20 to-cyber-400/20 rounded-2xl p-8 mb-8 border border-electric-400/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-electric-400/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-medium">FEATURED CONTEST</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Monthly Championship</h2>
            <p className="text-gray-300 mb-6">The ultimate coding competition with $2000 prize pool</p>
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>January 28, 2024</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="w-4 h-4" />
                <span>120 minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Users className="w-4 h-4" />
                <span>5,672 registered</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-electric-400 to-neon-500 text-white rounded-lg font-semibold hover:from-electric-500 hover:to-neon-600 transition-all duration-200"
            >
              Register Now
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-gray-400">Contests Joined</div>
              </div>
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-gray-400">Top 10 Finishes</div>
              </div>
              <Award className="w-8 h-8 text-electric-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">1,247</div>
                <div className="text-gray-400">Best Rank</div>
              </div>
              <Star className="w-8 h-8 text-neon-400" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">2,845</div>
                <div className="text-gray-400">Total Score</div>
              </div>
              <Zap className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg mb-8 border border-gray-700">
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
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-electric-400 text-black' : 'bg-gray-600 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contest Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upcoming' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingContests.map((contest, index) => (
                <motion.div
                  key={contest.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{contest.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}>
                        {contest.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{contest.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-electric-400" />
                        <span>{contest.date} at {contest.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock className="w-4 h-4 text-neon-400" />
                        <span>{contest.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Users className="w-4 h-4 text-green-400" />
                        <span>{contest.participants.toLocaleString()} participants</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span>{contest.prize}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-electric-400 to-neon-500 text-white rounded-lg font-medium hover:from-electric-500 hover:to-neon-600 transition-all duration-200"
                    >
                      Register for Contest
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'live' && (
            <div className="space-y-6">
              {liveContests.length > 0 ? (
                liveContests.map((contest, index) => (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-red-900/20 via-red-800/20 to-red-900/20 rounded-lg border-2 border-red-500/50 p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-red-400 font-medium uppercase tracking-wide">Live Contest</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{contest.title}</h2>
                        <p className="text-gray-400">{contest.description}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Join Now</span>
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400 mb-1">{contest.timeLeft}</div>
                        <div className="text-gray-400">Time Remaining</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">{contest.participants}</div>
                        <div className="text-gray-400">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-electric-400 mb-1">{contest.problems}</div>
                        <div className="text-gray-400">Problems</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-neon-400 mb-1">#{contest.yourRank}</div>
                        <div className="text-gray-400">Your Rank</div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Live Contests</h3>
                  <p className="text-gray-400">Check back later for live competitions!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Contest History</h2>
                <div className="space-y-4">
                  {pastContests.map((contest, index) => (
                    <motion.div
                      key={contest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{contest.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{contest.date}</span>
                            <span>{contest.participants} participants</span>
                            <span>Winner: {contest.winner}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-electric-400">#{contest.yourRank}</div>
                        <div className="text-sm text-gray-400">Score: {contest.score}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContestsPage;