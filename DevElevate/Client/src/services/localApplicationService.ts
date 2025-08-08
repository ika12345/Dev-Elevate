// Fallback service that stores applications locally when Firebase is not available
export interface LocalApplicationData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  track: string;
  message: string;
  resumeFileName?: string;
  resumeSize?: number;
  status: 'pending';
  submittedAt: string;
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  track: string;
  message: string;
  resume: File | null;
}

// Store application locally
export const submitApplicationLocally = async (formData: ApplicationFormData): Promise<string> => {
  // Simulate API delay for realistic experience
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Validate required fields
  if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.track) {
    throw new Error('Please fill in all required fields');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    throw new Error('Please enter a valid email address');
  }

  // Validate phone number
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
    throw new Error('Please enter a valid phone number');
  }

  // Validate resume file
  if (!formData.resume) {
    throw new Error('Please upload your resume');
  }

  if (formData.resume.type !== 'application/pdf') {
    throw new Error('Resume must be a PDF file');
  }

  if (formData.resume.size > 2 * 1024 * 1024) { // 2MB limit
    throw new Error('Resume file size must be less than 2MB');
  }

  // Check for duplicate email in localStorage
  const existingApplications = getStoredApplications();
  const duplicateEmail = existingApplications.find(app => app.email.toLowerCase() === formData.email.toLowerCase());

  if (duplicateEmail) {
    const submittedDate = new Date(duplicateEmail.submittedAt).toLocaleDateString();
    throw new Error(`You've already submitted an application with this email on ${submittedDate}. Each email can only be used once. Please use a different email or contact support if you need to update your application.`);
  }

  // Generate unique ID
  const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create application data
  const applicationData: LocalApplicationData = {
    id: applicationId,
    fullName: formData.fullName.trim(),
    email: formData.email.toLowerCase().trim(),
    phoneNumber: formData.phoneNumber.trim(),
    track: formData.track,
    message: formData.message?.trim() || '',
    resumeFileName: formData.resume.name,
    resumeSize: formData.resume.size,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };

  // Store in localStorage
  const applications = getStoredApplications();
  applications.push(applicationData);
  localStorage.setItem('develevate_applications', JSON.stringify(applications));

  console.log('Application stored locally:', applicationData);
  return applicationId;
};

// Get stored applications
export const getStoredApplications = (): LocalApplicationData[] => {
  try {
    const stored = localStorage.getItem('develevate_applications');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading stored applications:', error);
    return [];
  }
};

// Clear stored applications (for testing)
export const clearStoredApplications = (): void => {
  localStorage.removeItem('develevate_applications');
};

// Get application by ID
export const getApplicationById = (id: string): LocalApplicationData | null => {
  const applications = getStoredApplications();
  return applications.find(app => app.id === id) || null;
};

// Get applications by email
export const getApplicationsByEmail = (email: string): LocalApplicationData[] => {
  const applications = getStoredApplications();
  return applications.filter(app => app.email.toLowerCase() === email.toLowerCase());
};

// Update existing application (for same email)
export const updateExistingApplication = async (formData: ApplicationFormData): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const applications = getStoredApplications();
  const existingIndex = applications.findIndex(app => app.email.toLowerCase() === formData.email.toLowerCase());

  if (existingIndex === -1) {
    throw new Error('No existing application found with this email');
  }

  // Update the existing application
  const existingApp = applications[existingIndex];
  const updatedApp: LocalApplicationData = {
    ...existingApp,
    fullName: formData.fullName.trim(),
    phoneNumber: formData.phoneNumber.trim(),
    track: formData.track,
    message: formData.message?.trim() || '',
    resumeFileName: formData.resume?.name || existingApp.resumeFileName,
    resumeSize: formData.resume?.size || existingApp.resumeSize,
    submittedAt: new Date().toISOString(), // Update submission time
  };

  applications[existingIndex] = updatedApp;
  localStorage.setItem('develevate_applications', JSON.stringify(applications));

  console.log('Application updated locally:', updatedApp);
  return existingApp.id;
};

// Remove application by email
export const removeApplicationByEmail = (email: string): boolean => {
  const applications = getStoredApplications();
  const filteredApplications = applications.filter(app => app.email.toLowerCase() !== email.toLowerCase());

  if (filteredApplications.length === applications.length) {
    return false; // No application was removed
  }

  localStorage.setItem('develevate_applications', JSON.stringify(filteredApplications));
  return true;
};

// Export stats for admin
export const getApplicationStats = () => {
  const applications = getStoredApplications();

  return {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    byTrack: {
      frontend: applications.filter(app => app.track === 'frontend').length,
      backend: applications.filter(app => app.track === 'backend').length,
      fullstack: applications.filter(app => app.track === 'fullstack').length,
      datascience: applications.filter(app => app.track === 'datascience').length,
    }
  };
};
