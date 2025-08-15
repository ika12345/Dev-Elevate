import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Share2, BookOpen } from 'lucide-react';
import type { Problem } from '../../types';
import { motion } from 'framer-motion';

interface ProblemDescriptionProps {
  problem: Problem;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'solutions'>('description');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'solutions', label: 'Solutions' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Problem Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Acceptance Rate: <span className="text-green-400">{problem.acceptance}%</span></span>
              <span>Submissions: {problem.submissions.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Star className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ThumbsUp className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ThumbsDown className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-electric-400/20 text-electric-400 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
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
      <div className="p-6">
        {activeTab === 'description' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {problem.description}
              </div>
            </div>

            {problem.examples.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Examples</h3>
                <div className="space-y-4">
                  {problem.examples.map((example, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-4">
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-400 mb-1">Input:</div>
                        <code className="text-green-400 bg-gray-800 px-2 py-1 rounded">
                          {example.input}
                        </code>
                      </div>
                      <div className="mb-3">
                        <div className="text-sm font-medium text-gray-400 mb-1">Output:</div>
                        <code className="text-blue-400 bg-gray-800 px-2 py-1 rounded">
                          {example.output}
                        </code>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-sm font-medium text-gray-400 mb-1">Explanation:</div>
                          <div className="text-gray-300 text-sm">{example.explanation}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {problem.constraints.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Constraints</h3>
                <ul className="space-y-2">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-gray-300 text-sm">
                      • {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'editorial' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Editorial Coming Soon</h3>
            <p className="text-gray-400">Detailed solution explanation will be available after submission.</p>
          </motion.div>
        )}

        {activeTab === 'solutions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-electric-400 to-neon-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Community Solutions</h3>
            <p className="text-gray-400">Browse solutions shared by the community.</p>
            <div className="mt-6 space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-white">Python Solution - O(n)</div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span>234</span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-3">by @pythonmaster</div>
                <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                  <code className="text-green-400">
{`def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescription;