import { 
  collection, 
  addDoc, 
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../utils/firebase';

export interface ApplicationData {
  fullName: string;
  email: string;
  phoneNumber: string;
  track: 'frontend' | 'backend' | 'fullstack' | 'datascience';
  message?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: any; // Firestore timestamp
  userId?: string; // Optional: link to authenticated user
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  track: string;
  message: string;
  resume: File | null;
}

// Upload resume file to Firebase Storage
export const uploadResume = async (file: File, applicationId: string): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `resumes/${applicationId}_${timestamp}_${sanitizedFileName}`;
    
    // Create storage reference
    const storageRef = ref(storage, fileName);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume. Please try again.');
  }
};

// Submit application to Firestore
export const submitApplication = async (formData: ApplicationFormData): Promise<string> => {
  try {
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

    // Check for duplicate email
    const applicationsRef = collection(db, 'applications');
    const emailQuery = query(applicationsRef, where('email', '==', formData.email));
    const existingApplications = await getDocs(emailQuery);
    
    if (!existingApplications.empty) {
      throw new Error('An application with this email already exists');
    }

    // Create application document (without resume URL first)
    const applicationData: Partial<ApplicationData> = {
      fullName: formData.fullName.trim(),
      email: formData.email.toLowerCase().trim(),
      phoneNumber: formData.phoneNumber.trim(),
      track: formData.track as ApplicationData['track'],
      message: formData.message?.trim() || '',
      status: 'pending',
      submittedAt: serverTimestamp(),
    };

    // Upload resume first if exists
    let resumeUrl = '';
    let resumeFileName = '';
    if (formData.resume) {
      // Generate a temporary ID for storage
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      resumeUrl = await uploadResume(formData.resume, tempId);
      resumeFileName = formData.resume.name;
    }

    // Add complete document to Firestore
    const completeApplicationData = {
      ...applicationData,
      resumeUrl,
      resumeFileName,
    };

    const docRef = await addDoc(applicationsRef, completeApplicationData);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting application:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to submit application. Please try again.');
  }
};

// Get all applications (for admin use)
export const getAllApplications = async (): Promise<ApplicationData[]> => {
  try {
    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const applications: ApplicationData[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({ ...doc.data(), id: doc.id } as ApplicationData);
    });
    
    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw new Error('Failed to fetch applications');
  }
};

// Get applications by email
export const getApplicationsByEmail = async (email: string): Promise<ApplicationData[]> => {
  try {
    const applicationsRef = collection(db, 'applications');
    const q = query(
      applicationsRef, 
      where('email', '==', email.toLowerCase()),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const applications: ApplicationData[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({ ...doc.data(), id: doc.id } as ApplicationData);
    });
    
    return applications;
  } catch (error) {
    console.error('Error fetching applications by email:', error);
    throw new Error('Failed to fetch applications');
  }
};

// Delete resume from storage
export const deleteResume = async (resumeUrl: string): Promise<void> => {
  try {
    const storageRef = ref(storage, resumeUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting resume:', error);
    // Don't throw error for file deletion failures
  }
};

// Helper function to format track names
export const formatTrackName = (track: string): string => {
  switch (track) {
    case 'frontend':
      return 'Frontend Development';
    case 'backend':
      return 'Backend Development';
    case 'fullstack':
      return 'Fullstack Development';
    case 'datascience':
      return 'Data Science';
    default:
      return track;
  }
};

// Helper function to get track icon
export const getTrackIcon = (track: string): string => {
  switch (track) {
    case 'frontend':
      return '🎨';
    case 'backend':
      return '⚙️';
    case 'fullstack':
      return '🌐';
    case 'datascience':
      return '📊';
    default:
      return '💻';
  }
};
