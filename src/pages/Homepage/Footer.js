import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaArrowUp, FaHeart } from 'react-icons/fa';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Google Fonts import
const googleFontsLink = document.createElement('link');
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&display=swap';
googleFontsLink.rel = 'stylesheet';
if (!document.querySelector(`link[href="${googleFontsLink.href}"]`)) {
  document.head.appendChild(googleFontsLink);
}

const defaultTheme = {
  colors: {
    lightGrayBg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    darkBg: '#0f1419',
    text: '#1e40af',
    textSecondary: '#3b82f6',
    secondary: '#2563eb',
    primary: '#1d4ed8',
    accent: '#2563eb',
    white: '#FFFFFF',
    border: 'rgba(79, 195, 247, 0.2)',
    cardBg: 'rgba(33, 150, 243, 0.1)',
    hover: 'rgba(79, 195, 247, 0.15)'
  },
  font: "'Inter', 'Roboto', 'Open Sans', 'Lato', sans-serif"
};

// Modern animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const FooterContainer = styled.footer(({ theme = defaultTheme }) => ({
  background: 'rgba(173, 216, 230, 0.15)',
  color: theme.colors.text,
  fontFamily: theme.font,
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(3px)',
  borderTop: '1px solid rgba(173, 216, 230, 0.25)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.01"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    zIndex: 0,
  }
}));

const TopFooter = styled.div(({ theme = defaultTheme }) => ({
  padding: '15px 3%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '15px',
  position: 'relative',
  zIndex: 1,
  background: theme.colors.cardBg,
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${theme.colors.border}`,
  animation: `${fadeInUp} 0.8s ease-out`,
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    textAlign: 'center',
    padding: '12px 3%',
    gap: '10px',
  },
  '@media (max-width: 480px)': {
    padding: '10px 2%',
    gap: '8px',
  },
}));

const SignUpText = styled.h3(({ theme = defaultTheme }) => ({
  fontSize: 'clamp(14px, 2vw, 18px)',
  fontWeight: 500,
  color: theme.colors.primary,
  margin: 0,
  minWidth: '200px',
  flex: 1,
  textShadow: '0 2px 10px rgba(79, 195, 247, 0.3)',
  background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.accent})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  '@media (max-width: 768px)': {
    minWidth: 'auto',
    textAlign: 'center',
    fontSize: '16px',
  },
  '@media (max-width: 480px)': {
    fontSize: '14px',
  },
}));

const SubscribeForm = styled.form(({ theme = defaultTheme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '320px',
  minWidth: '180px',
  flex: 2,
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  borderRadius: '6px',
  overflow: 'hidden',
  background: theme.colors.white,
  '@media (max-width: 768px)': {
    maxWidth: '100%',
    minWidth: '240px',
  },
  '@media (max-width: 480px)': {
    minWidth: '200px',
  },
}));

const EmailInput = styled.input(({ theme = defaultTheme }) => ({
  flex: 1,
  padding: '8px 15px',
  border: 'none',
  fontSize: '12px',
  color: theme.colors.darkBg,
  background: 'transparent',
  '&:focus': {
    outline: 'none',
  },
  '&::placeholder': {
    color: '#999',
  },
  '@media (max-width: 480px)': {
    padding: '6px 12px',
    fontSize: '11px',
  },
}));

const SubscribeButton = styled.button(({ theme = defaultTheme }) => ({
  padding: '8px 18px',
  background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.accent})`,
  color: theme.colors.white,
  border: 'none',
  fontWeight: 600,
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(79, 195, 247, 0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
  '@media (max-width: 480px)': {
    padding: '6px 15px',
    fontSize: '11px',
  },
}));

const MainFooter = styled.div(({ theme = defaultTheme }) => ({
  padding: '20px 3%',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '20px',
  position: 'relative',
  zIndex: 1,
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '15px',
    padding: '15px 3%',
  },
  '@media (max-width: 480px)': {
    padding: '12px 2%',
    gap: '12px',
    alignItems: 'center',
  },
}));

const FooterColumn = styled.div(({ theme = defaultTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  flex: 1,
  minWidth: '200px',
  transition: 'all 0.3s ease',
  '@media (max-width: 768px)': {
    textAlign: 'center',
    alignItems: 'center',
    minWidth: 'auto',
    width: '100%',
  },
  '@media (max-width: 480px)': {
    minWidth: 'auto',
    alignItems: 'center',
  },
}));

const ColTitle = styled.h4(({ theme = defaultTheme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: theme.colors.primary,
  marginBottom: '15px',
  textAlign: 'center',
  position: 'relative',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  width: '100%',
  '@media (max-width: 768px)': {
    fontSize: '15px',
    textAlign: 'center',
    marginBottom: '12px',
  },
  '@media (max-width: 480px)': {
    fontSize: '14px',
    marginBottom: '10px',
  },
}));

const ContactItem = styled.div(({ theme = defaultTheme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '4px',
  fontSize: '14px',
  lineHeight: 1.3,
  color: theme.colors.textSecondary,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  '&:hover': {
    color: theme.colors.white,
    background: theme.colors.hover,
    transform: 'translateY(-2px)',
  },
  '@media (max-width: 768px)': {
    fontSize: '13px',
    justifyContent: 'flex-start',
    textAlign: 'left',
    gap: '4px',
    marginBottom: '3px',
    padding: '3px',
  },
  '@media (max-width: 480px)': {
    fontSize: '12px',
    gap: '4px',
    marginBottom: '3px',
    padding: '3px',
    flexDirection: 'column',
    textAlign: 'center',
  },
}));

const ContactIcon = styled.div(({ theme = defaultTheme }) => ({
  minWidth: '32px',
  height: '32px',
  borderRadius: '50%',
  background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.accent})`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.colors.white,
  fontSize: '14px',
  boxShadow: '0 3px 10px rgba(79, 195, 247, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 5px 15px rgba(79, 195, 247, 0.4)',
  },
  '@media (max-width: 768px)': {
    minWidth: '28px',
    height: '28px',
    fontSize: '12px',
  },
  '@media (max-width: 480px)': {
    minWidth: '24px',
    height: '24px',
    fontSize: '10px',
  },
}));

const FooterLink = styled(Link)(({ theme = defaultTheme }) => ({
  display: 'inline-block',
  color: theme.colors.textSecondary,
  textDecoration: 'none',
  marginBottom: '8px',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  padding: '6px 12px',
  borderRadius: '18px',
  background: theme.colors.cardBg,
  border: `1px solid ${theme.colors.border}`,
  '&:hover': {
    color: theme.colors.white,
    background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.accent})`,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(79, 195, 247, 0.3)',
  },
  '@media (max-width: 768px)': {
    fontSize: '13px',
    textAlign: 'center',
    padding: '5px 10px',
    '&:hover': {
      transform: 'translateY(-1px)',
    },
  },
  '@media (max-width: 480px)': {
    fontSize: '12px',
    marginBottom: '6px',
    padding: '4px 8px',
  },
}));

const SocialItem = styled.div(({ theme = defaultTheme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: '0px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  '@media (max-width: 768px)': {
    justifyContent: 'center',
  },
}));

const SocialLink = styled.a(({ theme = defaultTheme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: theme.colors.textSecondary,
  textDecoration: 'none',
  fontSize: '13px',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  padding: '8px 12px',
  borderRadius: '25px',
  background: theme.colors.cardBg,
  border: `1px solid ${theme.colors.border}`,
  minWidth: '100px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    color: theme.colors.white,
    background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.accent})`,
    transform: 'translateY(-3px) scale(1.05)',
    boxShadow: '0 8px 25px rgba(79, 195, 247, 0.4)',
    border: `1px solid ${theme.colors.primary}`,
  },
  '&:hover::before': {
    left: '100%',
  },
  '&:active': {
    transform: 'translateY(-1px) scale(1.02)',
  },
  '@media (max-width: 768px)': {
    fontSize: '12px',
    minWidth: '90px',
    justifyContent: 'center',
    padding: '6px 10px',
  },
  '@media (max-width: 480px)': {
    fontSize: '11px',
    minWidth: '80px',
    padding: '5px 8px',
    gap: '4px',
  },
}));

const BottomFooter = styled.div(({ theme = defaultTheme }) => ({
  padding: '12px 3%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  fontSize: '12px',
  borderTop: `1px solid ${theme.colors.border}`,
  gap: '15px',
  position: 'relative',
  zIndex: 1,
  background: theme.colors.cardBg,
  backdropFilter: 'blur(10px)',
  '@media (max-width: 768px)': {
    flexDirection: 'row',
    textAlign: 'center',
    padding: '10px 3%',
    gap: '12px',
  },
  '@media (max-width: 480px)': {
    padding: '8px 2%',
    gap: '8px',
    flexDirection: 'column',
  },
}));

const LogoBottom = styled(Link)(({ theme = defaultTheme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '16px',
  fontWeight: 600,
  color: theme.colors.primary,
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  textShadow: '0 2px 10px rgba(79, 195, 247, 0.3)',
  '&:hover': {
    transform: 'scale(1.02)',
    textShadow: '0 3px 12px rgba(79, 195, 247, 0.5)',
  },
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
  '@media (max-width: 480px)': {
    fontSize: '12px',
  },
}));

const BottomLinks = styled.div(({ theme = defaultTheme }) => ({
  display: 'flex',
  gap: '15px',
  alignItems: 'center',
  '@media (max-width: 768px)': {
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  '@media (max-width: 480px)': {
    flexDirection: 'row',
    gap: '8px',
    justifyContent: 'center',
  },
  '& a': {
    color: theme.colors.textSecondary,
    textDecoration: 'none',
    fontSize: '12px',
    transition: 'all 0.3s ease',
    padding: '6px 12px',
    borderRadius: '15px',
    background: theme.colors.cardBg,
    border: `1px solid ${theme.colors.border}`,
    whiteSpace: 'nowrap',
    '&:hover': {
      color: theme.colors.white,
      background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.accent})`,
      transform: 'translateY(-1px)',
      boxShadow: '0 3px 10px rgba(79, 195, 247, 0.3)',
    },
    '@media (max-width: 480px)': {
      fontSize: '11px',
      padding: '4px 8px',
    },
  },
}));

const Copyright = styled.span(({ theme = defaultTheme }) => ({
  color: theme.colors.textSecondary,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '11px',
  whiteSpace: 'nowrap',
  '@media (max-width: 768px)': {
    justifyContent: 'center',
  },
  '@media (max-width: 480px)': {
    fontSize: '10px',
  },
}));

const ScrollToTop = styled.button(({ theme = defaultTheme }) => ({
  position: 'fixed',
  bottom: '15px',
  right: '15px',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.accent})`,
  border: 'none',
  color: theme.colors.white,
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  zIndex: 1000,
  boxShadow: '0 2px 8px rgba(79, 195, 247, 0.3)',
  transform: 'translateY(60px)',
  opacity: 0,
  '&.visible': {
    transform: 'translateY(0)',
    opacity: 1,
  },
  '&:hover': {
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 4px 12px rgba(79, 195, 247, 0.5)',
  },
  '@media (max-width: 768px)': {
    bottom: '12px',
    right: '12px',
    width: '28px',
    height: '28px',
    fontSize: '10px',
  },
  '@media (max-width: 480px)': {
    bottom: '8px',
    right: '8px',
    width: '24px',
    height: '24px',
    fontSize: '8px',
  },
}));

const Footer = ({ theme }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const mergedTheme = {
    ...defaultTheme,
    ...theme,
    colors: {
      ...defaultTheme.colors,
      ...(theme?.colors || {})
    }
  };

  // Handle scroll to top visibility
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <FooterContainer theme={mergedTheme}>
      <MainFooter theme={mergedTheme}>
        <FooterColumn theme={mergedTheme}>
          <ColTitle theme={mergedTheme}>Get in touch</ColTitle>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: '10px', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '15px 0',
            width: '100%'
          }}>
            <ContactItem theme={mergedTheme} style={{ 
              flex: '1', 
              minWidth: '100px', 
              maxWidth: '120px',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 8px',
              textAlign: 'center',
              margin: '0 auto'
            }}>
              <ContactIcon theme={mergedTheme}><FaPhoneAlt /></ContactIcon>
              <div style={{ whiteSpace: 'nowrap', fontSize: '12px', lineHeight: '1.3' }}>
                <div style={{ fontWeight: '600', color: '#1d4ed8', marginBottom: '2px' }}>Call Us</div>
                <div>+91 987654321</div>
              </div>
            </ContactItem>
            <ContactItem theme={mergedTheme} style={{ 
              flex: '1', 
              minWidth: '100px', 
              maxWidth: '120px',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 8px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.02)',
              textAlign: 'center',
              margin: '0 auto'
            }}>
              <ContactIcon theme={mergedTheme}><FaMapMarkerAlt /></ContactIcon>
              <div style={{ whiteSpace: 'nowrap', fontSize: '12px', lineHeight: '1.3' }}>
                <div style={{ fontWeight: '600', color: '#1d4ed8', marginBottom: '2px' }}>Visit Us</div>
                <div>Tamilnadu, India</div>
              </div>
            </ContactItem>
            <ContactItem theme={mergedTheme} style={{ 
              flex: '1', 
              minWidth: '100px', 
              maxWidth: '120px',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 8px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.02)',
              textAlign: 'center',
              margin: '0 auto'
            }}>
              <ContactIcon theme={mergedTheme}><FaEnvelope /></ContactIcon>
              <div style={{ whiteSpace: 'nowrap', fontSize: '12px', lineHeight: '1.3' }}>
                <div style={{ fontWeight: '600', color: '#1d4ed8', marginBottom: '2px' }}>Email Us</div>
                <div>contact@learnly.com</div>
              </div>
            </ContactItem>
          </div>
        </FooterColumn>

        <FooterColumn theme={mergedTheme}>
          <ColTitle theme={mergedTheme}>Popular Courses</ColTitle>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: '8px', 
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            <FooterLink to="/courses/siddha" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>Siddha Medicine</FooterLink>
            <FooterLink to="/courses/ayurveda" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>Ayurveda</FooterLink>
            <FooterLink to="/courses/varma" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>Varma Therapy</FooterLink>
            <FooterLink to="/courses/yoga" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>Yoga & Meditation</FooterLink>
            <FooterLink to="/courses/naturopathy" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>Naturopathy</FooterLink>
          </div>
        </FooterColumn>

        <FooterColumn theme={mergedTheme}>
          <ColTitle theme={mergedTheme}>Connect With Us</ColTitle>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: '8px', 
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '280px',
            margin: '0 auto'
          }}>
            <SocialItem theme={mergedTheme}>
              <SocialLink href="https://youtube.com" target="_blank" theme={mergedTheme}>
                <FaYoutube size={12} color="#FF0000" /> YouTube
              </SocialLink>
            </SocialItem>
            <SocialItem theme={mergedTheme}>
              <SocialLink href="https://facebook.com" target="_blank" theme={mergedTheme}>
                <FaFacebookF size={12} color="#1877F2" /> Facebook
              </SocialLink>
            </SocialItem>
            <SocialItem theme={mergedTheme}>
              <SocialLink href="https://instagram.com" target="_blank" theme={mergedTheme}>
                <FaInstagram size={12} color="#C13584" /> Instagram
              </SocialLink>
            </SocialItem>
            <SocialItem theme={mergedTheme}>
              <SocialLink href="https://twitter.com" target="_blank" theme={mergedTheme}>
                <FaTwitter size={12} color="#1DA1F2" /> Twitter
              </SocialLink>
            </SocialItem>
          </div>
        </FooterColumn>

        <FooterColumn theme={mergedTheme}>
          <ColTitle theme={mergedTheme}>Quick Links</ColTitle>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: '8px', 
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            <FooterLink to="/about" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>About Us</FooterLink>
            <FooterLink to="/courses" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>All Courses</FooterLink>
            <FooterLink to="/blog" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>Blog</FooterLink>
            <FooterLink to="/contact" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>Contact</FooterLink>
            <FooterLink to="/faq" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>FAQ</FooterLink>
            <FooterLink to="/support" theme={mergedTheme} style={{ marginBottom: '4px', whiteSpace: 'nowrap' }}>Support</FooterLink>
          </div>
        </FooterColumn>
      </MainFooter>

      <BottomFooter theme={mergedTheme}>
        <LogoBottom to="/" theme={mergedTheme}>
          🌿 Learnly
        </LogoBottom>
        <BottomLinks theme={mergedTheme}>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </BottomLinks>
        <Copyright theme={mergedTheme}>
          © 2025 Learnly. Made with <FaHeart color="#ff6b6b" /> in India
        </Copyright>
      </BottomFooter>

      <ScrollToTop
        className={showScrollTop ? 'visible' : ''}
        onClick={scrollToTop}
        theme={mergedTheme}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </ScrollToTop>
    </FooterContainer>
  );
};

export default Footer;
