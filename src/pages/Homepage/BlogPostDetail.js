import React, { useState, useEffect, useCallback } from 'react';
import { FiArrowLeft, FiClock, FiTag, FiShare2, FiBookmark, FiEye, FiHeart, FiUser, FiCalendar, FiThumbsUp, FiMessageCircle, FiTrendingUp } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const theme = {
  colors: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#1E293B',
    accent: '#F59E0B',
    success: '#10B981',
    text: '#374151',
    textLight: '#6B7280',
    textDark: '#111827',
    background: '#FAFBFC',
    backgroundSecondary: '#F8FAFC',
    white: '#FFFFFF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    gradient: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      blue: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    }
  },
  animation: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
};

// Enhanced blog post data with more rich content
const blogPostData = {
  1: {
    id: 1,
    title: 'Herbal Healing Siddha: Ancient Wisdom for Modern Health',
    subtitle: 'Discover the profound healing traditions that have transformed lives for over 5,000 years',
    imageUrl: '/Siddha.jpg',
    category: 'Traditional Medicine',
    date: 'Sep 20, 2022',
    readTime: '5 min read',
    views: '2.4k',
    likes: '48',
    comments: '12',
    shares: '24',
    difficulty: 'Beginner',
    tags: ['Siddha', 'Traditional Medicine', 'Holistic Health', 'Ancient Wisdom', 'Natural Healing'],
    author: {
      name: 'Dr. Rajesh Kumar',
      avatar: '/default-avatar.jpg',
      bio: 'Traditional Medicine Expert with 20+ years of experience in Siddha practices',
      credentials: 'MD (Siddha), PhD in Traditional Medicine',
      followers: '12.5k',
      articles: '156'
    },
    content: `
      <div class="article-intro">
        <p class="lead-paragraph">Siddha medicine, one of the world's oldest medical systems, continues to offer profound healing wisdom that is increasingly relevant in our modern healthcare landscape. This ancient Tamil tradition, dating back over 5,000 years, provides a holistic approach to wellness that treats not just symptoms, but the entire person.</p>
      </div>
      
      <div class="content-section">
        <h2 class="section-title">The Foundation of Siddha Medicine</h2>
        <p>At its core, Siddha medicine is built upon the understanding that the human body is a microcosm of the universe. This system recognizes three fundamental life forces or 'doshas' that govern our physical, mental, and spiritual well-being:</p>
        
        <div class="dosha-grid">
          <div class="dosha-card">
            <h3>Vatham (Wind)</h3>
            <p>Controls movement and nervous system functions, governing circulation, breathing, and neural activities.</p>
          </div>
          <div class="dosha-card">
            <h3>Pitham (Fire)</h3>
            <p>Governs digestion and metabolism, responsible for transformation and energy production.</p>
          </div>
          <div class="dosha-card">
            <h3>Kabam (Water)</h3>
            <p>Maintains structure and immunity, providing stability and protective functions.</p>
          </div>
        </div>
      </div>
      
      <div class="content-section">
        <h2 class="section-title">Modern Applications of Ancient Wisdom</h2>
        <p>Today's healthcare practitioners are rediscovering the value of Siddha medicine's personalized approach. Unlike conventional medicine's one-size-fits-all methodology, Siddha treatment is tailored to individual constitution, lifestyle, and specific imbalances.</p>
        
        <blockquote class="enhanced-quote">
          <div class="quote-content">
            <p>"The beauty of Siddha medicine lies in its recognition that each person is unique, requiring individualized treatment that addresses root causes rather than merely suppressing symptoms."</p>
          </div>
          <div class="quote-author">
            <cite>— Ancient Siddha Texts</cite>
          </div>
        </blockquote>
      </div>
      
      <div class="content-section">
        <h2 class="section-title">Key Healing Principles</h2>
        <p>Siddha medicine employs several sophisticated therapeutic approaches that work synergistically:</p>
        
        <div class="principles-list">
          <div class="principle-item">
            <div class="principle-number">01</div>
            <div class="principle-content">
              <h3>Herbal Medicines</h3>
              <p>Carefully prepared plant-based remedies using time-tested formulations and precise preparation methods.</p>
            </div>
          </div>
          <div class="principle-item">
            <div class="principle-number">02</div>
            <div class="principle-content">
              <h3>Dietary Therapy</h3>
              <p>Food as medicine principles that align nutrition with individual constitution and seasonal requirements.</p>
            </div>
          </div>
          <div class="principle-item">
            <div class="principle-number">03</div>
            <div class="principle-content">
              <h3>Yoga and Meditation</h3>
              <p>Mind-body healing practices that integrate physical postures with breath work and mental discipline.</p>
            </div>
          </div>
          <div class="principle-item">
            <div class="principle-number">04</div>
            <div class="principle-content">
              <h3>Mineral Therapies</h3>
              <p>Purified metals and minerals for specific conditions, prepared through ancient alchemical processes.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="content-section">
        <h2 class="section-title">Integration with Modern Healthcare</h2>
        <p>The integration of Siddha medicine with conventional healthcare offers exciting possibilities for comprehensive treatment approaches. Many chronic conditions that challenge modern medicine respond well to Siddha interventions, particularly when combined with contemporary diagnostic tools.</p>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">5000+</div>
            <div class="stat-label">Years of Practice</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">85%</div>
            <div class="stat-label">Patient Satisfaction</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">200+</div>
            <div class="stat-label">Documented Formulations</div>
          </div>
        </div>
        
        <p>As we move forward, the wisdom of Siddha medicine reminds us that true healing encompasses not just the physical body, but the mind and spirit as well. This ancient system's emphasis on prevention, lifestyle modification, and natural healing continues to offer valuable insights for our modern world.</p>
      </div>
    `
  }
};

const BlogPostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const post = blogPostData[id] || blogPostData[1];

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  }, [post]);

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      position: 'relative',
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      opacity: isVisible ? 1 : 0,
      transition: theme.animation.transition,
    },
    
    // Progress bar
    progressBar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: theme.colors.gradient.primary,
      transform: `scaleX(${scrollProgress})`,
      transformOrigin: 'left',
      transition: 'transform 0.1s ease',
      zIndex: 1000,
    },

    // Enhanced header with better mobile support
    header: {
      position: 'relative',
      height: isMobile ? '50vh' : '70vh',
      minHeight: isMobile ? '400px' : '500px',
      background: `linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%), url(${post.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'scroll', // Always scroll for better mobile performance
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: isMobile ? '0 16px' : '0 20px',
      overflow: 'hidden',
    },

    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
      zIndex: 1,
    },

    // Enhanced back button with better mobile touch target
    backButton: {
      position: 'absolute',
      top: isMobile ? '20px' : '30px',
      left: isMobile ? '16px' : '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.95)',
      border: 'none',
      color: theme.colors.text,
      borderRadius: '16px',
      width: isMobile ? '48px' : '56px',
      height: isMobile ? '48px' : '56px',
      cursor: 'pointer',
      transition: theme.animation.bounce,
      backdropFilter: 'blur(20px)',
      boxShadow: theme.colors.shadow.lg,
      zIndex: 10,
      // Better touch target for mobile
      minWidth: '44px',
      minHeight: '44px',
    },

    headerContent: {
      maxWidth: '900px',
      margin: '0 auto',
      zIndex: 2,
      position: 'relative',
      animation: 'fadeInUp 1s ease-out',
      padding: isMobile ? '0 8px' : '0',
    },

    // Enhanced category badge with mobile optimization
    categoryBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '8px',
      background: theme.colors.gradient.accent,
      color: 'white',
      padding: isMobile ? '10px 20px' : '12px 24px',
      borderRadius: '50px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: isMobile ? '16px' : '24px',
      boxShadow: theme.colors.shadow.lg,
      border: '2px solid rgba(255, 255, 255, 0.2)',
    },

    title: {
      fontSize: isMobile ? '1.8rem' : isTablet ? '3.5rem' : '4rem',
      fontWeight: '900',
      marginBottom: '16px',
      lineHeight: isMobile ? '1.2' : '1.1',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
      // Better text wrapping for mobile
      wordBreak: isMobile ? 'break-word' : 'normal',
      hyphens: isMobile ? 'auto' : 'none',
    },

    subtitle: {
      fontSize: isMobile ? '1rem' : '1.3rem',
      fontWeight: '400',
      marginBottom: isMobile ? '24px' : '32px',
      opacity: 0.9,
      lineHeight: '1.6',
      maxWidth: '700px',
      margin: isMobile ? '0 auto 24px' : '0 auto 32px',
    },

    // Enhanced meta section with better mobile layout
    meta: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? '12px' : '24px',
      fontSize: isMobile ? '14px' : '16px',
      opacity: 0.95,
      flexWrap: 'wrap',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: isMobile ? '12px 16px' : '16px 24px',
      borderRadius: '50px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },

    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '4px' : '8px',
      fontWeight: '500',
      // Hide some items on very small screens
      ...(isMobile && windowWidth < 400 ? { display: 'none' } : {}),
    },

    // Mobile-first meta item for essential info only
    metaItemEssential: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '4px' : '8px',
      fontWeight: '500',
    },

    // Enhanced content container with mobile optimization
    content: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: isMobile ? '40px 16px' : '80px 40px',
      backgroundColor: 'white',
      borderRadius: isMobile ? '20px 20px 0 0' : '32px 32px 0 0',
      marginTop: isMobile ? '-40px' : '-60px',
      position: 'relative',
      zIndex: 3,
      boxShadow: theme.colors.shadow['2xl'],
      border: '1px solid rgba(255, 255, 255, 0.8)',
    },

    // Enhanced author section with mobile layout
    authorSection: {
      display: 'flex',
      alignItems: isMobile ? 'flex-start' : 'center',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '16px' : '20px',
      padding: isMobile ? '24px 20px' : '32px',
      background: theme.colors.gradient.blue,
      borderRadius: isMobile ? '16px' : '24px',
      marginBottom: isMobile ? '32px' : '48px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      textAlign: isMobile ? 'center' : 'left',
    },

    authorSectionOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      borderRadius: isMobile ? '16px' : '24px',
    },

    authorAvatar: {
      width: isMobile ? '60px' : '80px',
      height: isMobile ? '60px' : '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid rgba(255, 255, 255, 0.3)',
      boxShadow: theme.colors.shadow.lg,
      zIndex: 1,
      position: 'relative',
      alignSelf: isMobile ? 'center' : 'flex-start',
    },

    authorInfo: {
      flex: 1,
      zIndex: 1,
      position: 'relative',
    },

    authorName: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '700',
      marginBottom: '6px',
      color: 'white',
    },

    authorCredentials: {
      fontSize: isMobile ? '12px' : '14px',
      opacity: 0.9,
      marginBottom: '8px',
      fontWeight: '500',
    },

    authorBio: {
      fontSize: isMobile ? '14px' : '16px',
      opacity: 0.9,
      lineHeight: '1.5',
      marginBottom: '12px',
    },

    authorStats: {
      display: 'flex',
      gap: isMobile ? '16px' : '24px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '600',
      justifyContent: isMobile ? 'center' : 'flex-start',
      flexWrap: 'wrap',
    },

    // Enhanced article content with mobile typography
    articleContent: {
      fontSize: isMobile ? '16px' : '18px',
      lineHeight: isMobile ? '1.7' : '1.8',
      color: theme.colors.text,
      marginBottom: isMobile ? '32px' : '48px',
    },

    // Enhanced tags section with mobile layout
    tagsSection: {
      marginBottom: isMobile ? '32px' : '48px',
    },

    tagsTitle: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: theme.colors.textDark,
    },

    tags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: isMobile ? '8px' : '12px',
    },

    tag: {
      padding: isMobile ? '6px 12px' : '8px 16px',
      background: theme.colors.backgroundSecondary,
      border: `2px solid ${theme.colors.borderLight}`,
      borderRadius: '50px',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: '500',
      color: theme.colors.text,
      transition: theme.animation.transition,
      cursor: 'pointer',
    },

    // Enhanced action bar with mobile layout
    actionBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '20px' : '0',
      padding: isMobile ? '20px 16px' : '24px 32px',
      borderTop: `2px solid ${theme.colors.borderLight}`,
      borderBottom: `2px solid ${theme.colors.borderLight}`,
      margin: isMobile ? '32px 0' : '48px 0',
      background: theme.colors.backgroundSecondary,
      borderRadius: isMobile ? '16px' : '20px',
    },

    actionButtons: {
      display: 'flex',
      gap: isMobile ? '12px' : '16px',
      flexWrap: 'wrap',
      justifyContent: isMobile ? 'center' : 'flex-start',
      width: isMobile ? '100%' : 'auto',
    },

    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '6px' : '10px',
      padding: isMobile ? '12px 16px' : '14px 20px',
      border: `2px solid ${theme.colors.border}`,
      borderRadius: isMobile ? '12px' : '16px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: theme.animation.bounce,
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      color: theme.colors.text,
      boxShadow: theme.colors.shadow.sm,
      minWidth: isMobile ? 'auto' : '100px',
      justifyContent: 'center',
      // Better touch targets for mobile
      minHeight: '44px',
      flex: isMobile ? '1' : 'none',
    },

    socialProof: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '20px',
      fontSize: isMobile ? '12px' : '14px',
      color: theme.colors.textLight,
      fontWeight: '500',
      flexWrap: 'wrap',
      justifyContent: isMobile ? 'center' : 'flex-end',
      // Hide on very small screens to save space
      ...(isMobile && windowWidth < 400 ? { display: 'none' } : {}),
    },

    // Reading progress indicator - hide on mobile for cleaner UI
    readingProgress: {
      display: isMobile ? 'none' : 'block',
      position: 'fixed',
      right: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '4px',
      height: '200px',
      background: theme.colors.borderLight,
      borderRadius: '2px',
      zIndex: 100,
    },

    readingProgressFill: {
      width: '100%',
      height: `${scrollProgress * 100}%`,
      background: theme.colors.gradient.primary,
      borderRadius: '2px',
      transition: 'height 0.1s ease',
    },

    // Newsletter signup with mobile optimization
    newsletterSection: {
      background: theme.colors.gradient.purple,
      borderRadius: isMobile ? '16px' : '24px',
      padding: isMobile ? '32px 20px' : '48px 32px',
      textAlign: 'center',
      color: 'white',
      marginTop: isMobile ? '32px' : '48px',
      position: 'relative',
      overflow: 'hidden',
    },

    newsletterTitle: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: '700',
      marginBottom: '16px',
    },

    newsletterSubtitle: {
      fontSize: isMobile ? '16px' : '18px',
      opacity: 0.9,
      marginBottom: isMobile ? '24px' : '32px',
      maxWidth: '500px',
      margin: isMobile ? '0 auto 24px' : '0 auto 32px',
      lineHeight: '1.6',
    },

    newsletterForm: {
      display: 'flex',
      gap: isMobile ? '12px' : '16px',
      maxWidth: '400px',
      margin: '0 auto',
      flexDirection: isMobile ? 'column' : 'row',
    },

    newsletterInput: {
      flex: 1,
      padding: isMobile ? '14px 16px' : '16px 20px',
      borderRadius: isMobile ? '12px' : '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '16px',
      backdropFilter: 'blur(10px)',
      minHeight: '44px', // Better touch target
    },

    newsletterButton: {
      padding: isMobile ? '14px 24px' : '16px 32px',
      background: 'white',
      color: theme.colors.primary,
      border: 'none',
      borderRadius: isMobile ? '12px' : '16px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: theme.animation.bounce,
      whiteSpace: 'nowrap',
      minHeight: '44px', // Better touch target
    },
  };

  // Enhanced content styles with better mobile responsiveness
  const contentStyles = `
    <style>
      .article-intro {
        margin-bottom: ${isMobile ? '32px' : '48px'};
      }
      
      .lead-paragraph {
        font-size: ${isMobile ? '18px' : '22px'};
        line-height: 1.7;
        color: #374151;
        font-weight: 400;
        margin-bottom: 0;
        text-align: justify;
      }
      
      .content-section {
        margin-bottom: ${isMobile ? '32px' : '48px'};
      }
      
      .section-title {
        font-size: ${isMobile ? '24px' : '32px'};
        font-weight: 800;
        color: #111827;
        margin-bottom: ${isMobile ? '16px' : '24px'};
        line-height: 1.2;
        position: relative;
        padding-left: ${isMobile ? '16px' : '20px'};
      }
      
      .section-title::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        border-radius: 2px;
      }
      
      .dosha-grid {
        display: grid;
        grid-template-columns: ${isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))'};
        gap: ${isMobile ? '16px' : '24px'};
        margin: ${isMobile ? '24px 0' : '32px 0'};
      }
      
      .dosha-card {
        background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
        padding: ${isMobile ? '24px 20px' : '32px'};
        border-radius: ${isMobile ? '16px' : '20px'};
        border: 2px solid #E2E8F0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      
      .dosha-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%);
      }
      
      .dosha-card:hover {
        transform: ${isMobile ? 'translateY(-4px)' : 'translateY(-8px)'};
        box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.3);
        border-color: #6366F1;
      }
      
      .dosha-card h3 {
        font-size: ${isMobile ? '18px' : '20px'};
        font-weight: 700;
        color: #1E293B;
        margin-bottom: 12px;
      }
      
      .dosha-card p {
        color: #64748B;
        line-height: 1.6;
        margin: 0;
        font-size: ${isMobile ? '14px' : '16px'};
      }
      
      .enhanced-quote {
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        padding: ${isMobile ? '24px 20px' : '40px'};
        border-radius: ${isMobile ? '16px' : '24px'};
        margin: ${isMobile ? '24px 0' : '40px 0'};
        color: white;
        position: relative;
        overflow: hidden;
      }
      
      .enhanced-quote::before {
        content: '"';
        position: absolute;
        top: ${isMobile ? '-5px' : '-10px'};
        left: ${isMobile ? '10px' : '20px'};
        font-size: ${isMobile ? '80px' : '120px'};
        font-weight: 700;
        opacity: 0.2;
        font-family: serif;
      }
      
      .quote-content p {
        font-size: ${isMobile ? '18px' : '24px'};
        line-height: 1.5;
        font-weight: 500;
        margin: 0;
        position: relative;
        z-index: 1;
      }
      
      .quote-author {
        margin-top: ${isMobile ? '16px' : '20px'};
        text-align: right;
      }
      
      .quote-author cite {
        font-size: ${isMobile ? '14px' : '16px'};
        opacity: 0.9;
        font-style: normal;
        font-weight: 600;
      }
      
      .principles-list {
        margin: ${isMobile ? '24px 0' : '32px 0'};
      }
      
      .principle-item {
        display: flex;
        gap: ${isMobile ? '16px' : '24px'};
        margin-bottom: ${isMobile ? '24px' : '32px'};
        padding: ${isMobile ? '20px 16px' : '32px'};
        background: white;
        border-radius: ${isMobile ? '16px' : '20px'};
        border: 2px solid #F3F4F6;
        transition: all 0.3s ease;
        position: relative;
        flex-direction: ${isMobile ? 'column' : 'row'};
        text-align: ${isMobile ? 'center' : 'left'};
      }
      
      .principle-item:hover {
        transform: ${isMobile ? 'translateY(-4px)' : 'translateX(8px)'};
        border-color: #6366F1;
        box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.3);
      }
      
      .principle-number {
        font-size: ${isMobile ? '20px' : '24px'};
        font-weight: 800;
        color: white;
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        width: ${isMobile ? '50px' : '60px'};
        height: ${isMobile ? '50px' : '60px'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 8px 20px -8px rgba(99, 102, 241, 0.5);
        align-self: ${isMobile ? 'center' : 'flex-start'};
      }
      
      .principle-content h3 {
        font-size: ${isMobile ? '18px' : '22px'};
        font-weight: 700;
        color: #1E293B;
        margin-bottom: 12px;
      }
      
      .principle-content p {
        color: #64748B;
        line-height: 1.6;
        margin: 0;
        font-size: ${isMobile ? '14px' : '16px'};
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: ${isMobile ? 'repeat(auto-fit, minmax(100px, 1fr))' : 'repeat(auto-fit, minmax(150px, 1fr))'};
        gap: ${isMobile ? '16px' : '24px'};
        margin: ${isMobile ? '24px 0' : '40px 0'};
      }
      
      .stat-item {
        text-align: center;
        padding: ${isMobile ? '24px 16px' : '32px 24px'};
        background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
        border-radius: ${isMobile ? '16px' : '20px'};
        border: 2px solid #E2E8F0;
        transition: all 0.3s ease;
      }
      
      .stat-item:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.1);
        border-color: #6366F1;
      }
      
      .stat-number {
        font-size: ${isMobile ? '32px' : '48px'};
        font-weight: 900;
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 8px;
        line-height: 1;
      }
      
      .stat-label {
        font-size: ${isMobile ? '12px' : '14px'};
        font-weight: 600;
        color: #64748B;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      /* Enhanced mobile responsiveness */
      @media (max-width: 480px) {
        .dosha-grid {
          gap: 12px;
        }
        
        .dosha-card {
          padding: 20px 16px;
        }
        
        .enhanced-quote {
          padding: 20px 16px;
          margin: 20px 0;
        }
        
        .quote-content p {
          font-size: 16px;
        }
        
        .principle-item {
          padding: 16px 12px;
          margin-bottom: 20px;
        }
        
        .principle-number {
          width: 45px;
          height: 45px;
          font-size: 18px;
        }
        
        .principle-content h3 {
          font-size: 16px;
        }
        
        .principle-content p {
          font-size: 13px;
        }
        
        .stats-grid {
          grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
          gap: 12px;
        }
        
        .stat-item {
          padding: 20px 12px;
        }
        
        .stat-number {
          font-size: 28px;
        }
        
        .stat-label {
          font-size: 11px;
        }
      }
    </style>
  `;

  return (
    <div style={styles.container}>
      {/* Reading progress bar */}
      <div style={styles.progressBar}></div>
      
      {/* Reading progress indicator - hidden on mobile */}
      {!isMobile && (
        <div style={styles.readingProgress}>
          <div style={styles.readingProgressFill}></div>
        </div>
      )}

      {/* Enhanced header */}
      <div style={styles.header}>
        <div style={styles.headerOverlay}></div>
        
        <button
          style={styles.backButton}
          onClick={() => navigate(-1)}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)';
            e.currentTarget.style.background = theme.colors.gradient.primary;
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.color = theme.colors.text;
          }}
          aria-label="Go back"
        >
          <FiArrowLeft size={isMobile ? 20 : 24} />
        </button>
        
        <div style={styles.headerContent}>
          <div style={styles.categoryBadge}>
            <FiTag size={isMobile ? 14 : 16} />
            {post.category}
          </div>
          <h1 style={styles.title}>{post.title}</h1>
          <p style={styles.subtitle}>{post.subtitle}</p>
          <div style={styles.meta}>
            <div style={styles.metaItemEssential}>
              <FiCalendar size={isMobile ? 14 : 16} />
              <span>{post.date}</span>
            </div>
            <span>•</span>
            <div style={styles.metaItemEssential}>
              <FiClock size={isMobile ? 14 : 16} />
              <span>{post.readTime}</span>
            </div>
            {!isMobile && (
              <>
                <span>•</span>
                <div style={styles.metaItem}>
                  <FiEye size={16} />
                  <span>{post.views} views</span>
                </div>
                <span>•</span>
                <div style={styles.metaItem}>
                  <FiTrendingUp size={16} />
                  <span>{post.difficulty}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced content */}
      <div style={styles.content}>
        {/* Enhanced author section */}
        <div style={styles.authorSection}>
          <div style={styles.authorSectionOverlay}></div>
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            style={styles.authorAvatar}
          />
          <div style={styles.authorInfo}>
            <div style={styles.authorName}>{post.author.name}</div>
            <div style={styles.authorCredentials}>{post.author.credentials}</div>
            <div style={styles.authorBio}>{post.author.bio}</div>
            <div style={styles.authorStats}>
              <span>{post.author.followers} followers</span>
              <span>•</span>
              <span>{post.author.articles} articles</span>
            </div>
          </div>
        </div>

        {/* Article content with enhanced styling */}
        <div 
          style={styles.articleContent}
          dangerouslySetInnerHTML={{ 
            __html: contentStyles + post.content 
          }}
        />

        {/* Tags section */}
        <div style={styles.tagsSection}>
          <div style={styles.tagsTitle}>Related Topics</div>
          <div style={styles.tags}>
            {post.tags.map((tag, index) => (
              <span
                key={index}
                style={styles.tag}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = theme.colors.primary;
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.colors.shadow.lg;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = theme.colors.backgroundSecondary;
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Enhanced action bar */}
        <div style={styles.actionBar}>
          <div style={styles.actionButtons}>
            <button
              style={{
                ...styles.actionButton,
                background: isLiked ? theme.colors.gradient.accent : 'white',
                color: isLiked ? 'white' : theme.colors.text,
                borderColor: isLiked ? 'transparent' : theme.colors.border,
              }}
              onClick={() => setIsLiked(!isLiked)}
              onMouseOver={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  e.currentTarget.style.boxShadow = theme.colors.shadow.lg;
                }
              }}
              onMouseOut={(e) => {
                if (!isLiked) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = theme.colors.shadow.sm;
                }
              }}
            >
              <FiHeart size={isMobile ? 16 : 18} fill={isLiked ? 'white' : 'none'} />
              {!isMobile && post.likes}
            </button>
            
            <button
              style={{
                ...styles.actionButton,
                background: isBookmarked ? theme.colors.gradient.success : 'white',
                color: isBookmarked ? 'white' : theme.colors.text,
                borderColor: isBookmarked ? 'transparent' : theme.colors.border,
              }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              onMouseOver={(e) => {
                if (!isBookmarked) {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  e.currentTarget.style.boxShadow = theme.colors.shadow.lg;
                }
              }}
              onMouseOut={(e) => {
                if (!isBookmarked) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = theme.colors.shadow.sm;
                }
              }}
            >
              <FiBookmark size={isMobile ? 16 : 18} fill={isBookmarked ? 'white' : 'none'} />
              Save
            </button>
            
            <button 
              style={styles.actionButton}
              onClick={handleShare}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.background = theme.colors.gradient.blue;
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = theme.colors.shadow.lg;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = theme.colors.text;
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.boxShadow = theme.colors.shadow.sm;
              }}
            >
              <FiShare2 size={isMobile ? 16 : 18} />
              Share
            </button>

            <button 
              style={styles.actionButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.background = theme.colors.gradient.purple;
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = theme.colors.shadow.lg;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = theme.colors.text;
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.boxShadow = theme.colors.shadow.sm;
              }}
            >
              <FiMessageCircle size={isMobile ? 16 : 18} />
              {!isMobile && post.comments}
            </button>
          </div>

          {windowWidth >= 400 && (
            <div style={styles.socialProof}>
              <div style={styles.metaItem}>
                <FiThumbsUp size={isMobile ? 14 : 16} />
                <span>{post.likes} likes</span>
              </div>
              <span>•</span>
              <div style={styles.metaItem}>
                <FiShare2 size={isMobile ? 14 : 16} />
                <span>{post.shares} shares</span>
              </div>
            </div>
          )}
        </div>

        {/* Newsletter signup */}
        <div style={styles.newsletterSection}>
          <h3 style={styles.newsletterTitle}>Stay Updated</h3>
          <p style={styles.newsletterSubtitle}>
            Get the latest insights on traditional medicine and holistic health delivered to your inbox.
          </p>
          <div style={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.newsletterInput}
            />
            <button
              style={styles.newsletterButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = theme.colors.shadow.lg;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
