import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHeadphones, FaFilePdf, FaPlay, FaPause,
  FaChevronRight, FaCheckCircle, FaLock,
  FaStepForward, FaStepBackward, FaForward, FaBackward,
  FaVolumeUp, FaVolumeMute, FaEdit, FaBookOpen,
  FaArrowLeft, FaTimes,FaSun, FaMoon
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { BsCheck2All } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import { MdMenuBook } from "react-icons/md";

// Theme Constants (Udemy-inspired palette) - COLORS CHANGED AS REQUESTED
const theme = {
  colors: {
    primary: '#007bff',      // CHANGED from '#a435f0'
    primaryDark: '#0069d9',   // CHANGED from '#8710d8'
    primaryLight: '#5faaff',  // CHANGED from '#b766f5'
    secondary: '#2d2f31',
    accent: '#f7c948',
    light: '#f7f7f7',
    dark: '#1c1d1f',
    gray: '#6a6f73',
    lightGray: '#d1d7dc',
    white: '#ffffff',
    success: '#03a678',
    successDark: '#028062',
    warning: '#f7c948',
    danger: '#d93025',
    textDark: '#1c1d1f',
    textLight: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    circle: '50%'
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.1)',
    md: '0 2px 4px rgba(0,0,0,0.15)',
    lg: '0 4px 8px rgba(0,0,0,0.2)'
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    laptop: '992px',
    desktop: '1200px'
  },
  transitions: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease'
  }
};

// Media Query Hook - UNCHANGED
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);
  return matches;
};

// Helper Functions - UNCHANGED
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function CourseContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
  const [currentAudioFileIndex, setCurrentAudioFileIndex] = useState(0);
  const [userProgress, setUserProgress] = useState({
    completedLessons: [],
    attemptedExams: {},
  });
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const playbackOptionsRef = useRef(null);
  const modalRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [hasUserPressedPlay, setHasUserPressedPlay] = useState(false);
  
  // Theme state logic
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('courseTheme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('courseTheme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.tablet})`);
  
  const sidebarWidth = isMobile ? '100%' : '400px';
  const MAIN_HEADER_HEIGHT = '65px';

  // Color palette logic
  const lightColors = {
    ...theme.colors 
  };

  const darkColors = {
    ...theme.colors,
    primary: '#5faaff',        // CHANGED from '#b766f5' to a light blue
    primaryDark: '#007bff',    // CHANGED from '#a435f0' to the main blue
    primaryLight: '#3c3e41', 
    light: '#2d2f31',
    dark: '#1c1d1f',
    gray: '#a9a9a9',
    lightGray: '#3c3e41',
    white: '#1c1d1f',
    textDark: '#ffffff',
    textLight: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.7)',
  };

  const activeColors = themeMode === 'light' ? lightColors : darkColors;
  
  const styles = {
    appContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: activeColors.dark,
      fontFamily: "'Inter', sans-serif",
      color: activeColors.textDark,
    },
    header: {
      position: 'sticky',
      top: MAIN_HEADER_HEIGHT,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      backgroundColor: activeColors.primary,
      color: activeColors.textLight,
      height: '60px',
      boxShadow: theme.shadows.sm,
      '@media (max-width: 768px)': {
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        height: '56px',
        top: 0,
      }
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    headerButton: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      border: 'none',
      backgroundColor: 'transparent',
      color: activeColors.textLight,
      fontWeight: 500,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      },
    },
    headerTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: 0,
      flex: 1,
      textAlign: 'center',
    },
    contentButton: {
      backgroundColor: activeColors.primary,
      color: activeColors.white,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      border: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      cursor: 'pointer',
      transition: theme.transitions.normal,
      ':hover': {
        backgroundColor: activeColors.primaryDark
      },
    },
    themeToggleButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.circle,
      border: `1px solid ${activeColors.textLight}`,
      backgroundColor: 'transparent',
      color: activeColors.textLight,
      fontSize: '1.2rem',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)'
      }
    },
    audioPlayer: {
      backgroundColor: activeColors.white,
      padding: theme.spacing.md,
      borderTop: `1px solid ${activeColors.lightGray}`,
      boxShadow: theme.shadows.sm,
      zIndex: 999,
      '@media (min-width: 768px)': {
        position: 'sticky',
        top: `calc(${MAIN_HEADER_HEIGHT} + 60px)`,
      },
      '@media (max-width: 768px)': {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme.spacing.sm,
      }
    },
    playerRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
      '@media (min-width: 768px)': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
      }
    },
    playerInfo: {
      flex: 1,
      minWidth: 0,
      '@media (min-width: 768px)': {
        marginRight: theme.spacing.md,
      }
    },
    audioTitle: {
      fontWeight: 600,
      fontSize: '0.95rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: theme.spacing.xs,
    },
    audioSubtitle: {
      fontSize: '0.75rem',
      color: activeColors.gray,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      width: '100%',
      '@media (min-width: 768px)': {
        flex: 2,
      }
    },
    progressBar: {
      flex: 1,
      height: '6px',
      backgroundColor: activeColors.lightGray,
      borderRadius: theme.borderRadius.lg,
      position: 'relative',
      cursor: 'pointer',
    },
    progressFill: {
      height: '100%',
      backgroundColor: activeColors.primary,
      borderRadius: theme.borderRadius.lg,
      position: 'relative'
    },
    progressThumb: {
      position: 'absolute',
      top: '50%',
      right: '-6px',
      transform: 'translateY(-50%)',
      width: '12px',
      height: '12px',
      backgroundColor: activeColors.primary,
      borderRadius: theme.borderRadius.circle,
      boxShadow: theme.shadows.sm,
    },
    timeDisplay: {
      fontSize: '0.75rem',
      color: activeColors.gray,
      minWidth: '40px',
      textAlign: 'center',
    },
    controlsRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: theme.spacing.md,
      }
    },
    controlsGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      '@media (max-width: 768px)': {
        gap: theme.spacing.md,
      }
    },
    controlButton: {
      width: '36px',
      height: '36px',
      borderRadius: theme.borderRadius.circle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      border: 'none',
      color: activeColors.textDark,
      cursor: 'pointer',
      transition: theme.transitions.normal,
      ':hover': {
        backgroundColor: activeColors.lightGray
      },
      ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
      },
    },
    playButton: {
      width: '42px',
      height: '42px',
      backgroundColor: activeColors.primary,
      color: activeColors.textLight,
      ':hover': {
        backgroundColor: activeColors.primaryDark
      },
    },
    volumeControl: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    volumeBar: {
      width: '80px',
      height: '4px',
      backgroundColor: activeColors.lightGray,
      borderRadius: theme.borderRadius.lg,
      position: 'relative',
      cursor: 'pointer',
    },
    volumeFill: {
      height: '100%',
      backgroundColor: activeColors.primary,
      borderRadius: theme.borderRadius.lg
    },
    volumeThumb: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '10px',
      height: '10px',
      backgroundColor: activeColors.primary,
      borderRadius: theme.borderRadius.circle,
    },
    playbackRate: {
      position: 'relative'
    },
    rateButton: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      backgroundColor: activeColors.white,
      border: `1px solid ${activeColors.lightGray}`,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: '0.8rem',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      ':hover': {
        borderColor: activeColors.primary
      },
    },
    rateOptions: {
      position: 'absolute',
      bottom: '100%',
      right: 0,
      backgroundColor: activeColors.white,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.md,
      padding: theme.spacing.sm,
      minWidth: '100px',
      zIndex: 10
    },
    rateOption: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.sm,
      fontSize: '0.8rem',
      cursor: 'pointer',
      transition: theme.transitions.fast,
      ':hover': {
        backgroundColor: activeColors.lightGray
      },
    },
    activeRate: {
      backgroundColor: activeColors.primaryLight,
      color: activeColors.white,
      fontWeight: 600
    },
    mainContent: {
      flex: 1,
      padding: theme.spacing.lg,
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
      backgroundColor: activeColors.light,
      transition: `margin-right ${theme.transitions.normal}`,
      '@media (max-width: 768px)': {
        padding: theme.spacing.md,
        paddingBottom: '100px',
      },
      '@media (min-width: 768px)': {
        paddingTop: `calc(${MAIN_HEADER_HEIGHT} + 24px)`,
      }
    },
    card: {
      backgroundColor: activeColors.white,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.sm,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    lessonHeader: {
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottom: `1px solid ${activeColors.lightGray}`
    },
    lessonTitle: {
      fontSize: '1.75rem',
      fontWeight: 700,
      margin: `0 0 ${theme.spacing.sm} 0`,
      color: activeColors.textDark,
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      margin: `0 0 ${theme.spacing.md} 0`,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      color: activeColors.textDark,
    },
    audioList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm
    },
    audioItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: activeColors.white,
      border: `1px solid ${activeColors.lightGray}`,
      cursor: 'pointer',
      transition: theme.transitions.normal,
      ':hover': {
        borderColor: activeColors.primary
      },
    },
    activeAudioItem: {
      backgroundColor: activeColors.primaryLight,
      borderColor: activeColors.primary,
      color: activeColors.white
    },
    audioItemInfo: {
      flex: 1,
      minWidth: 0,
      marginRight: theme.spacing.md
    },
    audioItemTitle: {
      fontWeight: 500,
      fontSize: '0.95rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: theme.spacing.xs,
    },
    audioItemMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      fontSize: '0.75rem',
      color: activeColors.gray,
    },
    pdfGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: theme.spacing.md,
    },
    pdfCard: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${activeColors.lightGray}`,
      textDecoration: 'none',
      color: activeColors.textDark,
      transition: theme.transitions.normal,
      ':hover': {
        boxShadow: theme.shadows.md,
        borderColor: activeColors.primary
      },
    },
    pdfIcon: {
      padding: theme.spacing.lg,
      backgroundColor: activeColors.lightGray,
      color: activeColors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
    },
    pdfDetails: {
      padding: theme.spacing.md,
      flex: 1,
      minWidth: 0,
    },
    pdfTitle: {
      fontWeight: 500,
      fontSize: '0.9rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: theme.spacing.xs,
    },
    lessonActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      borderTop: `1px solid ${activeColors.lightGray}`
    },
    badge: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      fontWeight: 500,
      fontSize: '0.9rem'
    },
    successBadge: {
      backgroundColor: activeColors.success,
      color: activeColors.white
    },
    button: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.md,
      border: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    primaryButton: {
      backgroundColor: activeColors.primary,
      color: activeColors.white,
      ':hover': {
        backgroundColor: activeColors.primaryDark
      }
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: theme.spacing.xl,
      color: activeColors.gray
    },
    emptyIcon: {
      width: '60px',
      height: '60px',
      borderRadius: theme.borderRadius.circle,
      backgroundColor: activeColors.lightGray,
      color: activeColors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.75rem',
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: activeColors.textDark,
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontSize: '0.95rem',
      maxWidth: '400px',
      lineHeight: 1.5,
      marginBottom: theme.spacing.lg,
    },
    sidebarOverlay: {
      position: 'fixed',
      top: MAIN_HEADER_HEIGHT,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: activeColors.overlay,
      zIndex: 2000,
      transition: `opacity ${theme.transitions.normal}`,
      '@media (max-width: 768px)': {
        top: 0,
      }
    },
    sidebarPanel: {
      position: 'fixed',
      top: MAIN_HEADER_HEIGHT,
      right: 0,
      height: `calc(100vh - ${MAIN_HEADER_HEIGHT})`,
      backgroundColor: activeColors.white,
      boxShadow: theme.shadows.lg,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: `transform ${theme.transitions.normal}`,
      '@media (max-width: 768px)': {
        top: 0,
        height: '100vh',
      }
    },
    sidebarHeader: {
      padding: theme.spacing.lg,
      borderBottom: `1px solid ${activeColors.lightGray}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: activeColors.secondary,
      color: activeColors.textLight,
    },
    sidebarTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      margin: 0,
    },
    sidebarClose: {
      backgroundColor: 'transparent',
      border: 'none',
      color: activeColors.textLight,
      fontSize: '1.25rem',
      cursor: 'pointer',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.circle,
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      },
    },
    sidebarBody: {
      flex: 1,
      overflowY: 'auto',
      padding: theme.spacing.md,
      backgroundColor: activeColors.white,
    },
    chapterItem: {
      padding: theme.spacing.md,
      borderBottom: `1px solid ${activeColors.lightGray}`,
      cursor: 'pointer',
      transition: theme.transitions.normal,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ':hover': {
        backgroundColor: activeColors.lightGray
      },
    },
    activeChapter: {
      backgroundColor: activeColors.primaryLight,
      color: activeColors.white
    },
    chapterTitle: {
      fontWeight: 200,
      fontSize: '1rem',
      margin: 0,
    },
    lessonItem: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderBottom: `1px solid ${activeColors.lightGray}`,
      cursor: 'pointer',
      transition: theme.transitions.normal,
      display: 'flex',
      alignItems: 'center',
      ':hover': {
        backgroundColor: activeColors.lightGray
      },
    },
    activeLesson: {
      backgroundColor: activeColors.primaryLight,
      color: activeColors.white
    },
    lockedLesson: {
      opacity: 0.7,
      cursor: 'not-allowed',
      backgroundColor: activeColors.lightGray,
      ':hover': {
        backgroundColor: activeColors.lightGray
      }
    },
    lessonIcon: {
      fontSize: '1.1rem',
      marginRight: theme.spacing.md,
      color: activeColors.gray,
    },
    activeIcon: {
      color: activeColors.white
    },
    completedIcon: {
      color: activeColors.success
    },
    lockedIcon: {
      color: activeColors.danger
    },
    lessonDetails: {
      flex: 1,
      minWidth: 0
    },
    lessonName: {
      fontWeight: 500,
      fontSize: '0.95rem',
      marginBottom: theme.spacing.xs,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    lessonMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      fontSize: '0.75rem',
      color: activeColors.gray,
    },
    lessonStatus: {
      marginLeft: theme.spacing.md,
      fontSize: '1.1rem',
    },
    examResult: {
      backgroundColor: activeColors.success,
      color: activeColors.white,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
    },
    examStats: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    examStat: {
      flex: '1 1 150px',
    },
    examStatLabel: {
      fontSize: '0.8rem',
      color: activeColors.textLight,
      opacity: 0.9,
      marginBottom: theme.spacing.xs,
    },
    examStatValue: {
      fontSize: '1.2rem',
      fontWeight: 600,
    },
    questionItem: {
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottom: `1px solid ${activeColors.lightGray}`,
    },
    questionHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    questionNumber: {
      backgroundColor: activeColors.primary,
      color: activeColors.white,
      width: '28px',
      height: '28px',
      borderRadius: theme.borderRadius.circle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
      flexShrink: 0,
      fontSize: '0.9rem',
    },
    questionText: {
      margin: 0,
      flex: 1,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: theme.spacing.sm,
      marginLeft: '38px',
    },
    optionItem: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${activeColors.lightGray}`,
      cursor: 'pointer',
      transition: theme.transitions.normal,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      ':hover': {
        borderColor: activeColors.primary,
        backgroundColor: activeColors.lightGray
      },
    },
    selectedOption: {
      backgroundColor: activeColors.primaryLight,
      borderColor: activeColors.primary,
      color: activeColors.white
    },
    optionMarker: {
      width: '24px',
      height: '24px',
      borderRadius: theme.borderRadius.circle,
      backgroundColor: activeColors.lightGray,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.8rem',
      fontWeight: 600,
      color: activeColors.textDark,
      flexShrink: 0,
    },
    selectedMarker: {
      backgroundColor: activeColors.primary,
      color: activeColors.white
    },
    optionText: {
      flex: 1,
      fontSize: '0.9rem',
    },
    questionMeta: {
      fontSize: '0.75rem',
      color: activeColors.gray,
      marginTop: theme.spacing.sm,
      marginLeft: '38px',
    }
  };

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
          const initialExamAnswers = {};
          fetchedChapters.forEach((chapter, cIdx) => {
            if (chapter.exam?.examQuestions) {
              chapter.exam.examQuestions.forEach((_, qIdx) => {
                initialExamAnswers[`${cIdx}-${qIdx}`] = "";
              });
            }
          });
          setExamAnswers(initialExamAnswers);
          if (fetchedChapters.length > 0 && !selectedLesson) {
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
  }, [id, selectedLesson]);

  useEffect(() => {
    const savedProgress = localStorage.getItem(`courseProgress_${id}`);
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setUserProgress({
          completedLessons: parsedProgress.completedLessons || [],
          attemptedExams: parsedProgress.attemptedExams || {},
        });
      } catch (e) {
        console.error("Error parsing progress:", e);
      }
    }
  }, [id]);

  useEffect(() => {
    if (userProgress.completedLessons.length > 0 || Object.keys(userProgress.attemptedExams).length > 0) {
      localStorage.setItem(`courseProgress_${id}`, JSON.stringify(userProgress));
    }
  }, [id, userProgress]);

  useEffect(() => {
    if (!selectedLesson || selectedLesson.type !== 'lesson' || !chapters.length) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setHasUserPressedPlay(false);
      return;
    }
    const lesson = chapters[selectedLesson.chapterIndex]?.lessons[selectedLesson.lessonIndex];
    const audioFiles = lesson?.audioFile;
    if (!audioFiles || audioFiles.length === 0 || !audioFiles[currentAudioFileIndex]?.url) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setHasUserPressedPlay(false);
      return;
    }
    const audioToPlay = audioFiles[currentAudioFileIndex];
    if (!audioRef.current) {
      audioRef.current = new Audio();
      setupAudioListeners(audioRef.current);
    }
    audioRef.current.volume = volume / 100;
    audioRef.current.playbackRate = playbackRate;
    if (audioRef.current.src !== audioToPlay.url) {
      audioRef.current.src = audioToPlay.url;
      audioRef.current.load();
      setHasUserPressedPlay(false);
      setIsPlaying(false);
    }
  }, [selectedLesson, currentAudioFileIndex, chapters, volume, playbackRate]);
  
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  const setupAudioListeners = (audio) => {
    const timeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0 && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const ended = () => {
      setIsPlaying(false);
      if (selectedLesson?.type === 'lesson' && chapters.length) {
        const lesson = chapters[selectedLesson.chapterIndex]?.lessons[selectedLesson.lessonIndex];
        if (lesson?.audioFile && currentAudioFileIndex < lesson.audioFile.length - 1) {
          setCurrentAudioFileIndex(prev => prev + 1);
        } else {
          markLessonComplete(selectedLesson.chapterIndex, selectedLesson.lessonIndex);
        }
      }
    };
    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);
    const error = () => {
      console.error("Audio error:", audio.error);
      setIsPlaying(false);
    };
    audio.addEventListener('timeupdate', timeUpdate);
    audio.addEventListener('loadedmetadata', timeUpdate);
    audio.addEventListener('ended', ended);
    audio.addEventListener('play', play);
    audio.addEventListener('pause', pause);
    audio.addEventListener('error', error);
  };
  
  const playPause = () => {
    if (!audioRef.current || !audioRef.current.src) {
      if (selectedLesson && selectedLesson.type === 'lesson' && chapters.length) {
        const lesson = chapters[selectedLesson.chapterIndex]?.lessons[selectedLesson.lessonIndex];
        const audioFile = lesson?.audioFile?.[currentAudioFileIndex];
        if (audioFile?.url) {
          if (!audioRef.current) {
            audioRef.current = new Audio();
            setupAudioListeners(audioRef.current);
          }
          audioRef.current.src = audioFile.url;
          audioRef.current.volume = volume / 100;
          audioRef.current.playbackRate = playbackRate;
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              setHasUserPressedPlay(true);
            })
            .catch(e => console.error("Play failed:", e));
        }
      }
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasUserPressedPlay(true);
        })
        .catch(e => console.error("Play failed:", e));
    }
  };

  const skipForward = () => {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
  };

  const skipBackward = () => {
    if (!audioRef.current || !duration) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
  };

  const skipToAudio = (index) => {
    if (!selectedLesson || selectedLesson.type !== 'lesson' || !chapters.length) return;
    const lesson = chapters[selectedLesson.chapterIndex]?.lessons[selectedLesson.lessonIndex];
    if (!lesson?.audioFile || index < 0 || index >= lesson.audioFile.length) return;
    setCurrentAudioFileIndex(index);
    setHasUserPressedPlay(false);
    setIsPlaying(false);
  };

  const skipToNextAudio = () => {
    if (!selectedLesson || selectedLesson.type !== 'lesson' || !chapters.length) return;
    const lesson = chapters[selectedLesson.chapterIndex]?.lessons[selectedLesson.lessonIndex];
    if (!lesson?.audioFile) return;
    if (currentAudioFileIndex < lesson.audioFile.length - 1) {
      skipToAudio(currentAudioFileIndex + 1);
    }
  };

  const skipToPrevAudio = () => {
    if (!selectedLesson || selectedLesson.type !== 'lesson' || !chapters.length) return;
    const lesson = chapters[selectedLesson.chapterIndex]?.lessons[selectedLesson.lessonIndex];
    if (!lesson?.audioFile) return;
    if (currentAudioFileIndex > 0) {
      skipToAudio(currentAudioFileIndex - 1);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newTime = (x / rect.width) * duration;
    audioRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
  };

  const handleVolumeSeek = (e) => {
    const bar = volumeBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.round(Math.max(0, Math.min(x / rect.width, 1)) * 100);
    setVolume(newVolume);
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setShowPlaybackOptions(false);
  };

  const markLessonComplete = (chapterIndex, lessonIndex) => {
    const key = `${chapterIndex}-${lessonIndex}`;
    if (userProgress.completedLessons.includes(key)) {
      unlockNextContent(chapterIndex, lessonIndex);
      return;
    }
    setUserProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, key]
    }));
    if (audioRef.current && selectedLesson?.chapterIndex === chapterIndex &&
      selectedLesson.lessonIndex === lessonIndex && selectedLesson?.type === 'lesson') {
      audioRef.current.pause();
    }
    unlockNextContent(chapterIndex, lessonIndex);
  };

  const unlockNextContent = (completedChapterIndex, completedLessonIndex = -1) => {
    if (!chapters || !chapters.length) return;
    const currentChapter = chapters[completedChapterIndex];
    if (!currentChapter) return;
    if (completedLessonIndex !== -1 && completedLessonIndex < currentChapter.lessons.length - 1) {
      handleSelectContent(completedChapterIndex, completedLessonIndex + 1, 'lesson');
      return;
    }
    if (completedLessonIndex === currentChapter.lessons.length - 1 && currentChapter.exam) {
      handleSelectContent(completedChapterIndex, undefined, 'exam');
      return;
    }
    const nextChapterIndex = completedChapterIndex + 1;
    if (nextChapterIndex < chapters.length) {
      const nextChapter = chapters[nextChapterIndex];
      if (nextChapter.lessons?.length > 0) {
        handleSelectContent(nextChapterIndex, 0, 'lesson');
      } else if (nextChapter.exam) {
        handleSelectContent(nextChapterIndex, undefined, 'exam');
      }
      setSelectedChapterIndex(nextChapterIndex);
    }
  };

  const isLessonCompleted = (chapterIndex, lessonIndex) => {
    return userProgress.completedLessons.includes(`${chapterIndex}-${lessonIndex}`);
  };

  const hasAttemptedExam = (chapterIndex) => {
    return userProgress.attemptedExams[chapterIndex]?.attempted || false;
  };

  const getExamResult = (chapterIndex) => {
    return userProgress.attemptedExams[chapterIndex]?.result;
  };

  const isLessonLocked = (chapterIndex, lessonIndex) => {
    if (!chapters || !chapters.length) return true;
    if (chapterIndex === 0 && lessonIndex === 0) return false;
    if (lessonIndex > 0) {
      return !isLessonCompleted(chapterIndex, lessonIndex - 1);
    }
    const prevChapter = chapters[chapterIndex - 1];
    if (!prevChapter) return true;
    if (prevChapter.exam) {
      return !hasAttemptedExam(chapterIndex - 1);
    }
    if (prevChapter.lessons?.length > 0) {
      return !isLessonCompleted(chapterIndex - 1, prevChapter.lessons.length - 1);
    }
    return false;
  };

  const isExamAvailable = (chapterIndex) => {
    if (!chapters || chapterIndex >= chapters.length) return false;
    const chapter = chapters[chapterIndex];
    if (!chapter || !chapter.exam) return false;
    return chapter.lessons?.every((_, lessonIndex) =>
      isLessonCompleted(chapterIndex, lessonIndex)
    ) ?? true;
  };

  const handleAnswerSelect = (questionKey, answer) => {
    const chapterIndex = parseInt(questionKey.split('-')[0]);
    if (submissionStatus?.status === "success" &&
      selectedLesson?.chapterIndex === chapterIndex &&
      !userProgress.attemptedExams[chapterIndex]?.allowRetake) {
      return;
    }
    setExamAnswers(prev => ({ ...prev, [questionKey]: answer }));
  };

  const submitExam = async () => {
    if (!selectedLesson || selectedLesson.type !== 'exam' || !chapters.length) return;
    const chapterIndex = selectedLesson.chapterIndex;
    const chapter = chapters[chapterIndex];
    if (!chapter?.exam?.examQuestions) return;
    const exam = chapter.exam;
    if (exam.examQuestions.some((_, i) => !examAnswers[`${chapterIndex}-${i}`])) {
      setSubmissionStatus({
        status: "error",
        message: `Please answer all ${exam.examQuestions.length} questions.`
      });
      return;
    }
    const payload = exam.examQuestions.map((question, i) => ({
      question: question.question,
      selectedAnswer: examAnswers[`${chapterIndex}-${i}`]
    }));
    try {
      setSubmissionStatus({ status: "submitting" });
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token missing.");
      const response = await fetch("https://learnly-backend-05ix.onrender.com/user/exam/answer-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          examId: exam.examId || exam._id,
          courseId: id,
          chapterTitle: chapter.title,
          answers: payload
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Submission failed.");
      }
      setUserProgress(prev => ({
        ...prev,
        attemptedExams: {
          ...prev.attemptedExams,
          [chapterIndex]: {
            attempted: true,
            score: data.data.obtainedMarks,
            result: data.data
          }
        }
      }));
      setSubmissionStatus({
        status: "success",
        data: data.data
      });
    } catch (err) {
      console.error("Exam submission error:", err);
      setSubmissionStatus({
        status: "error",
        message: err.message
      });
    }
  };

  const handleSelectContent = (chapterIndex, lessonIndex, type) => {
    setSelectedLesson({ chapterIndex, lessonIndex, type });
    if (type === 'lesson') {
      setCurrentAudioFileIndex(0);
      setHasUserPressedPlay(false);
    } else if (type === 'exam') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        setIsPlaying(false);
      }
      setSubmissionStatus(null);
    }
    setIsModalOpen(false);
  };

  const openContentModal = () => {
    setIsModalOpen(true);
    if (selectedLesson && chapters.length > selectedLesson.chapterIndex) {
      setSelectedChapterIndex(selectedLesson.chapterIndex);
    } else if (chapters.length > 0) {
      setSelectedChapterIndex(0);
    }
  };

  const currentChapter = selectedLesson && chapters.length > selectedLesson.chapterIndex ?
    chapters[selectedLesson.chapterIndex] : null;
  const currentLesson = selectedLesson?.type === 'lesson' && currentChapter ?
    currentChapter.lessons?.[selectedLesson.lessonIndex] : null;
  const currentExam = selectedLesson?.type === 'exam' && currentChapter ?
    currentChapter.exam : null;
  const isAudioPlayerVisible = selectedLesson?.type === 'lesson' &&
    currentLesson?.audioFile?.length > 0;
  const audioReady = audioRef.current && duration > 0 && !isNaN(duration) && hasUserPressedPlay;
  const getHeaderTitle = () => {
    if (!selectedLesson || !chapters.length) return "Course Details";
    if (selectedLesson.type === 'lesson') return currentLesson?.lessonname || "Lesson";
   // if (selectedLesson.type === 'exam') return currentExam?.examinationName || "Exam";

  };

  if (loading) {
    return (
      <div style={styles.appContainer}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>Loading...</div>
          <button style={styles.contentButton} disabled>
            <MdMenuBook /> Content
          </button>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 60px)',
          backgroundColor: activeColors.light
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${activeColors.primaryLight}`,
            borderTop: `4px solid ${activeColors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: theme.spacing.md
          }}></div>
          <div style={{ fontSize: '1rem', color: activeColors.gray }}>Loading Course Content...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.appContainer}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>Error</div>
          <button style={styles.contentButton} disabled>
            <MdMenuBook /> Content
          </button>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 60px)',
          padding: theme.spacing.lg,
          textAlign: 'center',
          backgroundColor: activeColors.light
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: activeColors.danger,
            color: activeColors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: theme.spacing.md
          }}>
            !
          </div>
          <h3 style={{ marginBottom: theme.spacing.sm, fontSize: '1.5rem', color: activeColors.textDark }}>
            Error Loading Content
          </h3>
          <p style={{ marginBottom: theme.spacing.lg, color: activeColors.gray, fontSize: '0.95rem' }}>
            {error}
          </p>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.headerButton}
            onClick={() => navigate(-1)}
            title="Go back"
          >
            <FaArrowLeft />
          </button>
          <div style={styles.headerTitle}>{getHeaderTitle()}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
          <button
            style={styles.contentButton}
            onClick={openContentModal}
          >
            <MdMenuBook /> Course Content
          </button>

          <button
            style={styles.themeToggleButton}
            onClick={toggleTheme}
            title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {themeMode === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </div>

      {isAudioPlayerVisible && (
        <div style={styles.audioPlayer}>
          <div style={styles.playerRow}>
            <div style={styles.playerInfo}>
              <div style={styles.audioTitle}>
                {currentLesson.audioFile?.[currentAudioFileIndex]?.name || "Audio Track"}
              </div>
              <div style={styles.audioSubtitle}>
                {currentChapter?.title} • {currentLesson.lessonname}
              </div>
            </div>
            <div style={styles.volumeControl}>
              <button
                style={{ ...styles.controlButton, ...(!audioReady ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                onClick={() => setVolume(v => v > 0 ? 0 : 80)}
                disabled={!audioReady}
                title={volume === 0 ? "Unmute" : "Mute"}
              >
                {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <div
                style={styles.volumeBar}
                ref={volumeBarRef}
                onClick={audioReady ? handleVolumeSeek : undefined}
              >
                <div style={{ ...styles.volumeFill, width: `${volume}%` }}></div>
                {audioReady && (
                  <div style={{ ...styles.volumeThumb, left: `${volume}%` }}></div>
                )}
              </div>
            </div>
          </div>
          <div style={styles.progressContainer}>
            <div style={styles.timeDisplay}>{formatTime(currentTime)}</div>
            <div
              style={styles.progressBar}
              ref={progressBarRef}
              onClick={audioReady ? handleSeek : undefined}
            >
              <div style={{ ...styles.progressFill, width: `${(currentTime / duration) * 100}%` }}>
              </div>

              {audioReady && (
                <div style={{ ...styles.progressThumb, left: `${(currentTime / duration) * 100}%` }}></div>
              )}
            </div>
            <div style={styles.timeDisplay}>{formatTime(duration)}</div>
          </div>
          <div style={styles.controlsRow}>
            <div style={styles.controlsGroup}>
              <button
                style={{ ...styles.controlButton, ...(!audioReady || currentAudioFileIndex === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                onClick={skipToPrevAudio}
                disabled={!audioReady || currentAudioFileIndex === 0}
                title="Previous Track"
              >
                <FaStepBackward />
              </button>
              <button
                style={{ ...styles.controlButton, ...(!audioReady ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                onClick={skipBackward}
                disabled={!audioReady}
                title="Rewind 10s"
              >
                <FaBackward />
              </button>
              <button
                style={{ ...styles.controlButton, ...styles.playButton, ...(!currentLesson.audioFile?.[currentAudioFileIndex]?.url ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                onClick={playPause}
                disabled={!currentLesson.audioFile?.[currentAudioFileIndex]?.url}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                style={{ ...styles.controlButton, ...(!audioReady ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                onClick={skipForward}
                disabled={!audioReady}
                title="Forward 10s"
              >
                <FaForward />
              </button>
              <button
                style={{ ...styles.controlButton, ...(!audioReady || currentAudioFileIndex >= currentLesson.audioFile.length - 1 ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                onClick={skipToNextAudio}
                disabled={!audioReady || currentAudioFileIndex >= currentLesson.audioFile.length - 1}
                title="Next Track"
              >
                <FaStepForward />
              </button>
            </div>
            <div style={styles.playbackRate} ref={playbackOptionsRef}>
              <button
                style={{ ...styles.rateButton, ...(!audioReady ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}
                onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
                disabled={!audioReady}
                title="Playback Speed"
              >
                {playbackRate.toFixed(1)}x <AiOutlineSetting size="0.9em" />
              </button>
              {showPlaybackOptions && audioReady && (
                <div style={styles.rateOptions}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(rate => (
                    <div
                      key={rate}
                      style={{ ...styles.rateOption, ...(playbackRate === rate ? styles.activeRate : {}) }}
                      onClick={() => changePlaybackRate(rate)}
                    >
                      {rate.toFixed(1)}x
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div style={{...styles.mainContent, ...(isModalOpen && !isMobile ? { marginRight: sidebarWidth } : {})}}>
        {!selectedLesson && chapters.length > 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <FaBookOpen />
            </div>
            <h3 style={styles.emptyTitle}>Welcome to the Course!</h3>
            <p style={styles.emptyText}>
              Select "Course Content" in the header to begin exploring chapters and lessons.
            </p>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={openContentModal}
            >
              Open Course Content
            </button>
          </div>
        )}

        {selectedLesson && currentLesson && (
          <div>
            {currentLesson.audioFile?.length > 0 && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>
                  <FaHeadphones /> Audio ({currentLesson.audioFile.length})
                </h2>
                <div style={styles.audioList}>
                  {currentLesson.audioFile.map((audio, i) => (
                    <div
                      key={audio.url || i}
                      style={{ ...styles.audioItem, ...(selectedLesson?.chapterIndex === selectedLesson.chapterIndex && selectedLesson.lessonIndex === selectedLesson.lessonIndex && currentAudioFileIndex === i ? styles.activeAudioItem : {}) }}
                      onClick={() => skipToAudio(i)}
                    >
                      <div style={styles.audioItemInfo}>
                        <div style={styles.audioItemTitle}>{audio.name}</div>
                        <div style={styles.audioItemMeta}>
                          <IoMdTime /> {formatTime(audio.duration || 0)}
                        </div>
                      </div>
                      <div style={{ color: currentAudioFileIndex === i && isPlaying ? activeColors.white : activeColors.primary }}>
                        {selectedLesson?.chapterIndex === selectedLesson.chapterIndex && selectedLesson.lessonIndex === selectedLesson.lessonIndex && currentAudioFileIndex === i && isPlaying ? <FaPause /> : <FaPlay />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentLesson.pdfFile?.length > 0 && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}>
                  <FaFilePdf /> Materials ({currentLesson.pdfFile.length})
                </h2>
                <div style={styles.pdfGrid}>
                  {currentLesson.pdfFile.map((pdf, i) => (
                    <a
                      key={pdf.url || i}
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.pdfCard}
                    >
                      <div style={styles.pdfIcon}>
                        <FaFilePdf />
                      </div>
                      <div style={styles.pdfDetails}>
                        <div style={styles.pdfTitle}>{pdf.name}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div style={styles.lessonActions}>
              {!isLessonCompleted(selectedLesson.chapterIndex, selectedLesson.lessonIndex) ? (
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={() => markLessonComplete(selectedLesson.chapterIndex, selectedLesson.lessonIndex)}
                >
                  Mark as Completed
                </button>
              ) : (
                <div style={{ ...styles.badge, ...styles.successBadge }}>
                  <FaCheckCircle /> Completed
                </div>
              )}
            </div>
          </div>
        )}

        {selectedLesson && currentExam && (
          <div>
            <div style={styles.card}>
              <h1 style={styles.lessonTitle}>{currentExam.examinationName}</h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                <div>
                  <div style={styles.examStatLabel}>Questions</div>
                  <div style={styles.examStatValue}>{currentExam.examQuestions?.length || 0}</div>
                </div>
                <div>
                  <div style={styles.examStatLabel}>Total Marks</div>
                  <div style={styles.examStatValue}>{currentExam.totalMarks}</div>
                </div>
                {currentExam.passMarks != null && (
                  <div>
                    <div style={styles.examStatLabel}>Pass Marks</div>
                    <div style={styles.examStatValue}>{currentExam.passMarks}</div>
                  </div>
                )}
              </div>
            </div>
            {(submissionStatus?.status === "success" || hasAttemptedExam(selectedLesson.chapterIndex)) && (
              <div style={styles.examResult}>
                <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>Exam Result</h2>
                <div style={styles.examStats}>
                  <div style={styles.examStat}>
                    <div style={styles.examStatLabel}>Score</div>
                    <div style={styles.examStatValue}>
                      {(submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).obtainedMarks}/
                      {(submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).totalMarks}
                    </div>
                  </div>
                  <div style={styles.examStat}>
                    <div style={styles.examStatLabel}>Correct</div>
                    <div style={styles.examStatValue}>
                      <FaCheckCircle /> {(submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).correctCount}
                    </div>
                  </div>
                  <div style={styles.examStat}>
                    <div style={styles.examStatLabel}>Status</div>
                    <div style={{
                      ...styles.examStatValue,
                      color: (submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).obtainedMarks >= currentExam.passMarks ?
                        activeColors.white : activeColors.danger
                    }}>
                      {(submissionStatus?.data || getExamResult(selectedLesson.chapterIndex)).obtainedMarks >= currentExam.passMarks ? "Passed" : "Failed"}
                    </div>
                  </div>
                </div>
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={() => unlockNextContent(selectedLesson.chapterIndex, undefined)}
                >
                  Continue to Next
                </button>
              </div>
            )}
            {submissionStatus?.status === 'error' && (
              <div style={{ ...styles.card, backgroundColor: activeColors.danger, color: activeColors.white, borderLeft: `4px solid ${activeColors.danger}` }}>
                <h2 style={{ color: activeColors.white, marginTop: 0, fontSize: '1.25rem' }}>Submission Error</h2>
                <p style={{ color: activeColors.white }}>{submissionStatus.message}</p>
              </div>
            )}
            {(!submissionStatus || submissionStatus?.status === 'error') && currentExam.examQuestions && (
              <div style={styles.card}>
                {!hasAttemptedExam(selectedLesson.chapterIndex) && (
                  <div style={{
                    backgroundColor: activeColors.primaryLight,
                    color: activeColors.white,
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.lg
                  }}>
                    <h2 style={{ color: activeColors.white, marginTop: 0, fontSize: '1.25rem' }}>Ready for the Exam?</h2>
                    <p style={{ color: activeColors.white }}>Please answer all questions below and click "Submit Exam" when you're finished.</p>
                  </div>
                )}
                {currentExam.examQuestions.map((question, i) => {
                  const questionKey = `${selectedLesson.chapterIndex}-${i}`;
                  const answer = examAnswers[questionKey];
                  return (
                    <div key={question._id || i} style={styles.questionItem}>
                      <div style={styles.questionHeader}>
                        <div style={styles.questionNumber}>{i + 1}</div>
                        <h3 style={styles.questionText}>{question.question}</h3>
                      </div>
                      <div style={styles.optionsGrid}>
                        {question.options.map((option, j) => (
                          <div
                            key={j}
                            style={{ ...styles.optionItem, ...(answer === option ? styles.selectedOption : {}) }}
                            onClick={() => handleAnswerSelect(questionKey, option)}
                          >
                            <div style={{ ...styles.optionMarker, ...(answer === option ? styles.selectedMarker : {}) }}>
                              {String.fromCharCode(65 + j)}
                            </div>
                            <div style={styles.optionText}>{option}</div>
                            {answer === option && (
                              <div style={{ color: activeColors.white }}>
                                <BsCheck2All />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div style={styles.questionMeta}>
                        Marks: {question.marks}
                      </div>
                    </div>
                  );
                })}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing.lg }}>
                  <button
                    style={{ ...styles.button, ...styles.primaryButton, ...(submissionStatus?.status === 'submitting' ? { opacity: 0.7 } : {}) }}
                    onClick={submitExam}
                    disabled={submissionStatus?.status === 'submitting'}
                  >
                    {submissionStatus?.status === 'submitting' ? 'Submitting...' : 'Submit Exam'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedLesson && !currentLesson && !currentExam && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <FaBookOpen />
            </div>
            <h3 style={styles.emptyTitle}>Content Not Found</h3>
            <p style={styles.emptyText}>
              The selected content could not be loaded. Please try selecting another item.
            </p>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={openContentModal}
            >
              Select Content
            </button>
          </div>
        )}
        {chapters.length === 0 && !loading && !error && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <FaBookOpen />
            </div>
            <h3 style={styles.emptyTitle}>No Content Available</h3>
            <p style={styles.emptyText}>
              This course doesn't have any content available at the moment.
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          ...styles.sidebarOverlay,
          opacity: isModalOpen ? 1 : 0,
          pointerEvents: isModalOpen ? 'auto' : 'none',
        }}
        onClick={() => setIsModalOpen(false)}
      >
        <div
          ref={modalRef}
          style={{
            ...styles.sidebarPanel,
            width: sidebarWidth,
            transform: isModalOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Course Content</h2>
            <button
              style={styles.sidebarClose}
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div style={styles.sidebarBody}>
            {chapters.map((chapter, cIdx) => (
              <div key={chapter._id || cIdx}>
                <div
                  style={{
                    ...styles.chapterItem,
                    ...(selectedChapterIndex === cIdx ? styles.activeChapter : {})
                  }}
                  onClick={() => setSelectedChapterIndex(cIdx)}
                >
                  <div style={styles.chapterTitle}>
                    Chapter {cIdx + 1}: {chapter.title}
                  </div>
                  <FaChevronRight />
                </div>

                {selectedChapterIndex === cIdx && (
                  <div>
                    {chapter.lessons?.map((lesson, lIdx) => {
                      const locked = isLessonLocked(cIdx, lIdx);
                      const completed = isLessonCompleted(cIdx, lIdx);
                      const isActive = selectedLesson?.type === 'lesson' &&
                        selectedLesson.chapterIndex === cIdx &&
                        selectedLesson.lessonIndex === lIdx;

                      let icon;
                      if (locked) {
                        icon = <FaLock />;
                      } else if (completed) {
                        icon = <FaCheckCircle />;
                      } else if (lesson.audioFile?.length) {
                        icon = <FaHeadphones />;
                      } else if (lesson.pdfFile?.length) {
                        icon = <FaFilePdf />;
                      } else {
                        icon = <FaBookOpen />;
                      }

                      return (
                        <div
                          key={lesson._id || lIdx}
                          style={{
                            ...styles.lessonItem,
                            ...(isActive ? styles.activeLesson : {}),
                            ...(locked ? styles.lockedLesson : {})
                          }}
                          onClick={() => !locked && handleSelectContent(cIdx, lIdx, 'lesson')}
                        >
                          <div style={{ ...styles.lessonIcon, ...(isActive ? styles.activeIcon : {}), ...(completed ? styles.completedIcon : {}), ...(locked ? styles.lockedIcon : {}) }}>
                            {icon}
                          </div>
                          <div style={styles.lessonDetails}>
                            <div style={styles.lessonName}>{lesson.lessonname}</div>
                            <div style={styles.lessonMeta}>
                              {lesson.audioFile?.length > 0 && (
                                <span><FaHeadphones size="0.8em" /> {lesson.audioFile.length}</span>
                              )}
                              {lesson.pdfFile?.length > 0 && (
                                <span><FaFilePdf size="0.8em" /> {lesson.pdfFile.length}</span>
                              )}
                            </div>
                          </div>
                          <div style={styles.lessonStatus}>
                            {completed && !locked && (
                              <FaCheckCircle style={{ color: activeColors.success }} />
                            )}
                            {locked && (
                              <FaLock style={{ color: activeColors.danger }} />
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {chapter.exam && (
                      <div
                        style={{ ...styles.lessonItem, ...(selectedLesson?.type === 'exam' && selectedLesson.chapterIndex === cIdx ? styles.activeLesson : {}), ...(!isExamAvailable(cIdx) && !hasAttemptedExam(cIdx) ? styles.lockedLesson : {}) }}
                        onClick={() => (isExamAvailable(cIdx) || hasAttemptedExam(cIdx)) && handleSelectContent(cIdx, undefined, 'exam')}
                      >
                        <div style={{ ...styles.lessonIcon, color: hasAttemptedExam(cIdx) ? activeColors.success : (!isExamAvailable(cIdx) ? activeColors.danger : activeColors.warning) }}>
                          <FaEdit />
                        </div>
                        <div style={styles.lessonDetails}>
                          <div style={styles.lessonName}>{chapter.exam.examinationName}</div>
                          <div style={styles.lessonMeta}>
                            {chapter.exam.examQuestions?.length || 0} Questions
                          </div>
                        </div>
                        <div style={styles.lessonStatus}>
                          {hasAttemptedExam(cIdx) && (
                            <FaCheckCircle style={{ color: activeColors.success }} />
                          )}
                          {!isExamAvailable(cIdx) && !hasAttemptedExam(cIdx) && (
                            <FaLock style={{ color: activeColors.danger }} />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {chapters.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <FaBookOpen />
                </div>
                <h3 style={styles.emptyTitle}>No Content Available</h3>
                <p style={styles.emptyText}>
                  This course doesn't have any content yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-size: 16px;
          line-height: 1.5;
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${activeColors.light}; }
        ::-webkit-scrollbar-thumb { background: ${activeColors.gray}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${activeColors.dark}; }
        button { cursor: pointer; outline: none; }
        button:disabled { cursor: not-allowed; }
        a { color: ${activeColors.primary}; text-decoration: none; }
        a:hover { text-decoration: none; }
        h1, h2, h3, h4, h5, h6 { margin-top: 0; line-height: 1.2; }
        @media (max-width: 768px) {
          body { font-size: 14px; }
          h1 { font-size: 1.5rem; }
          h2 { font-size: 1.25rem; }
          h3 { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}