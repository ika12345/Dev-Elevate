import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  track: string;
  message: string;
  resume?: File;
}

export interface ApplicationSubmission {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  track: string;
  message: string;
  resumeUrl?: string;
  resumeFileName?: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: any;
  updatedAt: any;
}

/**
 * Upload resume file to Firebase Storage
 */
export const uploadResume = async (file: File, applicationId: string): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `resumes/${applicationId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume. Please try again.');
  }
};

/**
 * Submit application to Firestore
 */
export const submitApplication = async (applicationData: ApplicationData): Promise<string> => {
  try {
    // First, create the application document without resume URL
    const applicationDoc: Omit<ApplicationSubmission, 'id'> = {
      fullName: applicationData.fullName,
      email: applicationData.email,
      phone: applicationData.phone,
      track: applicationData.track,
      message: applicationData.message,
      status: 'pending',
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add the document to Firestore
    const docRef = await addDoc(collection(db, 'applications'), applicationDoc);
    const applicationId = docRef.id;

    // If there's a resume, upload it and update the document
    if (applicationData.resume) {
      try {
        const resumeUrl = await uploadResume(applicationData.resume, applicationId);
        
        // Update the document with resume information
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'applications', applicationId), {
          resumeUrl: resumeUrl,
          resumeFileName: applicationData.resume.name,
          updatedAt: serverTimestamp(),
        });
      } catch (resumeError) {
        console.error('Error uploading resume, but application was saved:', resumeError);
        // Don't throw here - the application was still saved
      }
    }

    return applicationId;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error('Failed to submit application. Please try again.');
  }
};

/**
 * Get all applications (for admin use)
 */
export const getApplications = async (): Promise<ApplicationSubmission[]> => {
  try {
    const { getDocs, query, orderBy } = await import('firebase/firestore');
    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const applications: ApplicationSubmission[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...doc.data(),
      } as ApplicationSubmission);
    });
    
    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw new Error('Failed to fetch applications.');
  }
};

/**
 * Update application status (for admin use)
 */
export const updateApplicationStatus = async (
  applicationId: string, 
  status: ApplicationSubmission['status']
): Promise<void> => {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'applications', applicationId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update application status.');
  }
};
