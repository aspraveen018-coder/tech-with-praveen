import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';

// Your web app's Firebase configuration (paste what you copied)
const firebaseConfig = {
  apiKey: "AIzaSyB-TX8g7UJzL9x7K8mN4cP2rR3sT5vW6yX",
  authDomain: "tech-with-praveen.firebaseapp.com",
  projectId: "tech-with-praveen",
  storageBucket: "tech-with-praveen.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database instance
const db = getDatabase(app);

// User tracking functions
export const userTracking = {
  // Save user after login
  saveUser: async (userData) => {
    try {
      const userRef = ref(db, `users/${userData.email.replace(/\./g, ',')}`);
      const userSnapshot = await new Promise((resolve) => {
        onValue(userRef, (snapshot) => {
          resolve(snapshot.val());
        }, { onlyOnce: true });
      });

      const userTrackingData = {
        ...userData,
        lastLogin: new Date().toISOString(),
        loginCount: userSnapshot ? (userSnapshot.loginCount || 1) + 1 : 1,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      await set(userRef, userTrackingData);
      console.log('User saved to Firebase:', userData.email);
      return userTrackingData;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const usersRef = ref(db, 'users');
      return new Promise((resolve) => {
        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();
          const users = data ? Object.values(data) : [];
          console.log('Fetched users from Firebase:', users.length);
          resolve(users);
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Update user profile
  updateUser: async (email, updates) => {
    try {
      const userRef = ref(db, `users/${email.replace(/\./g, ',')}`);
      await update(userRef, updates);
      console.log('User updated:', email);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
};

export default db;