import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiClock, FiTag, FiShare2, FiBookmark, FiEye, FiTrendingUp, FiUser, FiHeart, FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const theme = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    accent: {
      50: '#fef3c7',
      100: '#fde68a',
      200: '#fcd34d',
      300: '#fbbf24',
      400: '#f59e0b',
      500: '#d97706',
      600: '#b45309',
      700: '#92400e',
      800: '#78350f',
      900: '#451a03'
    },
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#64748b',
      light: '#94a3b8'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      dark: '#0f172a',
      glass: 'rgba(255, 255, 255, 0.8)',
      card: 'rgba(255, 255, 255, 0.95)',
      overlay: 'rgba(15, 23, 42, 0.1)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      cool: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      dark: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      light: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
    },
    shadows: {
      xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      glow: '0 0 20px rgba(99, 102, 241, 0.4)',
      colored: '0 10px 30px rgba(99, 102, 241, 0.2)'
    }
  },
  typography: {
    fontFamily: {
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      serif: 'Playfair Display, Georgia, serif',
      mono: 'JetBrains Mono, monospace'
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
      '7xl': '4.5rem'
    },
    fontWeight: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    }
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  animation: {
    transition: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: '600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  }
};

// Enhanced Mock Data with better content structure
const mainPostsData = [
  { 
    id: 1, 
    imageUrl: '/Siddha.jpg', 
    title: 'Herbal Healing Siddha: Ancient Wisdom for Modern Health', 
    date: 'Sep 20, 2024', 
    category: 'Traditional Medicine', 
    excerpt: 'Explore the profound healing traditions of Siddha medicine, where ancient Tamil wisdom meets modern healthcare needs. Discover natural remedies that have been passed down through generations.',
    readTime: '5 min read',
    views: '2.4k',
    author: 'Dr. Priya Sharma',
    featured: true,
    tags: ['Siddha', 'Herbal Medicine', 'Traditional Healing'],
    likes: 142,
    comments: 28
  },
  { 
    id: 2, 
    imageUrl: '/Siddha.jpg', 
    title: 'Intermediate Varma Therapy: Pressure Points & Energy Flow', 
    date: 'Aug 20, 2024', 
    category: 'Therapeutic Arts', 
    excerpt: 'Master the art of Varma therapy with our comprehensive guide to pressure points and energy channels. Learn how to restore balance and promote healing through precise touch.',
    readTime: '8 min read',
    views: '1.8k',
    author: 'Master Rajesh Kumar',
    featured: false,
    tags: ['Varma Therapy', 'Pressure Points', 'Energy Healing'],
    likes: 89,
    comments: 15
  },
  { 
    id: 3, 
    imageUrl: '/ad.png', 
    title: 'Introduction to Ayurveda: The Science of Life', 
    date: 'July 28, 2024', 
    category: 'Ayurvedic Medicine', 
    excerpt: 'Dive into the holistic world of Ayurveda, where mind, body, and spirit unite in perfect harmony. Understand the fundamental principles that have guided wellness for over 5000 years.',
    readTime: '6 min read',
    views: '3.2k',
    author: 'Dr. Arjun Patel',
    featured: true,
    tags: ['Ayurveda', 'Holistic Health', 'Ancient Medicine'],
    likes: 234,
    comments: 42
  },
  { 
    id: 4, 
    imageUrl: '/y21.jpg', 
    title: 'Yoga Philosophy: Beyond Physical Practice', 
    date: 'July 15, 2024', 
    category: 'Spiritual Practice', 
    excerpt: 'Discover the deeper dimensions of yoga that extend far beyond physical postures. Explore meditation, pranayama, and the eight-limbed path to spiritual awakening.',
    readTime: '7 min read',
    views: '2.1k',
    author: 'Swami Ananda',
    featured: false,
    tags: ['Yoga Philosophy', 'Spirituality', 'Meditation'],
    likes: 167,
    comments: 31
  },
  { 
    id: 5, 
    imageUrl: '/y22.jpg', 
    title: 'Meditation Techniques for Beginners', 
    date: 'June 10, 2024', 
    category: 'Mindfulness', 
    excerpt: 'Start your meditation journey with proven techniques that calm the mind and nurture inner peace. Perfect for beginners seeking mental clarity and emotional balance.',
    readTime: '4 min read',
    views: '4.1k',
    author: 'Sarah Chen',
    featured: false,
    tags: ['Meditation', 'Mindfulness', 'Beginners Guide'],
    likes: 312,
    comments: 56
  },
  { 
    id: 6, 
    imageUrl: '/yoga2.jpg', 
    title: 'Holistic Nutrition: Feeding Body and Soul', 
    date: 'May 25, 2024', 
    category: 'Wellness', 
    excerpt: 'Learn how conscious eating can transform your health and vitality. Discover the connection between food, mood, and spiritual well-being in this comprehensive guide.',
    readTime: '9 min read',
    views: '1.9k',
    author: 'Dr. Maya Gupta',
    featured: true,
    tags: ['Nutrition', 'Holistic Health', 'Wellness'],
    likes: 198,
    comments: 37
  },
];

const popularPostsData = [
  { 
    id: 1, 
    imageUrl: '/y21.jpg', 
    title: 'Advanced Yoga Teacher Training Program', 
    date: 'September 20, 2022', 
    category: 'Education',
    views: '5.2k',
    trending: true
  },
  { 
    id: 2, 
    imageUrl: '/y21.jpg', 
    title: 'Scholarship Opportunities for Wellness Students', 
    date: 'August 20, 2022', 
    category: 'News',
    views: '3.8k',
    trending: false
  },
  { 
    id: 3, 
    imageUrl: '/y21.jpg', 
    title: 'Research Team Discovers New Healing Methods', 
    date: 'August 20, 2022', 
    category: 'Research',
    views: '4.3k',
    trending: true
  },
  { 
    id: 4, 
    imageUrl: '/y21.jpg', 
    title: 'Community Wellness Workshop Success', 
    date: 'July 22, 2022', 
    category: 'Community',
    views: '2.7k',
    trending: false
  },
];

// Enhanced Blog Post Card Component with World-Class Design
const BlogPostCard = ({ post, index, isMobile, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isListView = viewMode === 'list';

  const cardStyle = {
    position: 'relative',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius['3xl'],
    overflow: 'hidden',
    boxShadow: isHovered ? theme.colors.shadows['2xl'] : theme.colors.shadows.lg,
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${theme.colors.secondary[200]}`,
    animation: `fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`,
    opacity: 0,
    display: isListView ? 'flex' : 'block',
    alignItems: isListView ? 'center' : 'stretch',
    gap: isListView ? theme.spacing[6] : 0,
    padding: isListView ? theme.spacing[6] : 0,
    background: isHovered 
      ? `linear-gradient(135deg, ${theme.colors.background.card} 0%, ${theme.colors.primary[50]} 100%)`
      : theme.colors.background.card,
    ...(post.featured && {
      background: isHovered
        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%)'
        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(167, 139, 250, 0.05) 100%)',
      borderColor: theme.colors.primary[200]
    })
  };

  const imageContainerStyle = {
    position: 'relative',
    width: isListView ? (isMobile ? '120px' : '200px') : '100%',
    height: isListView ? (isMobile ? '80px' : '120px') : (isMobile ? '200px' : '280px'),
    overflow: 'hidden',
    borderRadius: isListView ? theme.borderRadius['2xl'] : 0,
    flexShrink: 0,
    background: theme.colors.gradients.cool
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
    filter: imageLoaded ? 'blur(0px)' : 'blur(10px)',
    opacity: imageLoaded ? 1 : 0.7
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.4s ease'
  };

  const contentStyle = {
    padding: isListView ? 0 : (isMobile ? theme.spacing[6] : theme.spacing[8]),
    flex: isListView ? 1 : 'none'
  };

  const categoryBadgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[1.5],
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    backgroundColor: post.featured 
      ? theme.colors.primary[500]
      : theme.colors.accent[500],
    color: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: theme.spacing[4],
    boxShadow: theme.colors.shadows.sm,
    transition: 'all 0.3s ease'
  };

  const titleStyle = {
    margin: `0 0 ${theme.spacing[4]} 0`,
    fontSize: isListView 
      ? (isMobile ? theme.typography.fontSize.lg : theme.typography.fontSize.xl)
      : (isMobile ? theme.typography.fontSize.xl : theme.typography.fontSize['2xl']),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.tight,
    fontFamily: theme.typography.fontFamily.serif,
    display: '-webkit-box',
    WebkitLineClamp: isListView ? 2 : 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    transition: 'color 0.3s ease',
    ...(isHovered && { color: theme.colors.primary[700] })
  };

  const excerptStyle = {
    margin: `0 0 ${theme.spacing[6]} 0`,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
    display: isListView ? 'none' : '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const metaRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing[4]
  };

  const metaInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[6],
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.muted
  };

  const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[1.5]
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2]
  };

  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: theme.borderRadius.full,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    color: theme.colors.text.muted,
    position: 'relative',
    overflow: 'hidden'
  };

  const topBadgesStyle = {
    position: 'absolute',
    top: theme.spacing[4],
    left: theme.spacing[4],
    zIndex: 10,
    display: 'flex',
    gap: theme.spacing[2]
  };

  const featuredBadgeStyle = {
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    background: theme.colors.gradients.warm,
    color: theme.colors.background.primary,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    boxShadow: theme.colors.shadows.md,
    backdropFilter: 'blur(10px)'
  };

  const shimmerStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    transition: 'left 0.6s ease',
    ...(isHovered && { left: '100%' })
  };

  return (
    <article 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageContainerStyle}>
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          style={imageStyle}
          onLoad={() => setImageLoaded(true)}
        />
        <div style={overlayStyle} />
        <div style={shimmerStyle} />
        {post.featured && (
          <div style={topBadgesStyle}>
            <span style={featuredBadgeStyle}>Featured</span>
          </div>
        )}
      </div>
      
      <div style={contentStyle}>
        <span style={categoryBadgeStyle}>
          <FiTag size={12} />
          {post.category}
        </span>
        <h3 style={titleStyle}>{post.title}</h3>
        {!isListView && <p style={excerptStyle}>{post.excerpt}</p>}
        
        <div style={metaRowStyle}>
          <div style={metaInfoStyle}>
            <div style={metaItemStyle}>
              <FiClock size={14} />
              <span>{post.readTime}</span>
            </div>
            <div style={metaItemStyle}>
              <FiEye size={14} />
              <span>{post.views}</span>
            </div>
            <div style={metaItemStyle}>
              <FiUser size={14} />
              <span>{post.author}</span>
            </div>
          </div>
          
          <div style={actionsStyle}>
            <button 
              style={{
                ...actionButtonStyle,
                backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                color: isLiked ? '#ef4444' : theme.colors.text.muted
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isLiked ? 'rgba(239, 68, 68, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiHeart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {post.likes}
              </span>
            </button>
            
            <button 
              style={{
                ...actionButtonStyle,
                backgroundColor: isBookmarked ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: isBookmarked ? theme.colors.primary[500] : theme.colors.text.muted
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = isBookmarked ? 'rgba(99, 102, 241, 0.1)' : 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiBookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            
            <button 
              style={actionButtonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiShare2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// Enhanced Popular Post Item Component with World-Class Design
const PopularPostItem = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[4],
    padding: theme.spacing[4],
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius['2xl'],
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: isHovered ? 'translateX(12px) scale(1.02)' : 'translateX(0) scale(1)',
    boxShadow: isHovered ? theme.colors.shadows.lg : theme.colors.shadows.sm,
    border: `2px solid ${isHovered ? theme.colors.primary[200] : theme.colors.secondary[200]}`,
    animation: `fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s forwards`,
    opacity: 0,
    position: 'relative',
    overflow: 'hidden'
  };

  const imageContainerStyle = {
    position: 'relative',
    width: '100px',
    height: '100px',
    borderRadius: theme.borderRadius['2xl'],
    overflow: 'hidden',
    flexShrink: 0,
    background: theme.colors.gradients.cool
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0
  };

  const titleStyle = {
    margin: `0 0 ${theme.spacing[2]} 0`,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.tight,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontFamily: theme.typography.fontFamily.serif,
    transition: 'color 0.3s ease',
    ...(isHovered && { color: theme.colors.primary[600] })
  };

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing[2],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: theme.typography.fontWeight.medium
  };

  const viewsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[1.5],
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeight.medium
  };

  const trendingBadgeStyle = {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: '24px',
    height: '24px',
    background: theme.colors.gradients.warm,
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: theme.colors.background.primary,
    boxShadow: theme.colors.shadows.md,
    animation: 'pulse 2s infinite'
  };

  const shimmerStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.8s ease',
    ...(isHovered && { left: '100%' })
  };

  const categoryBadgeStyle = {
    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
    backgroundColor: theme.colors.primary[100],
    color: theme.colors.primary[700],
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'capitalize'
  };

  return (
    <div 
      style={itemStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={shimmerStyle} />
      <div style={imageContainerStyle}>
        <img src={post.imageUrl} alt={post.title} style={imageStyle} />
        {post.trending && (
          <div style={trendingBadgeStyle}>
            <FiTrendingUp size={14} />
          </div>
        )}
      </div>
      
      <div style={contentStyle}>
        <div style={metaStyle}>
          <span style={categoryBadgeStyle}>{post.category}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
        <h4 style={titleStyle}>{post.title}</h4>
        <div style={viewsStyle}>
          <FiEye size={12} />
          <span>{post.views} views</span>
        </div>
      </div>
    </div>
  );
};

// Main Blog Page Component with World-Class Design
const BlogPage = () => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animations after component mounts
    setTimeout(() => setIsLoaded(true), 200);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const categories = ['all', ...Array.from(new Set(mainPostsData.map(post => post.category)))];

  const filteredPosts = mainPostsData.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const styles = {
    keyframes: `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
    `,
    
    pageContainer: {
      fontFamily: theme.typography.fontFamily.sans,
      background: `
        radial-gradient(circle at 20% 20%, ${theme.colors.primary[100]} 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, ${theme.colors.accent[100]} 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, ${theme.colors.secondary[100]} 0%, transparent 50%),
        ${theme.colors.background.secondary}
      `,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    },

    backgroundElements: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 0,
      background: `
        radial-gradient(circle at 20% 20%, ${theme.colors.primary[200]}20 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, ${theme.colors.accent[200]}20 0%, transparent 50%)
      `,
      animation: 'gradient 15s ease infinite',
      backgroundSize: '400% 400%'
    },

    contentWrapper: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '1600px',
      margin: '0 auto',
      padding: isMobile ? theme.spacing[4] : theme.spacing[8]
    },

    headerSection: {
      marginBottom: theme.spacing[16],
      animation: isLoaded ? 'fadeInUp 1s ease-out forwards' : 'none',
      opacity: isLoaded ? 1 : 0
    },

    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[8],
      marginBottom: theme.spacing[12],
      flexDirection: isMobile ? 'column' : 'row',
      textAlign: isMobile ? 'center' : 'left'
    },

    backButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '56px' : '64px',
      height: isMobile ? '56px' : '64px',
      background: theme.colors.gradients.primary,
      border: 'none',
      borderRadius: theme.borderRadius.full,
      color: theme.colors.background.primary,
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: theme.colors.shadows.lg,
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden'
    },

    pageTitle: {
      fontSize: isMobile ? theme.typography.fontSize['4xl'] : theme.typography.fontSize['7xl'],
      fontWeight: theme.typography.fontWeight.black,
      background: theme.colors.gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
      letterSpacing: '-0.05em',
      fontFamily: theme.typography.fontFamily.serif,
      lineHeight: theme.typography.lineHeight.tight
    },

    subtitle: {
      fontSize: isMobile ? theme.typography.fontSize.lg : theme.typography.fontSize.xl,
      color: theme.colors.text.secondary,
      fontWeight: theme.typography.fontWeight.medium,
      maxWidth: '800px',
      lineHeight: theme.typography.lineHeight.relaxed,
      marginTop: theme.spacing[4]
    },

    controlsSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing[6],
      marginBottom: theme.spacing[12],
      flexWrap: 'wrap',
      background: theme.colors.background.card,
      padding: theme.spacing[6],
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.colors.shadows.lg,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.colors.secondary[200]}`
    },

    searchContainer: {
      position: 'relative',
      flex: '1',
      maxWidth: '400px'
    },

    searchInput: {
      width: '100%',
      padding: `${theme.spacing[4]} ${theme.spacing[6]} ${theme.spacing[4]} ${theme.spacing[12]}`,
      border: `2px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.full,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.sans,
      backgroundColor: theme.colors.background.primary,
      transition: 'all 0.3s ease',
      outline: 'none',
      boxShadow: theme.colors.shadows.sm
    },

    searchIcon: {
      position: 'absolute',
      left: theme.spacing[4],
      top: '50%',
      transform: 'translateY(-50%)',
      color: theme.colors.text.muted,
      pointerEvents: 'none'
    },

    categoryFilter: {
      display: 'flex',
      gap: theme.spacing[2],
      alignItems: 'center',
      flexWrap: 'wrap'
    },

    categoryButton: {
      padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
      border: `2px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background.primary,
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'capitalize'
    },

    activeCategoryButton: {
      backgroundColor: theme.colors.primary[500],
      borderColor: theme.colors.primary[500],
      color: theme.colors.background.primary,
      boxShadow: theme.colors.shadows.colored
    },

    viewToggle: {
      display: 'flex',
      backgroundColor: theme.colors.secondary[100],
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[1],
      gap: theme.spacing[1]
    },

    viewButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: theme.borderRadius.md,
      border: 'none',
      backgroundColor: 'transparent',
      color: theme.colors.text.muted,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },

    activeViewButton: {
      backgroundColor: theme.colors.background.primary,
      color: theme.colors.primary[500],
      boxShadow: theme.colors.shadows.sm
    },

    mainLayout: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '3fr 1fr',
      gap: isMobile ? theme.spacing[12] : theme.spacing[16],
      alignItems: 'start'
    },

    mainContent: {
      animation: isLoaded ? 'fadeInUp 1s ease-out 0.3s forwards' : 'none',
      opacity: isLoaded ? 1 : 0
    },

    postsGrid: {
      display: 'grid',
      gridTemplateColumns: viewMode === 'grid' 
        ? (isMobile ? '1fr' : 'repeat(auto-fit, minmax(420px, 1fr))')
        : '1fr',
      gap: viewMode === 'grid' 
        ? (isMobile ? theme.spacing[8] : theme.spacing[10])
        : theme.spacing[6]
    },

    sidebar: {
      position: 'sticky',
      top: theme.spacing[8],
      animation: isLoaded ? 'fadeInUp 1s ease-out 0.6s forwards' : 'none',
      opacity: isLoaded ? 1 : 0
    },

    sidebarCard: {
      background: theme.colors.background.card,
      borderRadius: theme.borderRadius['3xl'],
      padding: theme.spacing[8],
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.colors.secondary[200]}`,
      boxShadow: theme.colors.shadows.xl,
      transform: `translateY(${scrollY * 0.1}px)`,
      transition: 'transform 0.1s ease-out'
    },

    sidebarTitle: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing[8],
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[3],
      fontFamily: theme.typography.fontFamily.serif
    },

    floatingActions: {
      position: 'fixed',
      bottom: theme.spacing[8],
      right: theme.spacing[8],
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[4],
      zIndex: 100,
      animation: 'float 3s ease-in-out infinite'
    },

    floatingButton: {
      width: '64px',
      height: '64px',
      background: theme.colors.gradients.primary,
      color: theme.colors.background.primary,
      border: 'none',
      borderRadius: theme.borderRadius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: theme.colors.shadows['2xl'],
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden'
    },

    statsBar: {
      display: 'flex',
      justifyContent: 'center',
      gap: theme.spacing[12],
      marginBottom: theme.spacing[12],
      padding: theme.spacing[6],
      background: theme.colors.background.card,
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.colors.shadows.lg,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.colors.secondary[200]}`
    },

    statItem: {
      textAlign: 'center'
    },

    statNumber: {
      fontSize: theme.typography.fontSize['3xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary[500],
      display: 'block',
      fontFamily: theme.typography.fontFamily.mono
    },

    statLabel: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontWeight: theme.typography.fontWeight.medium
    }
  };

  return (
    <>
      <style>{styles.keyframes}</style>
      <div style={styles.backgroundElements} />
      
      <div style={styles.pageContainer}>
        <div style={styles.contentWrapper}>
          <header style={styles.headerSection}>
            <div style={styles.titleContainer}>
              <button
                style={styles.backButton}
                onClick={() => navigate(-1)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)';
                  e.currentTarget.style.boxShadow = theme.colors.shadows.glow;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = theme.colors.shadows.lg;
                }}
                aria-label="Go back"
              >
                <FiArrowLeft size={isMobile ? 24 : 28} />
              </button>
              
              <div>
                <h1 style={styles.pageTitle}>Wellness Universe</h1>
                <p style={styles.subtitle}>
                  Discover transformative insights, ancient wisdom, and modern breakthroughs 
                  in holistic health and well-being
                </p>
              </div>
            </div>

            <div style={styles.statsBar}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>12K+</span>
                <span style={styles.statLabel}>Readers</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>150+</span>
                <span style={styles.statLabel}>Articles</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>25+</span>
                <span style={styles.statLabel}>Experts</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>95%</span>
                <span style={styles.statLabel}>Satisfaction</span>
              </div>
            </div>

            <div style={styles.controlsSection}>
              <div style={styles.searchContainer}>
                <FiSearch style={styles.searchIcon} size={20} />
                <input
                  style={styles.searchInput}
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary[500];
                    e.currentTarget.style.boxShadow = theme.colors.shadows.glow;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.secondary[200];
                    e.currentTarget.style.boxShadow = theme.colors.shadows.sm;
                  }}
                />
              </div>

              <div style={styles.categoryFilter}>
                {categories.map(category => (
                  <button
                    key={category}
                    style={{
                      ...styles.categoryButton,
                      ...(selectedCategory === category && styles.activeCategoryButton)
                    }}
                    onClick={() => setSelectedCategory(category)}
                    onMouseOver={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.borderColor = theme.colors.primary[300];
                        e.currentTarget.style.color = theme.colors.primary[500];
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.borderColor = theme.colors.secondary[200];
                        e.currentTarget.style.color = theme.colors.text.secondary;
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div style={styles.viewToggle}>
                <button
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'grid' && styles.activeViewButton)
                  }}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <FiGrid size={20} />
                </button>
                <button
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'list' && styles.activeViewButton)
                  }}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <FiList size={20} />
                </button>
              </div>
            </div>
          </header>

          <div style={styles.mainLayout}>
            <main style={styles.mainContent}>
              <div style={styles.postsGrid}>
                {filteredPosts.map((post, index) => (
                  <BlogPostCard 
                    key={post.id} 
                    post={post} 
                    index={index}
                    isMobile={isMobile}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </main>

            <aside style={styles.sidebar}>
              <div style={styles.sidebarCard}>
                <h2 style={styles.sidebarTitle}>
                  <FiTrendingUp size={28} />
                  Trending Now
                </h2>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing[4]
                }}>
                  {popularPostsData.map((post, index) => (
                    <PopularPostItem key={post.id} post={post} index={index} />
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {!isMobile && (
            <div style={styles.floatingActions}>
              <button 
                style={styles.floatingButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15) rotate(5deg)';
                  e.currentTarget.style.boxShadow = theme.colors.shadows.glow;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = theme.colors.shadows['2xl'];
                }}
                title="Explore Courses"
              >
                <FiBookmark size={28} />
              </button>
              
              <button 
                style={{...styles.floatingButton, background: theme.colors.gradients.warm}}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)';
                  e.currentTarget.style.boxShadow = theme.colors.shadows.glow;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = theme.colors.shadows['2xl'];
                }}
                title="Join Community"
              >
                <FiTag size={28} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;