import React, { useState } from 'react';
import { Upload, Send, CheckCircle, AlertCircle, X, FileText, User, Mail, Phone, Code, MessageSquare } from 'lucide-react';
import { submitApplication } from '../../utils/applicationService';

interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  track: string;
  resume: File | null;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  track?: string;
  resume?: string;
}

const ApplyPage: React.FC = () => {
  const [form, setForm] = useState<ApplicationForm>({
    fullName: '',
    email: '',
    phone: '',
    track: '',
    resume: null,
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const tracks = [
    { value: 'frontend', label: 'Frontend Development', icon: '🎨' },
    { value: 'backend', label: 'Backend Development', icon: '⚙️' },
    { value: 'fullstack', label: 'Full Stack Development', icon: '🔧' },
    { value: 'datascience', label: 'Data Science', icon: '📊' }
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (form.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Track validation
    if (!form.track) {
      newErrors.track = 'Please select a track';
    }

    // Resume validation
    if (!form.resume) {
      newErrors.resume = 'Resume is required';
    } else {
      const allowedTypes = ['application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(form.resume.type)) {
        newErrors.resume = 'Resume must be a PDF file';
      } else if (form.resume.size > maxSize) {
        newErrors.resume = 'Resume file size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, resume: file }));
    
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
      setForm(prev => ({ ...prev, resume: file }));
      
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
      // Submit application to Firebase
      const applicationId = await submitApplication({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        track: form.track,
        message: form.message,
        resume: form.resume || undefined,
      });

      console.log('Application submitted successfully with ID:', applicationId);

      setShowConfirmation(true);

      // Reset form
      setForm({
        fullName: '',
        email: '',
        phone: '',
        track: '',
        resume: null,
        message: ''
      });

    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Submission failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Apply to <span className="text-blue-600">DevElevate</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take the next step in your development journey. Join our community of passionate developers and accelerate your career.
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FileText className="mr-3" />
              Application Form
            </h2>
            <p className="text-blue-100 mt-2">Fill out all required fields to complete your application</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Track Selection */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Code className="w-4 h-4 mr-2 text-blue-600" />
                Development Track *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tracks.map((track) => (
                  <label
                    key={track.value}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300 transition-colors ${
                      form.track === track.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="track"
                      value={track.value}
                      checked={form.track === track.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{track.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{track.label}</span>
                    {form.track === track.value && (
                      <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
              {errors.track && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.track}
                </p>
              )}
            </div>

            {/* Resume Upload */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 mr-2 text-blue-600" />
                Resume Upload *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 
                  errors.resume ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {form.resume ? (
                  <div className="text-green-600">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">{form.resume.name}</p>
                    <p className="text-sm text-gray-500">
                      {(form.resume.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Drop your resume here or click to upload</p>
                    <p className="text-sm">PDF files only, max 5MB</p>
                  </div>
                )}
              </div>
              {errors.resume && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.resume}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                Message / Motivation (Optional)
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Tell us about your motivation and what you hope to achieve with DevElevate..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-white">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-bold">Application Submitted!</h3>
                </div>
                <button
                  onClick={closeConfirmation}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Thank you for your application! We have received your submission and will review it carefully.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                You will receive a confirmation email shortly with next steps. Our team will get back to you within 3-5 business days.
              </p>
              
              <button
                onClick={closeConfirmation}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyPage;
