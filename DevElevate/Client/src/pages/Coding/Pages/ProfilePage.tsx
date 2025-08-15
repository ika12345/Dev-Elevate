import React, { useState } from 'react';
import { User, Trophy, Zap, Calendar, GitCommit, Award, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const mockUser = {
    username: 'DemoUser',
    email: 'demo@develevate.com',
    stats: {
      solved: 45,
      ranking: 156,
      streak: 12,
      attempted: 67
    }
  };

  // Mock data for charts
  const progressData = [
    { name: 'Jan', solved: 12 },
    { name: 'Feb', solved: 19 },
    { name: 'Mar', solved: 25 },
    { name: 'Apr', solved: 33 },
    { name: 'May', solved: 42 },
    { name: 'Jun', solved: 50 },
  ];

  const difficultyData = [
    { name: 'Easy', value: 25, color: '#10B981' },
    { name: 'Medium', value: 15, color: '#F59E0B' },
    { name: 'Hard', value: 2, color: '#EF4444' },
  ];

  const languageData = [
    { name: 'Python', problems: 18 },
    { name: 'JavaScript', problems: 12 },
    { name: 'Java', problems: 8 },
    { name: 'C++', problems: 4 },
  ];

  const recentSubmissions = [
    { id: '1', problem: 'Two Sum', status: 'Accepted', language: 'Python', time: '2 hours ago' },
    { id: '2', problem: 'Reverse Integer', status: 'Accepted', language: 'JavaScript', time: '5 hours ago' },
    { id: '3', problem: 'Longest Substring', status: 'Wrong Answer', language: 'Java', time: '1 day ago' },
    { id: '4', problem: 'Merge Intervals', status: 'Accepted', language: 'Python', time: '2 days ago' },
  ];

  const achievements = [
    { icon: Trophy, title: '100 Problems Solved', description: 'Milestone achievement', date: '2024-01-15', color: 'text-yellow-400' },
    { icon: Zap, title: '30-Day Streak', description: 'Consistent problem solving', date: '2024-01-10', color: 'text-electric-400' },
    { icon: Award, title: 'First Contest Win', description: 'Weekly contest champion', date: '2024-01-05', color: 'text-purple-400' },
    { icon: Target, title: 'All Easy Problems', description: 'Completed all easy problems', date: '2024-01-01', color: 'text-green-400' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'progress', label: 'Progress' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'achievements', label: 'Achievements' },
  ];

  return (
    <div className="py-8 min-h-screen bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 mb-8 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl border border-gray-700"
        >
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-8">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex justify-center items-center w-32 h-32 text-4xl font-bold text-white bg-gradient-to-r rounded-full from-electric-400 to-neon-500"
              >
                {mockUser.username.charAt(0).toUpperCase()}
              </motion.div>
              <div className="flex absolute -right-2 -bottom-2 justify-center items-center w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-4xl font-bold text-white">{mockUser.username}</h1>
              <p className="mb-4 text-xl text-gray-400">{mockUser.email}</p>
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-electric-400">{mockUser.stats.solved}</div>
                  <div className="text-sm text-gray-400">Problems Solved</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-neon-400">{mockUser.stats.ranking}</div>
                  <div className="text-sm text-gray-400">Global Rank</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-cyber-400">{mockUser.stats.streak}</div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-yellow-400">{Math.floor((mockUser.stats.solved || 0) / (mockUser.stats.attempted || 1) * 100)}%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>
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
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-electric-400 border-b-2 border-electric-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Activity Chart */}
              <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="mb-4 text-xl font-semibold text-white">Solving Progress</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="solved" 
                      stroke="#00D4FF" 
                      strokeWidth={3}
                      dot={{ fill: '#00D4FF', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Difficulty Distribution */}
              <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="mb-4 text-xl font-semibold text-white">Problem Difficulty</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center mt-4 space-x-6">
                  {difficultyData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-300">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-8">
              {/* Language Usage */}
              <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="mb-4 text-xl font-semibold text-white">Language Usage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={languageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="problems" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Study Streak */}
              <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="mb-6 text-xl font-semibold text-white">Study Streak</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 49 }, (_, i) => {
                    const intensity = Math.random();
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={`w-8 h-8 rounded ${
                          intensity > 0.7 ? 'bg-electric-400' :
                          intensity > 0.4 ? 'bg-electric-400/60' :
                          intensity > 0.1 ? 'bg-electric-400/30' :
                          'bg-gray-700'
                        }`}
                        title={`Day ${i + 1}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gray-700 rounded"></div>
                    <div className="w-3 h-3 rounded bg-electric-400/30"></div>
                    <div className="w-3 h-3 rounded bg-electric-400/60"></div>
                    <div className="w-3 h-3 rounded bg-electric-400"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Recent Submissions</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {recentSubmissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 transition-colors hover:bg-gray-750"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          submission.status === 'Accepted' ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <div>
                          <h4 className="font-medium text-white">{submission.problem}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>{submission.language}</span>
                            <span>•</span>
                            <span>{submission.time}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'Accepted' 
                          ? 'bg-green-400/20 text-green-400'
                          : 'bg-red-400/20 text-red-400'
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-300 hover:border-gray-600"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center ${achievement.color}`}>
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1 font-semibold text-white">{achievement.title}</h4>
                      <p className="mb-2 text-sm text-gray-400">{achievement.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{achievement.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;