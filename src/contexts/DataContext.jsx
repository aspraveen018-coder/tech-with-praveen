import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loadData, saveData } from '../services/storage';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

export const DataContext = createContext();

// Initial dummy data for the application
const initialData = {
  resources: [
    {
      id: '1',
      icon: 'FaCertificate',
      title: 'Free Certifications',
      links: [
        { text: 'AWS Certified Cloud Practitioner - Free Course', url: '#' },
        { text: 'Google Cloud Digital Leader Certification', url: '#' },
        { text: 'Microsoft Azure Fundamentals AZ-900', url: '#' },
        { text: 'DevOps Foundation Certification', url: '#' }
      ],
      likes: 245,
      saves: 123,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      icon: 'FaRobot',
      title: 'AI Tools',
      links: [
        { text: 'Top 10 AI Tools for Developers 2024', url: '#' },
        { text: 'ChatGPT Prompts for Coding', url: '#' },
        { text: 'AI-Powered Development Tools', url: '#' },
        { text: 'Machine Learning Resources', url: '#' }
      ],
      likes: 189,
      saves: 98,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      icon: 'FaCloud',
      title: 'Cloud Learning',
      links: [
        { text: 'AWS Complete Roadmap 2024', url: '#' },
        { text: 'Azure Administrator Associate Guide', url: '#' },
        { text: 'Google Cloud Associate Engineer Path', url: '#' },
        { text: 'Multi-Cloud Strategy Guide', url: '#' }
      ],
      likes: 312,
      saves: 156,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      icon: 'FaRoad',
      title: 'DevOps Roadmap',
      links: [
        { text: 'Complete DevOps Learning Path', url: '#' },
        { text: 'Docker Mastery Course', url: '#' },
        { text: 'Kubernetes for Beginners', url: '#' },
        { text: 'Jenkins CI/CD Pipeline Guide', url: '#' }
      ],
      likes: 567,
      saves: 289,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      icon: 'FaPython',
      title: 'Python Full Stack',
      links: [
        { text: 'Python Django Complete Course', url: '#' },
        { text: 'Flask Web Development Guide', url: '#' },
        { text: 'FastAPI for Beginners', url: '#' },
        { text: 'Python with React Integration', url: '#' }
      ],
      likes: 423,
      saves: 201,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '6',
      icon: 'FaCode',
      title: 'Web Development',
      links: [
        { text: 'HTML/CSS Mastery Course', url: '#' },
        { text: 'JavaScript Complete Guide', url: '#' },
        { text: 'React.js Advanced Concepts', url: '#' },
        { text: 'Node.js Backend Development', url: '#' }
      ],
      likes: 678,
      saves: 345,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  
  jobs: [
    {
      id: '1',
      company: 'Google',
      role: 'Cloud Engineer',
      location: 'Bangalore, India',
      applyLink: '#',
      postedDate: '2024-01-15',
      type: 'Full-time',
      salary: '₹25L - ₹35L',
      description: 'Looking for experienced Cloud Engineer...',
      likes: 89,
      saves: 45,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      company: 'Microsoft',
      role: 'DevOps Specialist',
      location: 'Hyderabad, India (Remote)',
      applyLink: '#',
      postedDate: '2024-01-14',
      type: 'Full-time',
      salary: '₹20L - ₹30L',
      description: 'Seeking DevOps engineer with Kubernetes experience...',
      likes: 67,
      saves: 34,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      company: 'Amazon',
      role: 'Python Developer',
      location: 'Chennai, India',
      applyLink: '#',
      postedDate: '2024-01-13',
      type: 'Full-time',
      salary: '₹18L - ₹25L',
      description: 'Python developer with Django experience needed...',
      likes: 45,
      saves: 23,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      company: 'Netflix',
      role: 'Site Reliability Engineer',
      location: 'Remote, India',
      applyLink: '#',
      postedDate: '2024-01-12',
      type: 'Full-time',
      salary: '₹30L - ₹45L',
      description: 'SRE with strong AWS and automation skills...',
      likes: 123,
      saves: 67,
      createdAt: new Date().toISOString()
    }
  ],
  
  roadmaps: [
    {
      id: '1',
      title: 'Cloud Engineer',
      description: 'Complete path to become a Cloud Engineer in 6 months',
      steps: [
        'Learn Linux Fundamentals',
        'Master AWS/Azure Basics',
        'Networking Essentials',
        'Security Best Practices',
        'Infrastructure as Code (Terraform)',
        'CI/CD Pipeline Integration',
        'Monitoring & Logging',
        'Cost Optimization',
        'Advanced Cloud Architecture'
      ],
      resources: [
        'AWS Certified Solutions Architect Course',
        'Terraform: Up & Running Book',
        'Linux Command Line Tutorial',
        'Cloud Security Professional Guide'
      ],
      duration: '6 months',
      level: 'Beginner to Intermediate',
      likes: 234,
      saves: 123,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'DevOps Engineer',
      description: 'Master DevOps practices and tools',
      steps: [
        'Version Control (Git)',
        'CI/CD with Jenkins',
        'Containerization (Docker)',
        'Orchestration (Kubernetes)',
        'Configuration Management (Ansible)',
        'Infrastructure as Code',
        'Monitoring (Prometheus/Grafana)',
        'Cloud Platforms',
        'Security in DevOps'
      ],
      resources: [
        'Docker Mastery Course',
        'Kubernetes Certified Administrator Guide',
        'Jenkins Pipeline Tutorials',
        'Site Reliability Engineering Book'
      ],
      duration: '8 months',
      level: 'Intermediate',
      likes: 456,
      saves: 234,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Python Full Stack Developer',
      description: 'Become a full-stack Python developer',
      steps: [
        'Python Fundamentals',
        'Django/Flask Framework',
        'Database Design (SQL/NoSQL)',
        'REST API Development',
        'Frontend Basics (HTML/CSS/JS)',
        'React Integration',
        'Authentication & Authorization',
        'Testing & Debugging',
        'Deployment & DevOps'
      ],
      resources: [
        'Python Crash Course Book',
        'Django for Professionals',
        'React with Python Course',
        'Full Stack Python Guide'
      ],
      duration: '9 months',
      level: 'Beginner to Advanced',
      likes: 345,
      saves: 178,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Web Development',
      description: 'Modern web development journey',
      steps: [
        'HTML5 & CSS3',
        'JavaScript ES6+',
        'Responsive Design',
        'React.js Mastery',
        'State Management',
        'API Integration',
        'Performance Optimization',
        'Testing',
        'Deployment'
      ],
      resources: [
        'The Complete JavaScript Course',
        'React - The Complete Guide',
        'Modern CSS with Tailwind',
        'Web Performance Optimization'
      ],
      duration: '7 months',
      level: 'Beginner to Advanced',
      likes: 567,
      saves: 289,
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      title: 'AI Tools & ML',
      description: 'Learn AI tools and machine learning',
      steps: [
        'Python for AI',
        'Data Science Basics',
        'Machine Learning Algorithms',
        'Deep Learning',
        'NLP Fundamentals',
        'Computer Vision',
        'LLMs & Prompt Engineering',
        'AI Tools & Frameworks',
        'Model Deployment'
      ],
      resources: [
        'Machine Learning Course',
        'Deep Learning Specialization',
        'Hugging Face Tutorials',
        'LangChain Guide'
      ],
      duration: '10 months',
      level: 'Intermediate',
      likes: 189,
      saves: 98,
      createdAt: new Date().toISOString()
    }
  ],
  
  sessions: [
    {
      id: '1',
      title: 'Introduction to Kubernetes',
      description: 'Learn the basics of container orchestration with Kubernetes',
      date: '2024-02-01',
      time: '19:00',
      topic: 'DevOps',
      registrationLink: '#',
      instructor: 'Praveen',
      duration: '90 minutes',
      level: 'Beginner',
      likes: 78,
      saves: 34,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'AWS Solutions Architecture',
      description: 'Master AWS architecture patterns and best practices',
      date: '2024-02-05',
      time: '18:30',
      topic: 'Cloud Computing',
      registrationLink: '#',
      instructor: 'Praveen',
      duration: '120 minutes',
      level: 'Intermediate',
      likes: 92,
      saves: 45,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Python for Automation',
      description: 'Automate your daily tasks with Python scripts',
      date: '2024-02-08',
      time: '20:00',
      topic: 'Python',
      registrationLink: '#',
      instructor: 'Praveen',
      duration: '90 minutes',
      level: 'Beginner',
      likes: 56,
      saves: 23,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Resume Building Workshop',
      description: 'Create an impressive tech resume that stands out',
      date: '2024-02-10',
      time: '17:00',
      topic: 'Career Guidance',
      registrationLink: '#',
      instructor: 'Praveen',
      duration: '60 minutes',
      level: 'All Levels',
      likes: 145,
      saves: 89,
      createdAt: new Date().toISOString()
    }
  ],
  
  downloads: [
    {
      id: '1',
      title: 'AI Agents Guide',
      description: 'Complete guide to building and deploying AI agents',
      fileSize: '2.5 MB',
      downloadUrl: '#',
      icon: 'FaRobot',
      fileName: 'ai-agents-guide.pdf',
      downloads: 1234,
      likes: 234,
      saves: 123,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'DevOps Roadmap 2024',
      description: 'Comprehensive DevOps learning roadmap with resources',
      fileSize: '1.8 MB',
      downloadUrl: '#',
      icon: 'FaRoad',
      fileName: 'devops-roadmap-2024.pdf',
      downloads: 2341,
      likes: 456,
      saves: 234,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Cloud Cheat Sheet',
      description: 'Quick reference for AWS, Azure, and GCP services',
      fileSize: '1.2 MB',
      downloadUrl: '#',
      icon: 'FaCloud',
      fileName: 'cloud-cheat-sheet.pdf',
      downloads: 3456,
      likes: 567,
      saves: 289,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Resume Templates',
      description: 'ATS-friendly resume templates for tech roles',
      fileSize: '3.1 MB',
      downloadUrl: '#',
      icon: 'FaFileAlt',
      fileName: 'resume-templates.zip',
      downloads: 4567,
      likes: 678,
      saves: 345,
      createdAt: new Date().toISOString()
    }
  ],
  
  recentLinks: [
    {
      id: '1',
      icon: 'FaNewspaper',
      title: 'New AWS Certifications Launch 2024',
      meta: 'Cloud • 2 hours ago',
      url: '#',
      clicks: 123,
      likes: 45,
      saves: 23,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      icon: 'FaVideo',
      title: 'DevOps Zero to Hero Course - Free',
      meta: 'DevOps • 5 hours ago',
      url: '#',
      clicks: 456,
      likes: 89,
      saves: 45,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      icon: 'FaBlog',
      title: 'Top 10 AI Tools for Productivity',
      meta: 'AI • 1 day ago',
      url: '#',
      clicks: 789,
      likes: 123,
      saves: 67,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      icon: 'FaLink',
      title: '100+ Remote Job Openings',
      meta: 'Jobs • 2 days ago',
      url: '#',
      clicks: 234,
      likes: 56,
      saves: 34,
      createdAt: new Date().toISOString()
    }
  ],
  
  community: {
    instagram: 'https://instagram.com/techwithpraveen',
    telegram: 'https://t.me/techwithpraveen',
    youtube: 'https://youtube.com/@techwithpraveen',
    linkedin: 'https://linkedin.com/in/techwithpraveen',
    discord: 'https://discord.gg/techwithpraveen',
    twitter: 'https://twitter.com/techwithpraveen',
    github: 'https://github.com/techwithpraveen',
    website: 'https://techwithpraveen.com'
  },
  
  analytics: {
    totalVisitors: 123456,
    pageViews: 456789,
    averageSessionDuration: '4m 32s',
    bounceRate: '32%',
    topPages: [
      { path: '/', views: 12345 },
      { path: '/resources', views: 9876 },
      { path: '/jobs', views: 8765 },
      { path: '/roadmaps', views: 7654 }
    ]
  }
};

export const DataProvider = ({ children }) => {
  const [resources, setResources] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [recentLinks, setRecentLinks] = useState([]);
  const [community, setCommunity] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  
  // Save/Like functionality states
  const [savedItems, setSavedItems] = useState({});
  const [likedItems, setLikedItems] = useState({});
  const [userHistory, setUserHistory] = useState({});

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to load from localStorage first
        const savedData = localStorage.getItem('techwithpraveen_data');
        
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setResources(parsed.resources || []);
          setJobs(parsed.jobs || []);
          setRoadmaps(parsed.roadmaps || []);
          setSessions(parsed.sessions || []);
          setDownloads(parsed.downloads || []);
          setRecentLinks(parsed.recentLinks || []);
          setCommunity(parsed.community || initialData.community);
          setAnalytics(parsed.analytics || initialData.analytics);
          setLastUpdated(parsed.lastUpdated || new Date().toISOString());
        } else {
          // Use initial data if nothing in localStorage
          setResources(initialData.resources);
          setJobs(initialData.jobs);
          setRoadmaps(initialData.roadmaps);
          setSessions(initialData.sessions);
          setDownloads(initialData.downloads);
          setRecentLinks(initialData.recentLinks);
          setCommunity(initialData.community);
          setAnalytics(initialData.analytics);
          setLastUpdated(new Date().toISOString());
          
          // Save initial data to localStorage
          localStorage.setItem('techwithpraveen_data', JSON.stringify({
            ...initialData,
            lastUpdated: new Date().toISOString()
          }));
        }

        // Load saved/liked items from localStorage
        const saved = localStorage.getItem('saved_items');
        const liked = localStorage.getItem('liked_items');
        const history = localStorage.getItem('user_history');
        
        if (saved) setSavedItems(JSON.parse(saved));
        if (liked) setLikedItems(JSON.parse(liked));
        if (history) setUserHistory(JSON.parse(history));
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Using fallback data.');
        
        // Fallback to initial data
        setResources(initialData.resources);
        setJobs(initialData.jobs);
        setRoadmaps(initialData.roadmaps);
        setSessions(initialData.sessions);
        setDownloads(initialData.downloads);
        setRecentLinks(initialData.recentLinks);
        setCommunity(initialData.community);
        setAnalytics(initialData.analytics);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        const dataToSave = {
          resources,
          jobs,
          roadmaps,
          sessions,
          downloads,
          recentLinks,
          community,
          analytics,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('techwithpraveen_data', JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving data:', error);
        toast.error('Failed to save data');
      }
    }
  }, [resources, jobs, roadmaps, sessions, downloads, recentLinks, community, analytics, loading]);

  // Save/Like functions
  const toggleSave = (userEmail, item) => {
    if (!userEmail) {
      toast.error('Please login to save items');
      return;
    }

    const newSaved = { ...savedItems };
    if (!newSaved[userEmail]) newSaved[userEmail] = [];
    
    const exists = newSaved[userEmail].find(i => i.id === item.id);
    
    // Update the original item's save count
    const updateItemSaveCount = (items, id, increment) => {
      return items.map(i => 
        i.id === id 
          ? { ...i, saves: (i.saves || 0) + (increment ? 1 : -1) }
          : i
      );
    };

    if (exists) {
      // Remove from saved
      newSaved[userEmail] = newSaved[userEmail].filter(i => i.id !== item.id);
      
      // Update save count in respective data array
      switch(item.type) {
        case 'resource':
          setResources(prev => updateItemSaveCount(prev, item.id, false));
          break;
        case 'job':
          setJobs(prev => updateItemSaveCount(prev, item.id, false));
          break;
        case 'roadmap':
          setRoadmaps(prev => updateItemSaveCount(prev, item.id, false));
          break;
        case 'session':
          setSessions(prev => updateItemSaveCount(prev, item.id, false));
          break;
        case 'download':
          setDownloads(prev => updateItemSaveCount(prev, item.id, false));
          break;
        case 'link':
          setRecentLinks(prev => updateItemSaveCount(prev, item.id, false));
          break;
      }
      
      toast.success('Removed from saved');
    } else {
      // Add to saved
      newSaved[userEmail].push({
        ...item,
        savedDate: new Date().toISOString()
      });
      
      // Update save count in respective data array
      switch(item.type) {
        case 'resource':
          setResources(prev => updateItemSaveCount(prev, item.id, true));
          break;
        case 'job':
          setJobs(prev => updateItemSaveCount(prev, item.id, true));
          break;
        case 'roadmap':
          setRoadmaps(prev => updateItemSaveCount(prev, item.id, true));
          break;
        case 'session':
          setSessions(prev => updateItemSaveCount(prev, item.id, true));
          break;
        case 'download':
          setDownloads(prev => updateItemSaveCount(prev, item.id, true));
          break;
        case 'link':
          setRecentLinks(prev => updateItemSaveCount(prev, item.id, true));
          break;
      }
      
      toast.success('Added to saved');
    }
    
    setSavedItems(newSaved);
    localStorage.setItem('saved_items', JSON.stringify(newSaved));
  };

  const toggleLike = (userEmail, item) => {
    if (!userEmail) {
      toast.error('Please login to like items');
      return;
    }

    const newLiked = { ...likedItems };
    if (!newLiked[userEmail]) newLiked[userEmail] = [];
    
    const exists = newLiked[userEmail].find(i => i.id === item.id);
    
    // Update the original item's like count
    const updateItemLikeCount = (items, id, increment) => {
      return items.map(i => 
        i.id === id 
          ? { ...i, likes: (i.likes || 0) + (increment ? 1 : -1) }
          : i
      );
    };

    if (exists) {
      // Remove from liked
      newLiked[userEmail] = newLiked[userEmail].filter(i => i.id !== item.id);
      
      // Update like count in respective data array
      switch(item.type) {
        case 'resource':
          setResources(prev => updateItemLikeCount(prev, item.id, false));
          break;
        case 'job':
          setJobs(prev => updateItemLikeCount(prev, item.id, false));
          break;
        case 'roadmap':
          setRoadmaps(prev => updateItemLikeCount(prev, item.id, false));
          break;
        case 'session':
          setSessions(prev => updateItemLikeCount(prev, item.id, false));
          break;
        case 'download':
          setDownloads(prev => updateItemLikeCount(prev, item.id, false));
          break;
        case 'link':
          setRecentLinks(prev => updateItemLikeCount(prev, item.id, false));
          break;
      }
      
      toast.success('Removed from liked');
    } else {
      // Add to liked
      newLiked[userEmail].push({
        ...item,
        likedDate: new Date().toISOString()
      });
      
      // Update like count in respective data array
      switch(item.type) {
        case 'resource':
          setResources(prev => updateItemLikeCount(prev, item.id, true));
          break;
        case 'job':
          setJobs(prev => updateItemLikeCount(prev, item.id, true));
          break;
        case 'roadmap':
          setRoadmaps(prev => updateItemLikeCount(prev, item.id, true));
          break;
        case 'session':
          setSessions(prev => updateItemLikeCount(prev, item.id, true));
          break;
        case 'download':
          setDownloads(prev => updateItemLikeCount(prev, item.id, true));
          break;
        case 'link':
          setRecentLinks(prev => updateItemLikeCount(prev, item.id, true));
          break;
      }
      
      toast.success('Added to liked');
    }
    
    setLikedItems(newLiked);
    localStorage.setItem('liked_items', JSON.stringify(newLiked));
  };

  // Track user history
  const addToHistory = (userEmail, item) => {
    if (!userEmail) return;

    const newHistory = { ...userHistory };
    if (!newHistory[userEmail]) newHistory[userEmail] = [];
    
    // Add to beginning of history
    newHistory[userEmail] = [
      {
        ...item,
        viewedDate: new Date().toISOString()
      },
      ...newHistory[userEmail].filter(i => i.id !== item.id)
    ].slice(0, 50); // Keep only last 50 items
    
    setUserHistory(newHistory);
    localStorage.setItem('user_history', JSON.stringify(newHistory));
  };

  // Get user's saved items
  const getSavedItems = (userEmail) => {
    return savedItems[userEmail] || [];
  };

  // Get user's liked items
  const getLikedItems = (userEmail) => {
    return likedItems[userEmail] || [];
  };

  // Get user's history
  const getUserHistory = (userEmail) => {
    return userHistory[userEmail] || [];
  };

  // Check if item is saved by user
  const isItemSaved = (userEmail, itemId) => {
    if (!userEmail || !savedItems[userEmail]) return false;
    return savedItems[userEmail].some(i => i.id === itemId);
  };

  // Check if item is liked by user
  const isItemLiked = (userEmail, itemId) => {
    if (!userEmail || !likedItems[userEmail]) return false;
    return likedItems[userEmail].some(i => i.id === itemId);
  };

  // Helper function to add timestamps
  const addTimestamps = (item, isNew = true) => {
    const now = new Date().toISOString();
    return {
      ...item,
      id: item.id || uuidv4(),
      likes: item.likes || 0,
      saves: item.saves || 0,
      createdAt: isNew ? now : item.createdAt || now,
      updatedAt: now
    };
  };

  // Resources CRUD
  const addResource = (resource) => {
    const newResource = addTimestamps(resource);
    setResources(prev => [newResource, ...prev]);
    toast.success('Resource added successfully');
    return newResource;
  };

  const updateResource = (id, updatedData) => {
    setResources(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
    toast.success('Resource updated successfully');
  };

  const deleteResource = (id) => {
    setResources(prev => prev.filter(item => item.id !== id));
    toast.success('Resource deleted successfully');
  };

  const getResourceById = (id) => {
    return resources.find(item => item.id === id);
  };

  // Jobs CRUD
  const addJob = (job) => {
    const newJob = addTimestamps(job);
    setJobs(prev => [newJob, ...prev]);
    toast.success('Job posted successfully');
    return newJob;
  };

  const updateJob = (id, updatedData) => {
    setJobs(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
    toast.success('Job updated successfully');
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(item => item.id !== id));
    toast.success('Job deleted successfully');
  };

  const getJobById = (id) => {
    return jobs.find(item => item.id === id);
  };

  // Roadmaps CRUD
  const addRoadmap = (roadmap) => {
    const newRoadmap = addTimestamps(roadmap);
    setRoadmaps(prev => [newRoadmap, ...prev]);
    toast.success('Roadmap added successfully');
    return newRoadmap;
  };

  const updateRoadmap = (id, updatedData) => {
    setRoadmaps(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
    toast.success('Roadmap updated successfully');
  };

  const deleteRoadmap = (id) => {
    setRoadmaps(prev => prev.filter(item => item.id !== id));
    toast.success('Roadmap deleted successfully');
  };

  const getRoadmapById = (id) => {
    return roadmaps.find(item => item.id === id);
  };

  // Sessions CRUD
  const addSession = (session) => {
    const newSession = addTimestamps(session);
    setSessions(prev => [newSession, ...prev]);
    toast.success('Session scheduled successfully');
    return newSession;
  };

  const updateSession = (id, updatedData) => {
    setSessions(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
    toast.success('Session updated successfully');
  };

  const deleteSession = (id) => {
    setSessions(prev => prev.filter(item => item.id !== id));
    toast.success('Session deleted successfully');
  };

  const getSessionById = (id) => {
    return sessions.find(item => item.id === id);
  };

  // Downloads CRUD
  const addDownload = (download) => {
    const newDownload = addTimestamps({ ...download, downloads: 0 });
    setDownloads(prev => [newDownload, ...prev]);
    toast.success('Download added successfully');
    return newDownload;
  };

  const updateDownload = (id, updatedData) => {
    setDownloads(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
    toast.success('Download updated successfully');
  };

  const deleteDownload = (id) => {
    setDownloads(prev => prev.filter(item => item.id !== id));
    toast.success('Download deleted successfully');
  };

  const getDownloadById = (id) => {
    return downloads.find(item => item.id === id);
  };

  const incrementDownloadCount = (id) => {
    setDownloads(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, downloads: (item.downloads || 0) + 1 }
          : item
      )
    );
  };

  // Recent Links CRUD
  const addRecentLink = (link) => {
    const newLink = addTimestamps({ ...link, clicks: 0 });
    setRecentLinks(prev => [newLink, ...prev]);
    toast.success('Link added successfully');
    return newLink;
  };

  const updateRecentLink = (id, updatedData) => {
    setRecentLinks(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updatedData, updatedAt: new Date().toISOString() }
          : item
      )
    );
    toast.success('Link updated successfully');
  };

  const deleteRecentLink = (id) => {
    setRecentLinks(prev => prev.filter(item => item.id !== id));
    toast.success('Link deleted successfully');
  };

  const getRecentLinkById = (id) => {
    return recentLinks.find(item => item.id === id);
  };

  const incrementLinkClick = (id) => {
    setRecentLinks(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, clicks: (item.clicks || 0) + 1 }
          : item
      )
    );
  };

  // Community CRUD
  const updateCommunity = (platform, url) => {
    setCommunity(prev => ({
      ...prev,
      [platform]: url
    }));
    toast.success('Community link updated successfully');
  };

  const getCommunityLink = (platform) => {
    return community[platform] || '';
  };

  // Analytics
  const updateAnalytics = (newAnalytics) => {
    setAnalytics(prev => ({
      ...prev,
      ...newAnalytics,
      updatedAt: new Date().toISOString()
    }));
  };

  const incrementPageView = (path) => {
    setAnalytics(prev => ({
      ...prev,
      pageViews: (prev.pageViews || 0) + 1,
      lastPageView: new Date().toISOString()
    }));
  };

  // Search functionality
  const searchContent = (query) => {
    if (!query) return { resources: [], jobs: [], roadmaps: [] };
    
    const lowerQuery = query.toLowerCase();
    
    return {
      resources: resources.filter(r => 
        r.title.toLowerCase().includes(lowerQuery) ||
        r.links.some(l => l.text.toLowerCase().includes(lowerQuery))
      ),
      jobs: jobs.filter(j =>
        j.company.toLowerCase().includes(lowerQuery) ||
        j.role.toLowerCase().includes(lowerQuery) ||
        j.location.toLowerCase().includes(lowerQuery)
      ),
      roadmaps: roadmaps.filter(r =>
        r.title.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery) ||
        r.steps.some(s => s.toLowerCase().includes(lowerQuery))
      )
    };
  };

  // Get counts
  const getCounts = useCallback(() => ({
    resources: resources.length,
    jobs: jobs.length,
    roadmaps: roadmaps.length,
    sessions: sessions.length,
    downloads: downloads.length,
    recentLinks: recentLinks.length,
    totalDownloads: downloads.reduce((acc, d) => acc + (d.downloads || 0), 0),
    totalClicks: recentLinks.reduce((acc, l) => acc + (l.clicks || 0), 0)
  }), [resources, jobs, roadmaps, sessions, downloads, recentLinks]);

  // Reset all data (dangerous!)
  const resetToInitial = () => {
    if (window.confirm('Are you sure? This will delete all your data and restore initial content.')) {
      setResources(initialData.resources);
      setJobs(initialData.jobs);
      setRoadmaps(initialData.roadmaps);
      setSessions(initialData.sessions);
      setDownloads(initialData.downloads);
      setRecentLinks(initialData.recentLinks);
      setCommunity(initialData.community);
      setAnalytics(initialData.analytics);
      
      localStorage.setItem('techwithpraveen_data', JSON.stringify({
        ...initialData,
        lastUpdated: new Date().toISOString()
      }));
      
      toast.success('Data reset to initial state');
    }
  };

  // Export data
  const exportData = () => {
    const data = {
      resources,
      jobs,
      roadmaps,
      sessions,
      downloads,
      recentLinks,
      community,
      analytics,
      savedItems,
      likedItems,
      userHistory,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techwithpraveen-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  // Import data
  const importData = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.resources) setResources(data.resources);
      if (data.jobs) setJobs(data.jobs);
      if (data.roadmaps) setRoadmaps(data.roadmaps);
      if (data.sessions) setSessions(data.sessions);
      if (data.downloads) setDownloads(data.downloads);
      if (data.recentLinks) setRecentLinks(data.recentLinks);
      if (data.community) setCommunity(data.community);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.savedItems) setSavedItems(data.savedItems);
      if (data.likedItems) setLikedItems(data.likedItems);
      if (data.userHistory) setUserHistory(data.userHistory);
      
      toast.success('Data imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    }
  };

  const value = {
    // State
    resources,
    jobs,
    roadmaps,
    sessions,
    downloads,
    recentLinks,
    community,
    analytics,
    loading,
    error,
    lastUpdated,
    savedItems,
    likedItems,
    userHistory,
    
    // Resources
    addResource,
    updateResource,
    deleteResource,
    getResourceById,
    
    // Jobs
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    
    // Roadmaps
    addRoadmap,
    updateRoadmap,
    deleteRoadmap,
    getRoadmapById,
    
    // Sessions
    addSession,
    updateSession,
    deleteSession,
    getSessionById,
    
    // Downloads
    addDownload,
    updateDownload,
    deleteDownload,
    getDownloadById,
    incrementDownloadCount,
    
    // Recent Links
    addRecentLink,
    updateRecentLink,
    deleteRecentLink,
    getRecentLinkById,
    incrementLinkClick,
    
    // Community
    updateCommunity,
    getCommunityLink,
    
    // Analytics
    updateAnalytics,
    incrementPageView,
    
    // Save/Like/History Functions
    toggleSave,
    toggleLike,
    addToHistory,
    getSavedItems,
    getLikedItems,
    getUserHistory,
    isItemSaved,
    isItemLiked,
    
    // Utilities
    getCounts,
    searchContent,
    resetToInitial,
    exportData,
    importData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};