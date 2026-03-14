import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, update, get, child } from 'firebase/database';

// Your web app's Firebase configuration
// IMPORTANT: Add your databaseURL from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB-TX8g7UJzL9x7K8mN4cP2rR3sT5vW6yX",
  authDomain: "tech-with-praveen.firebaseapp.com",
  databaseURL: "https://tech-with-praveen-e8e89-default-rtdb.firebaseio.com", // YOU MUST ADD THIS!
  projectId: "tech-with-praveen",
  storageBucket: "tech-with-praveen.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database instance
const db = getDatabase(app);

// Test function to verify Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    console.log('📊 Database URL:', firebaseConfig.databaseURL);
    
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'users'));
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      console.log('✅ Firebase connected! Users found:', Object.keys(users).length);
    } else {
      console.log('✅ Firebase connected! No users yet.');
    }
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};

// Call test on init
testFirebaseConnection();

// Helper function to encode email for Firebase keys (dots aren't allowed)
const encodeEmail = (email) => {
  return email.replace(/\./g, ',');
};

// User tracking functions
export const userTracking = {
  // Save user after login
  saveUser: async (userData) => {
    try {
      console.log('💾 Attempting to save user to Firebase:', userData.email);
      
      const userKey = encodeEmail(userData.email);
      const userRef = ref(db, `users/${userKey}`);
      
      // Get existing user data if any
      const snapshot = await get(userRef);
      const existingUser = snapshot.val();

      const userTrackingData = {
        ...userData,
        lastLogin: new Date().toISOString(),
        loginCount: existingUser ? (existingUser.loginCount || 1) + 1 : 1,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      await set(userRef, userTrackingData);
      console.log('✅ User saved to Firebase:', userData.email);
      console.log('📊 Login count:', userTrackingData.loginCount);
      
      return userTrackingData;
    } catch (error) {
      console.error('❌ Error saving user to Firebase:', error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      console.log('📊 Fetching all users from Firebase...');
      
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const users = Object.values(data);
        console.log('✅ Fetched users from Firebase:', users.length);
        return users;
      } else {
        console.log('📭 No users found in Firebase');
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching users from Firebase:', error);
      return [];
    }
  },

  // Update user profile
  updateUser: async (email, updates) => {
    try {
      console.log('🔄 Updating user in Firebase:', email);
      
      const userKey = encodeEmail(email);
      const userRef = ref(db, `users/${userKey}`);
      
      await update(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ User updated in Firebase:', email);
      return true;
    } catch (error) {
      console.error('❌ Error updating user in Firebase:', error);
      return false;
    }
  },

  // Get single user by email
  getUserByEmail: async (email) => {
    try {
      const userKey = encodeEmail(email);
      const userRef = ref(db, `users/${userKey}`);
      const snapshot = await get(userRef);
      
      return snapshot.val();
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      return null;
    }
  }
};

export default db;