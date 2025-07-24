import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiChevronDown,
  FiHome,
  FiBook,
  FiFileText,
  FiBookmark,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiMenu,
  FiX,
  FiBell,
} from "react-icons/fi";

import { useAuth } from "../../Context/AuthContext";
import defaultAvatar from "../../assets/default-avatar.jpg";
// import Logo from "../../Images/Logo.png";

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isTablet = windowWidth <= 1024;
  const isMobile = windowWidth <= 768;

  const getUserPhoto = () => userData?.profilePicture?.url || defaultAvatar;
  const getDisplayName = () =>
    userData?.username || userData?.email?.split("@")[0] || "User";

  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Home", icon: <FiHome /> },
      { path: "/course", label: "Courses", icon: <FiBook /> },
      { path: "/blogpage", label: "Blog", icon: <FiBookmark /> },
      { path: "#", label: "Event", icon: <FiBook /> },
    ];
    return baseItems;
  };

  const navItems = getNavItems();

  const handleSignInClick = () => {
    if (onLoginClick) onLoginClick();
    closeAllMenus();
    navigate("/");
  };

  const styles = {
    headerWrapper: {
      backgroundColor: isMobile 
        ? "rgba(255, 255, 255, 0.95)" 
        : "rgba(255, 255, 255, 0.99)",
      position: "sticky",
      top: 0,
      zIndex: 1100,
      backdropFilter: "blur(25px)",
      webkitBackdropFilter: "blur(25px)",
      height: isMobile ? "56px" : "70px",
      display: "flex",
      alignItems: "center",
      width: "100%",
      borderBottom: isMobile ? "1px solid rgba(0, 0, 0, 0.08)" : "none",
      boxShadow: isMobile 
        ? "0 2px 20px rgba(0, 0, 0, 0.08)" 
        : "0 6px 35px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    },
    mainNav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: isMobile ? "0 20px" : "0 40px",
      width: "100%",
      maxWidth: "1600px",
      margin: "0 auto",
      position: "relative",
      height: "100%",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      gap: "12px",
      transition: "transform 0.3s ease",
      padding: isMobile ? "6px 10px" : "8px 14px",
      borderRadius: "12px",
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
      ...(isMobile && {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
      }),
      ":hover": {
        transform: isMobile ? "translateX(-50%) scale(1.05)" : "scale(1.05)",
        backgroundColor: "transparent",
        boxShadow: "none",
      },
    },
    logoImage: {
      height: isMobile ? "40px" : "60px",
      width: isMobile ? "40px" : "60px",
      maxWidth: "100%",
      maxHeight: "100px",
      objectFit: "contain",
      borderRadius: isMobile ? "8px" : "12px",
      filter: "drop-shadow(0 3px 12px rgba(0, 0, 0, 0.12))",
      transition: "all 0.3s ease",
      backgroundColor: "transparent",
      display: "block",
    },
    logoText: { 
      fontSize: isMobile ? "18px" : "28px", 
      fontWeight: "700", 
      color: "#007bff",
      letterSpacing: "-0.8px",
      margin: 0,
      textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    desktopNavLinks: {
      display: isTablet ? "none" : "flex",
      gap: "40px",
      alignItems: "center",
      marginLeft: "60px",
    },
    desktopNavLink: (active) => ({
      color: active ? theme.colors.primary : "#222",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: "16px",
      position: "relative",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      borderRadius: "10px",
      transition: "all 0.3s ease",
      ":hover": {
        backgroundColor: "rgba(0, 123, 255, 0.08)",
        transform: "translateY(-1px)",
        color: "#007bff",
      },
    }),
    rightMenu: { 
      display: "flex", 
      alignItems: "center", 
      gap: isMobile ? "12px" : "16px",
      zIndex: 1,
    },
    leftMenu: {
      display: "flex",
      alignItems: "center",
      zIndex: 1,
    },
    mobileMenuButton: {
      backgroundColor: "transparent",
      border: "none",
      fontSize: isMobile ? "22px" : "24px",
      cursor: "pointer",
      padding: isMobile ? "10px" : "8px",
      color: "#222",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "12px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      ":hover": {
        backgroundColor: "rgba(0, 123, 255, 0.08)",
        transform: "scale(1.1)",
      },
      ":active": {
        transform: "scale(0.95)",
      },
    },
    mobileMenuOverlay: {
      position: "fixed",
      top: isMobile ? "62px" : "76px",
      left: isMobile ? "50%" : 0,
      right: isMobile ? "auto" : 0,
      transform: isMobile ? "translateX(-50%)" : "none",
      backgroundColor: isMobile 
        ? "rgba(255, 255, 255, 0.98)" 
        : "rgba(255, 255, 255, 0.95)",
      boxShadow: isMobile 
        ? "0 16px 48px rgba(0, 0, 0, 0.2)" 
        : "none",
      borderRadius: isMobile ? "20px" : "0",
      padding: isMobile ? "24px" : "20px 40px",
      zIndex: 1100,
      transform: isMobileMenuOpen 
        ? (isMobile ? "translateX(-50%) translateY(0)" : "translateY(0)") 
        : (isMobile ? "translateX(-50%) translateY(-120%)" : "translateY(-100%)"),
      transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      maxHeight: isMobile ? "auto" : "none",
      overflowY: isMobile ? "auto" : "visible",
      backdropFilter: isMobile ? "blur(20px)" : "none",
      webkitBackdropFilter: isMobile ? "blur(20px)" : "none",
      width: isMobile ? "320px" : "100%",
      maxWidth: isMobile ? "90vw" : "100%",
      display: isMobile ? "block" : (isMobileMenuOpen ? "block" : "none"),
    },
    mobileNavLink: {
      color: "#222",
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "500",
      textDecoration: "none",
      padding: isMobile ? "14px 16px" : "12px 0",
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "14px" : "12px",
      borderRadius: isMobile ? "14px" : "8px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      marginBottom: isMobile ? "8px" : "0",
      background: isMobile 
        ? "rgba(248, 249, 250, 0.9)"
        : "transparent",
      border: isMobile ? "1px solid rgba(0, 0, 0, 0.05)" : "none",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      ":hover": {
        backgroundColor: isMobile 
          ? "rgba(0, 123, 255, 0.08)" 
          : "rgba(0, 123, 255, 0.05)",
        transform: isMobile ? "translateX(6px)" : "none",
        borderColor: isMobile ? "rgba(0, 123, 255, 0.2)" : "transparent",
        boxShadow: isMobile ? "0 4px 12px rgba(0, 123, 255, 0.15)" : "none",
      },
    },
    loginButton: {
      background: isMobile 
        ? "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)" 
        : "linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)",
      color: "white",
      padding: isMobile ? "8px 14px" : "10px 20px",
      borderRadius: isMobile ? "14px" : "12px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: isMobile ? "12px" : "14px",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "6px" : "8px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: isMobile 
        ? "0 4px 16px rgba(79, 195, 247, 0.35), 0 2px 6px rgba(0, 0, 0, 0.1)" 
        : "0 4px 16px rgba(79, 195, 247, 0.35), 0 2px 8px rgba(0, 0, 0, 0.08)",
      letterSpacing: "0.3px",
      position: "relative",
      overflow: "hidden",
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      minWidth: isMobile ? "80px" : "110px",
      ":hover": {
        background: "linear-gradient(135deg, #03A9F4 0%, #0288D1 100%)",
        transform: "translateY(-2px)",
        boxShadow: isMobile 
          ? "0 6px 20px rgba(79, 195, 247, 0.4), 0 3px 8px rgba(0, 0, 0, 0.12)" 
          : "0 6px 20px rgba(79, 195, 247, 0.4), 0 3px 10px rgba(0, 0, 0, 0.1)",
      },
      ":active": {
        transform: "translateY(0px)",
        boxShadow: isMobile 
          ? "0 3px 12px rgba(79, 195, 247, 0.3)" 
          : "0 3px 12px rgba(79, 195, 247, 0.3)",
      },
    },
    profileButton: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "8px" : "8px",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      padding: isMobile ? "6px" : "4px",
      borderRadius: isMobile ? "20px" : "24px",
      transition: "all 0.3s ease",
      ":hover": {
        backgroundColor: "rgba(0, 123, 255, 0.05)",
        transform: "scale(1.05)",
      },
    },
    profileImage: {
      width: isMobile ? "36px" : "36px",
      height: isMobile ? "36px" : "36px",
      borderRadius: "50%",
      objectFit: "cover",
      border: isMobile ? "2px solid rgba(0, 123, 255, 0.2)" : "2px solid transparent",
      transition: "all 0.3s ease",
      boxShadow: isMobile 
        ? "0 4px 12px rgba(0, 0, 0, 0.15)" 
        : "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    profileName: { 
      fontSize: "14px", 
      fontWeight: "500", 
      color: "#222",
      letterSpacing: "0.3px",
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 12px)",
      right: 0,
      backgroundColor: "#fff",
      borderRadius: isMobile ? "18px" : "16px",
      boxShadow: isMobile 
        ? "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08)" 
        : "0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)",
      padding: 0,
      minWidth: isMobile ? "300px" : "280px",
      zIndex: 1100,
      border: "1px solid rgba(0, 0, 0, 0.06)",
      backdropFilter: "blur(20px)",
      webkitBackdropFilter: "blur(20px)",
      overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    },
    dropdownItem: {
      padding: isMobile ? "16px 24px" : "14px 20px",
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "14px" : "12px",
      color: "#374151",
      textDecoration: "none",
      fontSize: isMobile ? "15px" : "14px",
      fontWeight: "500",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      ":hover": {
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        color: "#1d4ed8",
      },
    },
    dropdownDivider: {
      height: "1px",
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      margin: isMobile ? "12px 24px" : "8px 0",
    },
    notificationButton: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      padding: isMobile ? "10px" : "8px",
      color: "#222",
      position: "relative",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      ":hover": {
        backgroundColor: "rgba(0, 123, 255, 0.08)",
        transform: "scale(1.1)",
      },
      ":active": {
        transform: "scale(0.95)",
      },
    },
    notificationBadge: {
      position: "absolute",
      top: isMobile ? "6px" : "4px",
      right: isMobile ? "6px" : "4px",
      backgroundColor: "#e74c3c",
      color: "white",
      borderRadius: "50%",
      width: isMobile ? "10px" : "8px",
      height: isMobile ? "10px" : "8px",
      fontSize: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px solid white",
      animation: "pulse 2s infinite",
    },
  };

  return (
    <>
      {/* Google Fonts - Preload for better performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap" 
        rel="stylesheet" 
      />
      
      <style jsx global>{`
        /* Global Font Application */
        *, *::before, *::after {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif !important;
        }

        /* Header specific styles */
        .header-component {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }

        .header-component * {
          font-family: inherit !important;
        }

        /* Typography classes */
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }

        .font-poppins {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }

        .font-roboto {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }

        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .mobile-nav-item {
          animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }

        .mobile-nav-item:nth-child(1) { animation-delay: 0.1s; }
        .mobile-nav-item:nth-child(2) { animation-delay: 0.15s; }
        .mobile-nav-item:nth-child(3) { animation-delay: 0.2s; }
        .mobile-nav-item:nth-child(4) { animation-delay: 0.25s; }
        .mobile-nav-item:nth-child(5) { animation-delay: 0.3s; }

        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .mobile-menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1050;
          opacity: ${isMobileMenuOpen ? 1 : 0};
          visibility: ${isMobileMenuOpen ? 'visible' : 'hidden'};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dropdown-animation {
          animation: dropdownSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Navigation link hover effects */
        .nav-link-hover:hover {
          color: #3B82F6 !important;
          transform: translateY(-1px);
        }

        /* Button font styles */
        button, .button {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
          font-weight: 500;
          letter-spacing: 0.025em;
        }

        /* Input and form elements */
        input, select, textarea {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }

        /* Enhanced Login Button Styles */
        .login-button-enhanced {
          background: linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%) !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .login-button-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transition: left 0.4s;
        }

        .login-button-enhanced:hover::before {
          left: 100%;
        }

        .login-button-enhanced:hover {
          background: linear-gradient(135deg, #03A9F4 0%, #0288D1 100%) !important;
          transform: translateY(-1px) !important;
        }

        .login-button-enhanced:active {
          transform: translateY(0px) !important;
        }

        /* Mobile specific login button */
        @media (max-width: 768px) {
          .login-button-enhanced {
            min-width: 80px !important;
            justify-content: center !important;
          }
        }
      `}</style>

      {/* Mobile Menu Backdrop */}
      {isMobile && (
        <div 
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header style={styles.headerWrapper} className="header-component font-inter">
        <nav style={styles.mainNav}>
          {/* Left side - Mobile menu button (only on mobile/tablet) */}
          {isTablet && (
            <div style={styles.leftMenu}>
              <button
                style={styles.mobileMenuButton}
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
                className="font-inter"
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  transition: 'all 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}>
                  {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </div>
              </button>
            </div>
          )}

          {/* Center - Logo */}
          <Link 
            to="/" 
            style={styles.logoContainer} 
            onClick={closeAllMenus} 
            className="font-inter"
            title="Learnly - Online Learning Platform"
          >
            <img 
              src="/learnly.png" 
              alt="Learnly Logo" 
              style={styles.logoImage}
              loading="eager"
              onError={(e) => {
                console.log('Logo failed to load, using fallback');
                e.target.style.display = 'none';
                // Create fallback logo
                const fallback = document.createElement('div');
                fallback.style.cssText = `
                  width: ${isMobile ? '44px' : '70px'};
                  height: ${isMobile ? '44px' : '70px'};
                  background: linear-gradient(135deg, #007bff, #0056b3);
                  border-radius: ${isMobile ? '8px' : '10px'};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: ${isMobile ? '20px' : '32px'};
                  font-weight: 700;
                  font-family: 'Inter', sans-serif;
                  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                `;
                fallback.textContent = 'L';
                fallback.title = '';
                e.target.parentNode.insertBefore(fallback, e.target);
              }}
            />
            {!isMobile && (
              <h1 style={styles.logoText} className="font-poppins">
               
              </h1>
            )}
          </Link>

          {/* Desktop Navigation Links (hidden on mobile/tablet) */}
          <div style={styles.desktopNavLinks} className="font-inter">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={styles.desktopNavLink(isActive(item.path))}
                className="nav-link-hover font-inter"
              >
                {React.cloneElement(item.icon, { size: 16 })}
                <span className="font-inter">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Login/Profile + Notification */}
          <div style={styles.rightMenu} className="font-inter">
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <button 
                  style={styles.notificationButton}
                  aria-label="Notifications"
                  className="font-inter"
                >
                  <FiBell size={isMobile ? 20 : 20} />
                  <div style={styles.notificationBadge}></div>
                </button>
                
                {/* Profile Dropdown */}
                <div style={{ position: "relative" }} ref={profileRef} className="font-inter">
                  <button
                    style={styles.profileButton}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="font-inter"
                  >
                    <img
                      src={getUserPhoto()}
                      alt="Profile"
                      style={styles.profileImage}
                    />
                    {/* Only show name and chevron on desktop */}
                    {!isTablet && (
                      <>
                        <span style={styles.profileName} className="font-inter">{getDisplayName()}</span>
                        <FiChevronDown size={16} />
                      </>
                    )}
                  </button>
                  {isProfileOpen && (
                    <div style={styles.dropdown} className="dropdown-animation font-inter">
                      {/* Profile Header */}
                      <div style={{ 
                        padding: "20px 24px 16px 24px",
                        borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
                        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 197, 253, 0.05))",
                      }} className="font-inter">
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "8px",
                        }}>
                          <img
                            src={getUserPhoto()}
                            alt="Profile"
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "3px solid rgba(59, 130, 246, 0.2)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <div>
                            <div style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#111827",
                              marginBottom: "2px",
                              fontFamily: "'Inter', sans-serif",
                            }} className="font-inter">
                              {getDisplayName()}
                            </div>
                            <div style={{
                              fontSize: "13px",
                              color: "#6B7280",
                              fontFamily: "'Inter', sans-serif",
                            }} className="font-inter">
                              {userData?.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: "8px 0" }} className="font-inter">
                        <Link
                          to="/dashboard"
                          style={{
                            ...styles.dropdownItem,
                            borderBottom: "1px solid rgba(229, 231, 235, 0.6)",
                          }}
                          onClick={closeAllMenus}
                          className="font-inter"
                        >
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <FiUser size={16} color="#3B82F6" />
                          </div>
                          <span className="font-inter">Dashboard</span>
                        </Link>
                        
                        <button
                          style={{
                            ...styles.dropdownItem,
                            width: "100%",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#DC2626",
                            fontWeight: "500",
                          }}
                          onClick={handleLogout}
                          className="font-inter"
                        >
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(220, 38, 38, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <FiLogOut size={16} color="#DC2626" />
                          </div>
                          <span className="font-inter">Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // If LOGGED OUT, show Login button
              <button 
                onClick={handleSignInClick} 
                style={styles.loginButton} 
                className="font-inter login-button-enhanced"
                title="Sign in to your account"
              >
                <FiLogIn size={isMobile ? 14 : 16} />
                <span className="font-inter" style={{ fontWeight: '600' }}>
                  {isMobile ? 'Login' : 'Sign In'}
                </span>
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay - Clean laptop design */}
      {(isMobile || isMobileMenuOpen) && (
        <div ref={mobileMenuRef} style={styles.mobileMenuOverlay} className="font-inter">
          {/* Header with close button - Mobile Only */}
          {isMobile && (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            }} className="font-inter">
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#222",
                margin: 0,
                letterSpacing: "-0.3px",
              }} className="font-inter">
                Menu
              </h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  color: "#666",
                }}
                className="font-inter"
              >
                <FiX size={18} />
              </button>
            </div>
          )}

          {/* Nav items - Clean design for both mobile and tablet */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "0" : "20px",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: isMobile ? "flex-start" : "center",
            padding: isMobile ? "0" : "10px 0",
          }}>
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.mobileNavLink,
                  ...(isMobile ? {} : {
                    marginBottom: "0",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    background: "transparent",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#222",
                    textAlign: "center",
                    minWidth: "120px",
                    justifyContent: "center",
                  })
                }}
                className={`${isMobile ? 'mobile-nav-item' : ''} font-inter`}
                onClick={closeAllMenus}
              >
                <div style={{
                  padding: isMobile ? "8px" : "6px",
                  backgroundColor: isMobile ? "rgba(0, 123, 255, 0.1)" : "rgba(0, 123, 255, 0.08)",
                  borderRadius: isMobile ? "10px" : "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: isMobile ? "36px" : "28px",
                  height: isMobile ? "36px" : "28px",
                }}>
                  {React.cloneElement(item.icon, { size: isMobile ? 18 : 16 })}
                </div>
                <span style={{ 
                  flex: isMobile ? 1 : "none",
                  marginLeft: isMobile ? "0" : "8px",
                }} className="font-inter">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

export default Header;
