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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FiArrowLeft } from 'react-icons/fi';

const theme = {
  colors: {
    primary: '#0862F7',
    text: '#696984',
    lightBlueBg: '#F0F6FF',
    border: '#E9EAF0',
  },
};

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

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
    borderRadius: '50%',
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.colors.lightBlueBg,
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      transform: 'scale(1.05)'
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box 
            sx={backButtonStyle}
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <FiArrowLeft size={isMobile ? 20 : 24} />
          </Box>
          <Skeleton variant="text" width={150} height={40} />
        </Box>

        <Grid container spacing={4}>
          {Array.from({ length: isMobile ? 2 : 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}>
                <Skeleton 
                  variant="rectangular" 
                  height={200} 
                  sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }} 
                />
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1.5 }} />
                  <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                      <Skeleton variant="text" width={30} height={20} />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                      <Skeleton variant="text" width={50} height={20} />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                    <Skeleton variant="text" width={70} height={28} />
                    <Skeleton variant="text" width={90} height={28} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1600,
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box 
          sx={backButtonStyle}
          onClick={() => window.history.back()}
          aria-label="Go back"
        >
          <FiArrowLeft size={isMobile ? 20 : 24} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "text.primary" }}>
            My Learning
        </Typography>
      </Box>

      {courses.length === 0 ? (
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "60vh", 
          textAlign: "center",
          px: 2
        }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1, fontSize: isMobile ? '1.5rem' : '2rem' }}>
            No courses purchased yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
            Explore our catalog and find your next learning journey!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.courseId}>
              <Card 
                component={Link} 
                href={`/course/${course.courseId}`} 
                sx={{ 
                  textDecoration: "none", 
                  color: "inherit", 
                  borderRadius: 3, 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)", 
                  transition: "transform 0.3s ease, box-shadow 0.3s ease", 
                  "&:hover": { 
                    transform: "translateY(-5px)", 
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)" 
                  }, 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column" 
                }}
              >
                <Box sx={{ position: "relative", width: "100%" }}>
                  <CardMedia 
                    component="img" 
                    height="200" 
                    image={course.thumbnail || "https://via.placeholder.com/400x200"} 
                    alt={course.coursename} 
                    sx={{ 
                      width: "100%", 
                      objectFit: "cover", 
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12
                    }} 
                  />
                  <Chip 
                    label={course.level.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      position: "absolute", 
                      top: 12, 
                      left: 12, 
                      backgroundColor: "primary.main", 
                      color: "white", 
                      fontWeight: 600, 
                      fontSize: "0.7rem", 
                      px: 1.5, 
                      py: 0.5 
                    }} 
                  />
                </Box>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1.5, 
                      display: "-webkit-box", 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: "vertical", 
                      overflow: "hidden", 
                      minHeight: 64 
                    }}
                  >
                    {course.coursename}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    By {course.instructor?.name || "Unknown Instructor"}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <StarIcon sx={{ fontSize: 18, color: "#f8b400", mr: 0.5 }}/>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>4.5</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }}/>
                      <Typography variant="body2" color="text.secondary">
                        {`${course.contentduration?.hours || 0}h ${course.contentduration?.minutes || 0}m`}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto" }}>
                    <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>
                      ₹{course.price?.finalPrice || "0"}
                    </Typography>
                    <Chip 
                      label="Purchased" 
                      size="small" 
                      sx={{ 
                        backgroundColor: "success.light", 
                        color: "success.dark", 
                        fontWeight: 600 
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PurchasedCourses;