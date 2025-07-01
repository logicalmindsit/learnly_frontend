import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiTrendingUp,
  FiAward,
  FiActivity,
  FiDollarSign,
  FiUser,
  FiChevronRight
} from "react-icons/fi";

const MainDashBoard = () => {
  const navigate = useNavigate();

  const items = [
    { name: "Lesson Status", path: "/lesson-status", icon: <FiBook />, color: "#3b82f6" },
    { name: "Performance Record", path: "#", icon: <FiTrendingUp />, color: "#10b981" },
    { name: "Exam Mark Record", path: "/Examrecord", icon: <FiAward />, color: "#f59e0b" },
    { name: "Practice Class Record", path: "#", icon: <FiActivity />, color: "#8b5cf6" },
    { name: "Fees Record", path: "/payment", icon: <FiDollarSign />, color: "#ec4899" },
    { name: "Profile", path: "/profile", icon: <FiUser />, color: "#6366f1" },
  ];

  const stats = [
    { label: "Completed Lessons", value: "24/36", progress: 67 },
    { label: "Average Score", value: "87%", progress: 87 },
    { label: "Days Active", value: "28", progress: 78 },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Welcome Back, Student!</h1>
        <p style={styles.subtitle}>Track your learning progress and achievements</p>
      </div>
      
      <div style={styles.contentWrapper}>
        <div style={styles.mainContent}>
          <div style={styles.cardGrid}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{...styles.card, borderLeft: `4px solid ${item.color}`}}
                onClick={() => handleItemClick(item.path)}
              >
                <div style={{...styles.cardIcon, color: item.color, backgroundColor: `${item.color}20`}}>
                  {item.icon}
                </div>
                <div style={styles.cardText}>{item.name}</div>
                <div style={styles.cardArrow}>
                  <FiChevronRight />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.sideContent}>

          
          <div style={styles.imageCard}>
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Student studying" 
              style={styles.image}
            />
            <div style={styles.imageOverlay}>
              <p style={styles.overlayText}>Keep up the good work!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f0ff 100%)',
    padding: '2rem 1rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0 1rem',
  },
  title: {
    color: '#1e3a8a',
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: '700',
    marginBottom: '0.5rem',
    lineHeight: '1.2',
    background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    margin: '0',
    lineHeight: '1.5',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: '1 1 600px',
    maxWidth: '800px',
  },
  sideContent: {
    flex: '1 1 300px',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
    width: '100%',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #3b82f6',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    }
  },
  cardIcon: {
    fontSize: '1.25rem',
    marginRight: '1rem',
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  cardText: {
    color: '#1e293b',
    fontWeight: '600',
    fontSize: '1rem',
    flexGrow: '1',
  },
  cardArrow: {
    color: '#94a3b8',
    fontSize: '1.1rem',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  statsTitle: {
    color: '#1e3a8a',
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  statItem: {
    marginBottom: '1.25rem',
  },
  statInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: '#64748b',
    fontSize: '0.9rem',
  },
  statValue: {
    color: '#1e3a8a',
    fontWeight: '600',
    fontSize: '1rem',
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
  },
  imageCard: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
    padding: '1.5rem',
    color: 'white',
  },
  overlayText: {
    margin: '0',
    fontSize: '1rem',
    fontWeight: '500',
  },
  // Media queries for responsive design
  '@media (max-width: 1024px)': {
    contentWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    mainContent: {
      width: '100%',
      maxWidth: '100%',
    },
    sideContent: {
      width: '100%',
      maxWidth: '600px',
    },
  },
  '@media (max-width: 768px)': {
    container: {
      padding: '1.5rem 1rem',
    },
    cardGrid: {
      gridTemplateColumns: '1fr',
    },
    statsCard: {
      padding: '1.25rem',
    },
  },
  '@media (max-width: 480px)': {
    container: {
      padding: '1rem 0.75rem',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.5rem',
    },
    card: {
      padding: '1rem',
    },
    cardIcon: {
      padding: '0.5rem',
      fontSize: '1rem',
      marginRight: '0.75rem',
    },
    cardText: {
      fontSize: '0.9rem',
    },
  }
};

// Apply styles as CSS (since we can't use CSS-in-JS directly in this environment)
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = Object.entries(styles).map(([selector, rules]) => {
  if (selector.startsWith('@media')) {
    const mediaQuery = selector;
    const mediaRules = Object.entries(rules).map(([subSelector, subRules]) => {
      return `${subSelector} { ${Object.entries(subRules).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }`;
    }).join(' ');
    return `${mediaQuery} { ${mediaRules} }`;
  } else if (selector.startsWith('&')) {
    return `.dashboard ${selector} { ${Object.entries(rules).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }`;
  } else {
    return `.dashboard ${selector} { ${Object.entries(rules).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }`;
  }
}).join(' ');
document.head.appendChild(styleSheet);

export default MainDashBoard;