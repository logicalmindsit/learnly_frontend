import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaRegClock,
  FaUserGraduate,
  FaPlay,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaVolumeUp,
  FaVideo,
  FaUnlockAlt,
  FaCertificate,
  FaCheckCircle,
  FaChalkboardTeacher
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const CoursePage = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`https://learnly-backend-05ix.onrender.com/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setCourse(data.data);
          setAccess(data.access || "limited");
        } else {
          throw new Error(data.message || "Failed to load course.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleChapter = (index) => {
    setExpandedChapter(expandedChapter === index ? null : index);
  };

  const handlePreviewVideo = () => {
    setCurrentVideoUrl(course.previewvedio);
    setCurrentVideoTitle(`Preview: ${course.coursename}`);
    setShowVideoModal(true);
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

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading course content...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <h2>Error Loading Course</h2>
      <p>{error}</p>
      <Link to="/" className="primary-button">Back to Home</Link>
    </div>
  );
  
  if (!course) return (
    <div className="not-found-container">
      <h2>Course Not Found</h2>
      <p>The course you're looking for doesn't exist or may have been removed.</p>
      <Link to="/" className="primary-button">Browse Courses</Link>
    </div>
  );

  const hasFullAccess = access === "full";

  // Safely handle instructor data
  const instructor = typeof course.instructor === 'object' 
    ? course.instructor.name || "Expert Instructor"
    : course.instructor || "Expert Instructor";

  const instructorTitle = typeof course.instructor === 'object' 
    ? course.instructor.role || "Professional Educator"
    : "Professional Educator";

  const instructorAvatar = course.instructorAvatar || "/default-instructor.jpg";

  return (
    <div className="course-page-container">
      {/* Hero Section */}
      <div className="course-hero">
        <div className="course-hero-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/course">Courses</Link> / <span>{course.coursename}</span>
          </div>
          <h1>{course.coursename}</h1>
          <p className="course-subtitle">{course.shortDescription || "Master this skill with our comprehensive course"}</p>
          
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
                  <span>{course.rating?.toFixed(1) || "4.5"} ({course.reviewsCount || 0} reviews)</span>
                </div>
              </>
            )}
            <div className="meta-item">
              <FaRegClock className="meta-icon" />
              <span>{course.contentduration?.hours || 0}h {course.contentduration?.minutes || 0}m</span>
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
            <div className="preview-thumbnail" onClick={handlePreviewVideo}>
              <img 
                src={course.thumbnail || "/default-course.jpg"} 
                alt={course.coursename} 
              />
              <div className="play-overlay">
                <FaPlay className="play-icon" />
                <span>Preview this course</span>
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
                )) || (
                  <>
                    <li><FaCheckCircle className="check-icon" /> Master key concepts</li>
                    <li><FaCheckCircle className="check-icon" /> Build practical skills</li>
                    <li><FaCheckCircle className="check-icon" /> Complete real-world projects</li>
                    <li><FaCheckCircle className="check-icon" /> Earn a certificate</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Course Description */}
          <div className="course-description-section">
            <h2>Course Description</h2>
            <p>{course.description || "This comprehensive course will take you from beginner to advanced level..."}</p>
            
            <div className="description-details">
              <h3>About this course</h3>
              <ul>
                <li><strong>Skill Level:</strong> {course.level || "All Levels"}</li>
                <li><strong>Language:</strong> {course.language || "English"}</li>
                <li><strong>Certificate:</strong> {course.certificates === "yes" ? "Included" : "Not Included"}</li>
                <li><strong>Access:</strong> {hasFullAccess ? "Lifetime" : "Limited"}</li>
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
                    <span>{course.instructorRating || "4.8"} Instructor Rating</span>
                  </div>
                  <div className="stat-item">
                    <FaUserGraduate className="stat-icon" />
                    <span>{course.instructorStudents || "10,000"}+ Students</span>
                  </div>
                  {!isMobile && (
                    <div className="stat-item">
                      <FaVideo className="stat-icon" />
                      <span>{course.instructorCourses || "15"} Courses</span>
                    </div>
                  )}
                </div>
                <p className="instructor-bio">
                  {typeof course.instructor === 'object' && course.instructor.bio 
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
            {course.price?.discount > 0 && (
              <div className="price-original">
                <span className="original-price">₹{course.price.amount?.toFixed(2) || "0.00"}</span>
                <span className="discount-badge">{course.price.discount || 0}% OFF</span>
              </div>
            )}
            <div className="price-final">₹{(course.price?.finalPrice || 0).toFixed(2)}</div>
            
            {hasFullAccess ? (
              <Link to={`/course/${id}/content`} className="primary-button full-width">
                Continue Learning
              </Link>
            ) : (
              <Link to={`/course/${id}/payment`} className="primary-button full-width">
                Enroll Now
              </Link>
            )}

            {course.previewvedio && (
              <button 
                onClick={handlePreviewVideo} 
                className="secondary-button full-width"
              >
                Preview Course
              </button>
            )}

            <div className="money-back-badge">
              <FaCheckCircle className="badge-icon" />
              <span>30-Day Money-Back Guarantee</span>
            </div>

            <div className="includes-list">
              <h4>This course includes:</h4>
              <ul>
                <li>
                  <FaVideo className="include-icon" />
                  <span>{course.contentduration?.hours || 0}h {course.contentduration?.minutes || 0}m on-demand video</span>
                </li>
                <li>
                  {hasFullAccess ? <FaUnlockAlt className="include-icon" /> : <FaLock className="include-icon" />}
                  <span>{hasFullAccess ? "Full lifetime access" : "Limited access"}</span>
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
              <video src={currentVideoUrl} controls autoPlay className="video-player" />
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
              <audio src={currentAudioUrl} controls autoPlay className="audio-player" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating CTA */}
      {isMobile && (
        <div className="mobile-floating-cta">
          <div className="price-container">
            {course.price?.discount > 0 && (
              <span className="original-price">₹{course.price.amount?.toFixed(2)}</span>
            )}
            <span className="final-price">₹{(course.price?.finalPrice || 0).toFixed(2)}</span>
          </div>
          {hasFullAccess ? (
            <Link to={`/course/${id}/content`} className="primary-button">
              Continue
            </Link>
          ) : (
            <Link to={`/course/${id}/payment`} className="primary-button">
              Enroll Now
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursePage;

// CSS Styles (should be in a separate file or CSS-in-JS)
const styles = `
  /* Base Styles */
  :root {
    --primary-color: #2563eb;
    --primary-hover: #1d4ed8;
    --secondary-color: #f8fafc;
    --text-color: #1e293b;
    --text-light: #64748b;
    --border-color: #e2e8f0;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    --white: #ffffff;
    --black: #000000;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --transition: all 0.2s ease;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: var(--text-color);
    line-height: 1.5;
    background-color: #f8fafc;
  }

  /* Utility Classes */
  .primary-button {
    display: inline-block;
    background-color: var(--primary-color);
    color: var(--white);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    transition: var(--transition);
    border: none;
    cursor: pointer;
  }

  .primary-button:hover {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .primary-button.large {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }

  .secondary-button {
    display: inline-block;
    background-color: transparent;
    color: var(--primary-color);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    transition: var(--transition);
    border: 2px solid var(--primary-color);
    cursor: pointer;
  }

  .secondary-button:hover {
    background-color: rgba(37, 99, 235, 0.1);
    transform: translateY(-1px);
  }

  .full-width {
    width: 100%;
    display: block;
    margin: 0.5rem 0;
  }

  /* Loading State */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: 2rem;
    text-align: center;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(37, 99, 235, 0.1);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Error State */
  .error-container, .not-found-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: var(--white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    text-align: center;
  }

  .error-container h2, .not-found-container h2 {
    color: var(--danger-color);
    margin-bottom: 1rem;
  }

  /* Course Page Layout */
  .course-page-container {
    max-width: 100%;
    overflow-x: hidden;
    padding-bottom: 80px; /* Space for mobile floating CTA */
  }

  /* Hero Section */
  .course-hero {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    color: var(--white);
    padding: 4rem 2rem 3rem;
    position: relative;
    overflow: hidden;
  }

  .course-hero::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40%;
    background: url('/pattern.svg') no-repeat;
    background-size: cover;
    opacity: 0.1;
  }

  .course-hero-content {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .breadcrumb {
    font-size: 0.9rem;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .breadcrumb a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .breadcrumb span {
    color: var(--white);
    font-weight: 600;
  }

  .course-hero h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .course-subtitle {
    font-size: 1.25rem;
    max-width: 700px;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .course-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
  }

  .meta-icon {
    opacity: 0.8;
  }

  /* Main Content Layout */
  .course-main-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
  }

  /* Course Content */
  .course-content {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  /* Preview Card */
  .course-preview-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
    border-bottom: 1px solid var(--border-color);
  }

  .preview-thumbnail {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    aspect-ratio: 16/9;
  }

  .preview-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--white);
    transition: var(--transition);
  }

  .play-overlay:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .play-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .learning-outcomes {
    list-style: none;
  }

  .learning-outcomes li {
    margin-bottom: 0.75rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .check-icon {
    color: var(--success-color);
    flex-shrink: 0;
    margin-top: 0.2rem;
  }

  /* Course Description */
  .course-description-section {
    padding: 2rem;
    border-bottom: 1px solid var(--border-color);
  }

  .course-description-section h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  .description-details {
    margin-top: 2rem;
    background: var(--secondary-color);
    padding: 1.5rem;
    border-radius: var(--radius-md);
  }

  .description-details h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  .description-details ul {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .description-details li {
    display: flex;
    gap: 0.5rem;
  }

  .description-details strong {
    font-weight: 600;
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

  /* Instructor Section */
  .instructor-section {
    padding: 2rem;
    border-top: 1px solid var(--border-color);
  }

  .instructor-section h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  .instructor-card {
    display: flex;
    gap: 2rem;
    background: var(--secondary-color);
    padding: 2rem;
    border-radius: var(--radius-md);
  }

  .instructor-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
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
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  .instructor-title {
    color: var(--text-light);
    margin-bottom: 1rem;
  }

  .instructor-stats {
    display: flex;
    gap: 1.5rem;
    margin: 1rem 0;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .stat-icon {
    color: var(--primary-color);
  }

  .instructor-bio {
    margin-top: 1rem;
    line-height: 1.6;
  }

  /* Sidebar */
  .course-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-card {
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    padding: 1.5rem;
  }

  .pricing-card {
    position: sticky;
    top: 1rem;
  }

  .price-original {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .original-price {
    text-decoration: line-through;
    color: var(--text-light);
  }

  .discount-badge {
    background: var(--danger-color);
    color: var(--white);
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    border-radius: 2rem;
    font-weight: 600;
  }

  .price-final {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  .money-back-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
    font-size: 0.9rem;
    color: var(--success-color);
  }

  .badge-icon {
    flex-shrink: 0;
  }

  .includes-list {
    margin-top: 1.5rem;
  }

  .includes-list h4 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .includes-list ul {
    list-style: none;
  }

  .includes-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }

  .include-icon {
    color: var(--primary-color);
    flex-shrink: 0;
  }

  /* Share Card */
  .share-card h4 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .social-share-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .social-button {
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    border: none;
    color: var(--white);
    font-weight: 500;
    font-size: 0.85rem;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .social-button:hover {
    transform: translateY(-1px);
  }

  .social-button.facebook {
    background: #3b5998;
  }

  .social-button.twitter {
    background: #1da1f2;
  }

  .social-button.linkedin {
    background: #0077b5;
  }

  .social-button.whatsapp {
    background: #25d366;
  }

  /* Gift Card */
  .gifting-card h4 {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .gifting-card p {
    color: var(--text-light);
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .gift-button {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: var(--radius-md);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
  }

  .gift-button:hover {
    background: rgba(37, 99, 235, 0.1);
  }

  /* Modals */
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
    backdrop-filter: blur(5px);
  }

  .video-modal, .audio-modal {
    background: var(--white);
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
  }

  .audio-modal {
    max-width: 500px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }

  .modal-header h4 {
    font-weight: 600;
    margin-right: 1rem;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-light);
    cursor: pointer;
    transition: var(--transition);
    padding: 0.5rem;
    border-radius: 50%;
  }

  .close-button:hover {
    background: var(--secondary-color);
    color: var(--danger-color);
  }

  .modal-content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .video-player {
    width: 100%;
    aspect-ratio: 16/9;
    background: var(--black);
    border-radius: var(--radius-sm);
  }

  .audio-player {
    width: 100%;
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
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);