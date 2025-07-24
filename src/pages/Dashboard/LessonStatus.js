import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Skeleton,
  Link,
  Container,
  IconButton,
  Avatar,
  LinearProgress,
  Fade,
  Zoom,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import { FiArrowLeft, FiBook, FiClock, FiStar, FiUsers } from 'react-icons/fi';

// Modern Design System
const theme = {
  colors: {
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    secondary: '#f59e0b',
    accent: '#10b981',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      muted: '#94a3b8',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    border: '#e2e8f0',
    shadow: 'rgba(15, 23, 42, 0.08)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
    md: '0 4px 6px -1px rgba(15, 23, 42, 0.1)',
    lg: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
    xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1)',
  },
};

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  padding: '1rem',
  [theme.breakpoints.up('md')]: {
    padding: '2rem',
  },
}));

const BackButton = styled(IconButton)(({ theme, ismobile }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: `2px solid ${theme.colors?.border || '#e2e8f0'}`,
  borderRadius: '50%',
  width: ismobile === 'true' ? '48px' : '56px',
  height: ismobile === 'true' ? '48px' : '56px',
  boxShadow: theme.colors?.shadows?.md || '0 4px 6px -1px rgba(15, 23, 42, 0.1)',
  color: theme.colors?.primary || '#2563eb',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: theme.colors?.shadows?.lg || '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
    borderColor: theme.colors?.primary || '#2563eb',
  },
  '&:active': {
    transform: 'translateY(0) scale(1.02)',
  },
}));

const ModernCard = styled(Card)(({ theme, ismobile }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
  borderRadius: theme.colors?.borderRadius?.xl || '1.5rem',
  border: `1px solid ${theme.colors?.border || '#e2e8f0'}`,
  boxShadow: theme.colors?.shadows?.md || '0 4px 6px -1px rgba(15, 23, 42, 0.1)',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.colors?.primary || '#2563eb'} 0%, ${theme.colors?.primaryLight || '#3b82f6'} 100%)`,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.colors?.shadows?.xl || '0 20px 25px -5px rgba(15, 23, 42, 0.1)',
    borderColor: theme.colors?.primary || '#2563eb',
    '&::before': {
      transform: 'scaleX(1)',
    },
  },
  minHeight: ismobile === 'true' ? '380px' : '420px',
}));

const GradientChip = styled(Chip)(({ bgcolor, textcolor }) => ({
  background: bgcolor || 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  color: textcolor || '#ffffff',
  fontWeight: 700,
  fontSize: '0.875rem',
  padding: '0.5rem 1rem',
  borderRadius: '2rem',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
  border: 'none',
  '& .MuiChip-label': {
    padding: '0 0.5rem',
  },
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  backgroundColor: theme.colors?.background?.tertiary || '#f1f5f9',
  borderRadius: theme.colors?.borderRadius?.md || '0.75rem',
  transition: 'all 0.2s ease',
}));

const PurchasedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await axios.get(
          `https://learnly-backend-05ix.onrender.com/user/purchased-courses/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          console.error("Failed to fetch courses:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchPurchasedCourses();
    }
  }, [userId, token]);

  const LoadingSkeleton = () => (
    <StyledContainer maxWidth="xl">
      {/* Header Skeleton */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Skeleton 
          variant="circular" 
          width={isMobile ? 48 : 56} 
          height={isMobile ? 48 : 56}
          sx={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
        />
        <Skeleton 
          variant="text" 
          width={isMobile ? 200 : 300} 
          height={isMobile ? 32 : 40}
          sx={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
        />
      </Box>

      {/* Cards Skeleton */}
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {Array.from({ length: isMobile ? 2 : 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={index}>
            <Zoom in timeout={300 + index * 100}>
              <Card sx={{ 
                borderRadius: theme.borderRadius.xl,
                overflow: 'hidden',
                height: isMobile ? 380 : 420,
                background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
              }}>
                <Skeleton 
                  variant="rectangular" 
                  height={isMobile ? 160 : 200}
                  sx={{ backgroundColor: 'rgba(37, 99, 235, 0.08)' }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1.5, backgroundColor: 'rgba(37, 99, 235, 0.08)' }} />
                  <Skeleton variant="text" width="70%" height={24} sx={{ mb: 2, backgroundColor: 'rgba(37, 99, 235, 0.08)' }} />
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2, backgroundColor: 'rgba(37, 99, 235, 0.08)' }} />
                    <Skeleton variant="rectangular" width={90} height={32} sx={{ borderRadius: 2, backgroundColor: 'rgba(37, 99, 235, 0.08)' }} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Skeleton variant="text" width={80} height={32} sx={{ backgroundColor: 'rgba(37, 99, 235, 0.08)' }} />
                    <Skeleton variant="rectangular" width={100} height={28} sx={{ borderRadius: 2, backgroundColor: 'rgba(37, 99, 235, 0.08)' }} />
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );

  const EmptyState = () => (
    <Fade in timeout={800}>
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: '60vh',
        textAlign: "center",
        px: 2,
        py: 4,
      }}>
        <Box sx={{
          background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.primaryLight}10 100%)`,
          borderRadius: '50%',
          p: 3,
          mb: 3,
        }}>
          <SchoolIcon sx={{ 
            fontSize: isMobile ? 64 : 80, 
            color: theme.colors.primary,
          }} />
        </Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            mb: 2, 
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Start Your Learning Journey
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            maxWidth: 500,
            fontSize: isMobile ? '1rem' : '1.125rem',
            lineHeight: 1.6,
          }}
        >
          Discover amazing courses and unlock your potential. Your purchased courses will appear here once you make your first enrollment.
        </Typography>
      </Box>
    </Fade>
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <StyledContainer maxWidth="xl">
      {/* Enhanced Header */}
      <Fade in timeout={500}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 2, md: 3 }, 
          mb: { xs: 3, md: 5 },
          flexWrap: 'wrap',
        }}>
          <BackButton 
            ismobile={isMobile.toString()}
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <FiArrowLeft size={isMobile ? 20 : 24} />
          </BackButton>
          
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              sx={{ 
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.025em',
                mb: 0.5,
              }}
            >
              My Learning
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: isMobile ? '0.95rem' : '1.125rem',
                fontWeight: 500,
              }}
            >
              Continue your educational journey
            </Typography>
          </Box>
          
          {!isMobile && courses.length > 0 && (
            <GradientChip 
              label={`${courses.length} Course${courses.length !== 1 ? 's' : ''}`}
              icon={<FiBook size={16} />}
            />
          )}
        </Box>
      </Fade>

      {/* Course Progress Bar for Mobile */}
      {isMobile && courses.length > 0 && (
        <Fade in timeout={600}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Learning Progress
              </Typography>
              <GradientChip 
                label={`${courses.length} Courses`}
                size="small"
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={75} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: theme.colors.background.tertiary,
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                  borderRadius: 4,
                }
              }} 
            />
          </Box>
        </Fade>
      )}

      {/* Course Grid */}
      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={course.courseId}>
              <Zoom in timeout={300 + index * 100}>
                <ModernCard 
                  component={Link} 
                  href={`/course/${course.courseId}`}
                  ismobile={isMobile.toString()}
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia 
                      component="img" 
                      height={isMobile ? 160 : 200}
                      image={course.thumbnail || "https://via.placeholder.com/400x200?text=Course+Thumbnail"} 
                      alt={course.coursename}
                      sx={{ 
                        objectFit: "cover",
                        transition: 'transform 0.4s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }} 
                    />
                    
                    {/* Course Level Badge */}
                    <GradientChip 
                      label={course.level?.toUpperCase() || 'INTERMEDIATE'} 
                      size="small"
                      sx={{ 
                        position: "absolute", 
                        top: 12, 
                        left: 12,
                        fontSize: '0.75rem',
                      }} 
                    />
                    
                    {/* Play Button Overlay */}
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '.MuiPaper-root:hover &': {
                        opacity: 1,
                      }
                    }}>
                      <IconButton sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        color: theme.colors.primary,
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 1)',
                          transform: 'scale(1.1)',
                        }
                      }}>
                        <PlayArrowIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ 
                    p: { xs: 2.5, md: 3 }, 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1.5,
                  }}>
                    {/* Course Title */}
                    <Typography 
                      variant={isMobile ? "h6" : "h5"}
                      sx={{ 
                        fontWeight: 700, 
                        display: "-webkit-box", 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: "vertical", 
                        overflow: "hidden",
                        color: theme.colors.text.primary,
                        fontSize: isMobile ? '1.1rem' : '1.25rem',
                        lineHeight: 1.3,
                        minHeight: isMobile ? 56 : 64,
                      }}
                    >
                      {course.coursename}
                    </Typography>
                    
                    {/* Instructor */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: theme.colors.primary }}>
                        <PersonIcon sx={{ fontSize: 14 }} />
                      </Avatar>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: isMobile ? '0.875rem' : '0.95rem',
                          fontWeight: 500,
                        }}
                      >
                        {course.instructor?.name || "Expert Instructor"}
                      </Typography>
                    </Box>
                    
                    {/* Stats Row */}
                    <Box sx={{ 
                      display: "flex", 
                      gap: 1.5,
                      flexWrap: 'wrap',
                    }}>
                      <StatsBox>
                        <FiStar size={14} color={theme.colors.secondary} />
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          4.5
                        </Typography>
                      </StatsBox>
                      
                      <StatsBox>
                        <FiClock size={14} color={theme.colors.text.muted} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {`${course.contentduration?.hours || 0}h ${course.contentduration?.minutes || 0}m`}
                        </Typography>
                      </StatsBox>
                      
                      <StatsBox>
                        <FiUsers size={14} color={theme.colors.accent} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          1.2k
                        </Typography>
                      </StatsBox>
                    </Box>
                    
                    {/* Price and Status */}
                    <Box sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      mt: "auto",
                      pt: 1,
                    }}>
                      <Typography 
                        variant={isMobile ? "h6" : "h5"} 
                        sx={{ 
                          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 800,
                          fontSize: isMobile ? '1.25rem' : '1.375rem',
                        }}
                      >
                        ₹{course.price?.finalPrice || "0"}
                      </Typography>
                      
                      <GradientChip 
                        label="Purchased" 
                        size="small"
                        bgcolor="linear-gradient(135deg, #059669 0%, #10b981 100%)"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </CardContent>
                </ModernCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}
    </StyledContainer>
  );
};

export default PurchasedCourses;