import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, User, Mail, Phone, Code, FileText, MessageSquare, CheckCircle, X, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { submitApplication, ApplicationFormData } from '../../services/applicationService';
import { submitApplicationLocally, updateExistingApplication, removeApplicationByEmail } from '../../services/localApplicationService';
import { testFirebaseSetup, getFirebaseInfo } from '../../utils/firebaseDebug';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  track: string;
  resume: File | null;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  track?: string;
  resume?: string;
}

const ApplyPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    track: '',
    resume: null,
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string>('');

  const tracks = [
    { value: 'frontend', label: 'Frontend Development', icon: '🎨' },
    { value: 'backend', label: 'Backend Development', icon: '⚙️' },
    { value: 'fullstack', label: 'Fullstack Development', icon: '🌐' },
    { value: 'datascience', label: 'Data Science', icon: '📊' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Track selection validation
    if (!formData.track) {
      newErrors.track = 'Please select a track';
    }

    // Resume validation
    if (!formData.resume) {
      newErrors.resume = 'Resume upload is required';
    } else if (formData.resume.type !== 'application/pdf') {
      newErrors.resume = 'Resume must be a PDF file';
    } else if (formData.resume.size > 2 * 1024 * 1024) { // 2MB limit as specified
      newErrors.resume = 'Resume file size must be less than 2MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
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
      setFormData(prev => ({ ...prev, resume: file }));
      
      if (errors.resume) {
        setErrors(prev => ({ ...prev, resume: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const applicationData: ApplicationFormData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        track: formData.track,
        message: formData.message,
        resume: formData.resume
      };

      console.log('Attempting to submit application...');
      let applicationId: string;

      try {
        // Try Firebase first with shorter timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Firebase timeout')), 10000); // 10 second timeout
        });

        applicationId = await Promise.race([
          submitApplication(applicationData),
          timeoutPromise
        ]);

        console.log('Firebase submission successful with ID:', applicationId);

      } catch (firebaseError) {
        console.warn('Firebase submission failed, using local storage:', firebaseError);

        // Fallback to local storage
        try {
          applicationId = await submitApplicationLocally(applicationData);
          console.log('Local submission successful with ID:', applicationId);
        } catch (localError) {
          // Check if it's a duplicate email error
          if (localError instanceof Error && localError.message.includes('already submitted an application')) {
            setDuplicateError(localError.message);
            setShowDuplicateDialog(true);
            return; // Exit early, don't show generic error
          }
          throw localError; // Re-throw other errors
        }
      }

      setShowSuccess(true);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        track: '',
        resume: null,
        message: ''
      });

      // Clear any previous errors
      setErrors({});

    } catch (error) {
      console.error('Error submitting application:', error);

      // Show error message
      if (error instanceof Error) {
        setErrors({ resume: error.message });
      } else {
        setErrors({ resume: 'Failed to submit application. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
  };

  const handleUpdateExisting = async () => {
    setShowDuplicateDialog(false);
    setIsSubmitting(true);

    try {
      const applicationData: ApplicationFormData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        track: formData.track,
        message: formData.message,
        resume: formData.resume
      };

      const applicationId = await updateExistingApplication(applicationData);
      console.log('Application updated successfully with ID:', applicationId);

      setShowSuccess(true);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        track: '',
        resume: null,
        message: ''
      });

      setErrors({});

    } catch (error) {
      console.error('Error updating application:', error);
      if (error instanceof Error) {
        setErrors({ resume: error.message });
      } else {
        setErrors({ resume: 'Failed to update application. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAndResubmit = async () => {
    setShowDuplicateDialog(false);
    setIsSubmitting(true);

    try {
      // Remove existing application
      const removed = removeApplicationByEmail(formData.email);
      if (!removed) {
        throw new Error('Could not find existing application to remove');
      }

      // Submit new application
      const applicationData: ApplicationFormData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        track: formData.track,
        message: formData.message,
        resume: formData.resume
      };

      const applicationId = await submitApplicationLocally(applicationData);
      console.log('New application submitted successfully with ID:', applicationId);

      setShowSuccess(true);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        track: '',
        resume: null,
        message: ''
      });

      setErrors({});

    } catch (error) {
      console.error('Error resubmitting application:', error);
      if (error instanceof Error) {
        setErrors({ resume: error.message });
      } else {
        setErrors({ resume: 'Failed to resubmit application. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDuplicateDialog = () => {
    setShowDuplicateDialog(false);
    setDuplicateError('');
  };

  return (
    <div className="min-h-screen bg-black text-white py-6 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background - matching landing page */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Join DevElevate
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Take the next step in your development career. Apply now to join our exclusive program and accelerate your growth.
          </p>

          {/* Firebase Debug Button - Only in development */}
          {import.meta.env.DEV && (
            <div className="mt-6">
              <button
                type="button"
                onClick={async () => {
                  console.log('🔥 Testing Firebase connection...');
                  getFirebaseInfo();
                  const results = await testFirebaseSetup();

                  const message = `Firebase Test Results:\n\n` +
                    `Firestore: ${results.firestore.success ? '✅' : '❌'} ${results.firestore.message}\n\n` +
                    `Storage: ${results.storage.success ? '✅' : '❌'} ${results.storage.message}`;

                  alert(message);
                }}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
              >
                🔥 Test Firebase Connection
              </button>
            </div>
          )}
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 md:p-12 border border-white/10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <User className="w-6 h-6" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all ${
                      errors.fullName ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-300">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all ${
                      errors.email ? 'border-red-400' : 'border-white/20'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all ${
                    errors.phoneNumber ? 'border-red-400' : 'border-white/20'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* Track Selection */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Code className="w-6 h-6" />
                Track Selection
              </h2>
              
              <div>
                <label htmlFor="track" className="block text-sm font-medium text-gray-300 mb-2">
                  Choose Your Track *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tracks.map((track) => (
                    <label
                      key={track.value}
                      className={`flex items-center p-4 bg-black/30 border rounded-lg cursor-pointer transition-all hover:bg-black/50 ${
                        formData.track === track.value ? 'border-purple-400 bg-purple-500/30' : 'border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="track"
                        value={track.value}
                        checked={formData.track === track.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-3">{track.icon}</span>
                      <span className="text-white font-medium">{track.label}</span>
                    </label>
                  ))}
                </div>
                {errors.track && (
                  <p className="mt-1 text-sm text-red-400">{errors.track}</p>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-6 h-6" />
                Resume Upload
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Your Resume (PDF) *
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    dragActive
                      ? 'border-purple-400 bg-purple-500/20'
                      : errors.resume
                      ? 'border-red-400 bg-red-500/20'
                      : 'border-white/20 bg-black/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  {formData.resume ? (
                    <div className="text-white">
                      <p className="font-medium">{formData.resume.name}</p>
                      <p className="text-sm text-gray-400">
                        {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-300">
                      <p className="font-medium">Drop your resume here or click to browse</p>
                      <p className="text-sm text-gray-400">PDF files only, max 2MB</p>
                    </div>
                  )}
                </div>
                {errors.resume && (
                  <p className="mt-1 text-sm text-red-400">{errors.resume}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                Additional Information
              </h2>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message / Motivation (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none"
                  placeholder="Tell us about your motivation, goals, or any additional information you'd like to share..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center gap-3 px-6 sm:px-8 py-4 w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-lg shadow-lg transition-all ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-purple-500/25'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative"
          >
            <button
              onClick={closeSuccessModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Application Submitted Successfully!
              </h3>
              <div className="text-gray-600 space-y-2">
                <p>Thank you for your application to DevElevate!</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p><strong>What happens next?</strong></p>
                  <ul className="mt-2 space-y-1 text-left">
                    <li>• Your application has been securely saved</li>
                    <li>• Our team will review your submission</li>
                    <li>• We'll contact you within 3-5 business days</li>
                    <li>• Check your email for updates</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <p><strong>💡 Tip:</strong> You can check your application status by visiting this page again with the same email.</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={closeSuccessModal}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Duplicate Email Dialog */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative"
          >
            <button
              onClick={closeDuplicateDialog}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <AlertTriangle className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Application Already Exists
              </h3>
              <div className="text-gray-600 space-y-3">
                <p className="text-sm">{duplicateError}</p>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p><strong>What would you like to do?</strong></p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUpdateExisting}
                disabled={isSubmitting}
                className={`w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update My Existing Application'}
              </button>

              <button
                onClick={handleClearAndResubmit}
                disabled={isSubmitting}
                className={`w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Replace with New Application'}
              </button>

              <button
                onClick={closeDuplicateDialog}
                disabled={isSubmitting}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p><strong>Update:</strong> Modifies your existing application with new information</p>
              <p><strong>Replace:</strong> Completely removes old application and creates a new one</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ApplyPage;
