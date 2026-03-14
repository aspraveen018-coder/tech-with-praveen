import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaGoogle, FaUserCircle, FaSignOutAlt, FaCog, FaUser } from 'react-icons/fa';
import styled from 'styled-components';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Styled Components
const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 40px;
  background: ${props => props.scrolled ? 'rgba(3, 6, 20, 0.95)' : 'rgba(3, 6, 20, 0.8)'};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  letter-spacing: -0.5px;
  z-index: 1001;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(3, 6, 20, 0.95);
    backdrop-filter: blur(10px);
    padding: 30px;
    border-bottom: 1px solid rgba(0, 210, 255, 0.1);
    gap: 20px;
    z-index: 1000;
  }
`;

const NavLink = styled(motion.a)`
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
  cursor: pointer;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #00d2ff;
    
    &:after {
      width: 100%;
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const LoginButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #00d2ff;
  color: #00d2ff;
  padding: 8px 25px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 210, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UserButton = styled(motion.button)`
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 210, 255, 0.3);
  }
`;

const GoogleLoginModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled(motion.div)`
  background: rgba(10, 20, 40, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const ModalTitle = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ModalSubtitle = styled.p`
  color: #a0aec0;
  font-size: 0.95rem;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const GoogleButton = styled(motion.button)`
  width: 100%;
  background: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #333;
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    color: #DB4437;
    font-size: 1.3rem;
  }
`;

const AdminLink = styled(motion.a)`
  display: inline-block;
  margin-top: 20px;
  color: #4a5568;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    color: #00d2ff;
    background: rgba(0, 210, 255, 0.1);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
  }
`;

const UserMenu = styled(motion.div)`
  position: absolute;
  top: 70px;
  right: 40px;
  background: rgba(10, 20, 40, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 12px;
  padding: 10px 0;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1002;

  @media (max-width: 768px) {
    right: 20px;
  }
`;

const UserMenuItem = styled.div`
  padding: 12px 20px;
  color: ${props => props.danger ? '#ff6b6b' : '#a0aec0'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.danger ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 210, 255, 0.1)'};
    color: ${props => props.danger ? '#ff6b6b' : '#00d2ff'};
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Hooks
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, login, logout } = useGoogleAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleGoogleLogin = () => {
    setShowLoginModal(false);
    login(); // This triggers the Google login flow
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/'); // Navigate to home after logout
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/profile'); // Navigate to profile page
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    toast.success('Settings page coming soon!');
    // navigate('/settings'); // Uncomment when settings page is ready
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to home
    scrollToSection('hero');
  };

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'resources', label: 'Resources' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'roadmaps', label: 'Roadmaps' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'community', label: 'Community' },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <Nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        scrolled={scrolled}
      >
        <Logo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogoClick}
        >
          Tech with Praveen
        </Logo>
        
        <MenuButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </MenuButton>

        <NavLinks isOpen={isOpen}>
          {navItems.map((item, index) => (
            <NavLink
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              {item.label}
            </NavLink>
          ))}
          
          {!isAuthenticated ? (
            <LoginButton
              onClick={handleLoginClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <>
                  <FaUserCircle /> Login
                </>
              )}
            </LoginButton>
          ) : (
            <UserButton
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="user-menu-container"
            >
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    marginRight: '8px',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  marginRight: '8px',
                  fontWeight: 'bold'
                }}>
                  {getUserInitials()}
                </div>
              )}
              {user?.name?.split(' ')[0]}
            </UserButton>
          )}
        </NavLinks>

        {/* User Menu Dropdown */}
        <AnimatePresence>
          {showUserMenu && isAuthenticated && (
            <UserMenu
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="user-menu-container"
            >
              <UserMenuItem onClick={handleProfileClick}>
                <FaUser /> Profile
              </UserMenuItem>
              <UserMenuItem onClick={handleSettingsClick}>
                <FaCog /> Settings
              </UserMenuItem>
              <UserMenuItem danger onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </UserMenuItem>
            </UserMenu>
          )}
        </AnimatePresence>
      </Nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <GoogleLoginModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setShowLoginModal(false)}>
                <FaTimes />
              </CloseButton>
              
              <ModalTitle>Welcome Back! 👋</ModalTitle>
              <ModalSubtitle>
                Sign in to access all resources, job updates, and community features
              </ModalSubtitle>

              <GoogleButton
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #f3f3f3',
                      borderTop: '2px solid #DB4437',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Loading...
                  </>
                ) : (
                  <>
                    <FaGoogle /> Continue with Google
                  </>
                )}
              </GoogleButton>

              <div style={{ marginTop: '20px', color: '#4a5568', fontSize: '0.85rem' }}>
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>

              {/* Separate Admin Dashboard Link */}
              <AdminLink
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
              >
                🔐 Admin Dashboard Access (Separate Portal)
              </AdminLink>
            </ModalContent>
          </GoogleLoginModal>
        )}
      </AnimatePresence>

      {/* Add global spinner animation */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Navbar;