import React, { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiClock, FiTag, FiShare2, FiBookmark, FiEye, FiSearch, FiFilter, FiUser, FiTrendingUp, FiHeart, FiMessageCircle, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// World-class design system
const designSystem = {
  colors: {
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      900: '#1E3A8A',
    },
    secondary: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    accent: {
      orange: '#FF6B35',
      purple: '#8B5CF6',
      emerald: '#10B981',
      rose: '#F43F5E',
    },
    neutral: {
      white: '#FFFFFF',
      black: '#000000',
      gray: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
      }
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      card: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    },
    shadows: {
      soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      medium: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      large: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    }
  },
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: '"Playfair Display", "Georgia", serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
    easing: {
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  }
};

// Enhanced Mock Data with richer content
const mainPostsData = [
  { 
    id: 1, 
    imageUrl: '/Siddha.jpg', 
    title: 'The Revolutionary Science of Siddha Medicine: Ancient Wisdom Meets Modern Healthcare', 
    date: 'Dec 15, 2024', 
    category: 'Traditional Medicine', 
    excerpt: 'Discover how 5000-year-old Siddha medicine principles are revolutionizing modern healthcare through personalized treatments and natural healing methodologies that address root causes rather than symptoms.',
    readTime: '12 min read',
    views: '15.2k',
    likes: '1.8k',
    comments: '156',
    author: {
      name: 'Dr. Rajesh Kumar',
      avatar: '/author1.jpg',
      expertise: 'Siddha Medicine Expert'
    },
    trending: true,
    featured: true,
    tags: ['Medicine', 'Traditional', 'Healing', 'Wellness']
  },
  { 
    id: 2, 
    imageUrl: '/Siddha.jpg', 
    title: 'Master the Art of Varma Therapy: Advanced Techniques for Energy Healing', 
    date: 'Dec 12, 2024', 
    category: 'Therapeutic Arts', 
    excerpt: 'Unlock the secrets of Varma therapy with comprehensive training in pressure points, energy channels, and advanced healing techniques used by master practitioners for centuries.',
    readTime: '15 min read',
    views: '8.7k',
    likes: '986',
    comments: '78',
    author: {
      name: 'Master Selvam',
      avatar: '/author2.jpg',
      expertise: 'Varma Therapy Master'
    },
    trending: true,
    tags: ['Therapy', 'Energy', 'Healing', 'Ancient Arts']
  },
  { 
    id: 3, 
    imageUrl: '/ad.png', 
    title: 'Complete Guide to Ayurvedic Living: Transform Your Life Through Ancient Wisdom', 
    date: 'Dec 10, 2024', 
    category: 'Ayurvedic Medicine', 
    excerpt: 'Embrace the complete Ayurvedic lifestyle with practical guidance on diet, daily routines, seasonal living, and personalized wellness practices based on your unique constitution.',
    readTime: '18 min read',
    views: '12.3k',
    likes: '1.4k',
    comments: '203',
    author: {
      name: 'Dr. Priya Sharma',
      avatar: '/author3.jpg',
      expertise: 'Ayurvedic Physician'
    },
    tags: ['Ayurveda', 'Lifestyle', 'Wellness', 'Holistic Health']
  },
  { 
    id: 4, 
    imageUrl: '/y21.jpg', 
    title: 'Beyond Asanas: The Profound Philosophy and Science of Yoga', 
    date: 'Dec 8, 2024', 
    category: 'Spiritual Practice', 
    excerpt: 'Explore the deeper dimensions of yoga philosophy, from the eight-limbed path to advanced meditation techniques that lead to profound spiritual transformation and inner awakening.',
    readTime: '14 min read',
    views: '9.8k',
    likes: '1.1k',
    comments: '89',
    author: {
      name: 'Guru Ananda',
      avatar: '/author4.jpg',
      expertise: 'Yoga Philosophy Teacher'
    },
    tags: ['Yoga', 'Philosophy', 'Meditation', 'Spirituality']
  },
  { 
    id: 5, 
    imageUrl: '/y22.jpg', 
    title: 'Meditation Mastery: Scientific Approaches to Mindfulness and Inner Peace', 
    date: 'Dec 5, 2024', 
    category: 'Mindfulness', 
    excerpt: 'Learn evidence-based meditation techniques backed by neuroscience research, designed to reduce stress, enhance focus, and cultivate lasting inner peace and emotional resilience.',
    readTime: '11 min read',
    views: '18.5k',
    likes: '2.2k',
    comments: '167',
    author: {
      name: 'Swami Vishnu',
      avatar: '/author5.jpg',
      expertise: 'Meditation Teacher'
    },
    trending: true,
    tags: ['Meditation', 'Mindfulness', 'Peace', 'Science']
  },
  { 
    id: 6, 
    imageUrl: '/yoga2.jpg', 
    title: 'Holistic Nutrition Revolution: Food as Medicine for Body and Soul', 
    date: 'Dec 2, 2024', 
    category: 'Wellness', 
    excerpt: 'Discover the transformative power of conscious eating through ancient nutritional wisdom combined with modern dietary science for optimal health and spiritual well-being.',
    readTime: '16 min read',
    views: '7.9k',
    likes: '892',
    comments: '134',
    author: {
      name: 'Nutritionist Maya',
      avatar: '/author6.jpg',
      expertise: 'Holistic Nutritionist'
    },
    tags: ['Nutrition', 'Holistic Health', 'Food', 'Wellness']
  },
];

const popularPostsData = [
  { 
    id: 7, 
    imageUrl: '/y21.jpg', 
    title: '500-Hour Advanced Yoga Teacher Training: Transform Your Practice and Teaching', 
    date: 'November 28, 2024', 
    category: 'Education',
    views: '25.8k',
    trending: true
  },
  { 
    id: 8, 
    imageUrl: '/y21.jpg', 
    title: 'Full Scholarship Program: Empowering the Next Generation of Wellness Leaders', 
    date: 'November 25, 2024', 
    category: 'News',
    views: '19.3k'
  },
  { 
    id: 9, 
    imageUrl: '/y21.jpg', 
    title: 'Breakthrough Research: New Discoveries in Mind-Body Healing Mechanisms', 
    date: 'November 22, 2024', 
    category: 'Research',
    views: '22.7k',
    trending: true
  },
  { 
    id: 10, 
    imageUrl: '/y21.jpg', 
    title: 'Global Wellness Summit 2024: Celebrating Community and Healing Together', 
    date: 'November 20, 2024', 
    category: 'Community',
    views: '14.5k'
  },
];

// Glassmorphism utility function
const getGlassmorphismStyle = (opacity = 0.1) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
});

// World-class Hero Section with Particle Animation
const HeroSection = ({ onBackClick, isMobile }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const heroStyle = {
    position: 'relative',
    background: designSystem.colors.gradients.hero,
    borderRadius: designSystem.borderRadius['3xl'],
    padding: isMobile ? '4rem 2rem' : '8rem 4rem',
    textAlign: 'center',
    marginBottom: designSystem.spacing['3xl'],
    overflow: 'hidden',
    minHeight: isMobile ? '50vh' : '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const backgroundOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
    transition: `background ${designSystem.animation.duration.normal} ${designSystem.animation.easing.ease}`,
  };

  const floatingElementsStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  };

  return (
    <div ref={heroRef} style={heroStyle}>
      <div style={backgroundOverlayStyle} />
      
      {/* Floating geometric elements */}
      <div style={floatingElementsStyle}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              background: `rgba(255, 255, 255, ${0.1 - i * 0.01})`,
              borderRadius: i % 2 === 0 ? '50%' : '20%',
              top: `${10 + i * 15}%`,
              left: `${5 + i * 15}%`,
              animation: `float ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <button
        style={{
          position: 'absolute',
          top: isMobile ? '2rem' : '3rem',
          left: isMobile ? '2rem' : '3rem',
          ...getGlassmorphismStyle(0.2),
          border: 'none',
          borderRadius: designSystem.borderRadius.full,
          width: isMobile ? '48px' : '56px',
          height: isMobile ? '48px' : '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: `all ${designSystem.animation.duration.normal} ${designSystem.animation.easing.spring}`,
          zIndex: 10,
        }}
        onClick={onBackClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <FiArrowLeft size={isMobile ? 20 : 24} color="white" />
      </button>

      <div style={{ position: 'relative', zIndex: 5 }}>
        <div style={{
          fontSize: designSystem.typography.fontSize.sm,
          fontWeight: designSystem.typography.fontWeight.semibold,
          color: 'rgba(255, 255, 255, 0.8)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: designSystem.spacing.md,
        }}>
          World-Class Wellness Hub
        </div>
        
        <h1 style={{
          fontSize: isMobile ? designSystem.typography.fontSize['4xl'] : designSystem.typography.fontSize['6xl'],
          fontWeight: designSystem.typography.fontWeight.black,
          fontFamily: designSystem.typography.fontFamily.heading,
          color: 'white',
          marginBottom: designSystem.spacing.lg,
          lineHeight: 1.1,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          Wellness <span style={{ 
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Blog</span>
        </h1>
        
        <p style={{
          fontSize: isMobile ? designSystem.typography.fontSize.lg : designSystem.typography.fontSize.xl,
          color: 'rgba(255, 255, 255, 0.9)',
          maxWidth: '700px',
          lineHeight: 1.6,
          marginBottom: designSystem.spacing.xl,
        }}>
          Discover transformative insights, ancient wisdom, and cutting-edge research 
          in holistic health and wellness
        </p>

        <div style={{
          display: 'flex',
          gap: designSystem.spacing.md,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{
            ...getGlassmorphismStyle(0.15),
            padding: '12px 24px',
            borderRadius: designSystem.borderRadius.full,
            fontSize: designSystem.typography.fontSize.sm,
            fontWeight: designSystem.typography.fontWeight.medium,
            color: 'white',
          }}>
            🏆 Award-Winning Content
          </div>
          <div style={{
            ...getGlassmorphismStyle(0.15),
            padding: '12px 24px',
            borderRadius: designSystem.borderRadius.full,
            fontSize: designSystem.typography.fontSize.sm,
            fontWeight: designSystem.typography.fontWeight.medium,
            color: 'white',
          }}>
            🌟 Expert Contributors
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>
    </div>
  );
};

// Premium Featured Post with Advanced Animations
const FeaturedPost = ({ post, isMobile }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const containerStyle = {
    position: 'relative',
    background: designSystem.colors.gradients.card,
    borderRadius: designSystem.borderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: designSystem.spacing['3xl'],
    minHeight: isMobile ? '400px' : '500px',
    cursor: 'pointer',
    transition: `all ${designSystem.animation.duration.slow} ${designSystem.animation.easing.spring}`,
    transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isHovered ? designSystem.colors.shadows.xl : designSystem.colors.shadows.large,
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const imageContainerStyle = {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: `transform ${designSystem.animation.duration.slower} ${designSystem.animation.easing.ease}`,
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    opacity: imageLoaded ? 1 : 0,
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, 
      rgba(8, 98, 247, 0.9) 0%, 
      rgba(10, 3, 60, 0.8) 50%, 
      rgba(139, 92, 246, 0.7) 100%)`,
    display: 'flex',
    alignItems: 'center',
    padding: isMobile ? '2rem' : '4rem',
  };

  const contentStyle = {
    color: 'white',
    maxWidth: '800px',
    position: 'relative',
    zIndex: 2,
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '8px 16px',
    borderRadius: designSystem.borderRadius.full,
    fontSize: designSystem.typography.fontSize.sm,
    fontWeight: designSystem.typography.fontWeight.semibold,
    marginBottom: designSystem.spacing.lg,
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  return (
    <article 
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/blog/${post.id}`)}
    >
      <div style={imageContainerStyle}>
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          style={imageStyle}
          onLoad={() => setImageLoaded(true)}
        />
        <div style={overlayStyle}>
          <div style={contentStyle}>
            <div style={badgeStyle}>
              <FiStar size={16} />
              Featured Article
              {post.trending && (
                <>
                  <span>•</span>
                  <FiTrendingUp size={16} />
                  Trending
                </>
              )}
            </div>
            
            <h2 style={{
              fontSize: isMobile ? designSystem.typography.fontSize['2xl'] : designSystem.typography.fontSize['4xl'],
              fontWeight: designSystem.typography.fontWeight.black,
              fontFamily: designSystem.typography.fontFamily.heading,
              marginBottom: designSystem.spacing.lg,
              lineHeight: 1.2,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
              {post.title}
            </h2>
            
            <p style={{
              fontSize: isMobile ? designSystem.typography.fontSize.base : designSystem.typography.fontSize.lg,
              marginBottom: designSystem.spacing.xl,
              opacity: 0.95,
              lineHeight: 1.7,
            }}>
              {post.excerpt}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: designSystem.spacing.lg,
              flexWrap: 'wrap',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: designSystem.borderRadius.full,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}>
                  <FiUser size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: designSystem.typography.fontWeight.semibold }}>
                    {post.author.name}
                  </div>
                  <div style={{ fontSize: designSystem.typography.fontSize.sm, opacity: 0.8 }}>
                    {post.author.expertise}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: designSystem.spacing.md,
                fontSize: designSystem.typography.fontSize.sm,
                opacity: 0.9,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiClock size={16} />
                  {post.readTime}
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiEye size={16} />
                  {post.views}
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiHeart size={16} />
                  {post.likes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

// Premium Blog Post Card with Micro-interactions
const BlogPostCard = ({ post, index, isMobile }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const cardStyle = {
    background: designSystem.colors.gradients.card,
    borderRadius: designSystem.borderRadius['2xl'],
    overflow: 'hidden',
    boxShadow: isHovered ? designSystem.colors.shadows.large : designSystem.colors.shadows.soft,
    transition: `all ${designSystem.animation.duration.normal} ${designSystem.animation.easing.spring}`,
    cursor: 'pointer',
    transform: isHovered ? 'translateY(-12px) scale(1.03)' : 'translateY(0) scale(1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    animationDelay: `${index * 150}ms`,
  };

  const imageContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '280px',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: `transform ${designSystem.animation.duration.slow} ${designSystem.animation.easing.ease}`,
    transform: isHovered ? 'scale(1.1) rotate(2deg)' : 'scale(1) rotate(0deg)',
  };

  const categoryBadgeStyle = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    ...getGlassmorphismStyle(0.9),
    color: designSystem.colors.primary[700],
    padding: '8px 16px',
    borderRadius: designSystem.borderRadius.full,
    fontSize: designSystem.typography.fontSize.xs,
    fontWeight: designSystem.typography.fontWeight.bold,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const trendingBadgeStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: designSystem.colors.accent.orange,
    color: 'white',
    padding: '6px 12px',
    borderRadius: designSystem.borderRadius.full,
    fontSize: designSystem.typography.fontSize.xs,
    fontWeight: designSystem.typography.fontWeight.bold,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    animation: 'pulse 2s infinite',
  };

  const contentStyle = {
    padding: '32px',
  };

  const titleStyle = {
    margin: '0 0 16px 0',
    fontSize: designSystem.typography.fontSize.xl,
    fontWeight: designSystem.typography.fontWeight.bold,
    fontFamily: designSystem.typography.fontFamily.heading,
    color: designSystem.colors.secondary[900],
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const excerptStyle = {
    margin: '0 0 24px 0',
    fontSize: designSystem.typography.fontSize.base,
    color: designSystem.colors.secondary[600],
    lineHeight: 1.7,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const authorSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    padding: '16px',
    background: 'rgba(248, 250, 252, 0.8)',
    borderRadius: designSystem.borderRadius.lg,
    border: '1px solid rgba(226, 232, 240, 0.5)',
  };

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    fontSize: designSystem.typography.fontSize.sm,
    color: designSystem.colors.secondary[500],
  };

  const metaLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: `1px solid ${designSystem.colors.secondary[200]}`,
  };

  const actionButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: designSystem.borderRadius.full,
    transition: `all ${designSystem.animation.duration.fast} ${designSystem.animation.easing.ease}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <article 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/blog/${post.id}`)}
    >
      <div style={imageContainerStyle}>
        <img src={post.imageUrl} alt={post.title} style={imageStyle} />
        <div style={categoryBadgeStyle}>
          <FiTag size={12} />
          {post.category}
        </div>
        {post.trending && (
          <div style={trendingBadgeStyle}>
            <FiTrendingUp size={12} />
            Trending
          </div>
        )}
      </div>
      
      <div style={contentStyle}>
        <h3 style={titleStyle}>{post.title}</h3>
        <p style={excerptStyle}>{post.excerpt}</p>
        
        <div style={authorSectionStyle}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: designSystem.borderRadius.full,
            background: designSystem.colors.primary[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: designSystem.colors.primary[600],
          }}>
            <FiUser size={18} />
          </div>
          <div>
            <div style={{ 
              fontWeight: designSystem.typography.fontWeight.semibold,
              color: designSystem.colors.secondary[900],
              fontSize: designSystem.typography.fontSize.sm,
            }}>
              {post.author.name}
            </div>
            <div style={{ 
              fontSize: designSystem.typography.fontSize.xs,
              color: designSystem.colors.secondary[500],
            }}>
              {post.author.expertise}
            </div>
          </div>
        </div>
        
        <div style={metaStyle}>
          <div style={metaLeftStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiClock size={14} />
              <span>{post.readTime}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiEye size={14} />
              <span>{post.views}</span>
            </div>
          </div>
          <div style={{ fontSize: designSystem.typography.fontSize.xs, color: designSystem.colors.secondary[400] }}>
            {post.date}
          </div>
        </div>
        
        <div style={footerStyle}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  background: designSystem.colors.primary[50],
                  color: designSystem.colors.primary[700],
                  padding: '4px 12px',
                  borderRadius: designSystem.borderRadius.full,
                  fontSize: designSystem.typography.fontSize.xs,
                  fontWeight: designSystem.typography.fontWeight.medium,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                ...actionButtonStyle,
                color: isLiked ? designSystem.colors.accent.rose : designSystem.colors.secondary[500],
                backgroundColor: isLiked ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
              }}
              onClick={handleLike}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isLiked ? 'rgba(244, 63, 94, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiHeart size={16} />
            </button>
            <button
              style={{
                ...actionButtonStyle,
                color: isBookmarked ? designSystem.colors.accent.purple : designSystem.colors.secondary[500],
                backgroundColor: isBookmarked ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              }}
              onClick={handleBookmark}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isBookmarked ? 'rgba(139, 92, 246, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiBookmark size={16} />
            </button>
            <button
              style={{
                ...actionButtonStyle,
                color: designSystem.colors.secondary[500],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(100, 116, 139, 0.1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiShare2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </article>
  );
};

// Enhanced Popular Post Item with Premium Design
const PopularPostItem = ({ post, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    padding: '20px',
    borderRadius: designSystem.borderRadius.xl,
    transition: `all ${designSystem.animation.duration.normal} ${designSystem.animation.easing.spring}`,
    backgroundColor: isHovered ? designSystem.colors.primary[50] : 'transparent',
    border: `1px solid ${isHovered ? designSystem.colors.primary[200] : 'transparent'}`,
    transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
    position: 'relative',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '72px',
    height: '72px',
    borderRadius: designSystem.borderRadius.lg,
    objectFit: 'cover',
    transition: `transform ${designSystem.animation.duration.normal} ${designSystem.animation.easing.ease}`,
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    border: `2px solid ${designSystem.colors.neutral.white}`,
    boxShadow: designSystem.colors.shadows.soft,
  };

  const rankStyle = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: designSystem.colors.accent.orange,
    color: 'white',
    width: '24px',
    height: '24px',
    borderRadius: designSystem.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: designSystem.typography.fontWeight.bold,
  };

  return (
    <div 
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/blog/${post.id}`)}
    >
      <div style={{ position: 'relative' }}>
        <img src={post.imageUrl} alt={post.title} style={imageStyle} />
        <div style={rankStyle}>{index + 1}</div>
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{
          margin: '0 0 8px 0',
          fontSize: designSystem.typography.fontSize.base,
          fontWeight: designSystem.typography.fontWeight.semibold,
          color: designSystem.colors.secondary[900],
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.title}
        </h4>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: designSystem.typography.fontSize.sm,
          color: designSystem.colors.secondary[500],
          marginBottom: '8px',
        }}>
          <span>{post.date}</span>
          <span>•</span>
          <div style={{
            background: designSystem.colors.primary[100],
            color: designSystem.colors.primary[700],
            padding: '2px 8px',
            borderRadius: designSystem.borderRadius.full,
            fontSize: designSystem.typography.fontSize.xs,
            fontWeight: designSystem.typography.fontWeight.medium,
          }}>
            {post.category}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: designSystem.typography.fontSize.sm,
          color: designSystem.colors.secondary[600],
        }}>
          <FiEye size={14} />
          <span>{post.views}</span>
          {post.trending && (
            <>
              <span>•</span>
              <FiTrendingUp size={14} style={{ color: designSystem.colors.accent.orange }} />
              <span style={{ color: designSystem.colors.accent.orange, fontWeight: designSystem.typography.fontWeight.medium }}>
                Trending
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Advanced Search and Filter Bar
const SearchFilterBar = ({ onSearch, onFilter, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const containerStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '48px',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
  };

  const searchContainerStyle = {
    position: 'relative',
    flex: 1,
  };

  const searchInputStyle = {
    width: '100%',
    padding: '16px 20px 16px 56px',
    border: `2px solid ${isSearchFocused ? designSystem.colors.primary[500] : 'transparent'}`,
    borderRadius: designSystem.borderRadius.xl,
    fontSize: designSystem.typography.fontSize.base,
    fontFamily: designSystem.typography.fontFamily.primary,
    background: designSystem.colors.neutral.white,
    boxShadow: isSearchFocused ? designSystem.colors.shadows.medium : designSystem.colors.shadows.soft,
    transition: `all ${designSystem.animation.duration.normal} ${designSystem.animation.easing.ease}`,
    outline: 'none',
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: isSearchFocused ? designSystem.colors.primary[500] : designSystem.colors.secondary[400],
    transition: `color ${designSystem.animation.duration.normal}`,
  };

  const filterButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    border: 'none',
    borderRadius: designSystem.borderRadius.xl,
    background: designSystem.colors.neutral.white,
    color: designSystem.colors.secondary[700],
    cursor: 'pointer',
    fontWeight: designSystem.typography.fontWeight.medium,
    fontSize: designSystem.typography.fontSize.base,
    boxShadow: designSystem.colors.shadows.soft,
    transition: `all ${designSystem.animation.duration.normal} ${designSystem.animation.easing.spring}`,
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyle}>
      <div style={searchContainerStyle}>
        <FiSearch style={searchIconStyle} size={20} />
        <input
          type="text"
          placeholder="Search wellness articles, topics, or authors..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          style={searchInputStyle}
        />
      </div>
      
      <button 
        style={filterButtonStyle}
        onClick={onFilter}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = designSystem.colors.primary[500];
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = designSystem.colors.shadows.large;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = designSystem.colors.neutral.white;
          e.currentTarget.style.color = designSystem.colors.secondary[700];
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = designSystem.colors.shadows.soft;
        }}
      >
        <FiFilter size={18} />
        {!isMobile && 'Advanced Filters'}
      </button>
    </div>
  );
};

// World-class Main Component
const EnhancedBlog = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  const styles = {
    pageContainer: {
      fontFamily: designSystem.typography.fontFamily.primary,
      backgroundColor: '#FAFBFC',
      minHeight: '100vh',
      padding: isMobile ? '20px' : '40px',
      position: 'relative',
    },
    contentWrapper: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '48px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    mainContent: {
      flex: 3,
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(2, 1fr)',
      gap: '40px',
    },
    sidebar: {
      flex: 1,
      position: 'sticky',
      top: '40px',
      height: 'fit-content',
      background: designSystem.colors.gradients.card,
      borderRadius: designSystem.borderRadius['2xl'],
      padding: '40px',
      boxShadow: designSystem.colors.shadows.soft,
      marginTop: isMobile ? '48px' : '0',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    sidebarTitle: {
      fontSize: designSystem.typography.fontSize['2xl'],
      fontWeight: designSystem.typography.fontWeight.bold,
      fontFamily: designSystem.typography.fontFamily.heading,
      color: designSystem.colors.secondary[900],
      marginBottom: '32px',
      textAlign: 'center',
      background: designSystem.colors.gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    popularPostsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    newsletterSection: {
      marginTop: '48px',
      padding: '32px',
      background: designSystem.colors.gradients.primary,
      borderRadius: designSystem.borderRadius.xl,
      textAlign: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    },
  };

  // Parallax effect for background elements
  const parallaxOffset = scrollY * 0.5;

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Implement search functionality
  };

  const handleFilter = () => {
    console.log('Opening advanced filters');
    // Implement filter functionality
  };

  return (
    <div style={styles.pageContainer}>
      {/* Animated background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        transform: `translateY(${parallaxOffset}px)`,
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <HeroSection onBackClick={() => navigate(-1)} isMobile={isMobile} />

      <div style={styles.contentWrapper}>
        <main style={styles.mainContent}>
          <FeaturedPost post={mainPostsData[0]} isMobile={isMobile} />
          
          <SearchFilterBar 
            onSearch={handleSearch} 
            onFilter={handleFilter} 
            isMobile={isMobile}
          />
          
          <div style={styles.postsGrid}>
            {mainPostsData.slice(1).map((post, index) => (
              <BlogPostCard 
                key={post.id} 
                post={post} 
                index={index + 1} 
                isMobile={isMobile}
              />
            ))}
          </div>
        </main>

        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>🔥 Trending Now</h2>
          <div style={styles.popularPostsList}>
            {popularPostsData.map((post, index) => (
              <PopularPostItem key={post.id} post={post} index={index} />
            ))}
          </div>
          
          <div style={styles.newsletterSection}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              animation: 'pulse 3s infinite',
            }} />
            
            <h3 style={{ 
              fontSize: designSystem.typography.fontSize.xl,
              fontWeight: designSystem.typography.fontWeight.bold,
              marginBottom: '16px',
              fontFamily: designSystem.typography.fontFamily.heading,
            }}>
              🌟 Premium Newsletter
            </h3>
            <p style={{ 
              fontSize: designSystem.typography.fontSize.base,
              marginBottom: '24px',
              opacity: 0.9,
              lineHeight: 1.6,
            }}>
              Get exclusive wellness insights, expert tips, and early access to our premium content
            </p>
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '14px 28px',
              borderRadius: designSystem.borderRadius.full,
              fontWeight: designSystem.typography.fontWeight.semibold,
              fontSize: designSystem.typography.fontSize.base,
              cursor: 'pointer',
              transition: `all ${designSystem.animation.duration.normal} ${designSystem.animation.easing.spring}`,
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
            >
              Subscribe Now - It's Free! ✨
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EnhancedBlog;
