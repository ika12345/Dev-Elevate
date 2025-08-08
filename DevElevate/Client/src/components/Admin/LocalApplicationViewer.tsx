import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  Trash2, 
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  FileText,
  BarChart3
} from 'lucide-react';
import { 
  getStoredApplications, 
  clearStoredApplications,
  getApplicationStats,
  LocalApplicationData 
} from '../../services/localApplicationService';

const LocalApplicationViewer: React.FC = () => {
  const [applications, setApplications] = useState<LocalApplicationData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadApplications = () => {
    setLoading(true);
    setTimeout(() => {
      const apps = getStoredApplications();
      const appStats = getApplicationStats();
      setApplications(apps);
      setStats(appStats);
      setLoading(false);
    }, 500); // Small delay for better UX
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all stored applications? This cannot be undone.')) {
      clearStoredApplications();
      loadApplications();
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getTrackIcon = (track: string) => {
    switch (track) {
      case 'frontend': return '🎨';
      case 'backend': return '⚙️';
      case 'fullstack': return '🌐';
      case 'datascience': return '📊';
      default: return '💻';
    }
  };

  const getTrackName = (track: string) => {
    switch (track) {
      case 'frontend': return 'Frontend Development';
      case 'backend': return 'Backend Development';
      case 'fullstack': return 'Fullstack Development';
      case 'datascience': return 'Data Science';
      default: return track;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Local Applications</h1>
            <p className="text-gray-600">Applications stored locally (fallback when Firebase is unavailable)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadApplications}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎨</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Frontend</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.byTrack.frontend}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Backend</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.byTrack.backend}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🌐</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Fullstack</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.byTrack.fullstack}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Science</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.byTrack.datascience}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Applications */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">No applications have been submitted locally yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Track
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application, index) => (
                    <motion.tr
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.fullName}
                          </div>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {application.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {application.phoneNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getTrackIcon(application.track)}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getTrackName(application.track)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {application.resumeFileName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(application.resumeSize)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(application.submittedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {application.message || <span className="text-gray-400 italic">No message</span>}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocalApplicationViewer;
