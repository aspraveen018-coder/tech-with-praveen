/**
 * Storage Service
 * Handles all localStorage operations for the application
 * Provides methods for CRUD operations on different data types
 */

// Storage keys
const STORAGE_KEYS = {
  AUTH: 'techwithpraveen_auth',
  DATA: 'techwithpraveen_data',
  SETTINGS: 'techwithpraveen_settings',
  CACHE: 'techwithpraveen_cache',
  ANALYTICS: 'techwithpraveen_analytics',
  USER_PREFERENCES: 'techwithpraveen_preferences'
};

// Cache expiration times (in milliseconds)
const CACHE_EXPIRY = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  WEEK: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * Save data to localStorage with optional encryption
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 * @param {boolean} encrypt - Whether to encrypt the data
 * @returns {boolean} - Success status
 */
export const saveToStorage = (key, data, encrypt = false) => {
  try {
    let storageData = data;
    
    // Add metadata
    const dataWithMeta = {
      data: storageData,
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    // Convert to string
    let stringData = JSON.stringify(dataWithMeta);

    // Optional encryption (simple base64 for demo, use proper encryption in production)
    if (encrypt) {
      stringData = btoa(stringData);
    }

    localStorage.setItem(key, stringData);
    
    // Dispatch storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: stringData,
      oldValue: localStorage.getItem(key)
    }));

    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Load data from localStorage with optional decryption
 * @param {string} key - Storage key
 * @param {boolean} decrypt - Whether to decrypt the data
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Retrieved data or default value
 */
export const loadFromStorage = (key, decrypt = false, defaultValue = null) => {
  try {
    let stringData = localStorage.getItem(key);
    
    if (!stringData) {
      return defaultValue;
    }

    // Optional decryption
    if (decrypt) {
      stringData = atob(stringData);
    }

    const parsed = JSON.parse(stringData);
    
    // Check if data has metadata wrapper
    if (parsed && parsed.meta && parsed.data !== undefined) {
      return parsed.data;
    }

    return parsed;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - Success status
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    
    // Dispatch event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: key,
      newValue: null,
      oldValue: localStorage.getItem(key)
    }));

    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clear all application data from localStorage
 * @param {boolean} keepAuth - Whether to keep authentication data
 * @returns {boolean} - Success status
 */
export const clearAllStorage = (keepAuth = true) => {
  try {
    const authData = keepAuth ? localStorage.getItem(STORAGE_KEYS.AUTH) : null;
    
    localStorage.clear();
    
    if (keepAuth && authData) {
      localStorage.setItem(STORAGE_KEYS.AUTH, authData);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Save authentication data
 * @param {Object} authData - Authentication data
 * @returns {boolean} - Success status
 */
export const saveAuth = (authData) => {
  return saveToStorage(STORAGE_KEYS.AUTH, authData, true);
};

/**
 * Load authentication data
 * @returns {Object|null} - Authentication data
 */
export const loadAuth = () => {
  return loadFromStorage(STORAGE_KEYS.AUTH, true, null);
};

/**
 * Clear authentication data
 * @returns {boolean} - Success status
 */
export const clearAuth = () => {
  return removeFromStorage(STORAGE_KEYS.AUTH);
};

/**
 * Save application data
 * @param {Object} data - Application data
 * @returns {boolean} - Success status
 */
export const saveData = (data) => {
  return saveToStorage(STORAGE_KEYS.DATA, data);
};

/**
 * Load application data
 * @returns {Object|null} - Application data
 */
export const loadData = () => {
  return loadFromStorage(STORAGE_KEYS.DATA, false, null);
};

/**
 * Save user settings
 * @param {Object} settings - User settings
 * @returns {boolean} - Success status
 */
export const saveSettings = (settings) => {
  return saveToStorage(STORAGE_KEYS.SETTINGS, settings);
};

/**
 * Load user settings
 * @returns {Object|null} - User settings
 */
export const loadSettings = () => {
  return loadFromStorage(STORAGE_KEYS.SETTINGS, false, {
    theme: 'dark',
    notifications: true,
    language: 'en',
    itemsPerPage: 20
  });
};

/**
 * Save to cache with expiration
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {string} duration - Cache duration (SHORT, MEDIUM, LONG, WEEK)
 * @returns {boolean} - Success status
 */
export const saveToCache = (key, data, duration = 'MEDIUM') => {
  try {
    const cacheData = {
      data,
      expiresAt: Date.now() + CACHE_EXPIRY[duration]
    };
    
    const cacheKey = `${STORAGE_KEYS.CACHE}_${key}`;
    return saveToStorage(cacheKey, cacheData);
  } catch (error) {
    console.error('Error saving to cache:', error);
    return false;
  }
};

/**
 * Load from cache
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const loadFromCache = (key) => {
  try {
    const cacheKey = `${STORAGE_KEYS.CACHE}_${key}`;
    const cacheData = loadFromStorage(cacheKey);
    
    if (!cacheData) return null;
    
    // Check if cache has expired
    if (cacheData.expiresAt && Date.now() > cacheData.expiresAt) {
      removeFromStorage(cacheKey);
      return null;
    }
    
    return cacheData.data;
  } catch (error) {
    console.error('Error loading from cache:', error);
    return null;
  }
};

/**
 * Clear expired cache entries
 * @returns {number} - Number of cleared entries
 */
export const clearExpiredCache = () => {
  try {
    let clearedCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith(STORAGE_KEYS.CACHE)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.expiresAt && Date.now() > data.expiresAt) {
            localStorage.removeItem(key);
            clearedCount++;
          }
        } catch {
          // If data is corrupted, remove it
          localStorage.removeItem(key);
          clearedCount++;
        }
      }
    }
    
    return clearedCount;
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    return 0;
  }
};

/**
 * Save analytics data
 * @param {Object} analytics - Analytics data
 * @returns {boolean} - Success status
 */
export const saveAnalytics = (analytics) => {
  return saveToStorage(STORAGE_KEYS.ANALYTICS, analytics);
};

/**
 * Load analytics data
 * @returns {Object|null} - Analytics data
 */
export const loadAnalytics = () => {
  return loadFromStorage(STORAGE_KEYS.ANALYTICS, false, {
    pageViews: {},
    events: [],
    sessions: []
  });
};

/**
 * Save user preferences
 * @param {Object} preferences - User preferences
 * @returns {boolean} - Success status
 */
export const savePreferences = (preferences) => {
  return saveToStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

/**
 * Load user preferences
 * @returns {Object|null} - User preferences
 */
export const loadPreferences = () => {
  return loadFromStorage(STORAGE_KEYS.USER_PREFERENCES, false, {
    sidebarCollapsed: false,
    recentSearches: [],
    favorites: [],
    lastVisited: []
  });
};

/**
 * Add to recent searches
 * @param {string} searchQuery - Search query
 * @param {number} limit - Maximum number of recent searches to keep
 * @returns {boolean} - Success status
 */
export const addRecentSearch = (searchQuery, limit = 10) => {
  try {
    const preferences = loadPreferences();
    
    if (!preferences.recentSearches) {
      preferences.recentSearches = [];
    }
    
    // Remove if already exists
    preferences.recentSearches = preferences.recentSearches.filter(
      s => s.query !== searchQuery
    );
    
    // Add to beginning
    preferences.recentSearches.unshift({
      query: searchQuery,
      timestamp: new Date().toISOString()
    });
    
    // Limit the number
    if (preferences.recentSearches.length > limit) {
      preferences.recentSearches = preferences.recentSearches.slice(0, limit);
    }
    
    return savePreferences(preferences);
  } catch (error) {
    console.error('Error adding recent search:', error);
    return false;
  }
};

/**
 * Get recent searches
 * @param {number} limit - Maximum number to return
 * @returns {Array} - Recent searches
 */
export const getRecentSearches = (limit = 5) => {
  const preferences = loadPreferences();
  return (preferences.recentSearches || []).slice(0, limit);
};

/**
 * Add to favorites
 * @param {string} type - Item type (resource, job, roadmap, etc.)
 * @param {string} id - Item ID
 * @param {Object} metadata - Additional metadata
 * @returns {boolean} - Success status
 */
export const addToFavorites = (type, id, metadata = {}) => {
  try {
    const preferences = loadPreferences();
    
    if (!preferences.favorites) {
      preferences.favorites = [];
    }
    
    // Check if already exists
    const exists = preferences.favorites.some(
      f => f.type === type && f.id === id
    );
    
    if (!exists) {
      preferences.favorites.push({
        type,
        id,
        ...metadata,
        addedAt: new Date().toISOString()
      });
    }
    
    return savePreferences(preferences);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

/**
 * Remove from favorites
 * @param {string} type - Item type
 * @param {string} id - Item ID
 * @returns {boolean} - Success status
 */
export const removeFromFavorites = (type, id) => {
  try {
    const preferences = loadPreferences();
    
    if (preferences.favorites) {
      preferences.favorites = preferences.favorites.filter(
        f => !(f.type === type && f.id === id)
      );
    }
    
    return savePreferences(preferences);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

/**
 * Check if item is in favorites
 * @param {string} type - Item type
 * @param {string} id - Item ID
 * @returns {boolean} - True if in favorites
 */
export const isFavorite = (type, id) => {
  const preferences = loadPreferences();
  return (preferences.favorites || []).some(
    f => f.type === type && f.id === id
  );
};

/**
 * Get all favorites
 * @returns {Array} - Favorites list
 */
export const getFavorites = () => {
  const preferences = loadPreferences();
  return preferences.favorites || [];
};

/**
 * Get storage usage statistics
 * @returns {Object} - Storage usage stats
 */
export const getStorageStats = () => {
  try {
    let totalSize = 0;
    const items = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const size = new Blob([value]).size;
      
      totalSize += size;
      items.push({
        key,
        size,
        sizeFormatted: formatBytes(size)
      });
    }
    
    return {
      totalSize,
      totalSizeFormatted: formatBytes(totalSize),
      itemCount: localStorage.length,
      items,
      quota: 5 * 1024 * 1024, // Approximate 5MB quota
      usagePercentage: (totalSize / (5 * 1024 * 1024)) * 100
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};

/**
 * Format bytes to human readable string
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Decimal places
 * @returns {string} - Formatted string
 */
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Check if localStorage is available
 * @returns {boolean} - True if available
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Migrate data from old version
 * @param {Object} oldData - Old data structure
 * @returns {Object} - Migrated data
 */
export const migrateData = (oldData) => {
  // Handle different versions of data structure
  const migratedData = {
    resources: oldData.resources || [],
    jobs: oldData.jobs || [],
    roadmaps: oldData.roadmaps || [],
    sessions: oldData.sessions || [],
    downloads: oldData.downloads || [],
    recentLinks: oldData.recentLinks || [],
    community: oldData.community || {},
    analytics: oldData.analytics || {},
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  };
  
  // Add missing fields or transform data as needed
  if (oldData.version === '0.9.0') {
    // Handle migration from older version
    migratedData.resources = migratedData.resources.map(r => ({
      ...r,
      createdAt: r.createdAt || new Date().toISOString(),
      updatedAt: r.updatedAt || new Date().toISOString()
    }));
  }
  
  return migratedData;
};

/**
 * Backup all data
 * @returns {Object} - Backup object
 */
export const createBackup = () => {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data: {
        auth: loadAuth(),
        settings: loadSettings(),
        preferences: loadPreferences(),
        analytics: loadAnalytics(),
        appData: loadData()
      }
    };
    
    return backup;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
};

/**
 * Restore from backup
 * @param {Object} backup - Backup object
 * @returns {boolean} - Success status
 */
export const restoreFromBackup = (backup) => {
  try {
    if (!backup || !backup.data) {
      throw new Error('Invalid backup data');
    }
    
    if (backup.data.auth) saveAuth(backup.data.auth);
    if (backup.data.settings) saveSettings(backup.data.settings);
    if (backup.data.preferences) savePreferences(backup.data.preferences);
    if (backup.data.analytics) saveAnalytics(backup.data.analytics);
    if (backup.data.appData) saveData(backup.data.appData);
    
    return true;
  } catch (error) {
    console.error('Error restoring from backup:', error);
    return false;
  }
};

// Export all storage keys for external use
export const storageKeys = STORAGE_KEYS;

// Export cache expiry constants
export const cacheExpiry = CACHE_EXPIRY;

// Default export with all methods
export default {
  // Core methods
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearAllStorage,
  
  // Auth methods
  saveAuth,
  loadAuth,
  clearAuth,
  
  // Data methods
  saveData,
  loadData,
  
  // Settings methods
  saveSettings,
  loadSettings,
  
  // Cache methods
  saveToCache,
  loadFromCache,
  clearExpiredCache,
  
  // Analytics methods
  saveAnalytics,
  loadAnalytics,
  
  // Preferences methods
  savePreferences,
  loadPreferences,
  addRecentSearch,
  getRecentSearches,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavorites,
  
  // Utility methods
  getStorageStats,
  isStorageAvailable,
  migrateData,
  createBackup,
  restoreFromBackup,
  
  // Constants
  storageKeys,
  cacheExpiry
};