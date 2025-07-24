// src/pages/HomePageContent.js
import { Fade, Zoom, Slide } from "react-awesome-reveal";
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeProvider, keyframes } from "styled-components";
import {
  FaStar,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookMedical,
  FaHandHoldingHeart,
  FaLeaf,
  FaLaptopCode,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaInfinity,
  FaGraduationCap,
  FaCertificate,
  FaUsers,
  FaClock,
  FaHeart,
  FaShieldAlt,
  FaLightbulb,
} from "react-icons/fa";

// Google Fonts Import
const GoogleFontsLink = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return null;
};

// --- MODERN ANIMATIONS ---
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(60px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const fadeInScale = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
`;

const morphBackground = keyframes`
  0%, 100% { 
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  25% { 
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
  50% { 
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  75% { 
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
`;

const brandGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px rgba(102, 126, 234, 0.5),
                 0 0 40px rgba(102, 126, 234, 0.3),
                 0 0 60px rgba(102, 126, 234, 0.1);
  }
  50% { 
    text-shadow: 0 0 30px rgba(118, 75, 162, 0.6),
                 0 0 50px rgba(118, 75, 162, 0.4),
                 0 0 70px rgba(118, 75, 162, 0.2);
  }
`;

// --- ENHANCED LEARNLY THEME ---
const theme = {
  colors: {
    // LEARNLY Brand Colors
    primary: "#667eea",
    primaryDark: "#5a67d8",
    primaryLight: "#e6fffa",
    secondary: "#764ba2",
    secondaryLight: "#f093fb",
    tertiary: "#4facfe",
    accent: "#f5576c",
    // Neutral Colors
    dark: "#2d3748",
    darkLight: "#4a5568",
    text: "#2d3748",
    textLight: "#718096",
    textDark: "#1a202c",
    // Background Colors
    white: "#ffffff",
    gray50: "#f7fafc",
    gray100: "#edf2f7",
    gray200: "#e2e8f0",
    gray300: "#cbd5e0",
    gray800: "#2d3748",
    gray900: "#1a202c",
    // Semantic Colors
    success: "#38b2ac",
    warning: "#ed8936",
    error: "#e53e3e",
    // LEARNLY Gradients
    gradient1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    gradient2: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    gradient3: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    gradient4: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
    glassBg: "rgba(255, 255, 255, 0.85)",
    glassBlur: "rgba(255, 255, 255, 0.25)",
  },
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary: "'Playfair Display', serif",
    accent: "'Poppins', sans-serif",
    brand: "'Montserrat', sans-serif",
  },
  shadows: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    base: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    md: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    lg: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    glow: "0 0 20px rgba(102, 126, 234, 0.4)",
    glowHover: "0 0 40px rgba(102, 126, 234, 0.6)",
    brandGlow: "0 0 30px rgba(118, 75, 162, 0.3)",
  },
  spacing: {
    xs: "0.375rem",
    sm: "0.75rem",
    md: "1.25rem",
    lg: "1.75rem",
    xl: "2.5rem",
    xxl: "3.5rem",
    section: "4rem 1.25rem",
    sectionLg: "6rem 1.75rem",
  },
  radii: {
    xs: "0.125rem",
    sm: "0.25rem",
    base: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    xxl: "1.5rem",
    full: "9999px",
  },
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    xxl: "1536px",
  },
  transitions: {
    fast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// --- GLOBAL STYLES ---
const GlobalContainer = styled.div`
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  background: ${({ theme }) => theme.colors.gray50};
  overflow-x: hidden;
  min-height: 100vh;
  
  * {
    box-sizing: border-box;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.textDark};
    line-height: 1.2;
    margin: 0 0 1rem 0;
    font-weight: 700;
    letter-spacing: -0.025em;
  }
  
  h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-family: ${({ theme }) => theme.fonts.secondary};
  }
  
  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-family: ${({ theme }) => theme.fonts.secondary};
  }
  
  h3 {
    font-size: clamp(1.5rem, 3vw, 2rem);
  }
  
  p {
    margin: 0 0 1.25rem 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: clamp(1rem, 2vw, 1.125rem);
  }
  
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: ${({ theme }) => theme.transitions.base};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  img {
    max-width: 90%;
    height: auto;
    border-radius: ${({ theme }) => theme.radii.lg};
  }
  
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }
`;

// --- MODERN SECTION COMPONENTS ---
const Section = styled.section`
  padding: 3rem 1.5rem;
  position: relative;
  overflow: hidden;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 4rem 2rem;
  }
  
  &.hero {
    padding: 0;
    height: 85vh;
    min-height: 600px;
    max-height: 800px;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      height: 75vh;
      min-height: 500px;
    }
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      height: 65vh;
      min-height: 450px;
    }
  }
  
  &.glass {
    background: ${({ theme }) => theme.colors.glassBg};
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  &.gradient-bg {
    background: ${({ theme }) => theme.colors.gradient1};
    animation: ${morphBackground} 25s ease-in-out infinite;
  }
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.xxl};
  margin: 0 auto;
  padding: 0 1.25rem;
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 1.5rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding: 0 2rem;
  }
`;

// --- ENHANCED HERO SECTION ---
const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ bgImage }) => `url(${bgImage})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  transform: scale(1.05);
  transition: transform 10s ease-out;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background-attachment: scroll;
    background-size: cover;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.3) 0%,
      rgba(118, 75, 162, 0.25) 50%,
      rgba(79, 172, 254, 0.2) 100%
    );
    backdrop-filter: blur(2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  max-width: 900px;
  padding: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem;
  }
`;

const LearnlyBrand = styled.div`
  margin-bottom: 2rem;
  animation: ${slideUp} 1s ease-out;
`;

const LearnlyLogo = styled.h1`
  font-family: ${({ theme }) => theme.fonts.brand};
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 900;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e6fffa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${brandGlow} 3s ease-in-out infinite alternate;
  text-transform: uppercase;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, transparent, #ffffff, transparent);
    border-radius: 2px;
  }
`;

const LearnlyTagline = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-bottom: 0;
  font-family: ${({ theme }) => theme.fonts.accent};
`;

const HeroTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 1s ease-out 0.2s both;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 1s ease-out 0.4s both;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtonGroup = styled.div`
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${slideUp} 1s ease-out 0.6s both;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: ${({ theme }) => theme.transitions.spring};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.brandGlow};
    background: ${({ theme }) => theme.colors.gradient1};
    color: ${({ theme }) => theme.colors.white};
    border-color: rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.875rem 2rem;
    font-size: 0.95rem;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.white};
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: ${({ theme }) => theme.transitions.spring};
  backdrop-filter: blur(15px);
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    background: rgba(255, 255, 255, 0.2);
    border-color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.875rem 2rem;
    font-size: 0.95rem;
  }
`;

// --- MODERN FEATURE CARDS ---
const FeaturesSection = styled(Section)`
  background: ${({ theme }) => theme.colors.white};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.gradient1};
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 4rem;
  }
`;

const Eyebrow = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryLight} 0%, rgba(102, 126, 234, 0.1) 100%);
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.9rem;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &::after {
    content: 'LEARNLY';
    position: absolute;
    top: -0.5rem;
    right: 0;
    font-size: 0.6rem;
    color: ${({ theme }) => theme.colors.accent};
    font-family: ${({ theme }) => theme.fonts.brand};
    font-weight: 900;
    letter-spacing: 0.1em;
    opacity: 0.3;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      display: none;
    }
  }
`;

const SectionDescription = styled.p`
  font-size: clamp(1.05rem, 2.2vw, 1.2rem);
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.7;
  max-width: 650px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 2rem 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.base};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  transition: ${({ theme }) => theme.transitions.spring};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.05), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.primary};
    
    &::before {
      left: 100%;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem 1rem;
  }
`;

const FeatureIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.tertiary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
  transition: ${({ theme }) => theme.transitions.spring};
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${float} 6s ease-in-out infinite;
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    animation-play-state: paused;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 4.5rem;
    height: 4.5rem;
    font-size: 1.6rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.accent};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.4rem;
  }
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.95rem;
  line-height: 1.5;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

// --- MODERN COURSE CARDS ---
const CoursesSection = styled(Section)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.gray50} 0%, ${({ theme }) => theme.colors.primaryLight} 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231d4ed8' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

const CoursesCarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  
  &:hover .nav-arrow {
    opacity: 1;
    visibility: visible;
  }
`;

const NavArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radii.full};
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: ${({ theme }) => theme.transitions.spring};
  opacity: 0;
  visibility: hidden;
  backdrop-filter: blur(10px);
  
  ${({ left }) => left && `left: 1rem;`}
  ${({ right }) => right && `right: 1rem;`}
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-50%) scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.glowHover};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const CoursesContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 1.5rem 3rem;
  }
`;

const CourseCard = styled.div`
  min-width: 320px;
  max-width: 360px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  transition: ${({ theme }) => theme.transitions.spring};
  position: relative;
  
  &:hover {
    transform: translateY(-10px) scale(1.01);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-width: 280px;
  }
`;

const CourseImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray100};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: ${({ theme }) => theme.transitions.slow};
  }
  
  ${CourseCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CourseOverlay = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  right: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CourseCategory = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.4rem 0.8rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid ${({ theme }) => theme.colors.primaryDark};
`;

const CourseContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.accent};
  line-height: 1.3;
  margin-bottom: 0.25rem;
`;

const CourseInstructor = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &::before {
    content: '👨‍🏫';
    font-size: 0.9rem;
  }
`;

const CourseStats = styled.div`
  display: flex;
  gap: 1.2rem;
  margin: 0.75rem 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const CourseStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CourseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const CoursePrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Price = styled.span`
  font-weight: 700;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.primary};
  
  &.free {
    color: ${({ theme }) => theme.colors.success};
  }
`;

const OriginalPrice = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: line-through;
  margin-left: 0.4rem;
`;

const CourseRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  
  svg {
    color: ${({ theme }) => theme.colors.warning};
  }
`;

const ViewCourseButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.tertiary} 100%);
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-weight: 600;
  font-size: 0.9rem;
  transition: ${({ theme }) => theme.transitions.spring};
  margin-top: 0.75rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    
    &::before {
      left: 100%;
    }
  }
`;

// --- MODERN CATEGORIES SECTION ---
const CategoriesSection = styled(Section)`
  background: ${({ theme }) => theme.colors.white};
  position: relative;
  overflow: hidden;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding: 1rem 0;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.25rem;
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.radii.xl};
  border: 2px solid transparent;
  transition: ${({ theme }) => theme.transitions.spring};
  text-decoration: none;
  position: relative;
  overflow: hidden;
  min-width: 180px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15 0%, ${({ theme }) => theme.colors.tertiary}15 100%);
    opacity: 0;
    transition: ${({ theme }) => theme.transitions.base};
  }
  
  &:hover {
    transform: translateY(-6px) scale(1.03);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    
    &::before {
      opacity: 1;
    }
  }
`;

const CategoryIconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary} 0%, ${({ theme }) => theme.colors.tertiary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  transition: ${({ theme }) => theme.transitions.spring};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
  z-index: 1;
  
  svg {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.white};
    transition: ${({ theme }) => theme.transitions.base};
  }
  
  ${CategoryCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 0.4rem;
  text-align: center;
  position: relative;
  z-index: 1;
  
  ${CategoryCard}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategoryCount = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
  position: relative;
  z-index: 1;
`;

// --- MAIN COMPONENTS ---

// === HeroSlider COMPONENT ===
const HeroSlider = () => {
  const slidesData = [
    {
      title: "Master Ancient Healing Arts",
      description: "Transform your life with LEARNLY's comprehensive courses in Siddha, Varma, and Ayurveda - time-tested wisdom for modern wellness.",
      bgImage: "/y21.jpg",
    },
    {
      title: "Unlock Your Healing Potential",
      description: "Join thousands of students worldwide who trust LEARNLY for authentic, transformative education in traditional healing arts.",
      bgImage: "/y22.jpg",
    },
    {
      title: "Learn from World-Class Masters",
      description: "Experience LEARNLY's revolutionary approach to ancient wisdom - certified courses designed for the modern learner.",
      bgImage: "/yoga2.jpg",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 8000);
    return () => clearInterval(slideInterval);
  }, [slidesData.length]);

  return (
    <Section className="hero">
      <HeroContainer>
        <HeroBackground bgImage={slidesData[currentSlide].bgImage} />
        <Container>
          <HeroContent>
            <LearnlyBrand>
              <LearnlyLogo>LEARNLY</LearnlyLogo>
              <LearnlyTagline>Your Gateway to Ancient Wisdom</LearnlyTagline>
            </LearnlyBrand>
            <HeroTitle>{slidesData[currentSlide].title}</HeroTitle>
            <HeroSubtitle>{slidesData[currentSlide].description}</HeroSubtitle>
            <HeroButtonGroup>
              <PrimaryButton to="/course">
                <FaGraduationCap />
                Explore Courses
              </PrimaryButton>
              <SecondaryButton to="/blogpage">
                <FaPlay />
                Watch Demo
              </SecondaryButton>
            </HeroButtonGroup>
          </HeroContent>
        </Container>
      </HeroContainer>
    </Section>
  );
};

// === Features COMPONENT ===
const Features = () => (
  <FeaturesSection>
    <Container>
      <Fade direction="up" triggerOnce>
        <SectionHeader>
          <Eyebrow>Why Choose LEARNLY</Eyebrow>
          <SectionTitle>Revolutionary Learning Experience</SectionTitle>
          <SectionDescription>
            LEARNLY combines ancient wisdom with cutting-edge technology to deliver transformative education that fits your modern lifestyle and accelerates your healing journey.
          </SectionDescription>
        </SectionHeader>
      </Fade>
      
      <FeaturesGrid>
        <Fade cascade damping={0.1} direction="up" triggerOnce>
          <FeatureCard>
            <FeatureIcon>
              <FaChalkboardTeacher />
            </FeatureIcon>
            <FeatureTitle>Expert Masters</FeatureTitle>
            <FeatureDescription>
              Learn from certified practitioners with decades of experience in traditional healing arts and modern therapeutic approaches.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaCertificate />
            </FeatureIcon>
            <FeatureTitle>Certified Programs</FeatureTitle>
            <FeatureDescription>
              Earn internationally recognized certifications that validate your expertise and open doors to professional opportunities.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FaInfinity />
            </FeatureIcon>
            <FeatureTitle>Lifetime Access</FeatureTitle>
            <FeatureDescription>
              Enjoy unlimited access to all course materials, updates, and community resources for continuous learning and growth.
            </FeatureDescription>
          </FeatureCard>
        </Fade>
      </FeaturesGrid>
    </Container>
  </FeaturesSection>
);

// === Courses COMPONENT ===
const Courses = () => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const courses = [
    {
      id: 1,
      title: "Siddha Medicine Fundamentals",
      category: "Traditional Medicine",
      instructor: "Dr. Aruna Maharishi",
      price: "Free",
      originalPrice: "₹89",
      rating: 4.9,
      reviews: 234,
      students: "2.1k",
      duration: "12 hours",
      image: "/Siddha.jpg",
      description: "Master the foundational principles of Siddha medicine, including diagnosis, herbal preparations, and holistic treatment approaches."
    },
    {
      id: 2,
      title: "Varma Kalai Mastery",
      category: "Energy Healing",
      instructor: "Master Selvam Kumar",
      price: "₹129",
      originalPrice: "₹199",
      rating: 4.8,
      reviews: 189,
      students: "1.8k",
      duration: "18 hours",
      image: "/y21.jpg",
      description: "Learn the ancient art of Varma Kalai - pressure point therapy for healing, self-defense, and energy manipulation."
    },
    {
      id: 3,
      title: "Ayurvedic Lifestyle Design",
      category: "Holistic Wellness",
      instructor: "Vaidya Priya Sharma",
      price: "89",
      originalPrice: "149",
      rating: 4.7,
      reviews: 312,
      students: "3.2k",
      duration: "15 hours",
      image: "/ad.png",
      description: "Design your perfect Ayurvedic lifestyle with personalized nutrition, daily routines, and seasonal practices."
    },
    {
      id: 4,
      title: "Advanced Yoga Therapy",
      category: "Therapeutic Yoga",
      instructor: "Yogi Ananth Krishnan",
      price: "$79",
      originalPrice: "$129",
      rating: 4.9,
      reviews: 428,
      students: "4.1k",
      duration: "20 hours",
      image: "/yoga2.jpg",
      description: "Specialized yoga therapy techniques for chronic conditions, stress management, and spiritual development."
    },
    {
      id: 5,
      title: "Herbal Medicine Mastery",
      category: "Natural Healing",
      instructor: "Dr. Lakshmi Devi",
      price: "$99",
      originalPrice: "$159",
      rating: 4.8,
      reviews: 267,
      students: "2.7k",
      duration: "16 hours",
      image: "/y25.jpg",
      description: "Comprehensive training in traditional herbal medicine, plant identification, and therapeutic formulations."
    },
  ];

  return (
    <CoursesSection>
      <Container>
        <Fade direction="up" triggerOnce>
          <SectionHeader>
            <Eyebrow>Featured Programs</Eyebrow>
            <SectionTitle>Popular Courses</SectionTitle>
            <SectionDescription>
              Discover our most sought-after programs designed by master practitioners and loved by thousands of students worldwide.
            </SectionDescription>
          </SectionHeader>
        </Fade>
      </Container>

      <CoursesCarouselWrapper>
        <NavArrow className="nav-arrow" left onClick={() => handleScroll("left")}>
          <FaChevronLeft />
        </NavArrow>

        <CoursesContainer ref={scrollContainerRef}>
          {courses.map((course) => (
            <CourseCard key={course.id}>
              <CourseImageContainer>
                <img src={course.image} alt={course.title} loading="lazy" />
                <CourseOverlay>
                  <CourseCategory>{course.category}</CourseCategory>
                </CourseOverlay>
              </CourseImageContainer>

              <CourseContent>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseInstructor>{course.instructor}</CourseInstructor>
                
                <CourseStats>
                  <CourseStat>
                    <FaUsers />
                    {course.students} students
                  </CourseStat>
                  <CourseStat>
                    <FaClock />
                    {course.duration}
                  </CourseStat>
                </CourseStats>

                <CourseMeta>
                  <CoursePrice>
                    <Price className={course.price === "" ? "free" : ""}>
                      {course.price}
                      {course.originalPrice && course.price !== "Free" && (
                        <OriginalPrice>{course.originalPrice}</OriginalPrice>
                      )}
                    </Price>
                  </CoursePrice>
                  <CourseRating>
                    <FaStar />
                    {course.rating} ({course.reviews})
                  </CourseRating>
                </CourseMeta>

                <ViewCourseButton to={`/course`}>
                  View Course
                  <FaArrowRight />
                </ViewCourseButton>
              </CourseContent>
            </CourseCard>
          ))}
        </CoursesContainer>

        <NavArrow className="nav-arrow" right onClick={() => handleScroll("right")}>
          <FaChevronRight />
        </NavArrow>
      </CoursesCarouselWrapper>
    </CoursesSection>
  );
};

// === Categories COMPONENT ===
const Categories = () => {
  const categories = [
    { name: "Siddha Medicine", icon: <FaBookMedical />, count: "24", path: "/course" },
    { name: "Varma Therapy", icon: <FaHandHoldingHeart />, count: "18", path: "/course" },
    { name: "Ayurveda", icon: <FaLeaf />, count: "32", path: "/course" },
    { name: "Yoga Therapy", icon: <FaUserGraduate />, count: "28", path: "/course" },

  ];

  return (
    <CategoriesSection>
      <Container>
        <Fade direction="up" triggerOnce>
          <SectionHeader>
            <Eyebrow>Learning Paths</Eyebrow>
            <SectionTitle>Explore Categories</SectionTitle>
            <SectionDescription>
              Choose from our comprehensive range of traditional healing arts and wellness disciplines, each crafted by expert practitioners.
            </SectionDescription>
          </SectionHeader>
        </Fade>

        <CategoriesGrid>
          <Zoom cascade damping={0.05} triggerOnce>
            {categories.map((category, index) => (
              <CategoryCard key={category.name} to={category.path}>
                <CategoryIconWrapper>
                  {category.icon}
                </CategoryIconWrapper>
                <CategoryTitle>{category.name}</CategoryTitle>
                <CategoryCount>{category.count} Courses</CategoryCount>
              </CategoryCard>
            ))}
          </Zoom>
        </CategoriesGrid>
      </Container>
    </CategoriesSection>
  );
};

// --- MAIN COMPONENT ---
const HomePageContent = () => {
  return (
    <>
      <GoogleFontsLink />
      <ThemeProvider theme={theme}>
        <GlobalContainer>
          <HeroSlider />
          <Features />
          <Courses />
          <Categories />
        </GlobalContainer>
      </ThemeProvider>
    </>
  );
};

export default HomePageContent;