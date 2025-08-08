import { db, storage } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Test Firebase Firestore connection
export const testFirestoreConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Testing Firestore connection...');
    
    // Try to add a test document
    const testCollection = collection(db, 'test');
    const testDoc = await addDoc(testCollection, {
      message: 'Firebase connection test',
      timestamp: new Date(),
      testId: Math.random().toString(36).substr(2, 9)
    });
    
    console.log('✅ Firestore test document created:', testDoc.id);
    
    // Try to read documents
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firestore read test successful. Document count:', snapshot.size);
    
    return { 
      success: true, 
      message: `Firestore is working! Test document ID: ${testDoc.id}` 
    };
    
  } catch (error: any) {
    console.error('❌ Firestore connection error:', error);
    
    let message = 'Firestore connection failed: ';
    
    if (error.code === 'permission-denied') {
      message += 'Permission denied. Please check Firestore security rules.';
    } else if (error.code === 'unavailable') {
      message += 'Firestore service is unavailable. Check if Firestore is enabled in Firebase Console.';
    } else if (error.code === 'not-found') {
      message += 'Firestore database not found. Please enable Firestore in Firebase Console.';
    } else {
      message += error.message || 'Unknown error';
    }
    
    return { success: false, message };
  }
};

// Test Firebase Storage connection
export const testStorageConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Testing Storage connection...');
    
    // Create a small test file
    const testContent = 'Firebase Storage test file';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    // Try to upload test file
    const testRef = ref(storage, `test/test_${Date.now()}.txt`);
    const snapshot = await uploadBytes(testRef, testFile);
    
    console.log('✅ Storage upload test successful:', snapshot.ref.fullPath);
    
    // Try to get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Storage download URL test successful:', downloadURL);
    
    return { 
      success: true, 
      message: `Storage is working! Test file uploaded: ${snapshot.ref.name}` 
    };
    
  } catch (error: any) {
    console.error('❌ Storage connection error:', error);
    
    let message = 'Storage connection failed: ';
    
    if (error.code === 'storage/unauthorized') {
      message += 'Permission denied. Please check Storage security rules.';
    } else if (error.code === 'storage/unknown') {
      message += 'Storage service is unavailable. Check if Storage is enabled in Firebase Console.';
    } else if (error.code === 'storage/bucket-not-found') {
      message += 'Storage bucket not found. Please enable Storage in Firebase Console.';
    } else {
      message += error.message || 'Unknown error';
    }
    
    return { success: false, message };
  }
};

// Test complete Firebase setup
export const testFirebaseSetup = async (): Promise<{
  firestore: { success: boolean; message: string };
  storage: { success: boolean; message: string };
}> => {
  console.log('🔥 Starting Firebase setup test...');
  
  const results = {
    firestore: await testFirestoreConnection(),
    storage: await testStorageConnection()
  };
  
  console.log('🔥 Firebase test results:', results);
  
  return results;
};

// Get Firebase configuration info
export const getFirebaseInfo = () => {
  const config = {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  };
  
  console.log('🔥 Firebase Configuration:', config);
  return config;
};
