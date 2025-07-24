
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaStar, FaRegClock, FaPlay, FaUser, FaGraduationCap, FaHeart, FaBookmark } from "react-icons/fa";

// === Enhanced Animations ===
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(25, 118, 210, 0.6);
  }
`;

// === Enhanced Styled Components ===
const CourseGridContainer = styled.div`
  padding: 1.5rem 1rem;
  display: grid;
  gap: 1.25rem;
  max-width: 1400px; /* Increased from 1200px */
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  
  /* Mobile First - Enhanced mobile experience */
  grid-template-columns: 1fr;
  
  /* Small Mobile (375px+) */
  @media (min-width: 375px) {
    padding: 1.75rem 1.25rem;
    gap: 1.5rem;
  }
  
  /* Large Mobile (480px+) */
  @media (min-width: 480px) {
    padding: 2rem 1.5rem;
    gap: 1.75rem;
  }
  
  /* Tablet Portrait (640px+) - 2 columns */
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 2.5rem 2rem;
    gap: 2rem;
  }
  
  /* Tablet Landscape (768px+) */
  @media (min-width: 768px) {
    gap: 2.25rem;
    padding: 3rem 2.5rem;
  }
  
  /* Small Desktop (1024px+) - 3 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    padding: 3.5rem 3rem;
    gap: 2.5rem;
  }
  
  /* Large Desktop (1280px+) - 4 columns */
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem;
  }
  
  /* Extra Large Desktop (1536px+) - 5 columns */
  @media (min-width: 1536px) {
    grid-template-columns: repeat(5, 1fr);
    max-width: 1600px; /* Even more space for larger screens */
  }
  
  /* Ultra Wide (1920px+) - 6 columns */
  @media (min-width: 1920px) {
    grid-template-columns: repeat(6, 1fr);
    max-width: 1800px;
  }
`;

const CourseCard = styled(Link)`
  text-decoration: none;
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${fadeInUp} 0.8s ease-out;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  min-height: 420px;

  /* Mobile optimizations */
  @media (max-width: 639px) {
    min-height: 380px;
    border-radius: 24px;
  }

  &:hover {
    transform: translateY(-16px) scale(1.03);
    box-shadow: 
      0 32px 64px rgba(0, 0, 0, 0.12),
      0 16px 32px rgba(25, 118, 210, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    animation: ${float} 3s ease-in-out infinite;
    
    .thumbnail-overlay {
      opacity: 1;
    }
    
    .play-button {
      transform: scale(1.2);
      animation: ${glow} 2s ease-in-out infinite;
    }
    
    .course-title {
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .action-buttons {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #1976d2, #42a5f5, #90caf9, #e3f2fd);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:before {
    opacity: 1;
  }

  /* Mobile touch optimization */
  @media (max-width: 1023px) {
    &:active {
      transform: scale(0.98);
    }
  }
`;

const Thumbnail = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 24px 24px 0 0;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.6s ease;
    filter: brightness(0.95) contrast(1.1);
    
    @media (max-width: 639px) {
      height: 180px;
    }
    
    @media (min-width: 640px) {
      height: 220px;
    }
    
    @media (min-width: 1024px) {
      height: 200px;
    }
  }

  &:hover img {
    transform: scale(1.15);
    filter: brightness(1.05) contrast(1.2);
  }
`;

const ThumbnailOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.85) 0%,
    rgba(66, 165, 245, 0.7) 50%,
    rgba(144, 202, 249, 0.6) 100%
  );
  opacity: 0;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
`;

const PlayButton = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1976d2;
  font-size: 24px;
  transition: all 0.4s ease;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  
  @media (max-width: 639px) {
    width: 60px;
    height: 60px;
    font-size: 20px;
  }
  
  &:hover {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    transform: scale(1.2);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  color: white;
  padding: 0.6rem 1.2rem;
  font-size: 0.75rem;
  border-radius: 25px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 4px 16px rgba(25, 118, 210, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  
  @media (max-width: 639px) {
    top: 16px;
    left: 16px;
    padding: 0.5rem 1rem;
    font-size: 0.7rem;
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 0.75rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  
  @media (max-width: 639px) {
    top: 16px;
    right: 16px;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 639px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
  
  &:hover {
    background: white;
    color: #1976d2;
    transform: scale(1.1);
  }
`;

const CourseInfo = styled.div`
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  
  @media (max-width: 639px) {
    padding: 1.5rem 1.25rem;
    gap: 0.875rem;
  }
  
  @media (min-width: 640px) and (max-width: 1023px) {
    padding: 1.75rem 1.5rem;
    gap: 0.9375rem;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
  line-height: 1.3;
  transition: all 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.025em;
  
  @media (max-width: 639px) {
    font-size: 1.125rem;
    font-weight: 700;
  }
  
  @media (min-width: 640px) and (max-width: 1023px) {
    font-size: 1.1875rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1.3125rem;
  }
`;

const Instructor = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9375rem;
  color: #64748b;
  font-weight: 600;
  
  svg {
    margin-right: 0.5rem;
    color: #94a3b8;
    font-size: 0.875rem;
  }
  
  @media (max-width: 639px) {
    font-size: 0.875rem;
    
    svg {
      margin-right: 0.4375rem;
      font-size: 0.8125rem;
    }
  }
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: auto;
  
  @media (max-width: 479px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%);
  padding: 0.625rem 1rem;
  border-radius: 25px;
  border: 2px solid rgba(245, 158, 11, 0.2);
  
  svg {
    margin-right: 0.4375rem;
    font-size: 0.8125rem;
  }
  
  @media (max-width: 639px) {
    font-size: 0.8125rem;
    padding: 0.5625rem 0.875rem;
    
    svg {
      margin-right: 0.375rem;
      font-size: 0.75rem;
    }
  }
`;

const Duration = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1976d2;
  padding: 0.625rem 1rem;
  border-radius: 25px;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(66, 165, 245, 0.08) 100%);
  border: 2px solid rgba(25, 118, 210, 0.25);

  svg {
    margin-right: 0.4375rem;
    color: #1976d2;
    font-size: 0.8125rem;
  }
  
  @media (max-width: 639px) {
    font-size: 0.75rem;
    padding: 0.5625rem 0.875rem;
    
    svg {
      margin-right: 0.375rem;
      font-size: 0.75rem;
    }
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 2px solid #e2e8f0;
  
  @media (max-width: 479px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 479px) {
    justify-content: center;
  }
`;

const CurrentPrice = styled.span`
  font-weight: 800;
  font-size: 1.375rem;
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  
  @media (max-width: 639px) {
    font-size: 1.25rem;
  }
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 600;
  
  @media (max-width: 639px) {
    font-size: 0.9375rem;
  }
`;

const DiscountBadge = styled.span`
  background: linear-gradient(135deg, #ef4444 0%, #f87171 50%, #fca5a5 100%);
  color: white;
  padding: 0.4375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  
  @media (max-width: 639px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.6875rem;
  }
`;

const EnrollmentCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  color: #64748b;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 20px;
  font-weight: 600;
  
  svg {
    margin-right: 0.4375rem;
    color: #94a3b8;
    font-size: 0.875rem;
  }
  
  @media (max-width: 639px) {
    font-size: 0.75rem;
    margin-top: 0.625rem;
    padding: 0.4375rem 0.875rem;
  }
`;

// === Enhanced Loading Components ===
const LoadingContainer = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  
  @media (max-width: 639px) {
    padding: 4rem 1.5rem;
    gap: 1.5rem;
  }
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 5px solid #e2e8f0;
  border-top: 5px solid #1976d2;
  border-radius: 50%;
  animation: ${pulse} 1.2s linear infinite;
  
  @media (max-width: 639px) {
    width: 50px;
    height: 50px;
    border-width: 4px;
  }
`;

const LoadingText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(-90deg, #64748b 0%, #1976d2 50%, #64748b 100%);
  background-size: 400% 400%;
  animation: ${shimmer} 2s ease-in-out infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 639px) {
    font-size: 1.125rem;
  }
`;

const EmptyContainer = styled.div`
  padding: 6rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  
  @media (max-width: 639px) {
    padding: 4rem 1.5rem;
    gap: 2rem;
  }
`;

const EmptyIcon = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: #94a3b8;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 639px) {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }
`;

const EmptyText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 0.75rem;
  
  @media (max-width: 639px) {
    font-size: 1.25rem;
  }
`;

const EmptySubtext = styled.div`
  font-size: 1.125rem;
  color: #94a3b8;
  max-width: 500px;
  line-height: 1.6;
  
  @media (max-width: 639px) {
    font-size: 1rem;
    max-width: 400px;
  }
`;

// === Helper Function ===
const formatDuration = (duration) => {
  if (!duration || typeof duration !== 'string') return "N/A";
  
  // Handle the string format from backend: "6 months", "1 year", "2 years"
  const durationStr = duration.trim().toLowerCase();
  
  if (durationStr.includes('month')) {
    const months = parseInt(durationStr);
    return `${months} mo`;
  } else if (durationStr.includes('year')) {
    const years = parseInt(durationStr);
    if (years === 1) {
      return `${years} yr`;
    } else {
      return `${years} yrs`;
    }
  }
  
  // Fallback - return the original string
  return duration;
};

// === Main Component ===
const CourseGrid = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://learnly-backend-05ix.onrender.com/courses/user-view", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data.data || []))
      .catch((err) => console.error("Failed to fetch courses", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading amazing courses for you...</LoadingText>
      </LoadingContainer>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyContainer>
        <EmptyIcon>
          <FaGraduationCap />
        </EmptyIcon>
        <div>
          <EmptyText>No courses available yet</EmptyText>
          <EmptySubtext>
            We're crafting incredible learning experiences just for you. 
            Stay tuned for our amazing courses coming soon!
          </EmptySubtext>
        </div>
      </EmptyContainer>
    );
  }

  return (
    <CourseGridContainer>
      {courses.map((course, index) => (
        <CourseCard 
          to={`/course/${course._id}`} 
          key={course._id}
          style={{
            animationDelay: `${index * 0.15}s`
          }}
        >
          <Thumbnail>
            <img
              src={course.thumbnail || "/default-course.jpg"}
              alt={course.coursename || "Course Thumbnail"}
            />
            <ThumbnailOverlay className="thumbnail-overlay">
              <PlayButton className="play-button">
                <FaPlay />
              </PlayButton>
            </ThumbnailOverlay>
            <Badge>{course.level?.toUpperCase() || "BEGINNER"}</Badge>
            <ActionButtons className="action-buttons">
              <ActionButton>
                <FaHeart />
              </ActionButton>
              <ActionButton>
                <FaBookmark />
              </ActionButton>
            </ActionButtons>
          </Thumbnail>

          <CourseInfo>
            <Title className="course-title">{course.coursename}</Title>
            
            <Instructor>
              <FaUser />
              {course.instructor?.name || "Expert Instructor"}
            </Instructor>

            <MetaInfo>
              <Rating>
                <FaStar />
                {course.rating?.toFixed(1) || "4.5"}
              </Rating>
              
              <Duration>
                <FaRegClock />
                {formatDuration(course?.courseduration)}
              </Duration>
            </MetaInfo>

            {course.studentEnrollmentCount > 0 && (
              <EnrollmentCount>
                <FaGraduationCap />
                {course.studentEnrollmentCount} students enrolled
              </EnrollmentCount>
            )}

            <PriceContainer>
              <PriceInfo>
                <CurrentPrice>₹{course.price?.finalPrice || 0}</CurrentPrice>
                {course.price?.discount > 0 && (
                  <OriginalPrice>₹{course.price.amount}</OriginalPrice>
                )}
              </PriceInfo>
              
              {course.price?.discount > 0 && (
                <DiscountBadge>
                  {course.price.discount}% OFF
                </DiscountBadge>
              )}
            </PriceContainer>
          </CourseInfo>
        </CourseCard>
      ))}
    </CourseGridContainer>
  );
};

export default CourseGrid;
