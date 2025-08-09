import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../../contexts/GlobalContext';
import { 
  Upload, 
  User, 
  Mail, 
  Phone, 
  Code, 
  FileText, 
  Send, 
  CheckCircle,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  track: string;
  resume: File | null;
  message: string;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  track?: string;
  resume?: string;
}

const ApplyPage: React.FC = () => {
  const { state } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get job details from navigation state
  const jobDetails = location.state?.job;
  
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    track: '',
    resume: null,
    message: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const tracks = [
    'Frontend Development',
    'Backend Development', 
    'Fullstack Development',
    'Data Science',
    'DevOps',
    'Mobile Development',
    'Machine Learning',
    'UI/UX Design'
  ];

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Track validation
    if (!formData.track) {
      newErrors.track = 'Please select a track';
    }

    // Resume validation
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    } else {
      const file = formData.resume;
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['application/pdf'];
      
      if (!allowedTypes.includes(file.type)) {
        newErrors.resume = 'Resume must be a PDF file';
      } else if (file.size > maxSize) {
        newErrors.resume = 'Resume file size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = (file: File) => {
    setFormData(prev => ({ ...prev, resume: file }));
    if (errors.resume) {
      setErrors(prev => ({ ...prev, resume: undefined }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual Firebase/backend integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send data to Firebase or your backend
      console.log('Application submitted:', {
        ...formData,
        resumeFileName: formData.resume?.name,
        appliedJob: jobDetails?.company + ' - ' + jobDetails?.position,
        submittedAt: new Date().toISOString()
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      // Handle error state here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${state.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className={`p-8 rounded-2xl shadow-lg text-center ${
              state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}>
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className={`text-2xl font-bold mb-4 ${
                  state.darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Application Submitted Successfully! 🎉
                </h1>
                <p className={`text-lg mb-6 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Thank you for your application. We'll review your submission and get back to you soon.
                </p>
                
                {jobDetails && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    state.darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <p className={`font-semibold ${
                      state.darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Applied for: {jobDetails.company} - {jobDetails.position}
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/placement')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Back to Placement Prep
                  </button>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        track: '',
                        resume: null,
                        message: ''
                      });
                    }}
                    className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                      state.darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${state.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/placement')}
              className={`flex items-center space-x-2 mb-4 text-blue-500 hover:text-blue-600 transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Placement Prep</span>
            </button>
            
            <h1 className={`text-3xl font-bold mb-4 ${
              state.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Apply for Position
            </h1>
            
            {jobDetails && (
              <div className={`p-4 rounded-lg ${
                state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
              } border`}>
                <h2 className={`text-xl font-semibold ${
                  state.darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {jobDetails.company} - {jobDetails.position}
                </h2>
                <p className={state.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {jobDetails.location} • {jobDetails.type}
                </p>
              </div>
            )}
          </div>

          {/* Application Form */}
          <div className={`p-8 rounded-2xl shadow-lg ${
            state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.fullName 
                      ? 'border-red-500 focus:border-red-500' 
                      : state.darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : state.darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.phone 
                      ? 'border-red-500 focus:border-red-500' 
                      : state.darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Track Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Code className="w-4 h-4 inline mr-2" />
                  Track Selection *
                </label>
                <select
                  value={formData.track}
                  onChange={(e) => handleInputChange('track', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.track 
                      ? 'border-red-500 focus:border-red-500' 
                      : state.darkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none`}
                >
                  <option value="">Select your preferred track</option>
                  {tracks.map((track) => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
                {errors.track && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.track}
                  </p>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <FileText className="w-4 h-4 inline mr-2" />
                  Resume Upload (PDF) *
                </label>
                
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : errors.resume 
                        ? 'border-red-500' 
                        : state.darkMode 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-300 bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="text-center">
                    <Upload className={`w-8 h-8 mx-auto mb-4 ${
                      state.darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    
                    {formData.resume ? (
                      <div>
                        <p className={`font-medium ${
                          state.darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formData.resume.name}
                        </p>
                        <p className={`text-sm ${
                          state.darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className={`font-medium ${
                          state.darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Drop your resume here or click to browse
                        </p>
                        <p className={`text-sm ${
                          state.darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          PDF files only, max 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {errors.resume && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.resume}
                  </p>
                )}
              </div>

              {/* Message/Motivation */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  state.darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <FileText className="w-4 h-4 inline mr-2" />
                  Message / Motivation (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    state.darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500' 
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none`}
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-medium transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
