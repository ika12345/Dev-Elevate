import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../contexts/GlobalContext';
import { FileText, Download, Users, Calendar, Target, BookOpen, ExternalLink, Filter, ChevronDown} from 'lucide-react';
import { Code } from 'lucide-react';
import { getDSAProblems, getAllProgrammingProblems, ProgrammingProblem } from '../../api/programmingApi';
const PlacementPrep: React.FC = () => {
  const { state } = useGlobalState();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('opportunities');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Programming problems state
  const [programmingProblems, setProgrammingProblems] = useState<ProgrammingProblem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showDSAOnly, setShowDSAOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch programming problems when tab changes to practice or filters change
  useEffect(() => {
    if (selectedTab === 'practice') {
      fetchProgrammingProblems();
    }
  }, [selectedTab, selectedDifficulty, showDSAOnly, currentPage]);

  // Mock data for testing DSA filter feature
  const mockDSAProblems: ProgrammingProblem[] = [
    {
      _id: '1',
      title: 'Two Sum',
      difficulty: 'Easy' as const,
      link: 'https://leetcode.com/problems/two-sum/',
      category: 'DSA',
      tags: ['array', 'hash-table', 'dsa'],
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      platformName: 'LeetCode'
    },
    {
      _id: '2',
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium' as const,
      link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
      category: 'DSA',
      tags: ['tree', 'bfs', 'dsa'],
      description: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
      platformName: 'LeetCode'
    },
    {
      _id: '3',
      title: 'Merge k Sorted Lists',
      difficulty: 'Hard' as const,
      link: 'https://leetcode.com/problems/merge-k-sorted-lists/',
      category: 'DSA',
      tags: ['linked-list', 'heap', 'dsa'],
      description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
      platformName: 'LeetCode'
    },
    {
      _id: '4',
      title: 'Valid Palindrome',
      difficulty: 'Easy' as const,
      link: 'https://leetcode.com/problems/valid-palindrome/',
      category: 'DSA',
      tags: ['string', 'two-pointers', 'dsa'],
      description: 'A phrase is a palindrome if it reads the same forward and backward.',
      platformName: 'LeetCode'
    },
    {
      _id: '5',
      title: 'Coin Change',
      difficulty: 'Medium' as const,
      link: 'https://leetcode.com/problems/coin-change/',
      category: 'DSA',
      tags: ['dynamic-programming', 'dsa'],
      description: 'You are given an integer array coins and an integer amount.',
      platformName: 'LeetCode'
    },
    {
      _id: '6',
      title: 'Number of Islands',
      difficulty: 'Medium' as const,
      link: 'https://leetcode.com/problems/number-of-islands/',
      category: 'DSA',
      tags: ['graph', 'dfs', 'bfs', 'dsa'],
      description: 'Given an m x n 2D binary grid, return the number of islands.',
      platformName: 'LeetCode'
    }
  ];

  const allMockProblems: ProgrammingProblem[] = [
    ...mockDSAProblems,
    {
      _id: '7',
      title: 'System Design: URL Shortener',
      difficulty: 'Hard' as const,
      link: 'https://leetcode.com/discuss/interview-question/system-design/',
      category: 'System Design',
      tags: ['system-design', 'scalability'],
      description: 'Design a URL shortening service like bit.ly.',
      platformName: 'LeetCode'
    },
    {
      _id: '8',
      title: 'Database Query Optimization',
      difficulty: 'Medium' as const,
      link: 'https://leetcode.com/problems/database/',
      category: 'Database',
      tags: ['sql', 'database'],
      description: 'Optimize database queries for performance.',
      platformName: 'LeetCode'
    }
  ];

  const fetchProgrammingProblems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredProblems = showDSAOnly ? mockDSAProblems : allMockProblems;
      
      // Apply difficulty filter
      if (selectedDifficulty !== 'all') {
        filteredProblems = filteredProblems.filter(problem => 
          problem.difficulty === selectedDifficulty
        );
      }
      
      // Simulate pagination
      const startIndex = (currentPage - 1) * 12;
      const endIndex = startIndex + 12;
      const paginatedProblems = filteredProblems.slice(startIndex, endIndex);
      
      setProgrammingProblems(paginatedProblems);
      setTotalPages(Math.ceil(filteredProblems.length / 12));
      
      // Uncomment this when backend is ready:
      // const params = {
      //   page: currentPage,
      //   limit: 12,
      //   ...(selectedDifficulty !== 'all' && { difficulty: selectedDifficulty }),
      // };
      // const response = showDSAOnly 
      //   ? await getDSAProblems(params)
      //   : await getAllProgrammingProblems(params);
      // if (response.success) {
      //   setProgrammingProblems(response.problems);
      //   setTotalPages(response.pagination.totalPages);
      // } else {
      //   setError('Failed to fetch programming problems');
      // }
    } catch (err) {
      setError('Error loading programming problems. Please try again.');
      console.error('Error fetching programming problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'opportunities', label: 'Job Opportunities', icon: Users },
    { id: 'interviews', label: 'Interview Prep', icon: Target },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'mock', label: 'Mock Interviews', icon: Calendar },
    { id: 'practice', label: 'Practice DSA', icon: Code }

  ];

  const jobOpportunities = [
    {
      company: 'Google',
      position: 'Software Engineer',
      location: 'Mountain View, CA',
      type: 'Full-time',
      deadline: '2024-03-15',
      description: 'Join our team to build products that help create opportunities for everyone. Work on cutting-edge technologies.',
      requirements: ['BS/MS in Computer Science', '3+ years experience', 'Strong coding skills', 'System design experience'],
      salary: '$120,000 - $180,000',
      category: 'Product Based',
      applyUrl: 'https://careers.google.com/jobs/results/?q=software%20engineer'
    },
    {
      company: 'Microsoft',
      position: 'Software Engineer',
      location: 'Redmond, WA',
      type: 'Full-time',
      deadline: '2024-03-20',
      description: 'Build and maintain software solutions for Microsoft products. Work on Azure, Office, and other platforms.',
      requirements: ['BS/MS in Computer Science', 'C#/Java experience', 'Cloud platforms', 'Problem-solving skills'],
      salary: '$130,000 - $200,000',
      category: 'Product Based',
      applyUrl: 'https://careers.microsoft.com/us/en/search-results?keywords=software%20engineer'
    },
    {
      company: 'Amazon',
      position: 'Software Development Engineer',
      location: 'Seattle, WA',
      type: 'Full-time',
      deadline: '2024-02-28',
      description: 'Design and build scalable software solutions for Amazon services. Work on AWS, e-commerce, and logistics.',
      requirements: ['BS/MS in Computer Science', 'Java/Python experience', 'System design', 'Leadership skills'],
      salary: '$140,000 - $220,000',
      category: 'Product Based',
      applyUrl: 'https://www.amazon.jobs/en/search?base_query=software%20development%20engineer'
    },
    {
      company: 'Meta',
      position: 'Software Engineer',
      location: 'Menlo Park, CA',
      type: 'Full-time',
      deadline: '2024-04-01',
      description: 'Build products that connect billions of people. Work on Facebook, Instagram, WhatsApp, and VR platforms.',
      requirements: ['BS/MS in Computer Science', 'C++/Python experience', 'Large-scale systems', 'Innovation mindset'],
      salary: '$150,000 - $250,000',
      category: 'Product Based',
      applyUrl: 'https://www.metacareers.com/jobs/?q=software%20engineer'
    },
    {
      company: 'Netflix',
      position: 'Senior Software Engineer',
      location: 'Los Gatos, CA',
      type: 'Full-time',
      deadline: '2024-03-25',
      description: 'Build the future of entertainment. Work on streaming platform, recommendation systems, and content delivery.',
      requirements: ['5+ years experience', 'Java/Go expertise', 'Microservices', 'High-scale systems'],
      salary: '$180,000 - $300,000',
      category: 'Product Based',
      applyUrl: 'https://jobs.netflix.com/jobs/search?q=software%20engineer'
    },
    {
      company: 'Apple',
      position: 'Software Engineer',
      location: 'Cupertino, CA',
      type: 'Full-time',
      deadline: '2024-03-30',
      description: 'Create innovative software for iPhone, iPad, Mac, and Apple Watch. Work on iOS, macOS, and developer tools.',
      requirements: ['BS/MS in Computer Science', 'Swift/Objective-C', 'Apple frameworks', 'User experience focus'],
      salary: '$140,000 - $220,000',
      category: 'Product Based',
      applyUrl: 'https://jobs.apple.com/en-us/search?job=software%20engineer'
    },
    {
      company: 'TCS',
      position: 'Software Developer',
      location: 'Bangalore, India',
      type: 'Full-time',
      deadline: '2024-04-01',
      description: 'Join our digital transformation initiatives across various industries. Work on enterprise solutions and consulting.',
      requirements: ['BE/BTech in any stream', 'Java/.NET experience', 'Good communication', 'Problem-solving skills'],
      salary: '₹3.5 - 7 LPA',
      category: 'Mass Recruiter',
      applyUrl: 'https://www.tcs.com/careers/india'
    },
    {
      company: 'Infosys',
      position: 'Systems Engineer',
      location: 'Bangalore, India',
      type: 'Full-time',
      deadline: '2024-04-15',
      description: 'Work on digital transformation projects for global clients. Develop and maintain software solutions.',
      requirements: ['BE/BTech degree', 'Programming fundamentals', 'Database knowledge', 'Good communication'],
      salary: '₹3.25 - 6.5 LPA',
      category: 'Mass Recruiter',
      applyUrl: 'https://career.infosys.com/jobdesc/jobdescription'
    },
    {
      company: 'Adobe',
      position: 'Software Engineer',
      location: 'San Jose, CA',
      type: 'Full-time',
      deadline: '2024-03-25',
      description: 'Create innovative software solutions for creative professionals. Work on Photoshop, Illustrator, and Creative Cloud.',
      requirements: ['BS/MS in Computer Science', 'C++/JavaScript experience', 'Creative software development', 'User experience focus'],
      salary: '$130,000 - $200,000',
      category: 'Product Based',
      applyUrl: 'https://careers.adobe.com/us/en/search-results?keywords=software%20engineer'
    },
    {
      company: 'Salesforce',
      position: 'Software Engineer',
      location: 'San Francisco, CA',
      type: 'Full-time',
      deadline: '2024-03-30',
      description: 'Build the future of CRM and cloud computing. Work on Salesforce platform and enterprise solutions.',
      requirements: ['BS/MS in Computer Science', 'Java/Apex experience', 'Cloud platforms', 'Enterprise software'],
      salary: '$140,000 - $220,000',
      category: 'Product Based',
      applyUrl: 'https://salesforce.wd1.myworkdayjobs.com/en-US/External_Career_Site?q=software%20engineer'
    },
    {
      company: 'Oracle',
      position: 'Software Engineer',
      location: 'Austin, TX',
      type: 'Full-time',
      deadline: '2024-04-01',
      description: 'Develop enterprise software solutions and cloud infrastructure. Work on Oracle Cloud and database technologies.',
      requirements: ['BS/MS in Computer Science', 'Java/Python experience', 'Database systems', 'Cloud architecture'],
      salary: '$120,000 - $180,000',
      category: 'Product Based',
      applyUrl: 'https://careers.oracle.com/jobs/#en/sites/jobsearch/jobs?keyword=software%20engineer'
    },
    {
      company: 'Intel',
      position: 'Software Engineer',
      location: 'Santa Clara, CA',
      type: 'Full-time',
      deadline: '2024-03-28',
      description: 'Develop software for Intel processors and hardware. Work on drivers, firmware, and system software.',
      requirements: ['BS/MS in Computer Science', 'C/C++ experience', 'System programming', 'Hardware knowledge'],
      salary: '$130,000 - $190,000',
      category: 'Product Based',
      applyUrl: 'https://jobs.intel.com/en/search-jobs?keywords=software%20engineer'
    },
    {
      company: 'IBM',
      position: 'Software Developer',
      location: 'Armonk, NY',
      type: 'Full-time',
      deadline: '2024-04-05',
      description: 'Build enterprise solutions and AI-powered software. Work on IBM Cloud, Watson, and enterprise tools.',
      requirements: ['BS/MS in Computer Science', 'Java/Python experience', 'Cloud platforms', 'AI/ML knowledge'],
      salary: '$110,000 - $170,000',
      category: 'Product Based',
      applyUrl: 'https://careers.ibm.com/job-search/?q=software%20developer'
    },
    {
      company: 'Cisco',
      position: 'Software Engineer',
      location: 'San Jose, CA',
      type: 'Full-time',
      deadline: '2024-03-22',
      description: 'Develop networking software and security solutions. Work on routers, switches, and network infrastructure.',
      requirements: ['BS/MS in Computer Science', 'C/C++ experience', 'Networking protocols', 'System programming'],
      salary: '$125,000 - $185,000',
      category: 'Product Based',
      applyUrl: 'https://jobs.cisco.com/jobs/SearchJobs/?keyword=software%20engineer'
    },
    {
      company: 'Wipro',
      position: 'Software Engineer',
      location: 'Bangalore, India',
      type: 'Full-time',
      deadline: '2024-04-10',
      description: 'Work on digital transformation projects and consulting services. Develop enterprise solutions for global clients.',
      requirements: ['BE/BTech degree', 'Java/.NET experience', 'Good communication', 'Problem-solving skills'],
      salary: '₹3.2 - 6.8 LPA',
      category: 'Mass Recruiter',
      applyUrl: 'https://careers.wipro.com/careers-home/jobs'
    }
  ];

  const interviewQuestions = [
    {
      category: 'Technical',
      questions: [
        'Explain the difference between == and === in JavaScript',
        'What is time complexity and how do you calculate it?',
        'Implement a binary search algorithm',
        'Explain the concept of closures in JavaScript',
        'What are the different types of joins in SQL?'
      ]
    },
    {
      category: 'HR',
      questions: [
        'Tell me about yourself',
        'Why do you want to work here?',
        'What are your strengths and weaknesses?',
        'Where do you see yourself in 5 years?',
        'Why are you leaving your current job?'
      ]
    },
    {
      category: 'Behavioral',
      questions: [
        'Describe a challenging project you worked on',
        'How do you handle tight deadlines?',
        'Tell me about a time you had to work with a difficult team member',
        'Describe a situation where you had to learn something new quickly',
        'How do you prioritize tasks when everything seems urgent?'
      ]
    }
  ];

  const resources = [
    {
      title: 'Complete Interview Preparation Guide',
      description: 'Comprehensive guide covering technical and HR interview preparation',
      type: 'PDF',
      size: '2.5 MB',
      downloads: 1250
    },
    {
      title: 'System Design Interview Handbook',
      description: 'Learn how to design scalable systems for tech interviews',
      type: 'PDF',
      size: '3.8 MB',
      downloads: 980
    },
    {
      title: 'DSA Cheat Sheet',
      description: 'Quick reference for data structures and algorithms',
      type: 'PDF',
      size: '1.2 MB',
      downloads: 2100
    },
    {
      title: 'Behavioral Interview Questions Bank',
      description: 'Common behavioral questions with sample answers',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 750
    }
  ];

  // --- Tab Renderers ---
  const renderPractice = () => (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className={`text-xl font-semibold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
            Programming Practice
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            state.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
            {programmingProblems.length} problems
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Debug Test Button */}
          <button
            onClick={() => {
              const testUrl = 'https://leetcode.com/problems/two-sum/';
              console.log('Testing link:', testUrl);
              alert(`Trying to open: ${testUrl}`);
              window.open(testUrl, '_blank');
            }}
            className={`px-3 py-1 text-xs rounded border ${
              state.darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🔗 Test Link
          </button>

          {/* DSA Filter Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDSAOnly}
              onChange={(e) => {
                setShowDSAOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={`text-sm font-medium ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              DSA Only
            </span>
          </label>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg border ${
              state.darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className={`ml-3 ${state.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading problems...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`p-4 rounded-lg border ${
          state.darkMode 
            ? 'bg-red-900 border-red-700 text-red-200' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchProgrammingProblems}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Problems Grid */}
      {!loading && !error && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmingProblems.map((problem) => (
              <div
                key={problem._id}
                className={`p-6 rounded-2xl shadow-sm border hover:shadow-lg transition-all duration-200 ${
                  state.darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold mb-2 line-clamp-2">{problem.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                    problem.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : problem.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                {problem.description && (
                  <p className={`text-sm mb-4 line-clamp-3 ${
                    state.darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {problem.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {problem.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs ${
                        state.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {problem.tags.length > 3 && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      state.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      +{problem.tags.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${
                    state.darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {problem.platformName || 'LeetCode'}
                  </span>
                  <button
                    onClick={() => {
                      console.log('Opening problem:', problem.title, problem.link);
                      // Try multiple methods to ensure link opens
                      try {
                        window.open(problem.link, '_blank', 'noopener,noreferrer');
                      } catch (error) {
                        console.error('Failed to open link:', error);
                        // Fallback: direct navigation
                        window.location.href = problem.link;
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Solve
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? state.darkMode
                      ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                      : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : state.darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              <span className={`px-4 py-2 ${state.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? state.darkMode
                      ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                      : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : state.darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* No problems found */}
          {programmingProblems.length === 0 && (
            <div className="text-center py-12">
              <Code className={`w-16 h-16 mx-auto mb-4 ${
                state.darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                state.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                No problems found
              </h3>
              <p className={`text-sm ${
                state.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Try adjusting your filters or check back later for new problems.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderOpportunities = () => {
    const filteredJobs = jobOpportunities.filter((job: any) => {
      const matchesCategory =
        selectedCategory === 'All Categories' || job.category === selectedCategory;

      const matchesSearch =
        job.position.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.requirements.some((req: string) => req.toLowerCase().includes(debouncedSearch.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className={`text-xl font-semibold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
              Latest Job Opportunities
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                state.darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option>All Categories</option>
              <option>Product Based</option>
              <option>Mass Recruiter</option>
              <option>Internship</option>
            </select>
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by role or tech stack..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pr-10 px-4 py-2 rounded-lg border ${
                  state.darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <span
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xl ${
                  state.darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                🔍
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job: any, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-200  ${state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className={`text-lg font-semibold tracking-tight ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {job.position}
                  </h4>
                  <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  job.type === 'Internship'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {job.type}
                </span>
              </div>
              <p className={`text-sm leading-relaxed mb-4 ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {job.description}
              </p>
              <div className="mb-4">
                <h5 className={`text-sm font-semibold mb-2 ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Requirements:
                </h5>
                <ul className="text-sm space-y-1 pl-1">
                  {job.requirements.map((req: string, reqIndex: number) => (
                    <li key={reqIndex} className={`flex items-start space-x-2 ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="w-1 h-1 bg-current rounded-full shrink-0"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <span className={`text-sm font-semibold ${state.darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {job.salary}
                  </span>
                  <p className={`text-xs mt-1 ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Deadline: {job.deadline}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    console.log(`Applying to ${job.position} at ${job.company}`);
                    if (job.applyUrl && job.applyUrl !== '#') {
                      // Open real job application URL in new tab
                      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      // Fallback for mock data or invalid URLs
                      alert(`🚧 Coming Soon!\n\nJob application feature for ${job.position} at ${job.company} will be available soon.\n\nFor now, please visit the company's career page directly.`);
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Apply</span>
                </button>
              </div>
                          </div>
            ))}
        </div>
      </div>
    );
  };

  const renderInterviews = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {interviewQuestions.map((category, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md ${state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <h4 className={`text-lg font-semibold mb-4 ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
              {category.category} Questions
            </h4>
            <div className="space-y-3">
              {category.questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className={`p-3 rounded-lg ${state.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}
                >
                  <p className={`text-sm leading-relaxed ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {question}
                  </p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                console.log(`Viewing all ${category.category} questions`);
                // Open external resources with curated questions based on category
                const questionUrls = {
                  'Technical': 'https://github.com/DopplerHQ/awesome-interview-questions#technical-questions',
                  'HR': 'https://www.indeed.com/career-advice/interviewing/hr-interview-questions',
                  'Behavioral': 'https://www.indeed.com/career-advice/interviewing/behavioral-interview-questions'
                };
                
                const url = questionUrls[category.category as keyof typeof questionUrls];
                if (url) {
                  window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                  // Fallback for unknown categories
                  alert(`🚧 Coming Soon!\n\nDetailed ${category.category} questions page will be available soon.\n\nFor now, you can see the sample questions above.`);
                }
              }}
              className="w-full mt-5 px-4 py-2 text-sm font-medium rounded-xl 
    bg-blue-500 hover:bg-blue-600 text-white transition-colors 
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
              Practice {category.category} Questions
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-semibold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
        Download Resources
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border  transform transition-all duration-200  ${state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-y-1`}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-semibold mb-2 ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {resource.title}
                </h4>
                <p className={`text-sm mb-3 ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {resource.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center  gap-4 text-sm">
                    <span className={`${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                     📄 {resource.type} • {resource.size}
                    </span>
                    <span className={`${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ⬇️ {resource.downloads} downloads
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      console.log(`Downloading ${resource.title}`);
                      // Open actual downloadable resources based on the resource title
                      const downloadUrls = {
                        'Complete Interview Preparation Guide': 'http://localhost:3001/api/pdf/interview-guide',
                        'System Design Interview Handbook': 'http://localhost:3001/api/pdf/system-design',
                        'DSA Cheat Sheet': 'http://localhost:3001/api/pdf/dsa-cheatsheet',
                        'Behavioral Interview Questions Bank': 'http://localhost:3001/api/pdf/behavioral-questions'
                      };
                      
                      const url = downloadUrls[resource.title as keyof typeof downloadUrls];
                      if (url) {
                        // Create a temporary link element to trigger download without opening page
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${resource.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } else {
                        // Fallback for unknown resources
                        alert(`🚧 Coming Soon!\n\nDownload feature for "${resource.title}" will be available soon.\n\nFile: ${resource.type} • ${resource.size}\nDownloads: ${resource.downloads}`);
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMockInterviews = () => (
    <div className="space-y-6">
      <h3 className={`text-xl font-semibold tracking-tight ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
        Mock Interview Practice
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-200 ${state.darkMode ? 'bg-gray-800 border-gray-700 hover:shadow-md' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
          <h4 className={`text-xl font-semibold mb-3 tracking-tight ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
            🤖 AI Mock Interview
          </h4>
          <p className={`text-sm mb-4 leading-relaxed ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Practice with our AI interviewer. Get instant feedback on your answers and improve your performance.
          </p>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className={`text-sm ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Technical Questions</span>
              <span className="text-sm text-green-500 font-medium">Available</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`text-sm ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>HR Questions</span>
              <span className="text-sm text-green-500 font-medium">Available</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`text-sm ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Behavioral Questions</span>
              <span className="text-sm text-green-500 font-medium">Available</span>
            </div>
          </div>
          <button 
            onClick={() => {
              console.log('Starting AI Mock Interview');
              // For now, show a "Coming Soon" alert. In the future, this could navigate to the AI mock interview interface
              alert(`🚧 Coming Soon!\n\nAI Mock Interview feature will be available soon.\n\nThis will include:\n• Technical Questions\n• HR Questions\n• Behavioral Questions\n• Instant Feedback`);
            }}
            className="w-full mt-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-150"
          >
           🚀 Start AI Mock Interview
          </button>
        </div>
        <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-200 ${state.darkMode ? 'bg-gray-800 border-gray-700 hover:shadow-md' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
          <h4 className={`text-xl font-semibold mb-3 tracking-tight ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
            👥 Peer Mock Interview
          </h4>
          <p className={`text-sm mb-5 leading-relaxed ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Practice with other users. Take turns being the interviewer and interviewee.
          </p>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className={`${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Active Users</span>
              <span className="text-blue-500 font-medium">23 online</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Avg. Wait Time</span>
              <span className="text-orange-500 font-medium">2 minutes</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sessions Today</span>
              <span className="text-green-500 font-medium">156</span>
            </div>
          </div>
          <button 
            onClick={() => {
              console.log('Finding Interview Partner');
              // For now, show a "Coming Soon" alert. In the future, this could navigate to the peer interview matching interface
              alert(`🚧 Coming Soon!\n\nPeer Interview Partner feature will be available soon.\n\nThis will include:\n• Find interview partners\n• Real-time practice sessions\n• Turn-based interviewing\n• Community feedback`);
            }}
            className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-150"
          >
            Find Interview Partner
          </button>
        </div>
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className={`min-h-screen ${state.darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-sky-50 to-white'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
           Placement Preparation Arena
          </h1>
          <p className={`text-lg sm:text-xl ${state.darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl`}>
            Everything you need to ace your job interviews and land your dream job
          </p>
        </div>
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-sm transition-all duration-200 border ${
                    selectedTab === tab.id
                      ? 'bg-blue-600 text-white border-blue-600 scale-105'
                      : state.darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {/* Tab Content */}
        <div className={`rounded-2xl p-6 transition-all duration-300 shadow-md border ${state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} `}>
          {selectedTab === 'opportunities' && renderOpportunities()}
          {selectedTab === 'interviews' && renderInterviews()}
          {selectedTab === 'resources' && renderResources()}
          {selectedTab === 'mock' && renderMockInterviews()}
          {selectedTab === 'practice' && renderPractice()}

        </div>
      </div>
    </div>
  );
};

export default PlacementPrep;
