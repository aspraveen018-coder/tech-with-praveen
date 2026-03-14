import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaBell,
  FaPalette,
  FaGlobe,
  FaSave,
  FaKey,
  FaShieldAlt,
  FaDatabase,
  FaCloudUploadAlt,
  FaTrash,
  FaDownload,
  FaMoon,
  FaSun,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaSync,
  FaHistory,
  FaBriefcase,
  FaShieldVirus,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe as FaGlobeIcon
} from 'react-icons/fa';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: white;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #a0aec0;
  font-size: 1rem;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
`;

const CardIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #00d2ff;
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  flex: 1;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.error ? '#ff6b6b' : 'rgba(0, 210, 255, 0.2)'};
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d2ff;
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  right: 15px;
  color: #a0aec0;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  &:hover {
    color: ${props => props.clickable ? '#00d2ff' : '#a0aec0'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(0, 210, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00d2ff;
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
  }

  option {
    background: #0a0f1f;
    color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(0, 210, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #00d2ff;
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ToggleLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 0.95rem;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #00d2ff;
  }

  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Button = styled(motion.button)`
  padding: 12px 25px;
  background: ${props => props.primary ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent'};
  border: 2px solid ${props => props.primary ? 'transparent' : '#00d2ff'};
  color: ${props => props.primary ? 'white' : '#00d2ff'};
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? '0 10px 20px rgba(0, 210, 255, 0.3)' : '0 10px 20px rgba(0, 210, 255, 0.1)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4caf50;
  color: #4caf50;
  padding: 12px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 12px 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
`;

const InfoBox = styled.div`
  background: rgba(0, 210, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
  font-size: 0.9rem;
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: ${props => props.level === 'high' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)'};
  border: 1px solid ${props => props.level === 'high' ? '#4caf50' : '#ff9800'};
  border-radius: 20px;
  color: ${props => props.level === 'high' ? '#4caf50' : '#ff9800'};
  font-size: 0.85rem;
  margin-top: 10px;
`;

const AdminSettings = () => {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const { exportData, importData, resetToInitial } = useData();
  const { theme: currentTheme, updateTheme } = useTheme();

  // Profile Settings
  const [profile, setProfile] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@techwithpraveen.com',
    bio: user?.bio || 'Tech enthusiast and content creator passionate about helping students learn technology.',
    role: user?.role || 'Administrator',
    department: user?.department || 'Technology',
    location: user?.location || 'Bangalore, India',
    phone: user?.phone || '+91 98765 43210',
    website: user?.website || 'https://techwithpraveen.com'
  });

  // Password Settings
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    newUserAlerts: true,
    contentUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    loginAlerts: true,
    commentNotifications: true,
    jobAlerts: true
  });

  // Site Settings
  const [site, setSite] = useState({
    title: 'Tech with Praveen',
    description: 'Helping students learn technology, find IT jobs, and grow their careers.',
    keywords: 'technology, cloud, devops, ai, jobs, learning',
    language: 'en',
    timezone: 'Asia/Kolkata',
    maintenanceMode: false,
    registrationEnabled: true,
    commentsEnabled: true,
    siteUrl: 'https://techwithpraveen.com',
    adminEmail: 'admin@techwithpraveen.com',
    maxFileSize: 10,
    allowGuestPosts: false,
    enableCache: true,
    enableSSL: true
  });

  // Theme Settings
  const [theme, setTheme] = useState({
    mode: currentTheme?.mode || 'dark',
    accentColor: currentTheme?.accentColor || '#00d2ff',
    sidebarCollapsed: currentTheme?.sidebarCollapsed || false,
    animationsEnabled: currentTheme?.animationsEnabled || true
  });

  // UI States
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'zh', name: 'Chinese' }
  ];

  // Timezones
  const timezones = [
    'Asia/Kolkata',
    'America/New_York',
    'Europe/London',
    'Asia/Dubai',
    'Australia/Sydney',
    'Asia/Tokyo',
    'Europe/Paris',
    'America/Los_Angeles',
    'UTC'
  ];

  // Load settings from localStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      // Load profile settings
      const savedProfile = localStorage.getItem('profile_settings');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
      }

      // Load notification settings
      const savedNotifications = localStorage.getItem('notification_settings');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }

      // Load site settings
      const savedSite = localStorage.getItem('site_settings');
      if (savedSite) {
        setSite(JSON.parse(savedSite));
        applySiteSettings(JSON.parse(savedSite));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const applySiteSettings = (settings) => {
    // Update document title
    document.title = settings.title;
    
    // Update meta tags
    updateMetaTag('description', settings.description);
    updateMetaTag('keywords', settings.keywords);
    
    // Set language
    document.documentElement.lang = settings.language;
  };

  const updateMetaTag = (name, content) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // Profile Settings Functions
  const saveProfileSettings = async () => {
    setIsSaving(true);
    setSaveError('');
    
    try {
      // Validate inputs
      if (!isValidEmail(profile.email)) {
        throw new Error('Invalid email format');
      }

      if (profile.phone && !isValidPhone(profile.phone)) {
        throw new Error('Invalid phone number format');
      }

      // Update user profile in auth context
      if (updateUserProfile) {
        await updateUserProfile(profile);
      }

      // Save to localStorage
      localStorage.setItem('profile_settings', JSON.stringify(profile));
      
      setSaveSuccess(true);
      toast.success('Profile updated successfully!');
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error.message);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Password Change Function - FIXED VERSION
// Password Change Function - FIXED VERSION
const handleChangePassword = async () => {
  if (!validatePassword()) return;
  
  setIsSaving(true);
  setSaveError('');
  
  try {
    // Get stored password from localStorage
    const storedPassword = localStorage.getItem('user_password') || 'admin123';
    
    // Debug logs (remove in production)
    console.log('Current entered:', password.current);
    console.log('Stored password:', storedPassword);
    
    // Verify current password
    if (password.current !== storedPassword) {
      throw new Error('Current password is incorrect');
    }

    // Save new password to localStorage
    localStorage.setItem('user_password', password.new);
    
    // Also update in auth context if available
    if (updateUserPassword) {
      await updateUserPassword(password.new);
    }
    
    // Log password change
    logSecurityEvent('password_changed');

    toast.success('Password changed successfully!');
    setPassword({ current: '', new: '', confirm: '' });
    setPasswordStrength(0);
  } catch (error) {
    setSaveError(error.message);
    toast.error(error.message);
  } finally {
    setIsSaving(false);
  }
};

  // Notification Settings
  const saveNotificationSettings = async () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('notification_settings', JSON.stringify(notifications));
      
      // Apply notification preferences
      applyNotificationSettings(notifications);
      
      toast.success('Notification preferences saved!');
    } catch (error) {
      toast.error('Failed to save notification settings');
    } finally {
      setIsSaving(false);
    }
  };

  const applyNotificationSettings = (settings) => {
    // Here you would integrate with your notification service
    console.log('Notification settings applied:', settings);
  };

  // Site Settings
  const saveSiteSettings = async () => {
    setIsSaving(true);
    
    try {
      // Validate URL
      if (!isValidUrl(site.siteUrl)) {
        throw new Error('Invalid site URL');
      }

      localStorage.setItem('site_settings', JSON.stringify(site));
      applySiteSettings(site);
      
      toast.success('Site settings saved!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Theme Settings
  const saveThemeSettings = async () => {
    setIsSaving(true);
    
    try {
      updateTheme(theme);
      localStorage.setItem('theme_settings', JSON.stringify(theme));
      toast.success('Theme settings saved!');
    } finally {
      setIsSaving(false);
    }
  };

  // Save All Settings
  const saveAllSettings = async () => {
    setIsSaving(true);
    
    try {
      await saveProfileSettings();
      await saveNotificationSettings();
      await saveSiteSettings();
      await saveThemeSettings();
      
      toast.success('All settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save some settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Validation Functions
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validatePassword = () => {
    if (!password.current) {
      setSaveError('Please enter current password');
      return false;
    }
    if (password.new.length < 8) {
      setSaveError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(password.new)) {
      setSaveError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(password.new)) {
      setSaveError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password.new)) {
      setSaveError('Password must contain at least one number');
      return false;
    }
    if (!/[!@#$%^&*]/.test(password.new)) {
      setSaveError('Password must contain at least one special character');
      return false;
    }
    if (password.new !== password.confirm) {
      setSaveError('Passwords do not match');
      return false;
    }
    return true;
  };

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 20;
    if (/[A-Z]/.test(pass)) strength += 20;
    if (/[a-z]/.test(pass)) strength += 20;
    if (/[0-9]/.test(pass)) strength += 20;
    if (/[!@#$%^&*]/.test(pass)) strength += 20;
    return strength;
  };

  const logSecurityEvent = (event, data = {}) => {
    const eventLog = {
      event,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(eventLog);
    localStorage.setItem('security_logs', JSON.stringify(logs.slice(-100)));
  };

  // Handle Input Changes
  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setPassword({
      ...password,
      [e.target.name]: newPass
    });
    
    if (e.target.name === 'new') {
      setPasswordStrength(calculatePasswordStrength(newPass));
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const handleSiteChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSite({
      ...site,
      [e.target.name]: value
    });
  };

  const handleThemeChange = (key, value) => {
    setTheme({
      ...theme,
      [key]: value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  // Data Management
  const handleExportData = () => {
    exportData();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      importData(file);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      resetToInitial();
      toast.success('Data reset to initial state');
    }
  };

  const handleBackupData = () => {
    const data = {
      profile,
      notifications,
      site,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Backup created successfully');
  };

  const handleRestoreData = () => {
    document.getElementById('restore-file').click();
  };

  const handleFileRestore = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const backupData = JSON.parse(event.target.result);
          if (backupData.profile) {
            setProfile(backupData.profile);
            localStorage.setItem('profile_settings', JSON.stringify(backupData.profile));
          }
          if (backupData.notifications) {
            setNotifications(backupData.notifications);
            localStorage.setItem('notification_settings', JSON.stringify(backupData.notifications));
          }
          if (backupData.site) {
            setSite(backupData.site);
            localStorage.setItem('site_settings', JSON.stringify(backupData.site));
            applySiteSettings(backupData.site);
          }
          toast.success('Data restored successfully');
        } catch (error) {
          toast.error('Invalid backup file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all security logs?')) {
      localStorage.setItem('security_logs', '[]');
      toast.success('Security logs cleared');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Settings</Title>
        <Subtitle>Manage your account, site preferences, and security</Subtitle>
      </Header>

      <ButtonGroup style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
        <Button
          primary
          onClick={saveAllSettings}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaSave /> Save All Settings
        </Button>
        <Button
          onClick={loadSettings}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaSync /> Reload Settings
        </Button>
      </ButtonGroup>

      <SettingsGrid>
        {/* Profile Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardHeader>
            <CardIcon>
              <FaUser />
            </CardIcon>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>

          <Form>
            <FormGroup>
              <Label>
                <FaUser /> Full Name
              </Label>
              <Input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaEnvelope /> Email Address
              </Label>
              <Input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
                error={profile.email && !isValidEmail(profile.email)}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaPhone /> Phone Number
              </Label>
              <Input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaMapMarkerAlt /> Location
              </Label>
              <Input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                placeholder="City, Country"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaGlobeIcon /> Website
              </Label>
              <Input
                type="url"
                name="website"
                value={profile.website}
                onChange={handleProfileChange}
                placeholder="https://example.com"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaUser /> Bio
              </Label>
              <TextArea
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                placeholder="Tell us about yourself"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaBriefcase /> Role
              </Label>
              <Input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
                placeholder="Your role"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FaBriefcase /> Department
              </Label>
              <Input
                type="text"
                name="department"
                value={profile.department}
                onChange={handleProfileChange}
                placeholder="Department"
              />
            </FormGroup>

            <ButtonGroup>
              <Button 
                primary 
                onClick={saveProfileSettings}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSave /> {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </ButtonGroup>
          </Form>
        </SettingsCard>

        {/* Password & Security Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardHeader>
            <CardIcon>
              <FaShieldAlt />
            </CardIcon>
            <CardTitle>Password & Security</CardTitle>
          </CardHeader>

          <Form>
            <FormGroup>
              <Label>Current Password</Label>
              <InputWrapper>
                <Input
                  type={showPassword.current ? 'text' : 'password'}
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                <InputIcon 
                  clickable 
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </InputIcon>
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>New Password</Label>
              <InputWrapper>
                <Input
                  type={showPassword.new ? 'text' : 'password'}
                  name="new"
                  value={password.new}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <InputIcon 
                  clickable 
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </InputIcon>
              </InputWrapper>
              {password.new && (
                <>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', marginTop: '5px' }}>
                    <div style={{
                      width: `${passwordStrength}%`,
                      height: '100%',
                      background: passwordStrength < 40 ? '#ff6b6b' : passwordStrength < 70 ? '#ff9800' : '#4caf50',
                      borderRadius: '5px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <SecurityBadge level={passwordStrength >= 70 ? 'high' : 'medium'}>
                    <FaShieldVirus />
                    Password Strength: {passwordStrength >= 70 ? 'Strong' : passwordStrength >= 40 ? 'Medium' : 'Weak'}
                  </SecurityBadge>
                </>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Confirm New Password</Label>
              <InputWrapper>
                <Input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirm"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
                <InputIcon 
                  clickable 
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </InputIcon>
              </InputWrapper>
            </FormGroup>

            <InfoBox>
              <FaInfoCircle /> Password must be at least 8 characters with uppercase, lowercase, number, and special character.
            </InfoBox>

            <ButtonGroup>
              <Button 
                primary 
                onClick={handleChangePassword}
                disabled={isSaving || !password.current || !password.new || !password.confirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaKey /> {isSaving ? 'Changing...' : 'Change Password'}
              </Button>
            </ButtonGroup>
          </Form>
        </SettingsCard>

        {/* Notification Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardHeader>
            <CardIcon>
              <FaBell />
            </CardIcon>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>

          <Form>
            <ToggleContainer>
              <ToggleLabel>
                <FaEnvelope /> Email Notifications
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationChange('emailNotifications')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaBell /> Push Notifications
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={() => handleNotificationChange('pushNotifications')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaEnvelope /> Weekly Digest
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.weeklyDigest}
                  onChange={() => handleNotificationChange('weeklyDigest')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaUser /> New User Alerts
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.newUserAlerts}
                  onChange={() => handleNotificationChange('newUserAlerts')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaBell /> Content Updates
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.contentUpdates}
                  onChange={() => handleNotificationChange('contentUpdates')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaShieldAlt /> Security Alerts
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.securityAlerts}
                  onChange={() => handleNotificationChange('securityAlerts')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaEnvelope /> Login Alerts
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.loginAlerts}
                  onChange={() => handleNotificationChange('loginAlerts')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaEnvelope /> Comment Notifications
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.commentNotifications}
                  onChange={() => handleNotificationChange('commentNotifications')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaBriefcase /> Job Alerts
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={notifications.jobAlerts}
                  onChange={() => handleNotificationChange('jobAlerts')}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ButtonGroup>
              <Button 
                primary 
                onClick={saveNotificationSettings}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSave /> Save Preferences
              </Button>
            </ButtonGroup>
          </Form>
        </SettingsCard>

        {/* Site Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CardHeader>
            <CardIcon>
              <FaGlobe />
            </CardIcon>
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>

          <Form>
            <FormGroup>
              <Label>Site Title</Label>
              <Input
                type="text"
                name="title"
                value={site.title}
                onChange={handleSiteChange}
                placeholder="Enter site title"
              />
            </FormGroup>

            <FormGroup>
              <Label>Site Description</Label>
              <TextArea
                name="description"
                value={site.description}
                onChange={handleSiteChange}
                placeholder="Enter site description"
              />
              <small style={{ color: '#a0aec0' }}>
                This will appear in search engine results
              </small>
            </FormGroup>

            <FormGroup>
              <Label>Meta Keywords</Label>
              <Input
                type="text"
                name="keywords"
                value={site.keywords}
                onChange={handleSiteChange}
                placeholder="technology, cloud, devops, ai"
              />
            </FormGroup>

            <FormGroup>
              <Label>Site URL</Label>
              <Input
                type="url"
                name="siteUrl"
                value={site.siteUrl}
                onChange={handleSiteChange}
                placeholder="https://example.com"
              />
            </FormGroup>

            <FormGroup>
              <Label>Admin Email</Label>
              <Input
                type="email"
                name="adminEmail"
                value={site.adminEmail}
                onChange={handleSiteChange}
                placeholder="admin@example.com"
              />
            </FormGroup>

            <FormGroup>
              <Label>Language</Label>
              <Select name="language" value={site.language} onChange={handleSiteChange}>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Timezone</Label>
              <Select name="timezone" value={site.timezone} onChange={handleSiteChange}>
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Max File Size (MB)</Label>
              <Input
                type="number"
                name="maxFileSize"
                value={site.maxFileSize}
                onChange={handleSiteChange}
                min="1"
                max="100"
              />
            </FormGroup>

            <ToggleContainer>
              <ToggleLabel>
                <FaGlobe /> Maintenance Mode
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  name="maintenanceMode"
                  checked={site.maintenanceMode}
                  onChange={handleSiteChange}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaUser /> User Registration
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  name="registrationEnabled"
                  checked={site.registrationEnabled}
                  onChange={handleSiteChange}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaEnvelope /> Comments
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  name="commentsEnabled"
                  checked={site.commentsEnabled}
                  onChange={handleSiteChange}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaEnvelope /> Allow Guest Posts
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  name="allowGuestPosts"
                  checked={site.allowGuestPosts}
                  onChange={handleSiteChange}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaDatabase /> Enable Cache
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  name="enableCache"
                  checked={site.enableCache}
                  onChange={handleSiteChange}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaShieldAlt /> Enable SSL
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  name="enableSSL"
                  checked={site.enableSSL}
                  onChange={handleSiteChange}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ButtonGroup>
              <Button 
                primary 
                onClick={saveSiteSettings}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSave /> Save Site Settings
              </Button>
            </ButtonGroup>
          </Form>
        </SettingsCard>

        {/* Theme Settings */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CardHeader>
            <CardIcon>
              <FaPalette />
            </CardIcon>
            <CardTitle>Theme Settings</CardTitle>
          </CardHeader>

          <Form>
            <FormGroup>
              <Label>Theme Mode</Label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <Button
                  onClick={() => handleThemeChange('mode', 'dark')}
                  style={{
                    background: theme.mode === 'dark' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
                    border: '2px solid #00d2ff',
                    color: theme.mode === 'dark' ? 'white' : '#00d2ff',
                    flex: 1
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaMoon /> Dark
                </Button>
                <Button
                  onClick={() => handleThemeChange('mode', 'light')}
                  style={{
                    background: theme.mode === 'light' ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent',
                    border: '2px solid #00d2ff',
                    color: theme.mode === 'light' ? 'white' : '#00d2ff',
                    flex: 1
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaSun /> Light
                </Button>
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Accent Color</Label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['#00d2ff', '#ff6b6b', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4', '#ffc107'].map(color => (
                  <ColorButton
                    key={color}
                    color={color}
                    selected={theme.accentColor === color}
                    onClick={() => handleThemeChange('accentColor', color)}
                  />
                ))}
              </div>
            </FormGroup>

            <ToggleContainer>
              <ToggleLabel>
                <FaPalette /> Sidebar Collapsed
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={theme.sidebarCollapsed}
                  onChange={(e) => handleThemeChange('sidebarCollapsed', e.target.checked)}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ToggleContainer>
              <ToggleLabel>
                <FaPalette /> Animations Enabled
              </ToggleLabel>
              <Toggle>
                <ToggleInput
                  type="checkbox"
                  checked={theme.animationsEnabled}
                  onChange={(e) => handleThemeChange('animationsEnabled', e.target.checked)}
                />
                <ToggleSlider />
              </Toggle>
            </ToggleContainer>

            <ButtonGroup>
              <Button 
                primary 
                onClick={saveThemeSettings}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSave /> Apply Theme
              </Button>
            </ButtonGroup>
          </Form>
        </SettingsCard>

        {/* Security Logs */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CardHeader>
            <CardIcon>
              <FaHistory />
            </CardIcon>
            <CardTitle>Security Logs</CardTitle>
          </CardHeader>

          <Form>
            <InfoBox>
              <FaInfoCircle /> Last 100 security events are logged
            </InfoBox>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {JSON.parse(localStorage.getItem('security_logs') || '[]').map((log, index) => (
                <div key={index} style={{
                  padding: '10px',
                  borderBottom: '1px solid rgba(0,210,255,0.1)',
                  fontSize: '0.85rem',
                  color: '#a0aec0'
                }}>
                  <div><strong>{log.event}</strong> - {new Date(log.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleClearLogs}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%' }}
            >
              <FaTrash /> Clear Logs
            </Button>
          </Form>
        </SettingsCard>

        {/* Data Management */}
        <SettingsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <CardHeader>
            <CardIcon>
              <FaDatabase />
            </CardIcon>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>

          <Form>
            <FormGroup>
              <Label>Export Data</Label>
              <Button 
                onClick={handleExportData}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%' }}
              >
                <FaDownload /> Export All Data
              </Button>
            </FormGroup>

            <FormGroup>
              <Label>Import Data</Label>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
                id="import-file"
              />
              <Button
                as="label"
                htmlFor="import-file"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', cursor: 'pointer' }}
              >
                <FaCloudUploadAlt /> Import Data
              </Button>
            </FormGroup>

            <FormGroup>
              <Label>Backup & Restore</Label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  onClick={handleBackupData}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
                >
                  <FaDatabase /> Backup
                </Button>
                <Button
                  onClick={handleRestoreData}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
                >
                  <FaSync /> Restore
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  style={{ display: 'none' }}
                  id="restore-file"
                />
              </div>
            </FormGroup>

            <FormGroup>
              <Label>Reset Data</Label>
              <Button
                onClick={handleResetData}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ 
                  width: '100%',
                  background: 'rgba(255,107,107,0.1)',
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b'
                }}
              >
                <FaTrash /> Reset to Initial State
              </Button>
            </FormGroup>

            <InfoBox>
              <FaInfoCircle /> Data export includes all resources, jobs, roadmaps, sessions, and user data.
            </InfoBox>
          </Form>
        </SettingsCard>
      </SettingsGrid>

      {saveSuccess && (
        <SuccessMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ marginTop: '20px' }}
        >
          <FaCheck /> Settings saved successfully!
        </SuccessMessage>
      )}

      {saveError && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{ marginTop: '20px' }}
        >
          <FaTimes /> {saveError}
        </ErrorMessage>
      )}
    </Container>
  );
};

// Helper Components
const ColorButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 3px solid ${props => props.selected ? 'white' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export default AdminSettings;