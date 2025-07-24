import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegClock,
  FaUserGraduate,
  FaPlay,
  FaLock,
  FaVideo,
  FaUnlockAlt,
  FaCertificate,
  FaCheckCircle,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

// Material UI Components for Login Modal
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Link as MuiLink,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Toast Notifications
import { toast } from 'react-toastify';

// Auth Components
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

// Auth Context
import { useAuth } from '../../Context/AuthContext';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const muiTheme = useMuiTheme();
  const isMobileQuery = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [course, setCourse] = useState(null);
  const [access, setAccess] = useState("limited");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentVideoTitle, setCurrentVideoTitle] = useState("");
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [currentAudioTitle, setCurrentAudioTitle] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Login Modal States
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // Store action to perform after login

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check for payment completion and refetch data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    
    if (paymentSuccess === 'true' && isLoggedIn) {
      // Payment was successful, refetch course data
      setTimeout(async () => {
        await refetchCourseData();
        toast.success("Payment successful! You now have full access to the course.");
        
        // Force re-render by updating access status
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const res = await fetch(`https://learnly-backend-05ix.onrender.com/courses/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
              const userAccess = data.access || data.data?.userAccess || data.data?.access || data.accessStatus || "full";
              setAccess(userAccess);
              console.log("Payment success - Updated access to:", userAccess);
            }
          } catch (error) {
            console.error("Error updating access after payment:", error);
          }
        }
      }, 500);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        const res = await fetch(`https://learnly-backend-05ix.onrender.com/courses/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        // Handle 401 (Unauthorized) responses gracefully for non-logged-in users
        if (res.status === 401 && !isLoggedIn) {
          console.log("User not logged in - providing limited course preview");
          
          // Create a limited course preview object for non-authenticated users
          // In a real scenario, you'd want to fetch this from a public endpoint
          const limitedCourseData = {
            _id: id,
            coursename: "Course Preview",
            category: "General",
            courseduration: "Duration varies",
            thumbnail: "/default-course.jpg",
            price: {
              amount: 0,
              finalPrice: 0,
              discount: 0
            },
            rating: 0,
            level: "All Levels",
            language: "Multi-language",
            studentEnrollmentCount: 0,
            instructor: "Expert Instructor",
            description: "Please log in to view complete course details and enroll in this course.",
            whatYoullLearn: [
              "Please log in to see detailed learning outcomes",
              "Full course content available after enrollment",
              "Interactive lessons and assessments included"
            ],
            contentduration: {
              hours: 0,
              minutes: 0
            },
            certificates: "yes",
            previewvedio: null
          };
          
          setCourse(limitedCourseData);
          setAccess("limited");
          return;
        }
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success) {
          setCourse(data.data);
          // Ensure access is properly set based on backend response - check multiple possible fields
          const userAccess = data.access || data.data?.userAccess || data.data?.access || data.accessStatus || "limited";
          setAccess(userAccess);
          console.log("Course loaded - Access status:", userAccess, "User logged in:", isLoggedIn, "Raw data:", data); // Debug log
        } else {
          throw new Error(data.message || "Failed to load course.");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        
        // If user is not logged in and we get an error, provide limited preview
        if (!isLoggedIn && (err.message.includes("401") || err.message.includes("Unauthorized"))) {
          console.log("Handling auth error for non-logged-in user - providing course preview");
          
          const limitedCourseData = {
            _id: id,
            coursename: "Course Available - Login to View",
            category: "Various Categories",
            courseduration: "Multiple Duration Options",
            thumbnail: "/default-course.jpg",
            price: {
              amount: 0,
              finalPrice: 0,
              discount: 0
            },
            rating: 4.5,
            level: "All Levels",
            language: "english",
            studentEnrollmentCount: 0,
            instructor: "Expert Instructors",
            description: "This course is available for enrollment. Please log in to view complete details, pricing, and course content. Create an account to access full course information and start your learning journey.",
            whatYoullLearn: [
              "Complete course details available after login",
              "Expert-designed curriculum and content",
              "Interactive learning experience",
              "Certificate upon successful completion"
            ],
            contentduration: {
              hours: 0,
              minutes: 0
            },
            certificates: "yes",
            previewvedio: null
          };
          
          setCourse(limitedCourseData);
          setAccess("limited");
        } else {
          setError(err.message || "Failed to load course. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, isLoggedIn]); // Add isLoggedIn as dependency to refetch when login status changes

  // Additional effect to handle login status changes and ensure proper access updates
  useEffect(() => {
    if (isLoggedIn && course) {
      // User just logged in and we have course data, refetch to get updated access
      const updateAccessOnLogin = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const res = await fetch(`https://learnly-backend-05ix.onrender.com/courses/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
              const userAccess = data.access || data.data?.userAccess || data.data?.access || data.accessStatus || "limited";
              setAccess(userAccess);
              console.log("Login status changed - Updated access to:", userAccess);
              
              // Additional check: if user has purchased/enrolled, ensure they can access content
              if (userAccess === "full" || userAccess === "purchased" || userAccess === "enrolled" || userAccess === "completed") {
                console.log("User has full access - enrollment confirmed");
              }
            }
          }
        } catch (error) {
          console.error("Error updating access on login status change:", error);
        }
      };
      
      updateAccessOnLogin();
    }
  }, [isLoggedIn, course?.coursename]); // Trigger when login status changes and we have course data

  // Login Modal Handlers
  const handleOpenLogin = () => setLoginModalOpen(true);
  const handleCloseLogin = () => {
    setLoginModalOpen(false);
    setPendingAction(null);
  };
  const handleOpenSignup = () => setSignupModalOpen(true);
  const handleCloseSignup = () => {
    setSignupModalOpen(false);
    setPendingAction(null);
  };
  const handleOpenForgotPassword = () => setForgotPasswordModalOpen(true);
  const handleCloseForgotPassword = () => {
    setForgotPasswordModalOpen(false);
    setPendingAction(null);
  };

  const switchToSignup = () => {
    handleCloseLogin();
    handleCloseForgotPassword();
    handleOpenSignup();
  };
  const switchToLogin = () => {
    handleCloseSignup();
    handleCloseForgotPassword();
    handleOpenLogin();
  };
  const switchToForgotPassword = () => {
    handleCloseLogin();
    handleOpenForgotPassword();
  };

  // Function to refetch course data (useful after payment or login)
  const refetchCourseData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://learnly-backend-05ix.onrender.com/courses/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCourse(data.data);
          const userAccess = data.access || data.data?.userAccess || data.data?.access || data.accessStatus || "limited";
          setAccess(userAccess);
          console.log("Course data refetched, new access:", userAccess);
        }
      }
    } catch (err) {
      console.error("Error refetching course data:", err);
    }
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    handleCloseLogin();
    handleCloseSignup();
    toast.success("Login successful!");
    
    // Refetch course data to get updated access status
    setTimeout(async () => {
      await refetchCourseData();
      
      // Check if user already has access after login
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch(`https://learnly-backend-05ix.onrender.com/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            const userAccess = data.access || data.data?.userAccess || data.data?.access || data.accessStatus || "limited";
            if (userAccess === "full" || userAccess === "purchased" || userAccess === "enrolled" || userAccess === "completed") {
              // User already has access, navigate to content
              if (pendingAction === 'enroll' || pendingAction === 'continue') {
                navigate(`/course/${id}/content`);
              }
            } else {
              // User needs to purchase
              if (pendingAction === 'enroll') {
                navigate(`/course/${id}/payment`);
              }
            }
            
            // Handle preview action
            if (pendingAction === 'preview') {
              if (data.data?.previewvedio) {
                setCurrentVideoUrl(data.data.previewvedio);
                setCurrentVideoTitle(`Preview: ${data.data.coursename}`);
                setShowVideoModal(true);
              } else {
                toast.info("Preview video is not available for this course.");
              }
            }
          }
        } catch (error) {
          console.error("Error checking course access after login:", error);
          // Fallback to original pending action logic
          if (pendingAction === 'enroll') {
            navigate(`/course/${id}/payment`);
          } else if (pendingAction === 'continue') {
            navigate(`/course/${id}/content`);
          } else if (pendingAction === 'preview') {
            toast.info("Please try previewing the course again.");
          }
        }
      }
      setPendingAction(null);
    }, 1000);
  };

  // Check authentication before enrollment
  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      setPendingAction('enroll');
      handleOpenLogin();
      return;
    }
    navigate(`/course/${id}/payment`);
  };

  // Check authentication before continuing
  const handleContinueLearning = () => {
    if (!isLoggedIn) {
      setPendingAction('continue');
      handleOpenLogin();
      return;
    }
    
    // Double check access before navigating
    if (hasFullAccess) {
      console.log("Navigating to course content for course:", id);
      navigate(`/course/${id}/content`);
    } else {
      // If somehow user doesn't have access, show enrollment
      console.log("User doesn't have full access, redirecting to payment");
      navigate(`/course/${id}/payment`);
    }
  };

  const toggleChapter = (index) => {
    setExpandedChapter(expandedChapter === index ? null : index);
  };

  const handlePreviewVideo = () => {
    if (!isLoggedIn) {
      // For non-authenticated users, prompt them to login
      setPendingAction('preview');
      handleOpenLogin();
      return;
    }
    
    if (course.previewvedio) {
      setCurrentVideoUrl(course.previewvedio);
      setCurrentVideoTitle(`Preview: ${course.coursename}`);
      setShowVideoModal(true);
    } else {
      toast.info("Preview video will be available after login and enrollment.");
    }
  };

  const handlePlayLessonVideo = (videoFile) => {
    setCurrentVideoUrl(videoFile.url);
    setCurrentVideoTitle(videoFile.name);
    setShowVideoModal(true);
  };

  const handlePlayAudio = (audioFile) => {
    setCurrentAudioUrl(audioFile.url);
    setCurrentAudioTitle(audioFile.name);
    setShowAudioModal(true);
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading course content...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <h2>Error Loading Course</h2>
        <p>{error}</p>
        <Link to="/" className="primary-button">
          Back to Home
        </Link>
      </div>
    );

  if (!course)
    return (
      <div className="not-found-container">
        <h2>Course Not Found</h2>
        <p>
          The course you're looking for doesn't exist or may have been removed.
        </p>
        <Link to="/" className="primary-button">
          Browse Courses
        </Link>
      </div>
    );

  // More robust access checking - includes multiple possible access states
  const hasFullAccess = access === "full" || access === "purchased" || access === "enrolled" || access === "completed";
  const hasLimitedAccess = access === "limited";
  const isEnrolled = hasFullAccess; // User is considered enrolled if they have full access
  
  // Helper function to determine button state
  const getAccessStatus = () => {
    console.log("Access status check:", { isLoggedIn, access, hasFullAccess, isEnrolled }); // Debug log
    
    // If user is not logged in, show login prompt
    if (!isLoggedIn) {
      return { 
        canAccess: false, 
        buttonText: "Login to Enroll", 
        buttonAction: handleEnrollClick,
        showPreview: true 
      };
    }
    
    // If user has full access (enrolled/purchased), show continue learning
    if (hasFullAccess || isEnrolled) {
      return { 
        canAccess: true, 
        buttonText: "Continue Learning", 
        buttonAction: handleContinueLearning,
        showPreview: false 
      };
    }
    
    // Default: user needs to enroll
    return { 
      canAccess: false, 
      buttonText: "Enroll Now", 
      buttonAction: handleEnrollClick,
      showPreview: true 
    };
  };
  
  const accessStatus = getAccessStatus();

  // Safely handle instructor data
  const instructor =
    typeof course.instructor === "object"
      ? course.instructor.name || "Expert Instructor"
      : course.instructor || "Expert Instructor";

  const instructorTitle =
    typeof course.instructor === "object"
      ? course.instructor.role || "Professional Educator"
      : "Professional Educator";

  const instructorAvatar = course.instructorAvatar || "/default-instructor.jpg";

  return (
    <div className="course-page-container">
      {/* Hero Section */}
      <div className="course-hero">
        <div className="course-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/course">Courses</Link> /{" "}
            <span>{course.coursename}</span>
          </div>
          <h1>{course.coursename}</h1>
          <p className="course-subtitle">
            {course.shortDescription ||
              "Master this skill with our comprehensive course"}
          </p>

          <div className="course-meta">
            <div className="meta-item">
              <FaChalkboardTeacher className="meta-icon" />
              <span>{instructor}</span>
            </div>
            {!isMobile && (
              <>
                <div className="meta-item">
                  <FaUserGraduate className="meta-icon" />
                  <span>{course.studentEnrollmentCount || 0}+ students</span>
                </div>
                <div className="meta-item">
                  <FaStar className="meta-icon" />
                  <span>
                    {course.rating?.toFixed(1) || "4.5"} (
                    {course.reviewsCount || 0} reviews)
                  </span>
                </div>
              </>
            )}
            <div className="meta-item">
              <FaRegClock className="meta-icon" />
              <span>
                {course.contentduration?.hours || 0}h{" "}
                {course.contentduration?.minutes || 0}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="course-main-container">
        {/* Left Content */}
        <div className="course-content">
          {/* Course Preview */}
          <div className="course-preview-card">
            {/* Login prompt for non-authenticated users */}
            {!isLoggedIn && (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <p style={{ 
                  color: '#0369a1', 
                  fontSize: '0.95rem', 
                  margin: 0,
                  fontWeight: '500'
                }}>
                  📚 <strong>Login to view complete course details</strong> - Full course information, pricing, and enrollment options available after signing in.
                </p>
              </div>
            )}
            
            <div className="preview-thumbnail" onClick={handlePreviewVideo}>
              <img
                src={course.thumbnail || "/default-course.jpg"}
                alt={course.coursename}
              />
              <div className="play-overlay">
                <FaPlay className="play-icon" />
                <span>{isLoggedIn ? "Preview this course" : "Login to preview course"}</span>
              </div>
            </div>

            <div className="preview-content">
              <h3>What you'll learn</h3>
              <ul className="learning-outcomes">
                {course.learningOutcomes?.map((outcome, index) => (
                  <li key={index}>
                    <FaCheckCircle className="check-icon" />
                    <span>{outcome}</span>
                  </li>
                )) || course.whatYoullLearn?.map((outcome, index) => (
                  <li key={index}>
                    <FaCheckCircle className="check-icon" />
                    <span>{outcome}</span>
                  </li>
                )) || (
                  <>
                    <li>
                      <FaCheckCircle className="check-icon" /> Master key
                      concepts
                    </li>
                    <li>
                      <FaCheckCircle className="check-icon" /> Build practical
                      skills
                    </li>
                    <li>
                      <FaCheckCircle className="check-icon" /> Complete
                      real-world projects
                    </li>
                    <li>
                      <FaCheckCircle className="check-icon" /> Earn a
                      certificate
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Course Description */}
          <div className="course-description-section">
            <h2>Course Description</h2>
            <p>
              {course.description ||
                "This comprehensive course will take you from beginner to advanced level..."}
            </p>

            <div className="description-details">
              <h3>About this course</h3>
              <ul>
                <li>
                  <strong>Skill Level:</strong> {course.level || "All Levels"}
                </li>
                <li>
                  <strong>Language:</strong> {course.language || "English"}
                </li>
                <li>
                  <strong>Certificate:</strong>{" "}
                  {course.certificates === "yes" ? "Included" : "Not Included"}
                </li>
                <li>
                  <strong>Access:</strong>{" "}
                  {hasFullAccess ? "Lifetime" : "Limited"}
                </li>
              </ul>
            </div>
          </div>

          {/* Instructor Section */}
          <div className="instructor-section">
            <h2>About the Instructor</h2>
            <div className="instructor-card">
              <div className="instructor-avatar">
                <img src={instructorAvatar} alt={instructor} />
              </div>
              <div className="instructor-details">
                <h3>{instructor}</h3>
                <p className="instructor-title">{instructorTitle}</p>
                <div className="instructor-stats">
                  <div className="stat-item">
                    <FaStar className="stat-icon" />
                    <span>
                      {course.instructorRating || "4.8"} Instructor Rating
                    </span>
                  </div>
                  <div className="stat-item">
                    <FaUserGraduate className="stat-icon" />
                    <span>
                      {course.instructorStudents || "10,000"}+ Students
                    </span>
                  </div>
                  {!isMobile && (
                    <div className="stat-item">
                      <FaVideo className="stat-icon" />
                      <span>{course.instructorCourses || "15"} Courses</span>
                    </div>
                  )}
                </div>
                <p className="instructor-bio">
                  {typeof course.instructor === "object" &&
                  course.instructor.bio
                    ? course.instructor.bio
                    : "Our instructor has years of experience in this field and has helped thousands of students master these skills."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="course-sidebar">
          <div className="sidebar-card pricing-card">
            {/* Enrollment Status Indicator */}
            {isLoggedIn && hasFullAccess && (
              <div className="enrollment-status">
                <FaCheckCircle className="status-icon enrolled" />
                <span className="status-text">You are enrolled in this course</span>
              </div>
            )}
            
            {course.price?.discount > 0 && isLoggedIn && (
              <div className="price-original">
                <span className="original-price">
                  ₹{course.price.amount?.toFixed(2) || "0.00"}
                </span>
                <span className="discount-badge">
                  {course.price.discount || 0}% OFF
                </span>
              </div>
            )}
            <div className="price-final">
              {!isLoggedIn ? (
                <span style={{ color: '#64748b', fontSize: '1.2rem' }}>
                  Login to View Price
                </span>
              ) : (
                `₹${(course.price?.finalPrice || 0).toFixed(2)}`
              )}
            </div>

            <button
              onClick={accessStatus.buttonAction}
              className="primary-button full-width"
              disabled={loading}
            >
              {loading ? "Loading..." : accessStatus.buttonText}
            </button>

            {course.previewvedio && accessStatus.showPreview && (
              <button
                onClick={handlePreviewVideo}
                className="secondary-button full-width"
              >
                Preview Course
              </button>
            )}



            <div className="includes-list">
              <h4>This course includes:</h4>
              <ul>
                <li>
                  <FaVideo className="include-icon" />
                  <span>
                    {isLoggedIn ? (
                      `${course.contentduration?.hours || 0}h ${course.contentduration?.minutes || 0}m on-demand video`
                    ) : (
                      "Full video content (details available after login)"
                    )}
                  </span>
                </li>
                <li>
                  {hasFullAccess ? (
                    <FaUnlockAlt className="include-icon" />
                  ) : (
                    <FaLock className="include-icon" />
                  )}
                  <span>
                    {hasFullAccess ? "Full lifetime access" : (isLoggedIn ? "Limited preview access" : "Access details available after login")}
                  </span>
                </li>
                {course.certificates === "yes" && (
                  <li>
                    <FaCertificate className="include-icon" />
                    <span>Certificate of completion</span>
                  </li>
                )}
                {course.resourcesCount > 0 && (
                  <li>
                    <FiDownload className="include-icon" />
                    <span>{course.resourcesCount} downloadable resources</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {!hasFullAccess && !isMobile && (
            <div className="sidebar-card gifting-card">
              <h4>Gift this course</h4>
              <p>Give the gift of learning to someone special</p>
              <button className="gift-button">Gift Course</button>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal-overlay">
          <div className="video-modal">
            <div className="modal-header">
              <h4>{currentVideoTitle}</h4>
              <button
                onClick={() => setShowVideoModal(false)}
                className="close-button"
              >
                <IoClose />
              </button>
            </div>
            <div className="modal-content">
              <video
                src={currentVideoUrl}
                controls
                autoPlay
                className="video-player"
              />
            </div>
          </div>
        </div>
      )}

      {/* Audio Modal */}
      {showAudioModal && (
        <div className="modal-overlay">
          <div className="audio-modal">
            <div className="modal-header">
              <h4>{currentAudioTitle}</h4>
              <button
                onClick={() => setShowAudioModal(false)}
                className="close-button"
              >
                <IoClose />
              </button>
            </div>
            <div className="modal-content">
              <audio
                src={currentAudioUrl}
                controls
                autoPlay
                className="audio-player"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating CTA */}
      {isMobile && (
        <div className="mobile-floating-cta">
          <div className="price-container">
            {course.price?.discount > 0 && isLoggedIn && (
              <span className="original-price">
                ₹{course.price.amount?.toFixed(2)}
              </span>
            )}
            <span className="final-price">
              {!isLoggedIn ? "Login to View Price" : `₹${(course.price?.finalPrice || 0).toFixed(2)}`}
            </span>
          </div>
          <button 
            onClick={accessStatus.buttonAction} 
            className="primary-button"
            disabled={loading}
          >
            {loading ? "Loading..." : accessStatus.buttonText}
          </button>
        </div>
      )}

      {/* Login Modal */}
      <Dialog 
        open={loginModalOpen} 
        onClose={handleCloseLogin}
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px', m: 2, maxWidth: '900px' } }}
      >
        <IconButton 
          onClick={handleCloseLogin} 
          sx={{ position: 'absolute', right: 8, top: 8, zIndex: 10, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
          <Box 
            sx={{ 
              width: { xs: '100%', sm: '50%' },
              p: { xs: 3, sm: 4 },
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center' 
            }}
          >
            <LoginForm onLoginSuccess={handleLoginSuccess} onSwitchToForgotPassword={switchToForgotPassword} />
            
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don't have an account?{' '}
              <MuiLink 
                component="button" 
                variant="body2" 
                onClick={switchToSignup} 
                sx={{ fontWeight: 'bold', fontSize: '1rem' }}
              >
                Sign Up
              </MuiLink>
            </Typography>
          </Box>

          <Box 
            sx={{ 
              width: { xs: '100%', sm: '50%' },
              height: { xs: '250px', sm: 'auto' },
            }}
          >
            <Box
              component="img"
              src="/yoga2.jpg"
              alt="Course Learning"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderTopLeftRadius: { xs: '12px', sm: 0 },
                borderTopRightRadius: { xs: '12px', sm: 0 },
              }}
            />
          </Box>
        </Box>
      </Dialog>

      {/* Signup Modal */}
      <Dialog 
        open={signupModalOpen} 
        onClose={handleCloseSignup}
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px', m: 2, maxWidth: '900px' } }}
      >
        <IconButton 
          onClick={handleCloseSignup} 
          sx={{ position: 'absolute', right: 8, top: 8, zIndex: 10, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
          <Box 
            sx={{ 
              width: { xs: '100%', sm: '50%' },
              p: { xs: 3, sm: 4 },
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center' 
            }}
          >
            <RegisterForm onRegisterSuccess={handleLoginSuccess} />
            
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Already have an account?{' '}
              <MuiLink 
                component="button" 
                variant="body2" 
                onClick={switchToLogin} 
                sx={{ fontWeight: 'bold', fontSize: '1rem' }}
              >
                Login
              </MuiLink>
            </Typography>
          </Box>

          <Box 
            sx={{ 
              width: { xs: '100%', sm: '50%' },
              height: { xs: '250px', sm: 'auto' },
            }}
          >
            <Box
              component="img"
              src="/yoga2.jpg"
              alt="Join Learning"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderTopLeftRadius: { xs: '12px', sm: 0 },
                borderTopRightRadius: { xs: '12px', sm: 0 },
              }}
            />
          </Box>
        </Box>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog 
        open={forgotPasswordModalOpen} 
        onClose={handleCloseForgotPassword}
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px', m: 2, maxWidth: '900px' } }}
      >
        <IconButton 
          onClick={handleCloseForgotPassword} 
          sx={{ position: 'absolute', right: 8, top: 8, zIndex: 10, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ p: 4 }}>
          <ForgotPasswordForm onSwitchToLogin={switchToLogin} />
        </Box>
      </Dialog>
    </div>
  );
};

export default CoursePage;

// CSS Styles (should be in a separate file or CSS-in-JS)
const styles = `
  /* Modern CSS Variables */
  :root {
    --primary-color: #2563eb;
    --primary-hover: #1d4ed8;
    --primary-light: #93c5fd;
    --secondary-color: #f8fafc;
    --accent-color: #10b981;
    --accent-hover: #059669;
    --text-color: #1e293b;
    --text-light: #64748b;
    --text-muted: #94a3b8;
    --border-color: #e2e8f0;
    --border-light: #f1f5f9;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    --white: #ffffff;
    --black: #000000;
    --gray-50: #f8fafc;
    --gray-100: #f1f5f9;
    --gray-200: #e2e8f0;
    --gray-800: #1e293b;
    --gray-900: #0f172a;
    --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    --gradient-hero: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    --gradient-card: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
    --radius-xs: 0.125rem;
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.5rem;
    --transition-fast: all 0.15s ease;
    --transition-base: all 0.2s ease;
    --transition-slow: all 0.3s ease;
    --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  }

  /* Global Reset & Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: var(--font-body);
    color: var(--text-color);
    line-height: 1.6;
    background-color: var(--gray-50);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Enhanced Button Styles */
  .primary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--gradient-primary);
    color: var(--white);
    padding: 0.875rem 2rem;
    border-radius: var(--radius-lg);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    text-align: center;
    transition: var(--transition-base);
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .primary-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: var(--transition-slow);
  }

  .primary-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .primary-button:hover:not(:disabled)::before {
    left: 100%;
  }

  .primary-button:active {
    transform: translateY(0);
  }

  .primary-button:disabled {
    background: var(--text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .primary-button.large {
    padding: 1.125rem 2.5rem;
    font-size: 1.1rem;
    border-radius: var(--radius-xl);
  }

  .secondary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: var(--white);
    color: var(--primary-color);
    padding: 0.875rem 2rem;
    border-radius: var(--radius-lg);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    text-align: center;
    transition: var(--transition-base);
    border: 2px solid var(--primary-color);
    cursor: pointer;
    box-shadow: var(--shadow-xs);
  }

  .secondary-button:hover {
    background-color: var(--primary-color);
    color: var(--white);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .full-width {
    width: 100%;
    display: block;
    margin: 0.5rem 0;
  }

  /* Enhanced Loading State */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 3rem;
    text-align: center;
  }

  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid var(--gray-200);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    margin-bottom: 1.5rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-container p {
    color: var(--text-light);
    font-weight: 500;
    font-size: 1.1rem;
  }

  /* Enhanced Error State */
  .error-container, .not-found-container {
    max-width: 600px;
    margin: 3rem auto;
    padding: 3rem 2rem;
    background: var(--white);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-lg);
    text-align: center;
    border-top: 4px solid var(--danger-color);
  }

  .error-container h2, .not-found-container h2 {
    color: var(--danger-color);
    margin-bottom: 1rem;
    font-size: 1.75rem;
    font-weight: 700;
  }

  .error-container p, .not-found-container p {
    color: var(--text-light);
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  /* Course Page Layout */
  .course-page-container {
    max-width: 100%;
    overflow-x: hidden;
    padding-bottom: 100px;
    background: var(--gray-50);
  }

  /* Modern Hero Section */
  .course-hero {
    background: var(--gradient-hero);
    color: var(--white);
    padding: 5rem 2rem 4rem;
    position: relative;
    overflow: hidden;
  }

  .course-hero::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }

  .course-hero-content {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .breadcrumb {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .breadcrumb a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  .breadcrumb a:hover {
    color: var(--white);
    text-decoration: underline;
  }

  .breadcrumb span {
    color: var(--white);
    font-weight: 600;
  }

  .course-hero h1 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .course-subtitle {
    font-size: clamp(1rem, 3vw, 1.375rem);
    max-width: 800px;
    margin-bottom: 2.5rem;
    opacity: 0.95;
    line-height: 1.5;
    font-weight: 400;
  }

  .course-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    margin-top: 2rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
  }

  .meta-icon {
    font-size: 1.1rem;
    opacity: 0.9;
  }

  /* Enhanced Main Content Layout */
  .course-main-container {
    max-width: 1200px;
    margin: -2rem auto 2rem;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 3rem;
    position: relative;
    z-index: 1;
  }

  /* Course Content */
  .course-content {
    background: var(--white);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    border: 1px solid var(--border-light);
  }

  /* Enhanced Preview Card */
  .course-preview-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    padding: 3rem;
    background: var(--gradient-card);
    border-bottom: 1px solid var(--border-light);
  }

  .preview-thumbnail {
    position: relative;
    border-radius: var(--radius-xl);
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 16/9;
    box-shadow: var(--shadow-lg);
    transition: var(--transition-base);
  }

  .preview-thumbnail:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-xl);
  }

  .preview-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition-base);
  }

  .preview-thumbnail:hover img {
    transform: scale(1.05);
  }

  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--white);
    transition: var(--transition-base);
    backdrop-filter: blur(2px);
  }

  .play-overlay:hover {
    background: rgba(0, 0, 0, 0.6);
  }

  .play-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
  }

  .play-overlay span {
    font-weight: 600;
    font-size: 1.1rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  .preview-content h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }

  .learning-outcomes {
    list-style: none;
    display: grid;
    gap: 1rem;
  }

  .learning-outcomes li {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.75rem;
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xs);
    transition: var(--transition-fast);
  }

  .learning-outcomes li:hover {
    transform: translateX(4px);
    box-shadow: var(--shadow-sm);
  }

  .check-icon {
    color: var(--success-color);
    flex-shrink: 0;
    margin-top: 0.125rem;
    font-size: 1.1rem;
  }

  .learning-outcomes span {
    font-weight: 500;
    line-height: 1.5;
  }

  /* Enhanced Course Description */
  .course-description-section {
    padding: 3rem;
    border-bottom: 1px solid var(--border-light);
  }

  .course-description-section h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: var(--text-color);
  }

  .course-description-section p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: var(--text-light);
    margin-bottom: 2rem;
  }

  .description-details {
    margin-top: 2.5rem;
    background: var(--gray-50);
    padding: 2rem;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-light);
  }

  .description-details h3 {
    margin-bottom: 1.5rem;
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .description-details ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .description-details li {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 1rem;
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xs);
  }

  .description-details strong {
    font-weight: 600;
    color: var(--primary-color);
    min-width: 80px;
  }

  /* Curriculum */
  .course-curriculum-section {
    padding: 2rem;
  }

  .course-curriculum-section h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  .curriculum-stats {
    display: flex;
    justify-content: space-between;
    color: var(--text-light);
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }

  .chapter-list {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .chapter-item {
    border-bottom: 1px solid var(--border-color);
  }

  .chapter-item:last-child {
    border-bottom: none;
  }

  .chapter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    background: var(--secondary-color);
    cursor: pointer;
    transition: var(--transition);
  }

  .chapter-header:hover {
    background: #e2e8f0;
  }

  .chapter-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .chapter-number {
    font-weight: 600;
    color: var(--text-light);
  }

  .chapter-title h4 {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .chapter-meta {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-left: 1rem;
  }

  .toggle-icon {
    color: var(--text-light);
  }

  .lesson-list {
    background: var(--white);
  }

  .lesson-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .lesson-item:last-child {
    border-bottom: none;
  }

  .lesson-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-grow: 1;
  }

  .lesson-number {
    color: var(--text-light);
    font-size: 0.9rem;
    min-width: 30px;
  }

  .lesson-content {
    flex-grow: 1;
  }

  .lesson-content h5 {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .lesson-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--text-light);
  }

  .preview-badge {
    background: rgba(16, 185, 129, 0.1);
    color: var(--success-color);
    padding: 0.2rem 0.5rem;
    border-radius: 2rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .lesson-actions {
    display: flex;
    gap: 0.5rem;
  }

  .play-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--white);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
  }

  .play-button:hover {
    background: var(--primary-hover);
    transform: scale(1.1);
  }

  .play-button.locked {
    background: var(--text-light);
    cursor: not-allowed;
  }

  .lock-icon {
    position: absolute;
    font-size: 0.7rem;
    bottom: -2px;
    right: -2px;
    background: var(--white);
    color: var(--text-light);
    border-radius: 50%;
    padding: 2px;
  }

  .resource-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--secondary-color);
    color: var(--text-light);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
  }

  .resource-button:hover {
    background: #e2e8f0;
    color: var(--primary-color);
  }

  .empty-curriculum {
    padding: 2rem;
    text-align: center;
    color: var(--text-light);
  }

  /* Enhanced Instructor Section */
  .instructor-section {
    padding: 3rem;
    background: var(--white);
  }

  .instructor-section h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: var(--text-color);
  }

  .instructor-card {
    display: flex;
    gap: 2.5rem;
    background: var(--gradient-card);
    padding: 2.5rem;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-light);
    box-shadow: var(--shadow-sm);
  }

  .instructor-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: var(--shadow-lg);
    border: 4px solid var(--white);
  }

  .instructor-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .instructor-details {
    flex-grow: 1;
  }

  .instructor-details h3 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }

  .instructor-title {
    color: var(--text-light);
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .instructor-stats {
    display: flex;
    gap: 2rem;
    margin: 1.5rem 0;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xs);
  }

  .stat-icon {
    color: var(--primary-color);
    font-size: 1.1rem;
  }

  .instructor-bio {
    margin-top: 1.5rem;
    line-height: 1.7;
    color: var(--text-light);
    font-size: 1.05rem;
  }

  /* Enhanced Sidebar */
  .course-sidebar {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .sidebar-card {
    background: var(--white);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-lg);
    padding: 2rem;
    border: 1px solid var(--border-light);
    transition: var(--transition-base);
  }

  .sidebar-card:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }

  .pricing-card {
    position: sticky;
    top: 2rem;
    background: var(--gradient-card);
    border: 2px solid var(--primary-light);
  }

  .enrollment-status {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: rgba(16, 185, 129, 0.1);
    border: 2px solid rgba(16, 185, 129, 0.3);
    border-radius: var(--radius-xl);
    margin-bottom: 1.5rem;
  }

  .status-icon.enrolled {
    color: var(--success-color);
    font-size: 1.25rem;
  }

  .status-text {
    font-weight: 600;
    color: var(--success-color);
    font-size: 1rem;
  }

  .price-original {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .original-price {
    text-decoration: line-through;
    color: var(--text-muted);
    font-size: 1.25rem;
    font-weight: 500;
  }

  .discount-badge {
    background: var(--danger-color);
    color: var(--white);
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-lg);
    font-weight: 700;
    box-shadow: var(--shadow-sm);
  }

  .price-final {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .money-back-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.5rem 0;
    font-size: 1rem;
    color: var(--success-color);
    font-weight: 600;
    padding: 1rem;
    background: rgba(16, 185, 129, 0.1);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .badge-icon {
    flex-shrink: 0;
    font-size: 1.25rem;
  }

  .includes-list {
    margin-top: 2rem;
  }

  .includes-list h4 {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-color);
  }

  .includes-list ul {
    list-style: none;
    display: grid;
    gap: 1rem;
  }

  .includes-list li {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.875rem;
    background: var(--gray-50);
    border-radius: var(--radius-lg);
    transition: var(--transition-fast);
  }

  .includes-list li:hover {
    background: var(--gray-100);
    transform: translateX(4px);
  }

  .include-icon {
    color: var(--primary-color);
    flex-shrink: 0;
    font-size: 1.25rem;
  }

  /* Enhanced Gift Card */
  .gifting-card {
    background: var(--gradient-primary);
    color: var(--white);
  }

  .gifting-card h4 {
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .gifting-card p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }

  .gift-button {
    width: 100%;
    padding: 1rem;
    background: var(--white);
    border: none;
    color: var(--primary-color);
    border-radius: var(--radius-lg);
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .gift-button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  /* Enhanced Modals */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(10px);
    padding: 1rem;
  }

  .video-modal, .audio-modal {
    background: var(--white);
    border-radius: var(--radius-2xl);
    width: 100%;
    max-width: 1000px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--border-light);
  }

  .audio-modal {
    max-width: 600px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    border-bottom: 1px solid var(--border-light);
    background: var(--gray-50);
  }

  .modal-header h4 {
    font-weight: 700;
    font-size: 1.25rem;
    margin-right: 1rem;
    color: var(--text-color);
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-muted);
    cursor: pointer;
    transition: var(--transition-fast);
    padding: 0.5rem;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    background: var(--gray-200);
    color: var(--danger-color);
    transform: scale(1.1);
  }

  .modal-content {
    padding: 2rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .video-player {
    width: 100%;
    aspect-ratio: 16/9;
    background: var(--black);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
  }

  .audio-player {
    width: 100%;
    border-radius: var(--radius-lg);
  }

  /* Mobile Floating CTA */
  .mobile-floating-cta {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--white);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .mobile-floating-cta .price-container {
    display: flex;
    flex-direction: column;
  }

  .mobile-floating-cta .original-price {
    text-decoration: line-through;
    color: var(--text-light);
    font-size: 0.9rem;
  }

  .mobile-floating-cta .final-price {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--text-color);
  }

  .mobile-floating-cta .primary-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    flex-shrink: 0;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .course-main-container {
      grid-template-columns: 1fr;
    }
    
    .course-sidebar {
      grid-row: 1;
    }
    
    .course-preview-card {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .course-hero {
      padding: 3rem 1.5rem 2rem;
    }
    
    .course-hero h1 {
      font-size: 2rem;
    }
    
    .course-subtitle {
      font-size: 1.1rem;
    }
    
    .course-meta {
      gap: 1rem;
    }
    
    .course-main-container {
      padding: 0 1rem;
      margin: 1rem auto;
    }
    
    .course-preview-card {
      padding: 1.5rem;
      gap: 1.5rem;
    }
    
    .description-details ul {
      grid-template-columns: 1fr;
    }
    
    .instructor-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.5rem;
      gap: 1.5rem;
    }
    
    .instructor-avatar {
      width: 80px;
      height: 80px;
    }
    
    .instructor-stats {
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }
    
    .sidebar-card {
      padding: 1.25rem;
    }
    
    .price-final {
      font-size: 1.75rem;
    }
    
    .includes-list li {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .course-hero {
      padding: 2.5rem 1rem 1.5rem;
    }
    
    .course-hero h1 {
      font-size: 1.75rem;
    }
    
    .course-subtitle {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .course-meta {
      gap: 0.75rem;
    }
    
    .meta-item {
      font-size: 0.85rem;
    }
    
    .course-description-section,
    .instructor-section {
      padding: 1.5rem 1rem;
    }
    
    .course-description-section h2,
    .instructor-section h2 {
      font-size: 1.5rem;
    }
    
    .description-details {
      padding: 1rem;
    }
    
    .instructor-details h3 {
      font-size: 1.3rem;
    }
    
    .instructor-bio {
      font-size: 0.95rem;
    }
    
    .mobile-floating-cta {
      padding: 0.75rem 1rem;
    }
    
    .mobile-floating-cta .final-price {
      font-size: 1.1rem;
    }
    
    .mobile-floating-cta .primary-button {
      padding: 0.6rem 1.2rem;
      font-size: 0.95rem;
    }
  }
`;

// Inject styles
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);



