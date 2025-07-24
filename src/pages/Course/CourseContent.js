import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHeadphones, FaFilePdf, FaPlay, FaPause,
  FaChevronRight, FaCheckCircle, FaLock,
  FaStepForward, FaStepBackward, FaForward, FaBackward,
  FaVolumeUp, FaVolumeMute, FaEdit, FaBookOpen,
  FaArrowLeft, FaTimes,FaSun, FaMoon, FaMusic
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { BsCheck2All } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import { MdMenuBook } from "react-icons/md";

// --- THEME & HELPERS (UNCHANGED) ---
const theme = {
  colors: {
    primary: '#007bff', primaryDark: '#0069d9', primaryLight: '#5faaff', secondary: '#2d2f31', accent: '#f7c948', light: '#f7f7f7', dark: '#1c1d1f', gray: '#6a6f73', lightGray: '#d1d7dc', white: '#ffffff', success: '#03a678', successDark: '#028062', warning: '#f7c948', danger: '#d93025', textDark: '#1c1d1f', textLight: '#ffffff', overlay: 'rgba(0, 0, 0, 0.6)',
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
  borderRadius: { sm: '4px', md: '6px', lg: '8px', circle: '50%' },
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.1)', md: '0 2px 4px rgba(0,0,0,0.15)', lg: '0 4px 8px rgba(0,0,0,0.2)' },
  breakpoints: { mobile: '576px', tablet: '768px', laptop: '992px', desktop: '1200px' },
  transitions: { fast: 'all 0.2s ease', normal: 'all 0.3s ease', slow: 'all 0.5s ease' }
};
const useMediaQuery = (query) => { const [matches, setMatches] = useState(false); useEffect(() => { const media = window.matchMedia(query); if (media.matches !== matches) { setMatches(media.matches); } const listener = () => setMatches(media.matches); window.addEventListener('resize', listener); return () => window.removeEventListener('resize', listener); }, [matches, query]); return matches; };
const formatTime = (seconds) => { if (isNaN(seconds)) return "0:00"; const minutes = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; };


export default function CourseContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  
  // --- EXAM TIMER STATES ---
  const [examTimer, setExamTimer] = useState(null); // Time remaining in seconds
  const [examTimerActive, setExamTimerActive] = useState(false);
  const [totalExamTime, setTotalExamTime] = useState(0); // Total time allocated for exam
  const [examStarted, setExamStarted] = useState(false); // Track if exam has been started
  const [showExamModal, setShowExamModal] = useState(false); // Show exam in modal
  const [hasAnsweredQuestions, setHasAnsweredQuestions] = useState(false); // Track if user has answered any questions
  const [submissionError, setSubmissionError] = useState(''); // Track submission validation errors
  const [showValidationHighlight, setShowValidationHighlight] = useState(false); // Show highlighting when submit is pressed
  const [examInProgress, setExamInProgress] = useState(false); // Track if exam is currently in progress
  const [examCompleted, setExamCompleted] = useState(false); // Track if exam has been completed
  
  // Save exam state to localStorage
  const saveExamState = (examData) => {
    try {
      localStorage.setItem(`examState_${id}_${selectedLesson?.chapterIndex}`, JSON.stringify(examData));
    } catch (error) {
      console.error('Error saving exam state:', error);
    }
  };

  // Load exam state from localStorage
  const loadExamState = () => {
    try {
      const saved = localStorage.getItem(`examState_${id}_${selectedLesson?.chapterIndex}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading exam state:', error);
      return null;
    }
  };

  // Clear exam state from localStorage
  const clearExamState = () => {
    try {
      localStorage.removeItem(`examState_${id}_${selectedLesson?.chapterIndex}`);
    } catch (error) {
      console.error('Error clearing exam state:', error);
    }
  };
  
  // --- AUDIO COMPLETION TRACKING ---
  const [completedAudioFiles, setCompletedAudioFiles] = useState(() => {
    try {
      const saved = localStorage.getItem(`audioCompletion_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  // Set global styles for mobile optimization and white background
  useEffect(() => {
    // Set body background to white
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = "'Montserrat', 'Open Sans', 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    
    // Ensure proper mobile viewport
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    
    return () => {
      // Cleanup - reset body styles when component unmounts
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.fontFamily = '';
    };
  }, []);
  
  const examTimerRef = useRef(null);
  
  const [selectedLesson, setSelectedLesson] = useState(() => {
    try { const saved = localStorage.getItem(`coursePlayerState_${id}`); return saved ? JSON.parse(saved).selectedLesson : null; } catch { return null; }
  });
  const [currentAudioFileIndex, setCurrentAudioFileIndex] = useState(() => {
    try { const saved = localStorage.getItem(`coursePlayerState_${id}`); return saved ? JSON.parse(saved).currentAudioFileIndex : 0; } catch { return 0; }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
  const [userProgress, setUserProgress] = useState({ completedLessons: [], attemptedExams: {}, });
  const [activeTab, setActiveTab] = useState('playlist'); 
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(selectedLesson?.chapterIndex || 0);
  const [showExamQuestions, setShowExamQuestions] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const playbackOptionsRef = useRef(null);
  const playOnLoadRef = useRef(false);
  const hasRestoredState = useRef(!!selectedLesson);

  // --- FIX: Create refs to solve stale closure issues in event listeners ---
  const selectedLessonRef = useRef(selectedLesson);
  const currentAudioFileIndexRef = useRef(currentAudioFileIndex);
  const chaptersRef = useRef(chapters);

  // --- FIX: Keep refs in sync with state changes ---
  useEffect(() => { selectedLessonRef.current = selectedLesson; }, [selectedLesson]);
  useEffect(() => { currentAudioFileIndexRef.current = currentAudioFileIndex; }, [currentAudioFileIndex]);
  useEffect(() => { chaptersRef.current = chapters; }, [chapters]);

  // --- THEME ---
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('courseTheme') || 'light');
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.tablet})`);
  
  const lightColors = { 
    ...theme.colors,
    // Enhanced light mode colors
    background: '#ffffff',
    surface: '#f8f9fa',
    surfaceElevated: '#ffffff',
    border: '#e9ecef',
    shadow: 'rgba(0, 0, 0, 0.1)',
  };
  
  const darkColors = {
    ...theme.colors, 
    // Enhanced dark mode colors
    primary: '#4c9eff', 
    primaryDark: '#3d7bdb', 
    primaryLight: '#4a4e54', 
    light: '#1a1d23', // Main dark background
    dark: '#0f1114', // Darker elements
    gray: '#8b949e', 
    lightGray: '#30363d', // Elevated surfaces
    white: '#21262d', // Card backgrounds
    background: '#0d1117', // Pure dark background
    surface: '#161b22', // Surface elements
    surfaceElevated: '#21262d', // Elevated surfaces like cards
    border: '#30363d', // Border color
    shadow: 'rgba(0, 0, 0, 0.3)',
    textDark: '#f0f6fc', 
    textLight: '#f0f6fc', 
    overlay: 'rgba(0, 0, 0, 0.8)',
  };
  
  const activeColors = themeMode === 'light' ? lightColors : darkColors;
  
  useEffect(() => { localStorage.setItem('courseTheme', themeMode); }, [themeMode]);
  
  // Update document body background when theme changes
  useEffect(() => {
    document.body.style.backgroundColor = activeColors.background || (themeMode === 'light' ? '#ffffff' : '#0d1117');
    document.body.style.color = activeColors.textDark;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Cleanup function to reset on unmount
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.style.transition = '';
    };
  }, [themeMode, activeColors.background, activeColors.textDark]);
  
  const toggleTheme = () => setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  
  // --- STYLES ---
  const styles = {
    appContainer: { 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: activeColors.background || '#ffffff', 
      fontFamily: "'Montserrat', 'Open Sans', 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
      color: activeColors.textDark, 
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    header: { position: 'sticky', top: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? `${theme.spacing.xs} ${theme.spacing.md}` : `${theme.spacing.sm} ${theme.spacing.lg}`, backgroundColor: activeColors.primary, color: activeColors.textLight, height: isMobile ? '50px' : '55px', boxShadow: theme.shadows.sm, },
    headerLeft: { display: 'flex', alignItems: 'center', gap: isMobile ? theme.spacing.sm : theme.spacing.md, },
    // NEW: Styled back button
    backButton: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: isMobile ? '32px' : '36px',
        height: isMobile ? '32px' : '36px',
        borderRadius: theme.borderRadius.circle,
        border: `1px solid rgba(255, 255, 255, 0.3)`,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: activeColors.textLight,
        fontSize: isMobile ? '0.9rem' : '1rem',
        cursor: 'pointer',
        transition: theme.transitions.normal,
        ':hover': { 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            transform: 'translateX(-1px)'
        },
    },
    headerButton: { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, padding: `${theme.spacing.sm} ${theme.spacing.md}`, borderRadius: theme.borderRadius.md, border: 'none', backgroundColor: 'transparent', color: activeColors.textLight, fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', transition: theme.transitions.normal, ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }, },
    headerTitle: { 
      fontSize: isMobile ? '0.8rem' : '0.9rem', 
      fontWeight: 600, 
      whiteSpace: 'nowrap', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      margin: 0, 
      flex: 1, 
      textAlign: 'center',
      fontFamily: "'Montserrat', 'Open Sans', sans-serif",
    },
    // NEW: Slide toggle button for theme switching
    themeToggleButton: { 
        position: 'relative',
        width: isMobile ? '50px' : '60px', 
        height: isMobile ? '24px' : '28px', 
        backgroundColor: themeMode === 'light' 
            ? 'rgba(255, 193, 7, 0.2)' // Light golden background
            : 'rgba(73, 80, 87, 0.8)', // Dark gray background
        borderRadius: isMobile ? '12px' : '14px',
        border: `2px solid ${themeMode === 'light' ? '#ffc107' : '#6c757d'}`,
        cursor: 'pointer', 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
        outline: 'none',
        boxShadow: themeMode === 'light' 
            ? '0 2px 8px rgba(255, 193, 7, 0.3), inset 0 2px 4px rgba(255, 193, 7, 0.1)' 
            : '0 2px 8px rgba(73, 80, 87, 0.4), inset 0 2px 4px rgba(73, 80, 87, 0.2)',
        ':hover': { 
            transform: 'scale(1.05)',
            boxShadow: themeMode === 'light' 
                ? '0 4px 16px rgba(255, 193, 7, 0.4), inset 0 2px 4px rgba(255, 193, 7, 0.2)' 
                : '0 4px 16px rgba(73, 80, 87, 0.5), inset 0 2px 4px rgba(73, 80, 87, 0.3)',
        },
        ':active': {
            transform: 'scale(0.98)',
            transition: 'transform 0.1s ease',
        }
    },
    // NEW: Sliding circle inside the toggle
    themeToggleSlider: {
        position: 'absolute',
        top: '2px',
        left: themeMode === 'light' ? '2px' : isMobile ? '24px' : '30px',
        width: isMobile ? '16px' : '20px',
        height: isMobile ? '16px' : '20px',
        backgroundColor: themeMode === 'light' ? '#ffc107' : '#ffffff',
        borderRadius: '50%',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '0.6rem' : '0.7rem',
        color: themeMode === 'light' ? '#ffffff' : '#495057',
        boxShadow: themeMode === 'light' 
            ? '0 2px 6px rgba(255, 193, 7, 0.4), 0 0 12px rgba(255, 193, 7, 0.2)' 
            : '0 2px 6px rgba(0, 0, 0, 0.3), 0 0 8px rgba(255, 255, 255, 0.1)',
        fontWeight: 'bold',
    },
    mainContent: { 
      flex: 1, 
      padding: isMobile ? theme.spacing.md : theme.spacing.lg, 
      maxWidth: '1200px', 
      margin: '0 auto', 
      width: '100%', 
      backgroundColor: activeColors.background || '#ffffff',
      minHeight: 'calc(100vh - 55px)',
      transition: 'background-color 0.3s ease',
      '@media (max-width: 768px)': { 
        padding: theme.spacing.sm, 
        paddingBottom: '120px',
        minHeight: 'calc(100vh - 50px)', 
      }, 
    },
    card: { 
      backgroundColor: activeColors.surfaceElevated || activeColors.white, 
      borderRadius: isMobile ? theme.borderRadius.md : theme.borderRadius.lg, 
      boxShadow: `0 2px 8px ${activeColors.shadow}`, 
      border: `1px solid ${activeColors.border || activeColors.lightGray}`,
      padding: isMobile ? theme.spacing.md : theme.spacing.lg, 
      marginBottom: isMobile ? theme.spacing.md : theme.spacing.lg,
      width: '100%',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
    },
    videoStylePlayerContainer: { 
      position: 'relative', 
      borderRadius: isMobile ? theme.borderRadius.md : theme.borderRadius.lg, 
      overflow: 'hidden', 
      backgroundColor: themeMode === 'light' ? '#1a1d23' : '#0f1114', 
      boxShadow: `0 4px 20px ${activeColors.shadow}`,
      border: `2px solid ${activeColors.border || activeColors.lightGray}`,
      color: activeColors.textLight, 
      aspectRatio: isMobile ? '16 / 12' : '16 / 9', 
      marginBottom: isMobile ? theme.spacing.md : theme.spacing.lg,
      width: '100%',
      maxWidth: '100%',
      transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
    },
    // CHANGED: Updated player visual area to support a background image with top overlay for audio info
    playerVisualArea: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        zIndex: 1,
        // The background image is set here. Make sure 'audio-background.jpg' exists in your /public folder.
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/y25.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    },
    // NEW: Top overlay for audio info
    audioInfoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: theme.spacing.md,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
        zIndex: 2,
    },
    // NEW: Audio name in top left
    audioNameDisplay: {
        color: activeColors.textLight,
        fontSize: isMobile ? '0.9rem' : '1.1rem',
        fontWeight: 600,
        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        maxWidth: '70%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: "'Montserrat', 'Open Sans', sans-serif",
    },
    // NEW: Small audio icon in top right
    audioIconTopRight: {
        color: activeColors.primary,
        fontSize: isMobile ? '1.2rem' : '1.5rem',
        opacity: 0.9,
        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
    },
// FIND THIS STYLE BLOCK IN YOUR CODE:
playerControlsOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    // ADD THIS LINE RIGHT HERE:
    zIndex: 2,
    padding: isMobile ? `${theme.spacing.xs} ${theme.spacing.sm}` : `${theme.spacing.sm} ${theme.spacing.md}`, 
    background: themeMode === 'light' 
      ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)'
      : 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 60%, transparent 100%)', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: isMobile ? theme.spacing.xs : theme.spacing.sm,
    transition: 'background 0.3s ease',
},    progressContainer: { display: 'flex', alignItems: 'center', gap: isMobile ? theme.spacing.xs : theme.spacing.sm, width: '100%', },
    progressBar: { flex: 1, height: isMobile ? '4px' : '6px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: theme.borderRadius.lg, position: 'relative', cursor: 'pointer', },
    progressFill: { height: '100%', backgroundColor: activeColors.primary, borderRadius: theme.borderRadius.lg, position: 'relative' },
    progressThumb: { position: 'absolute', top: '50%', right: '-6px', transform: 'translateY(-50%)', width: isMobile ? '8px' : '12px', height: isMobile ? '8px' : '12px', backgroundColor: activeColors.primary, borderRadius: theme.borderRadius.circle, boxShadow: theme.shadows.sm, },
    timeDisplay: { fontSize: isMobile ? '0.65rem' : '0.75rem', color: activeColors.textLight, minWidth: isMobile ? '30px' : '40px', textAlign: 'center', },
    controlsRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm, },
    // CHANGED: Controls are now more compact on small screens
    controlsGroup: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? theme.spacing.xs : theme.spacing.sm, 
    },
    // CHANGED: Smaller control buttons on phones
    controlButton: { 
        width: isMobile ? '28px' : '36px', 
        height: isMobile ? '28px' : '36px', 
        borderRadius: theme.borderRadius.circle, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'transparent', 
        border: 'none', 
        color: activeColors.textLight, 
        cursor: 'pointer', 
        transition: 'all 0.3s ease', 
        fontSize: isMobile ? '0.8rem' : '1rem',
        ':hover': { 
          backgroundColor: themeMode === 'light' 
            ? 'rgba(255,255,255,0.15)' 
            : 'rgba(255,255,255,0.2)',
          transform: 'scale(1.1)',
        }, 
        ':disabled': { opacity: 0.5, cursor: 'not-allowed' }, 
    },
    // CHANGED: Smaller play button on phones
    playButton: { 
        width: isMobile ? '32px' : '42px', 
        height: isMobile ? '32px' : '42px', 
        backgroundColor: activeColors.primary, 
        color: activeColors.textLight, 
        fontSize: isMobile ? '0.9rem' : '1.1rem',
        ':hover': { backgroundColor: activeColors.primaryDark }, 
    },
    volumeControl: { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, },
    // CHANGED: Smaller volume bar on phones to ensure it's visible
    volumeBar: { 
        width: isMobile ? '40px' : '80px', 
        height: '4px', 
        backgroundColor: 'rgba(255,255,255,0.3)', 
        borderRadius: theme.borderRadius.lg, 
        position: 'relative', 
        cursor: 'pointer', 
    },
    volumeFill: { height: '100%', backgroundColor: activeColors.primary, borderRadius: theme.borderRadius.lg },
    volumeThumb: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: isMobile ? '8px' : '10px', height: isMobile ? '8px' : '10px', backgroundColor: activeColors.primary, borderRadius: theme.borderRadius.circle, },
    playbackRate: { position: 'relative' },
    // CHANGED: Smaller playback rate button on phones
    rateButton: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: theme.spacing.xs, 
        backgroundColor: 'transparent', 
        border: `1px solid ${activeColors.textLight}`, 
        color: activeColors.textLight, 
        borderRadius: theme.borderRadius.md, 
        padding: isMobile ? `${theme.spacing.xs} ${theme.spacing.xs}` : `${theme.spacing.xs} ${theme.spacing.sm}`, 
        fontSize: isMobile ? '0.7rem' : '0.8rem', 
        cursor: 'pointer', 
        transition: theme.transitions.normal, 
        ':hover': { backgroundColor: 'rgba(255,255,255,0.1)' }, 
    },
    rateOptions: { position: 'absolute', bottom: '120%', right: 0, backgroundColor: activeColors.dark, border: `1px solid ${activeColors.lightGray}`, borderRadius: theme.borderRadius.md, boxShadow: theme.shadows.md, padding: theme.spacing.sm, minWidth: '100px', zIndex: 10 },
    rateOption: { padding: `${theme.spacing.sm} ${theme.spacing.md}`, borderRadius: theme.borderRadius.sm, fontSize: '0.8rem', cursor: 'pointer', transition: theme.transitions.fast, color: activeColors.textLight, ':hover': { backgroundColor: activeColors.secondary }, },
    activeRate: { backgroundColor: activeColors.primary, color: activeColors.white, fontWeight: 600 },
    lessonTitle: { 
      fontSize: '1.75rem', 
      fontWeight: 700, 
      margin: `0 0 ${theme.spacing.sm} 0`, 
      color: activeColors.textDark,
      fontFamily: "'Montserrat', 'Nunito', sans-serif",
      letterSpacing: '-0.02em',
    },
    sectionTitle: { 
      fontSize: '1.25rem', 
      fontWeight: 600, 
      margin: `0 0 ${theme.spacing.md} 0`, 
      display: 'flex', 
      alignItems: 'center', 
      gap: theme.spacing.sm, 
      color: activeColors.textDark,
      fontFamily: "'Montserrat', 'Open Sans', sans-serif",
    },
    audioList: { display: 'flex', flexDirection: 'column', gap: theme.spacing.sm },
    audioItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.md, borderRadius: theme.borderRadius.md, backgroundColor: activeColors.white, border: `1px solid ${activeColors.lightGray}`, cursor: 'pointer', transition: theme.transitions.normal, ':hover': { borderColor: activeColors.primary, backgroundColor: activeColors.lightGray, }, },
    activeAudioItem: { backgroundColor: activeColors.primaryLight, borderColor: activeColors.primary, color: activeColors.white },
    audioItemInfo: { flex: 1, minWidth: 0, marginRight: theme.spacing.md },
    audioItemTitle: { 
      fontWeight: 500, 
      fontSize: '0.95rem', 
      whiteSpace: 'nowrap', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      marginBottom: theme.spacing.xs,
      fontFamily: "'Open Sans', 'Nunito', sans-serif",
    },
    audioItemMeta: { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, fontSize: '0.75rem', color: activeColors.gray, },
    pdfGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: theme.spacing.md, },
    pdfCard: { display: 'flex', alignItems: 'center', borderRadius: theme.borderRadius.md, border: `1px solid ${activeColors.lightGray}`, textDecoration: 'none', color: activeColors.textDark, transition: theme.transitions.normal, ':hover': { boxShadow: theme.shadows.md, borderColor: activeColors.primary }, },
    pdfIcon: { padding: theme.spacing.lg, backgroundColor: activeColors.lightGray, color: activeColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', },
    pdfDetails: { padding: theme.spacing.md, flex: 1, minWidth: 0, },
    pdfTitle: { fontWeight: 500, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: theme.spacing.xs, },
    lessonActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.lg, paddingTop: theme.spacing.md, borderTop: `1px solid ${activeColors.lightGray}` },
    badge: { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, padding: `${theme.spacing.sm} ${theme.spacing.md}`, borderRadius: theme.borderRadius.md, fontWeight: 500, fontSize: '0.9rem' },
    successBadge: { backgroundColor: activeColors.success, color: activeColors.white },
    button: { 
      padding: isMobile ? `${theme.spacing.sm} ${theme.spacing.md}` : `${theme.spacing.md} ${theme.spacing.lg}`, 
      borderRadius: theme.borderRadius.md, 
      border: 'none', 
      fontWeight: 600, 
      fontSize: isMobile ? '0.85rem' : '0.9rem', 
      cursor: 'pointer', 
      transition: theme.transitions.normal, 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: theme.spacing.sm,
      fontFamily: "'Montserrat', 'Nunito', sans-serif",
      minHeight: isMobile ? '44px' : 'auto', // Better touch targets on mobile
      width: isMobile ? '100%' : 'auto', // Full width on mobile
    },
    primaryButton: { backgroundColor: activeColors.primary, color: activeColors.white, ':hover': { backgroundColor: activeColors.primaryDark } },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: theme.spacing.xl, color: activeColors.gray },
    emptyIcon: { width: '60px', height: '60px', borderRadius: theme.borderRadius.circle, backgroundColor: activeColors.lightGray, color: activeColors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: theme.spacing.lg, },
    emptyTitle: { 
      fontSize: '1.5rem', 
      fontWeight: 600, 
      color: activeColors.textDark, 
      marginBottom: theme.spacing.sm,
      fontFamily: "'Montserrat', 'Open Sans', sans-serif",
    },
    emptyText: { 
      fontSize: '0.95rem', 
      maxWidth: '400px', 
      lineHeight: 1.5, 
      marginBottom: theme.spacing.lg,
      fontFamily: "'Open Sans', 'Nunito', sans-serif",
    },
    chapterItem: { 
      padding: isMobile ? theme.spacing.sm : theme.spacing.md, 
      borderBottom: `1px solid ${activeColors.border || activeColors.lightGray}`, 
      cursor: 'pointer', 
      transition: 'all 0.3s ease', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      minHeight: isMobile ? '50px' : 'auto',
      backgroundColor: activeColors.surfaceElevated || activeColors.white,
      ':hover': { 
        backgroundColor: activeColors.surface || activeColors.lightGray,
        transform: 'translateX(2px)',
      }, 
    },
    activeChapter: { backgroundColor: activeColors.primaryLight, color: activeColors.white },
    chapterTitle: { 
      fontWeight: 600, 
      fontSize: isMobile ? '0.9rem' : '1rem', 
      margin: 0, 
      color: activeColors.textDark,
      fontFamily: "'Montserrat', 'Open Sans', sans-serif",
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    lessonItem: { 
      padding: isMobile ? `${theme.spacing.sm} ${theme.spacing.md}` : `${theme.spacing.md} ${theme.spacing.lg}`, 
      paddingLeft: isMobile ? theme.spacing.lg : theme.spacing.xl, 
      borderBottom: `1px solid ${activeColors.border || activeColors.lightGray}`, 
      cursor: 'pointer', 
      transition: 'all 0.3s ease', 
      display: 'flex', 
      alignItems: 'center', 
      minHeight: isMobile ? '48px' : 'auto',
      ':hover': { 
        backgroundColor: activeColors.surface || activeColors.lightGray,
        transform: 'translateX(2px)',
      }, 
      background: activeColors.surfaceElevated || activeColors.white,
    },
    activeLesson: { backgroundColor: activeColors.primaryLight, color: activeColors.white, borderLeft: `4px solid ${activeColors.primary}`},
    lockedLesson: { opacity: 0.7, cursor: 'not-allowed', backgroundColor: activeColors.lightGray, ':hover': { backgroundColor: activeColors.lightGray } },
    lessonIcon: { fontSize: '1.1rem', marginRight: theme.spacing.md, color: activeColors.gray, },
    activeIcon: { color: activeColors.white },
    completedIcon: { color: activeColors.success },
    lockedIcon: { color: activeColors.danger },
    lessonDetails: { flex: 1, minWidth: 0 },
    lessonName: { 
      fontWeight: 500, 
      fontSize: isMobile ? '0.85rem' : '0.95rem', 
      marginBottom: theme.spacing.xs, 
      whiteSpace: 'nowrap', 
      overflow: 'hidden', 
      textOverflow: 'ellipsis',
      fontFamily: "'Open Sans', 'Nunito', sans-serif",
      lineHeight: isMobile ? '1.4' : '1.5',
    },
    lessonMeta: { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, fontSize: '0.75rem', color: activeColors.gray, },
    lessonStatus: { marginLeft: 'auto', fontSize: '1.1rem', },
    // NEW: Modern exam container styles
    examContainer: {
      backgroundColor: activeColors.white,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      marginBottom: theme.spacing.lg,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${activeColors.lightGray}`,
    },
    examHeader: {
      background: themeMode === 'light' 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #434343 0%, #000000 100%)',
      color: activeColors.white,
      padding: isMobile ? theme.spacing.lg : theme.spacing.xl,
      textAlign: 'center',
      position: 'relative',
      '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }
    },
    examTitle: {
      fontSize: isMobile ? '1.4rem' : '1.8rem',
      fontWeight: 700,
      margin: 0,
      marginBottom: theme.spacing.sm,
      fontFamily: "'Montserrat', 'Open Sans', sans-serif",
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    examSubtitle: {
      fontSize: isMobile ? '0.9rem' : '1rem',
      opacity: 0.9,
      margin: 0,
      fontFamily: "'Open Sans', 'Nunito', sans-serif",
    },
    examStatsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: theme.spacing.md,
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      backgroundColor: activeColors.lightGray,
    },
    examStatCard: {
      backgroundColor: activeColors.white,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${activeColors.lightGray}`,
    },
    examStatValue: {
      fontSize: isMobile ? '1.4rem' : '1.6rem',
      fontWeight: 700,
      color: activeColors.primary,
      marginBottom: theme.spacing.xs,
      fontFamily: "'Montserrat', sans-serif",
    },
    examStatLabel: {
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      color: activeColors.gray,
      fontWeight: 500,
      fontFamily: "'Open Sans', sans-serif",
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    // NEW: Exam result styles
    examResultContainer: {
      backgroundColor: activeColors.white,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      marginBottom: theme.spacing.lg,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    examResultHeader: {
      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      color: activeColors.white,
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      textAlign: 'center',
    },
    examResultTitle: {
      fontSize: isMobile ? '1.2rem' : '1.4rem',
      fontWeight: 600,
      margin: 0,
      fontFamily: "'Montserrat', sans-serif",
    },
    examResultBody: {
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
    },
    examResultGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    examResultCard: {
      backgroundColor: activeColors.lightGray,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      textAlign: 'center',
      border: `2px solid ${activeColors.primary}`,
    },
    examResultValue: {
      fontSize: isMobile ? '1.5rem' : '1.8rem',
      fontWeight: 700,
      color: activeColors.primary,
      marginBottom: theme.spacing.xs,
      fontFamily: "'Montserrat', sans-serif",
    },
    examResultLabel: {
      fontSize: '0.8rem',
      color: activeColors.gray,
      fontWeight: 500,
      fontFamily: "'Open Sans', sans-serif",
      textTransform: 'uppercase',
    },
    // NEW: Action buttons container
    examActionsContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: theme.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: theme.spacing.lg,
      borderTop: `1px solid ${activeColors.lightGray}`,
    },
    // NEW: Secondary button for viewing answers
    secondaryButton: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.md,
      border: `2px solid ${activeColors.primary}`,
      backgroundColor: 'transparent',
      color: activeColors.primary,
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      fontFamily: "'Montserrat', 'Nunito', sans-serif",
      width: isMobile ? '100%' : 'auto',
      ':hover': {
        backgroundColor: activeColors.primary,
        color: activeColors.white,
      }
    },
    // NEW: Question styles for simple, mobile-friendly design
    questionItem: {
      marginBottom: isMobile ? theme.spacing.md : theme.spacing.lg,
      paddingBottom: 0,
      borderBottom: 'none',
      backgroundColor: activeColors.white,
      borderRadius: '8px',
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${activeColors.lightGray}`,
    },
    questionHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: isMobile ? theme.spacing.sm : theme.spacing.md,
      gap: isMobile ? theme.spacing.sm : theme.spacing.md,
    },
    questionNumber: {
      backgroundColor: activeColors.primary,
      color: activeColors.white,
      width: isMobile ? '28px' : '32px',
      height: isMobile ? '28px' : '32px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 600,
      fontFamily: "'Montserrat', sans-serif",
    },
    questionText: {
      margin: 0,
      flex: 1,
      fontSize: isMobile ? '0.95rem' : '1.1rem',
      lineHeight: 1.5,
      fontFamily: "'Open Sans', 'Nunito', sans-serif",
      color: activeColors.textDark,
      fontWeight: 500,
    },
    optionsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? theme.spacing.sm : theme.spacing.md,
      marginTop: isMobile ? theme.spacing.sm : theme.spacing.md,
    },
    optionItem: {
      padding: isMobile ? theme.spacing.sm : theme.spacing.md,
      borderRadius: '6px',
      border: `2px solid ${activeColors.lightGray}`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? theme.spacing.sm : theme.spacing.md,
      backgroundColor: activeColors.white,
    },
    selectedOption: {
      backgroundColor: activeColors.primary,
      borderColor: activeColors.primary,
      color: activeColors.white,
    },
    optionMarker: {
      width: isMobile ? '24px' : '28px',
      height: isMobile ? '24px' : '28px',
      borderRadius: '4px',
      backgroundColor: activeColors.lightGray,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontWeight: 600,
      color: activeColors.textDark,
      flexShrink: 0,
      fontFamily: "'Montserrat', sans-serif",
    },
    selectedMarker: {
      backgroundColor: activeColors.white,
      color: activeColors.primary,
    },
    optionText: {
      flex: 1,
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontFamily: "'Open Sans', 'Nunito', sans-serif",
      lineHeight: 1.4,
      fontWeight: 400,
    },
    questionMeta: { fontSize: '0.75rem', color: activeColors.gray, marginTop: theme.spacing.sm, marginLeft: '38px', },

    // --- EXAM TIMER STYLES ---
    timerContainer: {
      position: 'sticky',
      top: isMobile ? '50px' : '55px',
      zIndex: 999,
      backgroundColor: activeColors.white,
      borderRadius: theme.borderRadius.md,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      margin: `0 0 ${theme.spacing.lg} 0`,
      overflow: 'hidden',
      border: `2px solid ${activeColors.lightGray}`,
    },
    timerHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: activeColors.white,
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    timerIcon: {
      fontSize: isMobile ? '1.2rem' : '1.5rem',
    },
    timerTitle: {
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: 600,
      margin: 0,
      fontFamily: "'Montserrat', sans-serif",
    },
    timerDisplay: {
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing.sm,
      backgroundColor: activeColors.lightGray,
    },
    timerTime: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      fontWeight: 700,
      fontFamily: "'Montserrat', sans-serif",
      textAlign: 'center',
    },
    timerProgress: {
      width: '100%',
      height: isMobile ? '8px' : '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      marginTop: theme.spacing.sm,
    },
    timerProgressFill: {
      height: '100%',
      borderRadius: theme.borderRadius.lg,
      transition: 'width 1s linear, background-color 0.3s ease',
    },
    timerWarning: {
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontWeight: 500,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      fontFamily: "'Open Sans', sans-serif",
    },

    // --- EXAM MODAL STYLES ---
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: themeMode === 'light' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: isMobile ? '0' : theme.spacing.sm,
      transition: 'background-color 0.3s ease',
    },
    modalContainer: {
      backgroundColor: activeColors.surfaceElevated || '#ffffff',
      borderRadius: isMobile ? '0' : '12px',
      boxShadow: `0 8px 32px ${activeColors.shadow}`,
      border: isMobile ? 'none' : `2px solid ${activeColors.border || activeColors.primary}`,
      width: '100%',
      maxWidth: isMobile ? '100vw' : '800px',
      maxHeight: isMobile ? '100vh' : '90vh',
      height: isMobile ? '100vh' : 'auto',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    },
    modalHeader: {
      backgroundColor: activeColors.primary,
      color: activeColors.white,
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    modalTitle: {
      fontSize: isMobile ? '1.1rem' : '1.4rem',
      fontWeight: 600,
      margin: 0,
      fontFamily: "'Montserrat', sans-serif",
    },
    modalCloseButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '8px',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: activeColors.white,
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
    },
    modalBody: {
      flex: 1,
      overflow: 'auto',
      padding: 0,
      backgroundColor: '#ffffff',
      WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
    },
    modalTimerSection: {
      position: 'sticky',
      top: 0,
      backgroundColor: activeColors.white,
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      borderBottom: `2px solid ${activeColors.lightGray}`,
      marginBottom: 0,
      zIndex: 5,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    compactTimer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      backgroundColor: activeColors.primary,
      borderRadius: '8px',
      color: activeColors.white,
    },
    compactTimerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    compactTimerIcon: {
      fontSize: isMobile ? '1.2rem' : '1.4rem',
      color: activeColors.white,
    },
    compactTimerText: {
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 600,
      color: activeColors.white,
      fontFamily: "'Montserrat', sans-serif",
    },
    compactTimerTime: {
      fontSize: isMobile ? '1.1rem' : '1.3rem',
      fontWeight: 700,
      fontFamily: "'Montserrat', sans-serif",
      color: activeColors.white,
    },
    examStartContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? theme.spacing.md : theme.spacing.xl,
      textAlign: 'center',
      gap: isMobile ? theme.spacing.sm : theme.spacing.lg,
      backgroundColor: '#ffffff',
      borderRadius: isMobile ? '4px' : '8px',
      border: `2px solid ${activeColors.primary}`,
      margin: isMobile ? theme.spacing.sm : 0,
      minHeight: isMobile ? 'auto' : '400px',
    },
    examStartIcon: {
      width: isMobile ? '60px' : '80px',
      height: isMobile ? '60px' : '80px',
      borderRadius: '8px',
      backgroundColor: activeColors.primary,
      color: activeColors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '1.5rem' : '2rem',
      marginBottom: theme.spacing.sm,
    },
    examStartTitle: {
      fontSize: isMobile ? '1.2rem' : '1.5rem',
      fontWeight: 600,
      color: activeColors.textDark,
      marginBottom: theme.spacing.sm,
      fontFamily: "'Montserrat', sans-serif",
    },
    examStartDescription: {
      fontSize: isMobile ? '0.9rem' : '1rem',
      color: activeColors.gray,
      lineHeight: 1.5,
      maxWidth: '400px',
      marginBottom: theme.spacing.lg,
      fontFamily: "'Open Sans', sans-serif",
    },
    examStartButton: {
      backgroundColor: activeColors.primary,
      color: activeColors.white,
      border: 'none',
      borderRadius: '8px',
      padding: isMobile ? `${theme.spacing.md} ${theme.spacing.lg}` : `${theme.spacing.lg} ${theme.spacing.xl}`,
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      fontFamily: "'Poppins', sans-serif",
    },

    tabsContainer: { display: 'flex', borderBottom: `1px solid ${activeColors.lightGray}`, backgroundColor: activeColors.white, color: activeColors.textDark, marginBottom: theme.spacing.lg, },
    tabButton: { 
      padding: `${theme.spacing.md} ${theme.spacing.lg}`, 
      border: 'none', 
      backgroundColor: 'transparent', 
      cursor: 'pointer', 
      fontSize: '1rem', 
      fontWeight: 600, 
      color: activeColors.gray, 
      borderBottom: '3px solid transparent', 
      transition: theme.transitions.normal,
      fontFamily: "'Montserrat', 'Open Sans', sans-serif",
    },
    activeTabButton: { color: activeColors.primary, borderBottom: `3px solid ${activeColors.primary}`, },
    tabContentContainer: { backgroundColor: activeColors.white, borderRadius: theme.borderRadius.md, color: activeColors.textDark, padding: isMobile ? theme.spacing.sm : theme.spacing.md, }
  };

  // --- DATA FETCHING & PROGRESS (UNCHANGED) ---
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found.");
        const response = await fetch(`https://learnly-backend-05ix.onrender.com/courses/${id}/content`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);
        const data = await response.json();
        if (data.success) {
          const fetchedChapters = data.data || [];
          setChapters(fetchedChapters);
          if (fetchedChapters.length > 0 && !hasRestoredState.current) {
            const firstChapter = fetchedChapters[0];
            if (firstChapter.lessons?.length > 0) {
              setSelectedLesson({ chapterIndex: 0, lessonIndex: 0, type: 'lesson' });
            } else if (firstChapter.exam) {
              setSelectedLesson({ chapterIndex: 0, type: 'exam' });
            }
          }
        } else {
          throw new Error(data.message || "Failed to fetch content");
        }
      } catch (err) {
        console.error("Fetch content error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  useEffect(() => { const savedProgress = localStorage.getItem(`courseProgress_${id}`); if (savedProgress) { try { const parsedProgress = JSON.parse(savedProgress); setUserProgress({ completedLessons: parsedProgress.completedLessons || [], attemptedExams: parsedProgress.attemptedExams || {}, }); } catch (e) { console.error("Error parsing progress:", e); } } }, [id]);
  useEffect(() => { if (userProgress.completedLessons.length > 0 || Object.keys(userProgress.attemptedExams).length > 0) { localStorage.setItem(`courseProgress_${id}`, JSON.stringify(userProgress)); } }, [id, userProgress]);
  
  // Prevent page refresh/reload during exam
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examInProgress && !examCompleted) {
        e.preventDefault();
        e.returnValue = 'You are currently taking an exam. Are you sure you want to leave? Your progress will be lost.';
        return 'You are currently taking an exam. Are you sure you want to leave? Your progress will be lost.';
      }
    };

    if (examInProgress && !examCompleted) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examInProgress, examCompleted]);
  
  // Set exam completed when submission is successful
  useEffect(() => {
    if (submissionStatus?.status === "success" && !examCompleted) {
      setExamCompleted(true);
      setExamInProgress(false);
    }
  }, [submissionStatus, examCompleted]);
  
  // Restore exam state on page reload/refresh
  useEffect(() => {
    if (selectedLesson?.type === 'exam' && chapters.length > 0) {
      const savedExamState = loadExamState();
      if (savedExamState) {
        // Restore exam state
        setExamStarted(savedExamState.examStarted || false);
        setExamTimerActive(savedExamState.examTimerActive || false);
        setShowExamModal(savedExamState.showExamModal || false);
        setExamInProgress(savedExamState.examInProgress || false);
        setExamCompleted(savedExamState.examCompleted || false);
        setExamTimer(savedExamState.examTimer || totalExamTime);
        setExamAnswers(savedExamState.examAnswers || {});
        setHasAnsweredQuestions(savedExamState.hasAnsweredQuestions || false);
        
        // If exam was in progress, continue the timer
        if (savedExamState.examInProgress && !savedExamState.examCompleted && savedExamState.examTimer > 0) {
          setExamTimerActive(true);
        }
      }
    }
  }, [selectedLesson, chapters, totalExamTime]);
  
  // --- EXAM TIMER LOGIC ---
  
  // Initialize exam data when exam is selected (but don't start timer yet)
  useEffect(() => {
    if (selectedLesson?.type === 'exam' && chapters.length > 0) {
      const currentChapter = chapters[selectedLesson.chapterIndex];
      const currentExam = currentChapter?.exam;
      
      if (currentExam && !hasAttemptedExam(selectedLesson.chapterIndex)) {
        // Calculate total time: 2 minutes per question
        const questionsCount = currentExam.examQuestions?.length || 0;
        const totalTime = questionsCount * 2 * 60; // 2 minutes per question in seconds
        
        setTotalExamTime(totalTime);
        setExamTimer(totalTime);
        // Don't start timer automatically - wait for start button
        setExamTimerActive(false);
        setExamStarted(false);
        setShowExamModal(false);
        setHasAnsweredQuestions(false);
      } else {
        // Reset all exam states if exam is already attempted or not an exam
        setExamTimerActive(false);
        setExamTimer(null);
        setExamStarted(false);
        setShowExamModal(false);
        setHasAnsweredQuestions(false);
      }
    } else {
      // Reset all exam states if not on exam
      setExamTimerActive(false);
      setExamTimer(null);
      setExamStarted(false);
      setShowExamModal(false);
      setHasAnsweredQuestions(false);
    }
  }, [selectedLesson, chapters, userProgress.attemptedExams]);

  // Start exam function
  const startExam = () => {
    setExamStarted(true);
    setExamTimerActive(true);
    setShowExamModal(true);
    setExamInProgress(true);
    setExamCompleted(false);
    
    // Save exam state to localStorage
    const examState = {
      examStarted: true,
      examTimerActive: true,
      showExamModal: true,
      examInProgress: true,
      examCompleted: false,
      examTimer: examTimer,
      examAnswers: examAnswers,
      hasAnsweredQuestions: hasAnsweredQuestions,
      timestamp: Date.now()
    };
    saveExamState(examState);
  };

  // Close modal function
  const closeExamModal = () => {
    if (examCompleted) {
      setShowExamModal(false);
      setExamInProgress(false);
      setExamCompleted(false);
      setExamStarted(false);
      
      // Clear saved exam state when closing completed exam
      clearExamState();
    }
  };

  // Prevent browser back button and ESC key during exam
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (examStarted && showExamModal && examInProgress && !examCompleted) {
        // Prevent ESC key during exam
        if (e.key === 'Escape') {
          e.preventDefault();
          // Don't close modal during exam
        }
        // Prevent F5 (refresh)
        if (e.key === 'F5') {
          e.preventDefault();
          // Don't close modal during exam
        }
        // Prevent Ctrl+R (refresh)
        if (e.ctrlKey && e.key === 'r') {
          e.preventDefault();
          // Don't close modal during exam
        }
      } else if (examCompleted && e.key === 'Escape') {
        // Allow ESC to close after exam completion
        closeExamModal();
      }
    };

    const handlePopState = (e) => {
      if (examStarted && showExamModal && examInProgress && !examCompleted) {
        // Prevent browser back button during exam
        window.history.pushState(null, null, window.location.pathname);
        // Don't close modal during exam
      }
    };

    if (examStarted && showExamModal) {
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('popstate', handlePopState);
      // Push a state to handle back button
      window.history.pushState(null, null, window.location.pathname);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [examStarted, showExamModal, examInProgress, examCompleted]);

  // Browser tab close/refresh detection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examStarted && showExamModal && examTimerActive) {
        // Simple warning without penalties
        e.preventDefault();
        e.returnValue = 'You have an exam in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    if (examStarted && showExamModal) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examStarted, showExamModal, examTimerActive, selectedLesson?.chapterIndex]);
  useEffect(() => {
    if (examTimerActive && examTimer > 0) {
      examTimerRef.current = setInterval(() => {
        setExamTimer(prevTime => {
          if (prevTime <= 1) {
            // Time's up! Auto-submit the exam
            setExamTimerActive(false);
            autoSubmitExam();
            return 0;
          }
          
          const newTime = prevTime - 1;
          
          // Save exam state every 5 seconds
          if (newTime % 5 === 0) {
            const examState = {
              examStarted: true,
              examTimerActive: true,
              showExamModal: true,
              examInProgress: true,
              examCompleted: false,
              examTimer: newTime,
              examAnswers: examAnswers,
              hasAnsweredQuestions: hasAnsweredQuestions,
              timestamp: Date.now()
            };
            saveExamState(examState);
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
        examTimerRef.current = null;
      }
    }

    return () => {
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
        examTimerRef.current = null;
      }
    };
  }, [examTimerActive, examTimer, examAnswers, hasAnsweredQuestions]);

  // Auto-submit function when timer expires
  const autoSubmitExam = async () => {
    if (!selectedLesson || selectedLesson.type !== 'exam') return;
    
    setShowExamModal(false); // Close modal when auto-submitting
    
    const chapterIndex = selectedLesson.chapterIndex;
    const chapter = chapters[chapterIndex];
    const exam = chapter.exam;
    
    // Auto-submit with current answers (even if incomplete)
    const payload = exam.examQuestions.map((q, i) => ({
      question: q.question,
      selectedAnswer: examAnswers[`${chapterIndex}-${i}`] || '' // Empty string for unanswered
    }));

    try {
      setSubmissionStatus({ status: "submitting" });
      const token = localStorage.getItem("token");
      const response = await fetch("https://learnly-backend-05ix.onrender.com/user/exam/answer-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          examId: exam.examId || exam._id,
          courseId: id,
          chapterTitle: chapter.title,
          answers: payload,
          autoSubmitted: true // Flag to indicate auto-submission
        })
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Auto-submission failed.");
      
      setUserProgress(prev => ({
        ...prev,
        attemptedExams: {
          ...prev.attemptedExams,
          [chapterIndex]: { attempted: true, score: data.data.obtainedMarks, result: data.data }
        }
      }));
      
      setSubmissionStatus({ 
        status: "success", 
        data: data.data,
        autoSubmitted: true 
      });
      
      // Reset exam states after auto-submission
      setExamStarted(false);
      setExamTimerActive(false);
      setExamInProgress(false);
      setExamCompleted(true);
      setHasAnsweredQuestions(false);
      
      // Clear saved exam state from localStorage
      clearExamState();
    } catch (err) {
      setSubmissionStatus({ 
        status: "error", 
        message: `Auto-submission failed: ${err.message}`,
        autoSubmitted: true 
      });
    }
  };

  // Format timer display
  const formatTimerDisplay = (seconds) => {
    if (seconds <= 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on remaining time
  const getTimerColor = (timeRemaining, totalTime) => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage > 50) return '#28a745'; // Green
    if (percentage > 25) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  // Prevent page reload/navigation during active exam
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examTimerActive && examTimer > 0) {
        e.preventDefault();
        e.returnValue = 'You have an active exam in progress. Are you sure you want to leave?';
        return 'You have an active exam in progress. Are you sure you want to leave?';
      }
    };

    if (examTimerActive) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examTimerActive, examTimer]);

  // Handle modal keyboard events and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showExamModal && e.key === 'Escape') {
        closeExamModal();
      }
    };

    if (showExamModal) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [showExamModal]);
  
  // --- AUDIO LOGIC (UNCHANGED) ---
  
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    const onLoadedMetadata = () => {
      if (isNaN(audio.duration)) return;
      setDuration(audio.duration);

      const currentLesson = selectedLessonRef.current;
      const currentTrackIndex = currentAudioFileIndexRef.current;
      if (!currentLesson) return;

      try {
        const savedStateRaw = localStorage.getItem(`coursePlayerState_${id}`);
        if (savedStateRaw) {
          const savedState = JSON.parse(savedStateRaw);
          if (savedState.selectedLesson &&
              savedState.selectedLesson.chapterIndex === currentLesson.chapterIndex &&
              savedState.selectedLesson.lessonIndex === currentLesson.lessonIndex &&
              savedState.currentAudioFileIndex === currentTrackIndex) {
            const time = savedState.currentTime;
            if (time > 0 && time < audio.duration) {
              audio.currentTime = time;
            }
          }
        }
      } catch (e) { console.error("Failed to parse saved state", e); }
      
      if (playOnLoadRef.current) {
        playOnLoadRef.current = false;
        audio.play().catch(e => console.error("Auto-play failed:", e));
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      const currentLesson = selectedLessonRef.current;
      const currentChapters = chaptersRef.current;
      const currentTrackIndex = currentAudioFileIndexRef.current;
      if (!currentLesson || !currentChapters.length) return;

      const lesson = currentChapters[currentLesson.chapterIndex]?.lessons[currentLesson.lessonIndex];
      
      // Mark current audio file as completed
      if (lesson?.audioFile && lesson.audioFile[currentTrackIndex]) {
        const audioKey = `${currentLesson.chapterIndex}-${currentLesson.lessonIndex}-${currentTrackIndex}`;
        setCompletedAudioFiles(prev => {
          const updated = { ...prev, [audioKey]: true };
          // Save to localStorage
          localStorage.setItem(`audioCompletion_${id}`, JSON.stringify(updated));
          return updated;
        });
      }
      
      if (lesson?.audioFile && currentTrackIndex < lesson.audioFile.length - 1) {
        playOnLoadRef.current = true;
        setCurrentAudioFileIndex(prev => prev + 1);
      } else {
        markLessonComplete(currentLesson.chapterIndex, currentLesson.lessonIndex);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('error', (e) => console.error("Audio Error", e));

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.src = '';
    };
  }, []); // This effect runs only once

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !chapters.length) return;
    const lesson = chapters[selectedLesson?.chapterIndex]?.lessons[selectedLesson?.lessonIndex];
    const audioFile = lesson?.audioFile?.[currentAudioFileIndex];
    const newSrc = audioFile?.url || '';
    if (audio.src !== newSrc) {
        audio.src = newSrc;
        if(newSrc) audio.load();
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
    }
  }, [selectedLesson, currentAudioFileIndex, chapters]);
  
  useEffect(() => { if (audioRef.current) { audioRef.current.volume = volume / 100; audioRef.current.playbackRate = playbackRate; } }, [volume, playbackRate]);

  useEffect(() => {
    const savePlayerState = () => {
      if (selectedLesson && audioRef.current && isPlaying) {
        localStorage.setItem(`coursePlayerState_${id}`, JSON.stringify({
          selectedLesson, currentAudioFileIndex, currentTime: audioRef.current.currentTime
        }));
      }
    };
    const intervalId = setInterval(savePlayerState, 3000);
    window.addEventListener('beforeunload', savePlayerState);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', savePlayerState);
    };
  }, [id, selectedLesson, currentAudioFileIndex, isPlaying]);

  // --- PLAYER CONTROLS (UNCHANGED) ---
  const playPause = () => { const audio = audioRef.current; if (!audio?.src) return; if (isPlaying) audio.pause(); else audio.play().catch(e => console.error("Play failed:", e)); };
  const handleAudioItemClick = (index) => { 
    // Check if audio is unlocked
    if (!isAudioUnlocked(index)) {
      alert(`Please complete the previous audio file before accessing this one.`);
      return;
    }
    
    if (index === currentAudioFileIndex) playPause(); 
    else { 
      playOnLoadRef.current = true; 
      setCurrentAudioFileIndex(index); 
    } 
  };
  const skipToNextAudio = () => { 
    const lesson = chapters[selectedLesson?.chapterIndex]?.lessons[selectedLesson?.lessonIndex]; 
    const nextIndex = currentAudioFileIndex + 1;
    
    if (lesson?.audioFile && nextIndex < lesson.audioFile.length) { 
      // Check if next audio is unlocked
      if (!isAudioUnlocked(nextIndex)) {
        alert('Please complete the current audio file before moving to the next one.');
        return;
      }
      
      playOnLoadRef.current = true; 
      setCurrentAudioFileIndex(nextIndex); 
    } 
  };
  const skipToPrevAudio = () => { if (currentAudioFileIndex > 0) { playOnLoadRef.current = true; setCurrentAudioFileIndex(currentAudioFileIndex - 1); } };
  const skipForward = () => { if (audioRef.current?.duration) audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration); };
  const skipBackward = () => { if (audioRef.current) audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0); };
  const handleSeek = (e) => { const bar = progressBarRef.current; if (!audioRef.current || !duration || !bar) return; const rect = bar.getBoundingClientRect(); const x = e.clientX - rect.left; audioRef.current.currentTime = (x / rect.width) * duration; };
  const handleVolumeSeek = (e) => { const bar = volumeBarRef.current; if (!bar) return; const rect = bar.getBoundingClientRect(); const x = e.clientX - rect.left; setVolume(Math.round(Math.max(0, Math.min(x / rect.width, 1)) * 100)); };
  const changePlaybackRate = (rate) => { setPlaybackRate(rate); setShowPlaybackOptions(false); };
  
  // --- CONTENT NAVIGATION & COMPLETION (UNCHANGED) ---
  const markLessonComplete = (chapterIndex, lessonIndex) => { const key = `${chapterIndex}-${lessonIndex}`; if (!userProgress.completedLessons.includes(key)) { setUserProgress(prev => ({ ...prev, completedLessons: [...prev.completedLessons, key] })); } unlockNextContent(chapterIndex, lessonIndex); };
  const unlockNextContent = (completedChapterIndex, completedLessonIndex = -1) => { if (!chapters || !chapters.length) return; const currentChapter = chapters[completedChapterIndex]; if (!currentChapter) return; if (completedLessonIndex !== -1 && completedLessonIndex < currentChapter.lessons.length - 1) { handleSelectContent(completedChapterIndex, completedLessonIndex + 1, 'lesson'); return; } if (completedLessonIndex === currentChapter.lessons.length - 1 && currentChapter.exam) { handleSelectContent(completedChapterIndex, undefined, 'exam'); return; } const nextChapterIndex = completedChapterIndex + 1; if (nextChapterIndex < chapters.length) { const nextChapter = chapters[nextChapterIndex]; if (nextChapter.lessons?.length > 0) { handleSelectContent(nextChapterIndex, 0, 'lesson'); } else if (nextChapter.exam) { handleSelectContent(nextChapterIndex, undefined, 'exam'); } setSelectedChapterIndex(nextChapterIndex); } };
  const isLessonCompleted = (chapterIndex, lessonIndex) => userProgress.completedLessons.includes(`${chapterIndex}-${lessonIndex}`);
  const hasAttemptedExam = (chapterIndex) => userProgress.attemptedExams[chapterIndex]?.attempted || false;
  const getExamResult = (chapterIndex) => userProgress.attemptedExams[chapterIndex]?.result;
  const isLessonLocked = (chapterIndex, lessonIndex) => { 
    // First lesson is always unlocked
    if (chapterIndex === 0 && lessonIndex === 0) return false; 
    
    // Check if previous lesson in same chapter is completed
    if (lessonIndex > 0) return !isLessonCompleted(chapterIndex, lessonIndex - 1); 
    
    // Check previous chapter requirements
    const prevChapter = chapters[chapterIndex - 1]; 
    if (!prevChapter) return true; 
    
    // If previous chapter has exam, check if it's attempted (including locked exams that were marked as attempted)
    if (prevChapter.exam) return !hasAttemptedExam(chapterIndex - 1); 
    
    // If previous chapter has lessons, check if last lesson is completed
    if (prevChapter.lessons?.length > 0) return !isLessonCompleted(chapterIndex - 1, prevChapter.lessons.length - 1); 
    
    return true; 
  };
  const isExamAvailable = (chapterIndex) => { const chapter = chapters[chapterIndex]; if (!chapter?.exam) return false; return chapter.lessons?.every((_, lessonIndex) => isLessonCompleted(chapterIndex, lessonIndex)) ?? true; };
  
  // Function to get the next lesson
  const getNextLesson = () => {
    if (!selectedLesson || !chapters || chapters.length === 0) return null;
    
    const { chapterIndex, lessonIndex, type } = selectedLesson;
    const currentChapter = chapters[chapterIndex];
    
    if (type === 'lesson') {
      // Check if there are more lessons in current chapter
      if (currentChapter.lessons && lessonIndex + 1 < currentChapter.lessons.length) {
        return { chapterIndex, lessonIndex: lessonIndex + 1, type: 'lesson' };
      }
      // Check if current chapter has an exam
      else if (currentChapter.exam && isExamAvailable(chapterIndex)) {
        return { chapterIndex, type: 'exam' };
      }
      // Move to next chapter's first lesson
      else if (chapterIndex + 1 < chapters.length) {
        const nextChapter = chapters[chapterIndex + 1];
        if (nextChapter.lessons && nextChapter.lessons.length > 0) {
          return { chapterIndex: chapterIndex + 1, lessonIndex: 0, type: 'lesson' };
        }
      }
    } else if (type === 'exam') {
      // After exam, move to next chapter's first lesson
      if (chapterIndex + 1 < chapters.length) {
        const nextChapter = chapters[chapterIndex + 1];
        if (nextChapter.lessons && nextChapter.lessons.length > 0) {
          return { chapterIndex: chapterIndex + 1, lessonIndex: 0, type: 'lesson' };
        }
      }
    }
    
    return null; // No next lesson available
  };
  
  // Function to go to next lesson
  const goToNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      handleSelectContent(nextLesson.chapterIndex, nextLesson.lessonIndex, nextLesson.type);
    }
  };
  
  // Function to get unanswered questions
  const getUnansweredQuestions = () => {
    if (!currentExam || !selectedLesson) return [];
    
    const unanswered = [];
    currentExam.examQuestions.forEach((question, index) => {
      const questionKey = `${selectedLesson.chapterIndex}-${index}`;
      if (!examAnswers[questionKey]) {
        unanswered.push({
          index,
          questionNumber: index + 1,
          question: question.question
        });
      }
    });
    
    return unanswered;
  };
  
  // Function to check if all audio files in current lesson are completed
  const isCurrentLessonAudioCompleted = () => {
    if (!selectedLesson || selectedLesson.type !== 'lesson') return true; // Non-lesson content is always "completed"
    
    const lesson = chapters[selectedLesson.chapterIndex]?.lessons[selectedLesson.lessonIndex];
    if (!lesson?.audioFile || lesson.audioFile.length === 0) return true; // No audio files means completed
    
    // Check if all audio files are completed
    for (let i = 0; i < lesson.audioFile.length; i++) {
      const audioKey = `${selectedLesson.chapterIndex}-${selectedLesson.lessonIndex}-${i}`;
      if (!completedAudioFiles[audioKey]) {
        return false; // Found an incomplete audio file
      }
    }
    
    return true; // All audio files completed
  };
  
  // Function to check if an audio file is unlocked (previous audio completed)
  const isAudioUnlocked = (audioIndex) => {
    if (!selectedLesson || selectedLesson.type !== 'lesson') return true;
    
    // First audio is always unlocked
    if (audioIndex === 0) return true;
    
    // Check if previous audio is completed
    const previousAudioKey = `${selectedLesson.chapterIndex}-${selectedLesson.lessonIndex}-${audioIndex - 1}`;
    return completedAudioFiles[previousAudioKey] || false;
  };
  
  // Function to scroll to a specific question
  const scrollToQuestion = (questionIndex) => {
    const questionElement = document.getElementById(`question-${questionIndex}`);
    if (questionElement) {
      questionElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      // Add a temporary highlight effect
      questionElement.style.backgroundColor = '#fff3cd';
      questionElement.style.border = '2px solid #ffc107';
      setTimeout(() => {
        questionElement.style.backgroundColor = '';
        questionElement.style.border = '';
      }, 3000);
    }
  };
  
  const handleSelectContent = (chapterIndex, lessonIndex, type) => { 
    const newSelection = { chapterIndex, lessonIndex, type }; 
    if (JSON.stringify(newSelection) === JSON.stringify(selectedLesson)) return; 
    
    setSelectedLesson(newSelection); 
    setSelectedChapterIndex(chapterIndex); 
    
    if (type === 'lesson') { 
      setCurrentAudioFileIndex(0); 
      playOnLoadRef.current = false; 
      setActiveTab('playlist'); 
      // Stop any running exam timer
      setExamTimerActive(false);
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
        examTimerRef.current = null;
      }
    } else if (type === 'exam') { 
      if (audioRef.current) audioRef.current.pause(); 
      setSubmissionStatus(null); 
      setActiveTab('playlist'); 
      // Reset exam answers for new attempt if not already attempted
      if (!hasAttemptedExam(chapterIndex)) {
        setExamAnswers({});
      }
    } 
  };
  
  // --- EXAM LOGIC ---
  const handleAnswerSelect = (questionKey, answer) => { 
    setExamAnswers(prev => {
      const newAnswers = { ...prev, [questionKey]: answer };
      
      // Check if all questions are now answered and clear error
      const chapterIndex = selectedLesson.chapterIndex;
      const chapter = chapters[chapterIndex];
      const exam = chapter.exam;
      const totalQuestions = exam.examQuestions.length;
      const answeredCount = Object.keys(newAnswers).filter(key => key.startsWith(`${chapterIndex}-`)).length;
      
      if (answeredCount === totalQuestions && submissionError) {
        setSubmissionError('');
        setShowValidationHighlight(false); // Clear highlighting when all answered
      }
      
      // Save exam state with updated answers
      const examState = {
        examStarted: true,
        examTimerActive: examTimerActive,
        showExamModal: true,
        examInProgress: true,
        examCompleted: false,
        examTimer: examTimer,
        examAnswers: newAnswers,
        hasAnsweredQuestions: true,
        timestamp: Date.now()
      };
      saveExamState(examState);
      
      return newAnswers;
    });
    
    // Track that user has answered at least one question
    setHasAnsweredQuestions(true);
  };
  const submitExam = async () => { 
    if (!selectedLesson || selectedLesson.type !== 'exam') return; 
    
    const chapterIndex = selectedLesson.chapterIndex; 
    const chapter = chapters[chapterIndex]; 
    const exam = chapter.exam; 
    
    // Check for unanswered questions before submission
    const unansweredQuestions = [];
    exam.examQuestions.forEach((_, i) => {
      if (!examAnswers[`${chapterIndex}-${i}`]) {
        unansweredQuestions.push(i);
      }
    });
    
    if (unansweredQuestions.length > 0) {
      // Don't close modal or stop timer - keep exam open
      const firstUnanswered = unansweredQuestions[0];
      
      // Trigger validation highlighting
      setShowValidationHighlight(true);
      
      // Show error message with specific unanswered questions
      setSubmissionError(`Please answer all questions before submitting. ${unansweredQuestions.length} question${unansweredQuestions.length > 1 ? 's' : ''} remaining: ${unansweredQuestions.map(q => q + 1).join(', ')}`);
      
      // Scroll to the first unanswered question
      setTimeout(() => {
        scrollToQuestion(firstUnanswered);
      }, 100);
      
      return; 
    }
    
    // Stop the timer when manually submitting (only after validation passes)
    setExamTimerActive(false);
    setShowExamModal(false);
    if (examTimerRef.current) {
      clearInterval(examTimerRef.current);
      examTimerRef.current = null;
    } 
    
    const payload = exam.examQuestions.map((q, i) => ({ 
      question: q.question, 
      selectedAnswer: examAnswers[`${chapterIndex}-${i}`] 
    })); 
    
    try { 
      setSubmissionStatus({ status: "submitting" }); 
      const token = localStorage.getItem("token"); 
      const response = await fetch("https://learnly-backend-05ix.onrender.com/user/exam/answer-submit", { 
        method: "POST", 
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, 
        body: JSON.stringify({ 
          examId: exam.examId || exam._id, 
          courseId: id, 
          chapterTitle: chapter.title, 
          answers: payload 
        }) 
      }); 
      
      const data = await response.json(); 
      if (!response.ok || !data.success) throw new Error(data.message || "Submission failed."); 
      
      setUserProgress(prev => ({ 
        ...prev, 
        attemptedExams: { 
          ...prev.attemptedExams, 
          [chapterIndex]: { attempted: true, score: data.data.obtainedMarks, result: data.data } 
        } 
      })); 
      
      setSubmissionStatus({ status: "success", data: data.data }); 
      
      // Reset exam states after successful submission
      setExamStarted(false);
      setExamTimerActive(false);
      setExamInProgress(false);
      setExamCompleted(true);
      setHasAnsweredQuestions(false);
      
      // Clear saved exam state from localStorage
      clearExamState();
    } catch (err) { 
      setSubmissionStatus({ status: "error", message: err.message }); 
    } 
  };

  // --- RENDER LOGIC (UNCHANGED) ---
  const currentChapter = chapters[selectedLesson?.chapterIndex];
  const currentLesson = selectedLesson?.type === 'lesson' ? currentChapter?.lessons?.[selectedLesson.lessonIndex] : null;
  const currentExam = selectedLesson?.type === 'exam' ? currentChapter?.exam : null;
  const isAudioPlayerVisible = !!selectedLesson;
  const audioReady = audioRef.current && duration > 0 && !isNaN(duration);
  
  // Helper function to truncate title to first two words with dots
  const truncateTitle = (title) => {
    if (!title) return "Course Content";
    const words = title.trim().split(/\s+/);
    if (words.length <= 2) return title;
    return `${words[0]} ${words[1]}...`;
  };
  
  const getHeaderTitle = () => { 
    if (currentLesson) return truncateTitle(currentLesson.lessonname); 
    if (currentExam) return truncateTitle(currentExam.examinationName); 
    return "Course Content" 
  };

  if (loading) { return ( <div style={styles.appContainer}> <div style={styles.header}> <div style={styles.headerTitle}>Loading...</div> </div> <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: `calc(100vh - ${isMobile ? '50px' : '55px'})`, backgroundColor: activeColors.background || '#ffffff', padding: isMobile ? theme.spacing.md : theme.spacing.lg }}> <div style={{ width: '40px', height: '40px', border: `4px solid ${activeColors.primaryLight}`, borderTop: `4px solid ${activeColors.primary}`, borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: theme.spacing.md }}></div> <div style={{ fontSize: '1rem', color: activeColors.gray }}>Loading Course Content...</div> </div> </div> ); }
  if (error) { return ( <div style={styles.appContainer}> <div style={styles.header}> <div style={styles.headerTitle}>Error</div> </div> <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: `calc(100vh - ${isMobile ? '50px' : '55px'})`, padding: isMobile ? theme.spacing.md : theme.spacing.lg, textAlign: 'center', backgroundColor: activeColors.background || '#ffffff' }}> <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: activeColors.danger, color: activeColors.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: theme.spacing.md }}> ! </div> <h3 style={{ marginBottom: theme.spacing.sm, fontSize: isMobile ? '1.3rem' : '1.5rem', color: activeColors.textDark }}> Error Loading Content </h3> <p style={{ marginBottom: theme.spacing.lg, color: activeColors.gray, fontSize: isMobile ? '0.85rem' : '0.95rem' }}> {error} </p> <button style={{ ...styles.button, ...styles.primaryButton }} onClick={() => window.location.reload()} > Try Again </button> </div> </div> ); }

  return (
    <div style={styles.appContainer}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backButton} onClick={() => navigate(-1)} title="Go back"> 
            <FaArrowLeft /> 
          </button>
          <div style={styles.headerTitle}>{truncateTitle(currentChapter?.title) || "Course"}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <button 
            style={styles.themeToggleButton} 
            onClick={toggleTheme} 
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {/* Sliding circle with current icon */}
            <div style={styles.themeToggleSlider}>
              {themeMode === 'light' ? (
                <FaSun style={{ color: 'inherit' }} />
              ) : (
                <FaMoon style={{ color: 'inherit' }} />
              )}
            </div>
          </button>
        </div>
      </div>
      <div style={styles.mainContent}>
        {/* Audio Completion Progress */}
        {currentLesson && currentLesson.audioFile?.length > 0 && (
          <div style={{
            backgroundColor: activeColors.surfaceElevated || activeColors.white,
            padding: isMobile ? theme.spacing.sm : theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            marginBottom: isMobile ? theme.spacing.sm : theme.spacing.md,
            border: `1px solid ${activeColors.border || activeColors.lightGray}`,
            boxShadow: `0 2px 4px ${activeColors.shadow}`,
            transition: 'all 0.3s ease',
            boxShadow: theme.shadows.sm
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.sm,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: isMobile ? theme.spacing.xs : 0,
            }}>
              <h3 style={{
                margin: 0,
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 600,
                color: activeColors.textDark,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaHeadphones />
                Audio Progress
              </h3>
              <div style={{
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: 600,
                color: isCurrentLessonAudioCompleted() ? '#28a745' : '#6c757d',
                textAlign: isMobile ? 'left' : 'right',
                flex: isMobile ? '1 1 100%' : 'auto',
              }}>
                {Object.keys(completedAudioFiles).filter(key => key.startsWith(`${selectedLesson.chapterIndex}-${selectedLesson.lessonIndex}-`)).length} / {currentLesson.audioFile.length} Completed
                <span style={{ 
                  marginLeft: isMobile ? '0' : '8px', 
                  fontSize: isMobile ? '0.7rem' : '0.8rem', 
                  color: '#007bff',
                  display: isMobile ? 'block' : 'inline',
                  marginTop: isMobile ? '2px' : '0',
                }}>
                  (Next: {currentLesson.audioFile.findIndex((_, i) => !isAudioUnlocked(i)) !== -1 
                    ? `#${currentLesson.audioFile.findIndex((_, i) => !isAudioUnlocked(i)) + 1} Locked` 
                    : 'All Unlocked'}
                  )
                </span>
              </div>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(Object.keys(completedAudioFiles).filter(key => key.startsWith(`${selectedLesson.chapterIndex}-${selectedLesson.lessonIndex}-`)).length / currentLesson.audioFile.length) * 100}%`,
                height: '100%',
                backgroundColor: isCurrentLessonAudioCompleted() ? '#28a745' : '#007bff',
                transition: 'width 0.3s ease'
              }} />
            </div>
            {isCurrentLessonAudioCompleted() && (
              <div style={{
                marginTop: theme.spacing.sm,
                padding: theme.spacing.sm,
                backgroundColor: '#d4edda',
                borderRadius: theme.borderRadius.sm,
                color: '#155724',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FaCheckCircle />
                All audio files completed! You can now proceed to the next lesson.
              </div>
            )}
          </div>
        )}
        
        {isAudioPlayerVisible && !showExamModal && (
            <div style={styles.videoStylePlayerContainer}>
              <div style={styles.playerVisualArea}>
                {/* Audio info overlay with name and icon */}
                <div style={styles.audioInfoOverlay}>
                  <div style={styles.audioNameDisplay}>
                    {truncateTitle(currentLesson?.audioFile?.[currentAudioFileIndex]?.name) || getHeaderTitle()}
                  </div>
                  <FaMusic style={styles.audioIconTopRight} />
                </div>
              </div>
              {currentLesson && currentLesson.audioFile?.length > 0 && (
                <div style={styles.playerControlsOverlay}>
                  <div style={styles.progressContainer}>
                      <div style={styles.timeDisplay}>{formatTime(currentTime)}</div>
                      <div style={styles.progressBar} ref={progressBarRef} onClick={audioReady ? handleSeek : undefined} >
                          <div style={{ ...styles.progressFill, width: `${(currentTime / duration) * 100}%` }}></div>
                          {audioReady && ( <div style={{ ...styles.progressThumb, left: `${(currentTime / duration) * 100}%` }}></div> )}
                      </div>
                      <div style={styles.timeDisplay}>{formatTime(duration)}</div>
                  </div>
                  <div style={styles.controlsRow}>
                      <div style={styles.controlsGroup}>
                          <button style={styles.controlButton} onClick={skipToPrevAudio} disabled={!audioReady || currentAudioFileIndex === 0} title="Previous Track"> <FaStepBackward /> </button>
                          <button style={styles.controlButton} onClick={skipBackward} disabled={!audioReady} title="Rewind 10s"> <FaBackward /> </button>
                          <button style={{ ...styles.controlButton, ...styles.playButton }} onClick={playPause} disabled={!currentLesson.audioFile?.[currentAudioFileIndex]?.url} title={isPlaying ? "Pause" : "Play"}> {isPlaying ? <FaPause /> : <FaPlay />} </button>
                          <button style={styles.controlButton} onClick={skipForward} disabled={!audioReady} title="Forward 10s"> <FaForward /> </button>
                          <button style={styles.controlButton} onClick={skipToNextAudio} disabled={!audioReady || currentAudioFileIndex >= (currentLesson.audioFile?.length - 1) || !isAudioUnlocked(currentAudioFileIndex + 1)} title="Next Track"> <FaStepForward /> </button>
                      </div>
                      <div style={styles.controlsGroup}>
                          <div style={styles.volumeControl}>
                              <button style={styles.controlButton} onClick={() => setVolume(v => v > 0 ? 0 : 80)} disabled={!audioReady} title={volume === 0 ? "Unmute" : "Mute"}> {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />} </button>
                              <div style={styles.volumeBar} ref={volumeBarRef} onClick={audioReady ? handleVolumeSeek : undefined}>
                                  <div style={{ ...styles.volumeFill, width: `${volume}%` }}></div>
                                  {audioReady && (<div style={{ ...styles.volumeThumb, left: `${volume}%` }}></div>)}
                              </div>
                          </div>
                          <div style={styles.playbackRate} ref={playbackOptionsRef}>
                              <button style={styles.rateButton} onClick={() => setShowPlaybackOptions(!showPlaybackOptions)} disabled={!audioReady} title="Playback Speed"> {playbackRate.toFixed(1)}x <AiOutlineSetting size="0.9em" /> </button>
                              {showPlaybackOptions && audioReady && (
                              <div style={styles.rateOptions}>
                                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(rate => (
                                  <div key={rate} style={{ ...styles.rateOption, ...(playbackRate === rate ? styles.activeRate : {}) }} onClick={() => changePlaybackRate(rate)} >
                                      {rate.toFixed(1)}x
                                  </div>
                                  ))}
                              </div>
                              )}
                          </div>
                      </div>
                  </div>
                </div>
              )}
            </div>
        )}
        <div style={styles.tabsContainer}>
            <button style={activeTab === 'playlist' ? {...styles.tabButton, ...styles.activeTabButton} : styles.tabButton} onClick={() => setActiveTab('playlist')}> Lesson Content </button>
            <button style={activeTab === 'courseContent' ? {...styles.tabButton, ...styles.activeTabButton} : styles.tabButton} onClick={() => setActiveTab('courseContent')}> Course Outline </button>
        </div>
        <div style={styles.tabContentContainer}>
            {activeTab === 'playlist' && (
                <div>
                  {currentLesson?.audioFile?.length > 0 && (
                      <div style={styles.audioList}>
                          {currentLesson.audioFile.map((audio, i) => {
                            const audioKey = `${selectedLesson.chapterIndex}-${selectedLesson.lessonIndex}-${i}`;
                            const isCompleted = completedAudioFiles[audioKey];
                            const isActive = currentAudioFileIndex === i;
                            const isUnlocked = isAudioUnlocked(i);
                            
                            return (
                              <div 
                                key={audio.url || i} 
                                style={{ 
                                  ...styles.audioItem, 
                                  ...(isActive ? styles.activeAudioItem : {}),
                                  ...(isCompleted && !isActive ? {
                                    backgroundColor: '#d4edda',
                                    borderColor: '#28a745',
                                    opacity: 0.8
                                  } : {}),
                                  ...(!isUnlocked ? {
                                    backgroundColor: '#f8f9fa',
                                    borderColor: '#dee2e6',
                                    opacity: 0.5,
                                    cursor: 'not-allowed'
                                  } : {})
                                }} 
                                onClick={() => handleAudioItemClick(i)} 
                              >
                                  <div style={styles.audioItemInfo}>
                                      <div style={{
                                        ...styles.audioItemTitle, 
                                        color: isActive ? activeColors.white : (!isUnlocked ? '#6c757d' : activeColors.textDark),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                      }}>
                                        {isCompleted && <FaCheckCircle style={{ color: '#28a745', fontSize: '0.9rem' }} />}
                                        {!isUnlocked && <FaLock style={{ color: '#6c757d', fontSize: '0.8rem' }} />}
                                        {audio.name}
                                      </div>
                                      <div style={{...styles.audioItemMeta, color: isActive ? activeColors.lightGray : (!isUnlocked ? '#6c757d' : activeColors.gray)}}> 
                                        <IoMdTime /> {formatTime(audio.duration || 0)} 
                                        {isCompleted && <span style={{ marginLeft: '8px', color: '#28a745', fontWeight: 600 }}>✓ Completed</span>}
                                        {!isUnlocked && <span style={{ marginLeft: '8px', color: '#6c757d', fontWeight: 600 }}>🔒 Locked</span>}
                                      </div>
                                  </div>
                                  <div style={{ color: isActive ? activeColors.white : (!isUnlocked ? '#6c757d' : activeColors.primary) }}> 
                                    {!isUnlocked ? <FaLock /> : (isActive && isPlaying ? <FaPause /> : <FaPlay />)}
                                  </div>
                              </div>
                            );
                          })}
                      </div>
                  )}
                  {currentLesson?.pdfFile?.length > 0 && (
                      <div style={{...styles.card, marginTop: theme.spacing.lg}}>
                          <h2 style={styles.sectionTitle}> <FaFilePdf /> Materials ({currentLesson.pdfFile.length}) </h2>
                          <div style={styles.pdfGrid}>
                              {currentLesson.pdfFile.map((pdf, i) => (
                                  <a key={pdf.url || i} href={pdf.url} target="_blank" rel="noopener noreferrer" style={styles.pdfCard} >
                                      <div style={styles.pdfIcon}> <FaFilePdf /> </div>
                                      <div style={styles.pdfDetails}> <div style={styles.pdfTitle}>{pdf.name}</div> </div>
                                  </a>
                              ))}
                          </div>
                      </div>
                  )}
                  {currentLesson && (
                      <div style={styles.lessonActions}>
                          {/* Go to Next Lesson Button */}
                          {getNextLesson() && (
                              <button 
                                  style={{ 
                                      ...styles.button, 
                                      ...(isCurrentLessonAudioCompleted() 
                                        ? styles.secondaryButton 
                                        : {
                                            backgroundColor: '#6c757d',
                                            color: '#ffffff',
                                            cursor: 'not-allowed',
                                            opacity: 0.6
                                          }
                                      ),
                                      marginLeft: '10px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                  }} 
                                  onClick={isCurrentLessonAudioCompleted() ? goToNextLesson : () => {
                                    alert('Please complete listening to all audio files in this lesson before proceeding to the next lesson.');
                                  }}
                                  title={isCurrentLessonAudioCompleted() 
                                    ? `Go to ${getNextLesson().type === 'exam' ? 'Exam' : 'Next Lesson'}`
                                    : 'Complete all audio files to unlock next lesson'
                                  }
                                  disabled={!isCurrentLessonAudioCompleted()}
                              > 
                                  {isCurrentLessonAudioCompleted() ? <FaChevronRight /> : <FaLock />}
                                  {isCurrentLessonAudioCompleted() 
                                    ? (getNextLesson().type === 'exam' ? 'Go to Exam' : 'Next Lesson')
                                    : 'Complete Audio First'
                                  }
                              </button>
                          )}
                      </div>
                  )}
                  {currentExam && (
                    <div>
                      {/* Modern Exam Header */}
                      <div style={styles.examContainer}>
                        <div style={styles.examHeader}>
                          <h1 style={styles.examTitle}>{currentExam.examinationName}</h1>
                          <p style={styles.examSubtitle}>Test your knowledge and earn your certification</p>
                        </div>
                        
                        {/* Exam Stats Grid */}
                        <div style={styles.examStatsGrid}>
                          <div style={styles.examStatCard}>
                            <div style={styles.examStatValue}>{currentExam.examQuestions?.length || 0}</div>
                            <div style={styles.examStatLabel}>Questions</div>
                          </div>
                          <div style={styles.examStatCard}>
                            <div style={styles.examStatValue}>{currentExam.totalMarks}</div>
                            <div style={styles.examStatLabel}>Total Marks</div>
                          </div>
                          {/* Time Limit Info */}
                          <div style={styles.examStatCard}>
                            <div style={styles.examStatValue}>
                              {formatTimerDisplay((currentExam.examQuestions?.length || 0) * 2 * 60)}
                            </div>
                            <div style={styles.examStatLabel}>Time Limit</div>
                          </div>
                          {currentExam.passMarks != null && (
                            <div style={styles.examStatCard}>
                              <div style={styles.examStatValue}>{currentExam.passMarks}</div>
                              <div style={styles.examStatLabel}>Pass Marks</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Resume Exam Button - Show if exam is in progress but modal is closed */}
                      {examStarted && examTimerActive && !showExamModal && !hasAttemptedExam(selectedLesson.chapterIndex) && (
                        <div style={{
                          backgroundColor: '#fff3cd',
                          border: '2px solid #ffc107',
                          borderRadius: theme.borderRadius.md,
                          padding: theme.spacing.lg,
                          marginBottom: theme.spacing.lg,
                          textAlign: 'center'
                        }}>
                          <h3 style={{ 
                            color: '#856404', 
                            marginTop: 0, 
                            marginBottom: theme.spacing.sm,
                            fontFamily: "'Montserrat', sans-serif" 
                          }}>
                            ⏰ Exam in Progress!
                          </h3>
                          <p style={{ 
                            color: '#856404', 
                            marginBottom: theme.spacing.md,
                            fontFamily: "'Open Sans', sans-serif" 
                          }}>
                            Your exam timer is running. Time remaining: <strong>{formatTimerDisplay(examTimer)}</strong>
                          </p>
                          <button
                            style={{
                              background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: theme.borderRadius.md,
                              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                              fontSize: '1rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: theme.transitions.normal,
                              display: 'flex',
                              alignItems: 'center',
                              gap: theme.spacing.sm,
                              margin: '0 auto',
                              fontFamily: "'Montserrat', sans-serif",
                              boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)',
                              ':hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px rgba(255, 193, 7, 0.4)',
                              }
                            }}
                            onClick={() => setShowExamModal(true)}
                          >
                            <FaEdit />
                            Resume Exam
                          </button>
                        </div>
                      )}

                      {/* Exam Results - Show if completed */}
                      {(submissionStatus?.status === "success" || hasAttemptedExam(selectedLesson.chapterIndex)) && !showExamQuestions && (
                        <div style={styles.examResultContainer}>
                          <div style={styles.examResultHeader}>
                            <h2 style={styles.examResultTitle}>
                              {submissionStatus?.autoSubmitted ? '⏰ Exam Auto-Submitted (Time Expired)' : '🎉 Exam Completed Successfully!'}
                            </h2>
                            {submissionStatus?.autoSubmitted && (
                              <p style={{
                                fontSize: isMobile ? '0.8rem' : '0.9rem',
                                margin: `${theme.spacing.sm} 0 0 0`,
                                opacity: 0.9,
                                fontFamily: "'Open Sans', sans-serif"
                              }}>
                                Your exam was automatically submitted when the timer reached zero.
                              </p>
                            )}
                          </div>
                          <div style={styles.examResultBody}>
                            <div style={styles.examResultGrid}>
                              <div style={styles.examResultCard}>
                                <div style={styles.examResultValue}>
                                  {(submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).obtainedMarks}/
                                  {(submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).totalMarks}
                                </div>
                                <div style={styles.examResultLabel}>Final Score</div>
                              </div>
                              <div style={styles.examResultCard}>
                                <div style={styles.examResultValue}>
                                  {(submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).correctCount}
                                </div>
                                <div style={styles.examResultLabel}>Correct Answers</div>
                              </div>
                              <div style={styles.examResultCard}>
                                <div style={{
                                  ...styles.examResultValue,
                                  color: (submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).obtainedMarks >= currentExam.passMarks 
                                    ? '#28a745' : '#dc3545'
                                }}>
                                  {(submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).obtainedMarks >= currentExam.passMarks ? "PASSED" : "FAILED"}
                                </div>
                                <div style={styles.examResultLabel}>Status</div>
                              </div>
                            </div>
                            
                            <div style={styles.examActionsContainer}>
                              <button 
                                style={styles.secondaryButton} 
                                onClick={() => setShowExamQuestions(true)}
                              >
                                📝 View Questions & Answers
                              </button>
                              {getNextLesson() && (
                                <button 
                                  style={{ ...styles.button, ...styles.primaryButton }} 
                                  onClick={goToNextLesson}
                                >
                                  <FaChevronRight style={{ marginRight: '8px' }} />
                                  {getNextLesson().type === 'exam' ? 'Continue to Next Exam' : 'Continue to Next Lesson'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Error State */}
                      {submissionStatus?.status === 'error' && (
                        <div style={{ 
                          ...styles.card, 
                          backgroundColor: '#f8d7da', 
                          color: '#721c24', 
                          borderLeft: `4px solid #dc3545`,
                          border: '1px solid #f5c6cb'
                        }}>
                          <h2 style={{ color: '#721c24', marginTop: 0, fontSize: isMobile ? '1.1rem' : '1.25rem', fontFamily: "'Montserrat', sans-serif" }}>
                            ⚠️ Submission Error
                          </h2>
                          <p style={{ color: '#721c24', fontFamily: "'Open Sans', sans-serif" }}>{submissionStatus.message}</p>
                        </div>
                      )}

                      {/* Show Questions - For review or first attempt */}
                      {(showExamQuestions || (!hasAttemptedExam(selectedLesson.chapterIndex) && !submissionStatus)) && currentExam.examQuestions && (
                        <div style={styles.card}>
                          {/* If exam hasn't started yet, show start button or locked message */}
                          {!examStarted && !hasAttemptedExam(selectedLesson.chapterIndex) && !showExamQuestions && (
                            <div style={styles.examStartContainer}>
                              {/* Simple Start Exam Interface */}
                              <div style={{ textAlign: 'center' }}>
                                <div style={styles.examStartIcon}>
                                  📝
                                </div>
                                <h2 style={styles.examStartTitle}>Ready to Start Your Exam?</h2>
                                
                                {/* Simple Exam Info */}
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-around',
                                  marginBottom: theme.spacing.lg,
                                  flexWrap: 'wrap',
                                  gap: isMobile ? theme.spacing.sm : theme.spacing.md,
                                }}>
                                  <div style={{
                                    textAlign: 'center',
                                    padding: isMobile ? theme.spacing.sm : theme.spacing.md,
                                  }}>
                                    <div style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '4px' }}>📝</div>
                                    <div style={{ fontWeight: 'bold', color: activeColors.primary }}>
                                      {currentExam.examQuestions?.length || 0} Questions
                                    </div>
                                  </div>
                                  
                                  <div style={{
                                    textAlign: 'center',
                                    padding: isMobile ? theme.spacing.sm : theme.spacing.md,
                                  }}>
                                    <div style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '4px' }}>⏱️</div>
                                    <div style={{ fontWeight: 'bold', color: activeColors.primary }}>
                                      {formatTimerDisplay(totalExamTime)}
                                    </div>
                                  </div>
                                  
                                  <div style={{
                                    textAlign: 'center',
                                    padding: isMobile ? theme.spacing.sm : theme.spacing.md,
                                  }}>
                                    <div style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '4px' }}>⭐</div>
                                    <div style={{ fontWeight: 'bold', color: activeColors.primary }}>
                                      {currentExam.examQuestions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0} Marks
                                    </div>
                                  </div>
                                </div>
                                
                                <p style={{
                                  ...styles.examStartDescription,
                                  fontSize: isMobile ? '0.9rem' : '1rem',
                                  marginBottom: theme.spacing.lg,
                                }}>
                                  You have <strong>2 minutes per question</strong> to complete this exam. Make sure you're ready before proceeding.
                                </p>
                                
                                <button 
                                  style={styles.examStartButton}
                                  onClick={startExam}
                                >
                                  📝 Start Exam
                                </button>
                                
                                {/* Next Lesson Button in Exam */}
                                {getNextLesson() && hasAttemptedExam(selectedLesson.chapterIndex) && (
                                  <button 
                                    style={{
                                      ...styles.button,
                                      ...styles.secondaryButton,
                                      marginTop: theme.spacing.md,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      justifyContent: 'center'
                                    }}
                                    onClick={goToNextLesson}
                                    title={`Skip to ${getNextLesson().type === 'exam' ? 'Next Exam' : 'Next Lesson'}`}
                                  >
                                    <FaChevronRight />
                                    {getNextLesson().type === 'exam' ? 'Skip to Next Exam' : ' Next Lesson'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {showExamQuestions && (
                            <div style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: '#ffffff',
                              padding: theme.spacing.lg,
                              borderRadius: theme.borderRadius.md,
                              marginBottom: theme.spacing.lg,
                              textAlign: 'center'
                            }}>
                              <h3 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.25rem', fontFamily: "'Montserrat', sans-serif" }}>
                                📋 Exam Review - Questions & Answers
                              </h3>
                              <button 
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  color: '#ffffff',
                                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                  borderRadius: theme.borderRadius.sm,
                                  marginTop: theme.spacing.sm,
                                  cursor: 'pointer',
                                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                                  fontFamily: "'Open Sans', sans-serif",
                                  transition: 'all 0.2s ease',
                                }}
                                onClick={() => setShowExamQuestions(false)}
                              >
                                ← Back to Results
                              </button>
                            </div>
                          )}
                          
                          {/* Timer Display - Show only during first attempt and when exam has started */}
                          {!hasAttemptedExam(selectedLesson.chapterIndex) && !showExamQuestions && examTimer !== null && examStarted && (
                            <div style={styles.timerContainer}>
                              <div style={styles.timerHeader}>
                                <IoMdTime style={styles.timerIcon} />
                                <h3 style={styles.timerTitle}>Time Remaining</h3>
                              </div>
                              <div style={styles.timerDisplay}>
                                <div 
                                  style={{
                                    ...styles.timerTime,
                                    color: getTimerColor(examTimer, totalExamTime)
                                  }}
                                >
                                  {formatTimerDisplay(examTimer)}
                                </div>
                                <div style={styles.timerProgress}>
                                  <div 
                                    style={{
                                      ...styles.timerProgressFill,
                                      width: `${(examTimer / totalExamTime) * 100}%`,
                                      backgroundColor: getTimerColor(examTimer, totalExamTime)
                                    }}
                                  />
                                </div>
                                <div 
                                  style={{
                                    ...styles.timerWarning,
                                    color: getTimerColor(examTimer, totalExamTime)
                                  }}
                                >
                                  {examTimer <= 60 ? '⚠️ Less than 1 minute remaining!' : 
                                   examTimer <= 300 ? '⏰ 5 minutes or less remaining' : 
                                   `📝 ${currentExam.examQuestions?.length || 0} questions • 2 minutes each`}
                                </div>
                                {submissionStatus?.autoSubmitted && (
                                  <div style={{
                                    ...styles.timerWarning,
                                    color: '#dc3545',
                                    fontWeight: 600,
                                    marginTop: theme.spacing.sm
                                  }}>
                                    ⏱️ Time expired - Exam auto-submitted
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Show questions only for review after completion */}
                          {showExamQuestions && currentExam.examQuestions.map((question, i) => {
                            const questionKey = `${selectedLesson.chapterIndex}-${i}`;
                            const answer = examAnswers[questionKey];
                            return (
                              <div key={question._id || i} style={styles.questionItem}>
                                <div style={styles.questionHeader}>
                                  <div style={styles.questionNumber}>{i + 1}</div>
                                  <h3 style={styles.questionText}>{question.question}</h3>
                                </div>
                                <div style={styles.optionsGrid}>
                                  {question.options.map((option, optionIndex) => {
                                    const optionLabel = String.fromCharCode(65 + optionIndex);
                                    const isSelected = answer === option;
                                    const isDisabled = hasAttemptedExam(selectedLesson.chapterIndex) || showExamQuestions;
                                    
                                    return (
                                      <div
                                        key={optionIndex}
                                        style={{
                                          ...styles.optionItem,
                                          ...(isSelected ? styles.selectedOption : {}),
                                          cursor: isDisabled ? 'default' : 'pointer',
                                          opacity: isDisabled ? 0.8 : 1
                                        }}
                                        onClick={() => {
                                          if (!isDisabled) {
                                            handleAnswerSelect(questionKey, option);
                                          }
                                        }}
                                      >
                                        <div style={{
                                          ...styles.optionMarker,
                                          ...(isSelected ? styles.selectedMarker : {})
                                        }}>
                                          {optionLabel}
                                        </div>
                                        <div style={styles.optionText}>{option}</div>
                                        
                                        {/* Show correct/incorrect indicators for completed exams */}
                                        {(hasAttemptedExam(selectedLesson.chapterIndex) || showExamQuestions) && (
                                          <div style={{ marginLeft: 'auto' }}>
                                            {question.answer === option ? (
                                              <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✅</span>
                                            ) : isSelected && question.answer !== option ? (
                                              <span style={{ color: '#dc3545', fontSize: '1.2rem' }}>❌</span>
                                            ) : null}
                                          </div>
                                        )}
                                        
                                        {/* Legacy check icon for selected answers (if not in review mode) */}
                                        {isSelected && !hasAttemptedExam(selectedLesson.chapterIndex) && !showExamQuestions && (
                                          <div style={{ color: activeColors.white }}>
                                            <BsCheck2All />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {/* Show correct answer for completed exams */}
                                {(hasAttemptedExam(selectedLesson.chapterIndex) || showExamQuestions) && (
                                  <div style={{
                                    marginTop: theme.spacing.md,
                                    padding: theme.spacing.sm,
                                    backgroundColor: '#d4edda',
                                    borderRadius: theme.borderRadius.sm,
                                    border: '1px solid #c3e6cb',
                                    fontSize: isMobile ? '0.8rem' : '0.85rem',
                                    fontFamily: "'Inter', sans-serif",
                                  }}>
                                    <strong style={{ color: '#155724' }}>Correct Answer: </strong>
                                    <span style={{ color: '#155724' }}>{question.answer}</span>
                                  </div>
                                )}
                                
                                <div style={styles.questionMeta}>Marks: {question.marks}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
            )}
            {activeTab === 'courseContent' && (
                 <div>
                    {chapters.map((chapter, cIdx) => (
                        <div key={chapter._id || cIdx} style={{marginBottom: theme.spacing.sm, borderRadius: theme.borderRadius.md, overflow: 'hidden', boxShadow: theme.shadows.sm}}>
                            <div style={{...styles.chapterItem, backgroundColor: activeColors.secondary, color: activeColors.textLight}} onClick={() => setSelectedChapterIndex(cIdx === selectedChapterIndex ? -1 : cIdx)} >
                                <div style={{...styles.chapterTitle, color: activeColors.textLight}}> Chapter {cIdx + 1}: {chapter.title} </div>
                                <FaChevronRight style={{ transform: selectedChapterIndex === cIdx ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}/>
                            </div>
                            {selectedChapterIndex === cIdx && (
                            <div>
                                {chapter.lessons?.map((lesson, lIdx) => { const locked = isLessonLocked(cIdx, lIdx); const completed = isLessonCompleted(cIdx, lIdx); const isActive = selectedLesson?.type === 'lesson' && selectedLesson.chapterIndex === cIdx && selectedLesson.lessonIndex === lIdx; let icon = locked ? <FaLock /> : (completed ? <FaCheckCircle /> : (lesson.audioFile?.length ? <FaHeadphones /> : <FaBookOpen />)); return (
                                    <div key={lesson._id || lIdx} style={{ ...styles.lessonItem, ...(isActive ? styles.activeLesson : {}), ...(locked ? styles.lockedLesson : {}) }} onClick={() => !locked && handleSelectContent(cIdx, lIdx, 'lesson')} >
                                        <div style={{ ...styles.lessonIcon, color: isActive ? activeColors.white : (completed ? activeColors.success : (locked ? activeColors.danger : activeColors.gray)) }}> {icon} </div>
                                        <div style={styles.lessonDetails}>
                                            <div style={{...styles.lessonName, color: isActive ? activeColors.white : activeColors.textDark}}>{lesson.lessonname}</div>
                                            <div style={{...styles.lessonMeta, color: isActive ? activeColors.white : activeColors.gray}}>
                                                {lesson.audioFile?.length > 0 && ( <span><FaHeadphones size="0.8em" /> {lesson.audioFile.length} Audio</span> )}
                                                {lesson.pdfFile?.length > 0 && ( <span><FaFilePdf size="0.8em" /> {lesson.pdfFile.length} PDF</span> )}
                                            </div>
                                        </div>
                                    </div> );
                                })}
                                {chapter.exam && (
                                <div style={{ 
                                  ...styles.lessonItem, 
                                  ...(selectedLesson?.type === 'exam' && selectedLesson.chapterIndex === cIdx ? styles.activeLesson : {}), 
                                  ...(!isExamAvailable(cIdx) && !hasAttemptedExam(cIdx) ? styles.lockedLesson : {})
                                }} onClick={() => (isExamAvailable(cIdx) || hasAttemptedExam(cIdx)) && handleSelectContent(cIdx, undefined, 'exam')} >
                                    <div style={{ 
                                      ...styles.lessonIcon, 
                                      color: hasAttemptedExam(cIdx) 
                                        ? activeColors.success 
                                        : (!isExamAvailable(cIdx) ? activeColors.danger : activeColors.warning) 
                                    }}> 
                                      <FaEdit /> 
                                    </div>
                                    <div style={styles.lessonDetails}>
                                        <div style={{
                                          ...styles.lessonName, 
                                          color: selectedLesson?.type === 'exam' && selectedLesson.chapterIndex === cIdx ? activeColors.white : activeColors.textDark
                                        }}>
                                          {chapter.exam.examinationName}
                                        </div>
                                        <div style={{
                                          ...styles.lessonMeta, 
                                          color: selectedLesson?.type === 'exam' && selectedLesson.chapterIndex === cIdx ? activeColors.white : activeColors.gray
                                        }}> 
                                          {chapter.exam.examQuestions?.length || 0} Questions
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            )}
                        </div>
                    ))}
                    {chapters.length === 0 && ( <div style={styles.emptyState}> <div style={styles.emptyIcon}> <FaBookOpen /> </div> <h3 style={styles.emptyTitle}>No Content Available</h3> <p style={styles.emptyText}> This course doesn't have any content yet. </p> </div> )}
                </div>
            )}
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
        @keyframes validationPulse { 
          0% { 
            transform: scale(1); 
            box-shadow: 0 0 15px rgba(220, 53, 69, 0.4); 
          } 
          50% { 
            transform: scale(1.02); 
            box-shadow: 0 0 25px rgba(220, 53, 69, 0.8); 
          } 
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 15px rgba(220, 53, 69, 0.4); 
          } 
        }
        @keyframes slideToggle { 0% { transform: translateX(-2px); } 100% { transform: translateX(2px); } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3); } 50% { box-shadow: 0 4px 16px rgba(255, 193, 7, 0.6); } }
        @keyframes moonGlow { 0%, 100% { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); } 50% { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), 0 0 12px rgba(255, 255, 255, 0.2); } }
        
        /* Slide toggle animations */
        .slide-toggle-light { animation: glowPulse 4s ease-in-out infinite; }
        .slide-toggle-dark { animation: moonGlow 4s ease-in-out infinite; }
        
        body { 
          margin: 0; 
          font-family: 'Montserrat', 'Open Sans', 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; 
          -webkit-font-smoothing: antialiased; 
          -moz-osx-font-smoothing: grayscale; 
          font-size: 16px; 
          line-height: 1.5; 
          font-weight: 400;
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; } 
        ::-webkit-scrollbar-track { background: ${activeColors.light}; } 
        ::-webkit-scrollbar-thumb { background: ${activeColors.gray}; border-radius: 3px; } 
        ::-webkit-scrollbar-thumb:hover { background: ${activeColors.dark}; }
        button { 
          cursor: pointer; 
          outline: none; 
          font-family: 'Montserrat', 'Nunito', sans-serif;
        } 
        button:disabled { cursor: not-allowed; }
        a { 
          color: ${activeColors.primary}; 
          text-decoration: none; 
          font-family: 'Open Sans', 'Nunito', sans-serif;
        } 
        a:hover { text-decoration: none; }
        h1, h2, h3, h4, h5, h6 { 
          margin-top: 0; 
          line-height: 1.2; 
          font-family: 'Montserrat', 'Open Sans', sans-serif;
          font-weight: 600;
        }
        p, span, div { 
          font-family: 'Open Sans', 'Nunito', sans-serif;
        }
        input, textarea, select { 
          font-family: 'Open Sans', 'Nunito', sans-serif;
        }
        @media (max-width: 768px) { 
          body { font-size: 14px; } 
          h1 { font-size: 1.5rem; } 
          h2 { font-size: 1.25rem; } 
          h3 { font-size: 1.1rem; } 
        }
        
        /* Enhanced Exam UI Animations */
        @keyframes validationPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(229, 115, 115, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(229, 115, 115, 0.6); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        /* Question Item Enhanced Hover Effect */
        .question-item-enhanced {
          animation: slideInUp 0.3s ease-out;
        }
        
        .question-item-enhanced:hover {
          transform: translateY(-4px) !important;
        }
        
        /* Option Hover Effects */
        .option-item-enhanced {
          position: relative;
          overflow: hidden;
        }
        
        .option-item-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .option-item-enhanced:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Exam Modal */}
      {showExamModal && examStarted && currentExam && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                📝 {currentExam.examinationName}
                {examInProgress && !examCompleted && (
                  <span style={{ 
                    fontSize: '0.8rem', 
                    marginLeft: '8px', 
                    color: activeColors.primary,
                    fontWeight: 'normal' 
                  }}>
                    (In Progress)
                  </span>
                )}
              </h3>
              {examCompleted && (
                <button 
                  style={styles.modalCloseButton}
                  onClick={closeExamModal}
                  title="Close Exam"
                >
                  <FaTimes />
                </button>
              )}
              {examInProgress && !examCompleted && (
                <div style={{
                  color: activeColors.gray,
                  fontSize: '0.7rem',
                  fontStyle: 'italic',
                  padding: '4px 8px',
                  backgroundColor: activeColors.lightGray,
                  borderRadius: '4px'
                }}>
                  Cannot close during exam
                </div>
              )}
            </div>

            <div style={styles.modalBody}>
              {/* Simple Timer */}
              <div style={styles.modalTimerSection}>
                <div style={styles.compactTimer}>
                  <div style={styles.compactTimerLeft}>
                    <IoMdTime style={styles.compactTimerIcon} />
                    <span style={styles.compactTimerText}>Time Remaining</span>
                  </div>
                  <div style={styles.compactTimerTime}>
                    {formatTimerDisplay(examTimer)}
                  </div>
                </div>
                
                {/* Simple Progress Info */}
                <div style={{
                  marginTop: theme.spacing.md,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  color: activeColors.gray,
                  fontWeight: 500,
                }}>
                  <span>Questions: {currentExam.examQuestions.length - getUnansweredQuestions().length}/{currentExam.examQuestions.length}</span>
                  <span>Total Marks: {currentExam.examQuestions.reduce((sum, q) => sum + (q.marks || 1), 0)}</span>
                </div>
              </div>

              {/* Questions Container */}
              <div style={{ 
                padding: isMobile ? theme.spacing.sm : theme.spacing.md,
              }}>
                {currentExam.examQuestions.map((question, i) => {
                  const questionKey = `${selectedLesson.chapterIndex}-${i}`;
                  const answer = examAnswers[questionKey];
                  const isUnanswered = !answer;
                  const shouldHighlight = showValidationHighlight && isUnanswered;
                  
                  return (
                    <div 
                      key={question._id || i} 
                      id={`question-${i}`}
                      style={{
                        ...styles.questionItem,
                        // Simple highlight for unanswered questions
                        ...(shouldHighlight ? {
                          backgroundColor: '#fff5f5',
                          border: '2px solid #dc3545',
                          boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)',
                        } : {})
                      }}
                    >
                      <div style={styles.questionHeader}>
                        <div style={{
                          ...styles.questionNumber,
                          backgroundColor: shouldHighlight ? '#dc3545' : (isUnanswered ? '#6c757d' : activeColors.primary),
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={styles.questionText}>
                            {question.question}
                          </h3>
                          <div style={{
                            fontSize: isMobile ? '0.75rem' : '0.8rem',
                            color: activeColors.gray,
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: isMobile ? '6px' : '8px',
                          }}>
                            <span style={{ 
                              backgroundColor: activeColors.primary, 
                              color: 'white', 
                              padding: '2px 6px', 
                              borderRadius: '4px',
                              fontSize: isMobile ? '0.7rem' : '0.75rem',
                              fontWeight: 600 
                            }}>
                              {question.marks || 1} Mark{question.marks > 1 ? 's' : ''}
                            </span>
                            {!isUnanswered && (
                              <span style={{ color: '#28a745', fontWeight: 600, fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                                ✓ Answered
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={styles.optionsGrid}>
                        {question.options.map((option, optionIndex) => {
                          const optionLabel = String.fromCharCode(65 + optionIndex);
                          const isSelected = answer === option;
                          
                          return (
                            <div
                              key={optionIndex}
                              style={{
                                ...styles.optionItem,
                                ...(isSelected ? styles.selectedOption : {})
                              }}
                              onClick={() => handleAnswerSelect(questionKey, option)}
                            >
                              <div style={{
                                ...styles.optionMarker,
                                ...(isSelected ? styles.selectedMarker : {})
                              }}>
                                {optionLabel}
                              </div>
                              <div style={styles.optionText}>{option}</div>
                              {isSelected && (
                                <div style={{ 
                                  color: activeColors.white,
                                  fontSize: '1rem',
                                  fontWeight: 'bold'
                                }}>
                                  ✓
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Enhanced Progress Summary */}
                <div style={{
                  marginTop: theme.spacing.xl,
                  padding: theme.spacing.xl,
                  background: getUnansweredQuestions().length === 0 ? '#d4edda' : '#fff3cd',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: getUnansweredQuestions().length === 0 ? '#155724' : '#856404',
                  boxShadow: 'none',
                  border: `2px solid ${getUnansweredQuestions().length === 0 ? '#28a745' : '#ffc107'}`,
                }}>
                  <div style={{
                    fontSize: isMobile ? '1.2rem' : '1.4rem',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: theme.spacing.md,
                    fontFamily: "'Poppins', sans-serif",
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  }}>
                    {getUnansweredQuestions().length === 0 ? '🎉 All Questions Completed!' : '� Exam Progress'}
                  </div>
                  
                  <div style={{
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    <strong>{currentExam.examQuestions.length - getUnansweredQuestions().length}</strong> of <strong>{currentExam.examQuestions.length}</strong> questions answered
                    {getUnansweredQuestions().length > 0 && (
                      <div style={{ marginTop: theme.spacing.sm, color: '#dc3545', fontSize: isMobile ? '0.75rem' : '0.8rem' }}>
                        <strong>{getUnansweredQuestions().length}</strong> questions remaining
                      </div>
                    )}
                  </div>
                </div>

                {/* Simple Submission Error Display */}
                {submissionStatus?.status === 'error' && (
                  <div style={{
                    marginTop: theme.spacing.lg,
                    padding: isMobile ? theme.spacing.md : theme.spacing.lg,
                    backgroundColor: '#f8d7da',
                    border: '2px solid #dc3545',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      color: '#721c24',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      fontWeight: 600,
                      marginBottom: theme.spacing.sm,
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      ⚠️ Cannot Submit Exam
                    </div>
                    <div style={{
                      color: '#721c24',
                      fontSize: isMobile ? '0.8rem' : '0.9rem',
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: theme.spacing.md,
                    }}>
                      {submissionStatus.message}
                    </div>
                    <button
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      onClick={() => {
                        setSubmissionError('');
                        setShowValidationHighlight(true);
                        const unanswered = getUnansweredQuestions();
                        if (unanswered.length > 0) {
                          scrollToQuestion(unanswered[0].index);
                        }
                      }}
                    >
                      📍 Go to Unanswered Question
                    </button>
                  </div>
                )}

                {/* Enhanced Submit Section */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: theme.spacing.lg,
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginTop: theme.spacing.xxl,
                  padding: theme.spacing.xl,
                  background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
                  borderTop: '3px solid #667eea',
                  borderRadius: '16px 16px 0 0',
                  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
                }}>
                  <button 
                    style={{ 
                      background: getUnansweredQuestions().length === 0 
                        ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: activeColors.white,
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: isMobile ? '1rem' : '1.2rem',
                      fontWeight: 700,
                      padding: isMobile ? `${theme.spacing.lg} ${theme.spacing.xl}` : `${theme.spacing.xl} ${theme.spacing.xxl}`,
                      flex: isMobile ? '1' : 'none',
                      minWidth: '200px',
                      cursor: submissionStatus?.status === 'submitting' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      ...(submissionStatus?.status === 'submitting' ? { 
                        opacity: 0.8,
                        transform: 'scale(0.98)',
                      } : {
                        ':hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 48px rgba(102, 126, 234, 0.4)',
                        }
                      }),
                    }} 
                    onClick={submitExam} 
                    disabled={submissionStatus?.status === 'submitting'}
                  >
                    {submissionStatus?.status === 'submitting' ? (
                      <>
                        <span style={{ 
                          display: 'inline-block', 
                          animation: 'spin 1s linear infinite',
                          fontSize: '1.2rem' 
                        }}>⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.2rem' }}>
                          {getUnansweredQuestions().length === 0 ? '🎯' : '📤'}
                        </span>
                        {getUnansweredQuestions().length === 0 ? 'Submit Complete Exam' : 'Submit Exam'}
                      </>
                    )}
                  </button>
                  
                  {/* Enhanced Next Lesson Button */}
                  {getNextLesson() && hasAttemptedExam(selectedLesson.chapterIndex) && (
                    <button 
                      style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
                        color: activeColors.white,
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        fontWeight: 600,
                        padding: isMobile ? `${theme.spacing.md} ${theme.spacing.lg}` : `${theme.spacing.lg} ${theme.spacing.xl}`,
                        flex: isMobile ? '1' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Poppins', sans-serif",
                        boxShadow: '0 6px 24px rgba(255, 107, 107, 0.3)',
                        ':hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
                        }
                      }}
                      onClick={() => {
                        if (window.confirm('⚠️ Are you sure you want to skip this exam and continue to the next lesson? Your current progress will not be saved.')) {
                          setShowExamModal(false);
                          setExamTimerActive(false);
                          if (examTimerRef.current) {
                            clearInterval(examTimerRef.current);
                            examTimerRef.current = null;
                          }
                          goToNextLesson();
                        }
                      }}
                      title={`Skip to ${getNextLesson().type === 'exam' ? 'Next Exam' : 'Next Lesson'}`}
                    >
                      <FaChevronRight />
                      {getNextLesson().type === 'exam' ? 'Skip to Next Exam' : 'Skip to Next Lesson'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}