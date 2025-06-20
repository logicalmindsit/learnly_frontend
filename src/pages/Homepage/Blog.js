// PASTE THIS ENTIRE CODE BLOCK INTO YOUR BlogPage.js FILE

import React, { useState, useEffect } from 'react'; // We need 'useEffect'
// Add this to the top of BlogPage.js
import { FiArrowLeft } from 'react-icons/fi';
const theme = {
  colors: {
    primary: '#0862F7',
    secondary: '#0A033C',
    text: '#696984',
    green: '#22C55E',
    lightBlueBg: '#F0F6FF',
    lightGrayBg: '#F7F8FA',
    white: '#FFFFFF',
    border: '#E9EAF0',
    yellow: '#FFC221',
  },
};

// --- MOCK DATA --- (Your original data)
const mainPostsData = [
  { id: 1, imageUrl: '/Siddha.jpg', title: 'Herbal Healing Siddha', date: 'Sep 20, 2022', category: 'Blog', excerpt: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been...', },
  { id: 2, imageUrl: '/Siddha.jpg', title: 'Intermediate - Varma ', date: 'Aug 20, 2022', category: 'Blog', excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et...', },
  { id: 3, imageUrl: '/ad.png', title: 'Introduction of Ayurveda ', date: 'July 28, 2022', category: 'Blog', excerpt: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur...', },
  { id: 4, imageUrl: '/y21.jpg', title: 'yoga', date: 'July 15, 2022', category: 'Updates', excerpt: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...', },
];
const popularPostsData = [
  { id: 1, imageUrl: '/y21.jpg', title: 'LMS WordPress plugin', date: 'September 20, 2022', category: 'Blog' },
  { id: 2, imageUrl: '/y21.jpg', title: 'Admin earns scholarship', date: 'August 20, 2022', category: 'Blog' },
  { id: 3, imageUrl: '/y21.jpg', title: 'Forensic team earns several', date: 'August 20, 2022', category: 'Blog' },
  { id: 4, imageUrl: '/y21.jpg', title: 'Working', date: 'July 22, 2022', category: 'Blog' },
];

// --- Child Components --- (Your original components)
const BlogPostCard = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.08)', transition: 'box-shadow 0.3s ease, transform 0.3s ease', cursor: 'pointer', transform: isHovered ? 'translateY(-5px)' : 'translateY(0)', };
  const cardImageStyle = { width: '100%', height: '220px', objectFit: 'cover' };
  const cardContentStyle = { padding: '25px' };
  const cardTitleStyle = { margin: '0 0 10px 0', fontSize: '22px', fontWeight: 'bold', color: '#212529' };
  const cardMetaStyle = { margin: '0 0 15px 0', fontSize: '14px', color: '#6C757D' };
  const cardExcerptStyle = { margin: '0', fontSize: '16px', color: '#495057', lineHeight: '1.6' };
  return ( <div style={cardStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}> <img src={post.imageUrl} alt={post.title} style={cardImageStyle} /> <div style={cardContentStyle}> <h3 style={cardTitleStyle}>{post.title}</h3> <p style={cardMetaStyle}>{post.date}  |  {post.category}</p> <p style={cardExcerptStyle}>{post.excerpt}</p> </div> </div> );
};
const PopularPostItem = ({ post }) => {
  const itemStyle = { display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' };
  const imageStyle = { width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' };
  const textContainerStyle = { display: 'flex', flexDirection: 'column' };
  const titleStyle = { margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold', color: '#343A40' };
  const metaStyle = { margin: '0', fontSize: '14px', color: '#6C757D' };
  return ( <div style={itemStyle}> <img src={post.imageUrl} alt={post.title} style={imageStyle} /> <div style={textContainerStyle}> <h4 style={titleStyle}>{post.title}</h4> <p style={metaStyle}>{post.date}  |  {post.category}</p> </div> </div> );
};

// --- MAIN BLOG PAGE COMPONENT ---
const BlogPage = () => {
  // This new code detects the screen size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set a breakpoint for mobile devices
  const isMobile = windowWidth < 768;

  // The styles object is now INSIDE the component to use `isMobile`
  const styles = {
    pageContainer: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#F8F9FA',
      padding: isMobile ? '20px' : '40px',
    },
   pageTitleContainer: {
      display: 'flex',
      alignItems: 'center', // <-- ADD THIS LINE
      gap: '20px',
      marginBottom: '40px',
    },
    // REPLACE your old backButton style with this new one

    backButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent', // No background color by default
      border: `1px solid ${theme.colors.border}`, // A subtle border matching your theme
      color: theme.colors.text, // Muted text color from your theme
      borderRadius: '50%', // Makes it a perfect circle
      width: isMobile ? '40px' : '48px', // Responsive size
      height: isMobile ? '40px' : '48px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out', // Smooth transition for hover effect
      
      // Use a pseudo-class for hover state (this requires a bit of a trick in inline styles)
      // We will handle this directly on the button element for simplicity.
    },
    pageTitle: { fontSize: isMobile ? '2.2rem' : '2.8rem', fontWeight: 'bold', color: '#343A40', marginBottom: '0' },
    contentWrapper: {
      display: 'flex',
      // THIS IS THE MOST IMPORTANT CHANGE:
      flexDirection: isMobile ? 'column' : 'row',
      gap: '40px',
    },
    mainContent: { flex: 3 },
    postsGrid: {
      display: 'grid',
      // THIS IS THE SECOND MOST IMPORTANT CHANGE:
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '30px',
    },
    sidebar: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', marginTop: isMobile ? '40px' : '0' },
    popularPostsTitle: { fontSize: '24px', fontWeight: 'bold', color: '#343A40', marginBottom: '10px' },
    popularPostsList: { display: 'flex', flexDirection: 'column', gap: '25px' },
    fixedButtonsContainer: { position: 'fixed', top: '50%', right: '0', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px' },
    fixedButton: { backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px 0 0 8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '70px', height: '60px', cursor: 'pointer', fontSize: '12px', color: '#495057' },
  };

  return (
    <>
     
      <div style={styles.pageContainer}>
        <div style={styles.pageTitleContainer}>
           <button
            style={styles.backButton}
            onClick={() => window.history.back()}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.lightBlueBg;
              e.currentTarget.style.borderColor = theme.colors.primary;
              e.currentTarget.style.color = theme.colors.primary;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.color = theme.colors.text;
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Go back"
          >
            <FiArrowLeft size={isMobile ? 20 : 24} />
          </button>
          <h1 style={styles.pageTitle}>Blog</h1>
        </div>

        <div style={styles.contentWrapper}>
          <main style={styles.mainContent}>
            <div style={styles.postsGrid}>
              {mainPostsData.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </main>

          <aside style={styles.sidebar}>
            <h2 style={styles.popularPostsTitle}>Popular posts</h2>
            <div style={styles.popularPostsList}>
              {popularPostsData.map((post) => (
                <PopularPostItem key={post.id} post={post} />
              ))}
            </div>
          </aside>
        </div>

        <div style={styles.fixedButtonsContainer}>
          <div style={styles.fixedButton}>
              <span style={{fontSize: '24px'}}>📚</span>
              <span>Demos</span>
          </div>
          <div style={styles.fixedButton}>
              <span style={{fontSize: '24px'}}>🛒</span>
              <span>Buy Now</span>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default BlogPage;