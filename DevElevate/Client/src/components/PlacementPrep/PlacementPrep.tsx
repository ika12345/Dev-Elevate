import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../../contexts/GlobalContext';
import { FileText, Download, Users, Calendar, Target, BookOpen, ExternalLink } from 'lucide-react';

const PlacementPrep: React.FC = () => {
  const { state } = useGlobalState();
  const [selectedTab, setSelectedTab] = useState('opportunities');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const tabs = [
    { id: 'opportunities', label: 'Job Opportunities', icon: Users },
    { id: 'interviews', label: 'Interview Prep', icon: Target },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'mock', label: 'Mock Interviews', icon: Calendar }
  ];

  const jobOpportunities = [
    {
      company: 'Google',
      position: 'Software Engineer',
      location: 'Mountain View, CA',
      type: 'Full-time',
      deadline: '2024-03-15',
      description: 'Join our team to build products that help create opportunities for everyone.',
      requirements: ['BS/MS in Computer Science', '3+ years experience', 'Strong coding skills'],
      salary: '$120,000 - $180,000',
      category: 'Product Based'
    },
    {
      company: 'Microsoft',
      position: 'AI Engineer',
      location: 'Seattle, WA',
      type: 'Full-time',
      deadline: '2024-03-20',
      description: 'Work on cutting-edge AI technologies and machine learning systems.',
      requirements: ['MS in AI/ML', 'Experience with Python/TensorFlow', 'Research background'],
      salary: '$130,000 - $200,000',
      category: 'Product Based'
    },
    {
      company: 'Amazon',
      position: 'SDE Intern',
      location: 'Multiple Locations',
      type: 'Internship',
      deadline: '2024-02-28',
      description: 'Summer internship program for software development engineers.',
      requirements: ['Currently pursuing CS degree', 'Strong programming skills', 'Problem-solving ability'],
      salary: '$8,000/month',
      category: 'Internship'
    },
    {
      company: 'TCS',
      position: 'Software Developer',
      location: 'Bangalore, India',
      type: 'Full-time',
      deadline: '2024-04-01',
      description: 'Join our digital transformation initiatives across various industries.',
      requirements: ['BE/BTech in any stream', 'Good communication skills', 'Aptitude for programming'],
      salary: '₹3.5 - 7 LPA',
      category: 'Mass Recruiter'
    }
  ];

  const renderOpportunities = () => {
    const filteredJobs = jobOpportunities.filter((job) => {
      const matchesCategory =
        selectedCategory === 'All Categories' || job.category === selectedCategory;

      const matchesSearch =
        job.position.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(debouncedSearch.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className={`text-xl font-semibold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
            Latest Job Opportunities
          </h3>

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

            {/* Search Input with Emoji */}
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
          {filteredJobs.map((job, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border ${
                state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className={`text-lg font-semibold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {job.position}
                  </h4>
                  <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {job.company} • {job.location}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  job.type === 'Internship'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {job.type}
                </span>
              </div>

              <p className={`text-sm mb-3 ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {job.description}
              </p>

              <div className="mb-3">
                <h5 className={`text-sm font-medium mb-2 ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Requirements:
                </h5>
                <ul className="text-sm space-y-1">
                  {job.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className={`flex items-center space-x-2 ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className={`text-sm font-medium ${state.darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {job.salary}
                  </span>
                  <p className={`text-xs ${state.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Deadline: {job.deadline}
                  </p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
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

  // Placeholder functions for the rest of the tabs (keep your original implementations)
  const renderInterviews = () => <div>Interview Prep Content</div>;
  const renderResources = () => <div>Resources Content</div>;
  const renderMockInterviews = () => <div>Mock Interview Content</div>;

  return (
    <div className={`min-h-screen ${state.darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Placement Preparation Arena
          </h1>
          <p className={`text-lg ${state.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything you need to ace your job interviews and land your dream job
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : state.darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`${state.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
          {selectedTab === 'opportunities' && renderOpportunities()}
          {selectedTab === 'interviews' && renderInterviews()}
          {selectedTab === 'resources' && renderResources()}
          {selectedTab === 'mock' && renderMockInterviews()}
        </div>
      </div>
    </div>
  );
};

export default PlacementPrep;
