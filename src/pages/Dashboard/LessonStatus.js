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
  Stack,
  Skeleton,
  Link,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PurchasedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: 1600, // Increased from 1400
          margin: "0 auto",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
          My Learning
        </Typography>
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2 }}
              />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="text" width="60%" height={24} />
              </Box>
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
        maxWidth: 1600, // Increased from 1400
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        My Learning
      </Typography>

      {courses.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            textAlign: "center",
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "primary.main",
              mb: 2,
            }}
          />
          <Typography variant="h5" sx={{ mb: 1 }}>
            No courses purchased yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
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
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ position: "relative", width: "100%" }}>
                  <CardMedia
                    component="img"
                    height="200" // Increased from 180
                    image={
                      course.thumbnail || "https://via.placeholder.com/400x200"
                    }
                    alt={course.coursename}
                    sx={{
                      width: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
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
                      py: 0.5,
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
                      minHeight: 64,
                    }}
                  >
                    {course.coursename}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    By {course.instructor?.name || "Unknown Instructor"}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <StarIcon
                        sx={{
                          fontSize: 18,
                          color: "#f8b400",
                          mr: 0.5,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        4.5
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon
                        sx={{ fontSize: 18, color: "text.secondary", mr: 0.5 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {`${course.contentduration?.hours || 0}h ${
                          course.contentduration?.minutes || 0
                        }m`}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: "auto",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      ₹{course.price?.finalPrice || "0"}
                    </Typography>
                    <Chip
                      label="Purchased"
                      size="small"
                      sx={{
                        backgroundColor: "success.light",
                        color: "success.dark",
                        fontWeight: 600,
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
