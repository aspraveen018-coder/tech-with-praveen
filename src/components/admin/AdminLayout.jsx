import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { useTheme } from '../../contexts/ThemeContext';
import {
  FaTachometerAlt,
  FaBook,
  FaBriefcase,
  FaRoad,
  FaVideo,
  FaDownload,
  FaLink,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaHome,
  FaMoon,
  FaSun,
  FaRocket,
  FaChartLine,
  FaUserClock
} from 'react-icons/fa';
import styled from 'styled-components';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import toast from 'react-hot-toast';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background-color var(--animation-speed) ease;
`;

const Sidebar = styled(motion.aside)`
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--border-color);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.3);
  transition: width var(--animation-speed) ease, background-color var(--animation-speed) ease;

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    width: 260px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--accent-gradient);
    border-radius: 5px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: var(--sidebar-width);
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  transition: margin-left var(--animation-speed) ease, background-color var(--animation-speed) ease;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: 80px 30px 30px;
  
  @media (max-width: 768px) {
    padding: 80px 20px 20px;
  }
`;

const Logo = styled.div`
  padding: 25px 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;

  h2 {
    font-size: 1.4rem;
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.8rem;
    margin-top: 2px;
  }
`;

const LogoIcon = styled.div`
  width: 45px;
  height: 45px;
  background: var(--accent-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const NavSection = styled.div`
  margin-bottom: 20px;
`;

const NavSectionTitle = styled.div`
  padding: 10px 20px;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  color: ${props => props.active ? 'var(--accent-color)' : 'var(--text-secondary)'};
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  background: ${props => props.active ? 'rgba(var(--accent-color-rgb), 0.1)' : 'transparent'};
  margin: 4px 0;
  position: relative;

  &:hover {
    background: rgba(var(--accent-color-rgb), 0.1);
    color: var(--accent-color);
    transform: translateX(5px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const NavBadge = styled.span`
  position: absolute;
  right: 20px;
  background: var(--accent-color);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  color: #ff6b6b;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(255, 107, 107, 0.1);
    transform: translateX(5px);
    border-left-color: #ff6b6b;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1001;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    display: block;
  }
`;

const TopBar = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  height: 70px;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 900;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: left var(--animation-speed) ease, background-color var(--animation-speed) ease;

  @media (max-width: 768px) {
    left: 0;
    padding: 0 20px 0 80px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(var(--text-primary-rgb), 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 8px 15px;
  width: 300px;

  svg {
    color: var(--text-secondary);
    margin-right: 10px;
  }

  input {
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 0.95rem;
    width: 100%;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: var(--text-secondary);
    }
  }

  @media (max-width: 768px) {
    width: 200px;
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconButton = styled(motion.button)`
  background: rgba(var(--text-primary-rgb), 0.05);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 8px;
  color: var(--text-primary);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(var(--accent-color-rgb), 0.1);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

const UserMenu = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  background: rgba(var(--text-primary-rgb), 0.05);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  position: relative;

  &:hover {
    background: rgba(var(--accent-color-rgb), 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 35px;
  height: 35px;
  background: var(--accent-gradient);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
  
  .name {
    color: var(--text-primary);
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  .role {
    color: var(--text-secondary);
    font-size: 0.7rem;
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 10px 0;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  color: ${props => props.danger ? '#ff6b6b' : 'var(--text-secondary)'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: ${props => props.danger ? 'rgba(255, 107, 107, 0.1)' : 'rgba(var(--accent-color-rgb), 0.1)'};
    color: ${props => props.danger ? '#ff6b6b' : 'var(--accent-color)'};
  }
`;

const ThemeToggle = styled(motion.button)`
  background: rgba(var(--text-primary-rgb), 0.05);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 8px;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(var(--accent-color-rgb), 0.1);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }
`;

const UserStatsPreview = styled(motion.div)`
  padding: 15px 20px;
  margin: 10px 15px;
  background: rgba(var(--accent-color-rgb), 0.05);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(var(--accent-color-rgb), 0.1);
    border-color: var(--accent-color);
  }

  .title {
    color: var(--accent-color);
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .stats {
    display: flex;
    justify-content: space-between;
    color: var(--text-secondary);
    font-size: 0.8rem;
  }
`;

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { resources, jobs, sessions } = useData();
  const { getAllUsers } = useGoogleAuth();
  const { theme, updateTheme } = useTheme();

  // Load user stats
  useEffect(() => {
    const users = getAllUsers?.() || [];
    setTotalUsers(users.length);
    
    const today = new Date().toDateString();
    const active = users.filter(u => new Date(u.lastLogin).toDateString() === today).length;
    setActiveToday(active);
  }, [getAllUsers]);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      // Implement search functionality here
    }
  };

  const toggleTheme = () => {
    updateTheme({
      ...theme,
      mode: theme.mode === 'dark' ? 'light' : 'dark'
    });
  };

  const navItems = [
    { 
      section: 'Main',
      items: [
        { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard', badge: null },
        { path: '/admin/resources', icon: <FaBook />, label: 'Resources', badge: resources?.length },
        { path: '/admin/jobs', icon: <FaBriefcase />, label: 'Jobs', badge: jobs?.length },
        { path: '/admin/roadmaps', icon: <FaRoad />, label: 'Roadmaps', badge: null },
      ]
    },
    {
      section: 'Content',
      items: [
        { path: '/admin/sessions', icon: <FaVideo />, label: 'Sessions', badge: sessions?.length },
        { path: '/admin/downloads', icon: <FaDownload />, label: 'Downloads', badge: null },
        { path: '/admin/recent-links', icon: <FaLink />, label: 'Recent Links', badge: null },
        { path: '/admin/community', icon: <FaUsers />, label: 'Community', badge: null },
      ]
    },
    {
      section: 'Analytics',
      items: [
        { path: '/admin/users', icon: <FaUserClock />, label: 'User Tracking', badge: totalUsers },
        { path: '/admin/analytics', icon: <FaChartLine />, label: 'Analytics', badge: null },
      ]
    },
    {
      section: 'System',
      items: [
        { path: '/admin/settings', icon: <FaCog />, label: 'Settings', badge: null },
      ]
    }
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD';
  };

  return (
    <AdminContainer>
      <MobileMenuButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>

      <Sidebar isOpen={sidebarOpen}>
        <Logo>
          <LogoIcon>
            <FaRocket />
          </LogoIcon>
          <div>
            <h2>Tech with Praveen</h2>
            <p>Admin Dashboard</p>
          </div>
        </Logo>

        {/* Quick User Stats Preview */}
        <UserStatsPreview
          as={motion.div}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/admin/users')}
        >
          <div className="title">
            <FaUsers /> Active Users
          </div>
          <div className="stats">
            <span>Total: {totalUsers}</span>
            <span>Today: {activeToday}</span>
          </div>
        </UserStatsPreview>

        {navItems.map((section, idx) => (
          <NavSection key={idx}>
            <NavSectionTitle>{section.section}</NavSectionTitle>
            {section.items.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                active={location.pathname === item.path ? 1 : 0}
              >
                {item.icon}
                {item.label}
                {item.badge > 0 && (
                  <NavBadge>{item.badge}</NavBadge>
                )}
              </NavItem>
            ))}
          </NavSection>
        ))}

        <NavItem to="/" active={0}>
          <FaHome /> View Site
        </NavItem>

        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </LogoutButton>

        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <div>v1.0.0 • {new Date().getFullYear()}</div>
          <div style={{ marginTop: '5px', color: 'var(--accent-color)' }}>
            {totalUsers} Total Users
          </div>
        </div>
      </Sidebar>

      <MainContent>
        <TopBar
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchBar as="form" onSubmit={handleSearch}>
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search users, content..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <TopBarActions>
            <ThemeToggle
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme.mode === 'dark' ? <FaSun /> : <FaMoon />}
            </ThemeToggle>

            <IconButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifications(0)}
            >
              <FaBell />
              {notifications > 0 && (
                <NotificationBadge>{notifications}</NotificationBadge>
              )}
            </IconButton>

            <UserMenu
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              whileHover={{ scale: 1.02 }}
            >
              <UserAvatar>
                {getInitials(user?.name)}
              </UserAvatar>
              <UserInfo>
                <div className="name">{user?.name || 'Admin'}</div>
                <div className="role">Administrator</div>
              </UserInfo>
              <FaChevronDown size={12} style={{ color: 'var(--text-secondary)' }} />
            </UserMenu>
          </TopBarActions>
        </TopBar>

        <AnimatePresence mode="wait">
          <ContentWrapper>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </ContentWrapper>
        </AnimatePresence>

        {/* User Dropdown Menu */}
        <AnimatePresence>
          {userMenuOpen && (
            <UserDropdown
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <DropdownItem onClick={() => navigate('/admin/settings')}>
                <FaUserCircle /> Profile
              </DropdownItem>
              <DropdownItem onClick={() => navigate('/admin/settings')}>
                <FaCog /> Settings
              </DropdownItem>
              <DropdownItem onClick={() => navigate('/admin/users')}>
                <FaUsers /> User Stats
              </DropdownItem>
              <DropdownItem danger onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </DropdownItem>
            </UserDropdown>
          )}
        </AnimatePresence>
      </MainContent>
    </AdminContainer>
  );
};

export default AdminLayout;