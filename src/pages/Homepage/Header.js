import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiChevronDown, FiHome, FiBook, FiFileText,
  FiBookmark, FiUser, FiLogOut, FiLogIn, FiMenu, FiX
} from 'react-icons/fi';

import { useAuth } from '../../Context/AuthContext';
import defaultAvatar from '../../assets/default-avatar.jpg';

const Header = ({ onLoginClick, theme }) => {
  const { isLoggedIn, logout, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useOutsideClick(profileRef, () => setIsProfileOpen(false));
  useOutsideClick(mobileMenuRef, () => setIsMobileMenuOpen(false));

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isTablet = windowWidth <= 1024;
  const isMobile = windowWidth <= 768;

  const getUserPhoto = () => (userData?.profilePicture?.url || defaultAvatar);
  const getDisplayName = () => (userData?.username || userData?.email?.split('@')[0] || 'User');

  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', icon: <FiHome /> },
      { path: '/course', label: 'Courses', icon: <FiBook /> },
      { path: '#', label: 'Resources', icon: <FiFileText /> },
      { path: '/blogpage', label: 'Blog', icon: <FiBookmark /> },
      { path: '#', label: 'Event', icon: <FiBook /> },
    ];
    return baseItems;
  };

  const navItems = getNavItems();

  const handleSignInClick = () => {
    if (onLoginClick) onLoginClick();
    closeAllMenus();
    navigate('/');
  };

  const styles = {
    // ... all other styles remain the same
    // headerWrapper: { backgroundColor: 'rgba(255, 255, 255, 0.98)', position: 'sticky', top: 0, zIndex: 1100, backdropFilter: 'blur(10px)', height: '80px', display: 'flex', alignItems: 'center', width: '100%' },
    headerWrapper: { backgroundColor: 'rgba(255, 255, 255, 0.98)', position: 'sticky', top: 0, zIndex: 1100, backdropFilter: 'blur(10px)', height: '80px', display: 'flex', alignItems: 'center', width: '100%' },
    mainNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', width: '100%', maxWidth: '1440px', margin: '0 auto' },
    logoContainer: { display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '1px' },
    // logoImage: { height: '100px', width: 'auto', maxHeight: '180px' },
    logoImage: {
  height: '100px',
  width: '100px', // Increase this value as needed
  maxWidth: '100%', // Ensures responsiveness
  maxHeight: '100px',
  objectFit: 'contain', 
},
    logoText: { fontSize: '24px', fontWeight: 'bold', color: '#333' },
    desktopNavLinks: { display: isTablet ? 'none' : 'flex', gap: '32px', alignItems: 'center' },
    desktopNavLink: (active) => ({ color: active ? theme.colors.primary : '#222', textDecoration: 'none', fontWeight: '500', fontSize: '15px', position: 'relative', padding: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }),
    rightMenu: { display: 'flex', alignItems: 'center', gap: '16px' },
    mobileMenuButton: { backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '8px', zIndex: 1, color: '#222' },
    mobileMenuOverlay: { position: 'fixed', top: '50px', left: 0, right: 0, backgroundColor: '#ffffff', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', padding: '24px', zIndex: 1100, transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-120%)', transition: 'transform 0.3s ease-in-out' },
    mobileNavLink: { color: '#222', fontSize: '18px', fontWeight: '500', textDecoration: 'none', padding: '12px 0', width: '100%', display: 'flex', alignItems: 'center', gap: '12px' },
    loginButton: { backgroundColor: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '14px' },
    profileButton: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '24px' },
    profileImage: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' },
    profileName: { fontSize: '14px', fontWeight: '500', color: '#222' },
    dropdown: { position: 'absolute', top: 'calc(100% + 12px)', right: 0, backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', padding: '8px 0', minWidth: '240px', zIndex: 1100, border: '1px solid rgba(0, 0, 0, 0.05)' },
    dropdownItem: { padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', color: '#333', textDecoration: 'none', fontSize: '14px' },
    dropdownDivider: { height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.05)', margin: '8px 0' },
  };

  return (
    <>
      <header style={styles.headerWrapper}>
        <nav style={styles.mainNav}>
          <Link to="/" style={styles.logoContainer} onClick={closeAllMenus}>
            <img src="/Logo.png" alt="Learnly Logo" style={styles.logoImage} />
            {!isMobile && <h1 style={styles.logoText}></h1>}
          </Link>

          <div style={styles.desktopNavLinks}>
            {navItems.map(item => (
              <Link key={item.path} to={item.path} style={styles.desktopNavLink(isActive(item.path))}>
                {React.cloneElement(item.icon, { size: 16 })}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div style={styles.rightMenu}>
            {/* ====== NEW LOGIC START ====== */}
            {isLoggedIn ? (
              // If LOGGED IN, show profile icon (on ALL screen sizes)
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button
                  style={styles.profileButton}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <img src={getUserPhoto()} alt="Profile" style={styles.profileImage} />
                  {/* Only show name and chevron on desktop */}
                  {!isTablet && (
                    <>
                      <span style={styles.profileName}>{getDisplayName()}</span>
                      <FiChevronDown size={16} />
                    </>
                  )}
                </button>
                {isProfileOpen && (
                  <div style={styles.dropdown}>
                    <div style={{ padding: '12px 16px', fontWeight: 600 }}>{userData?.email}</div>
                    <div style={styles.dropdownDivider} />
                    <Link to="/dashboard" style={styles.dropdownItem} onClick={closeAllMenus}>
                      <FiUser size={16} /> Dashboard
                    </Link>
                    <button
                      style={{ ...styles.dropdownItem, width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }}
                      onClick={handleLogout}
                    >
                      <FiLogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // If LOGGED OUT, show Login button (on ALL screen sizes)
              <button onClick={handleSignInClick} style={styles.loginButton}>
                Login
              </button>
            )}

            {/* Always show hamburger menu on tablet/mobile */}
            {isTablet && (
              <button style={styles.mobileMenuButton} onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            )}
            {/* ====== NEW LOGIC END ====== */}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay - Cleaned up */}
      <div ref={mobileMenuRef} style={styles.mobileMenuOverlay}>
        {/* Nav items are always visible */}
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={styles.mobileNavLink} onClick={closeAllMenus}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        {/* The Dashboard/Sign Out links are removed from here */}
      </div>
    </>
  );
};

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
};

export default Header;