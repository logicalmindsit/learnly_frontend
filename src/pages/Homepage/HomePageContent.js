// src/pages/HomePageContent.js
import React from "react";
import { Link } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import {
  FaStar,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookMedical,
  FaHandHoldingHeart,
  FaLeaf,
  FaLaptopCode,
  FaArrowRight,
} from "react-icons/fa";

// --- UPDATED THEME ---
const theme = {
  colors: {
    primary: "#2563EB", // Medium blue
    primaryLight: "#DBEAFE", // Light blue

    secondary: "#10B981", // Vibrant green
    secondaryLight: "#34D399", // Light green

    dark: "#111827", // Dark gray for headings
    text: "#374151", // Body text
    lightText: "#6B7280", // Secondary text

    accent: "#F59E0B", // Yellow for accents
    white: "#FFFFFF",
    border: "#E5E7EB", // Light borders
    background: "#F9FAFB", // Light background
  },
  fonts: {
    primary: "'Inter', sans-serif",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.08)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
  },
  spacing: {
    section: "5rem 1.5rem",
    sectionLg: "7rem 1.5rem",
  },
  radii: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "1rem",
    full: "9999px",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};

// --- GLOBAL STYLES ---
const GlobalContainer = styled.div`
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  background: ${({ theme }) => theme.colors.background};

  h1,
  h2,
  h3,
  h4 {
    color: ${({ theme }) => theme.colors.dark};
    line-height: 1.3;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    margin-bottom: 1.25rem;
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: all 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      opacity: 0.9;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.radii.md};
  }
`;

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.section};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.sectionLg};
  }

  &.bg-light {
    background: ${({ theme }) => theme.colors.white};
  }

  &.bg-primary-light {
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &.bg-green-light {
    background: #ecfdf5;
  }
`;

const Container = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.xl};
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 4rem;
  }
`;

const Eyebrow = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  margin: 0 auto;
  max-width: 700px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.25rem;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;

  &.primary {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: 2px solid ${({ theme }) => theme.colors.primary};

    /* 👇 Remove hover effect by making hover identical to default */
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white};
      border: 2px solid ${({ theme }) => theme.colors.primary};
      opacity: 1;
      transform: none;
      box-shadow: none;
    }
  }

  &.secondary {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
    border: 2px solid ${({ theme }) => theme.colors.secondary};

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }

  &.outline {
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};

    &:hover {
      background: ${({ theme }) => theme.colors.primaryLight};
      transform: translateY(-2px);
    }
  }
`;

// --- HERO SECTION ---
const HeroSection = styled(Section)`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.white};
`;

const HeroGrid = styled.div`
  display: grid;
  gap: 2rem;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
`;

const HeroContent = styled.div`
  text-align: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    text-align: left;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.dark};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const HeroDescription = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.lightText};
  max-width: 600px;
  margin: 0 auto 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: 0 0 2rem;
  }
`;

const HeroImage = styled.div`
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const HeroStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: flex-start;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.dark};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  strong {
    font-weight: 600;
  }
`;

// --- FEATURES SECTION ---
const FeaturesGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FeatureIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    transform: scale(1.1);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.dark};
`;

const FeatureText = styled.p`
  color: ${({ theme }) => theme.colors.lightText};
  font-size: 0.9375rem;
`;

// --- COURSES SECTION ---
const CoursesGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CourseCard = styled(Link)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CourseImage = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${CourseCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CourseContent = styled.div`
  padding: 1.5rem;
`;

const CourseCategory = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.dark};
`;

const CourseInstructor = styled.p`
  color: ${({ theme }) => theme.colors.lightText};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const CourseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CoursePrice = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  &.free {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const CourseRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.lightText};

  svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

// --- CATEGORIES SECTION (CIRCULAR DESIGN) ---
const CategoriesSection = styled(Section)`
  background: #ecfdf5; /* Light green background */
  overflow: hidden;
`;

// CategoryIcon and CategoryTitle BEFORE CategoryCard
const CategoryIcon = styled.div`
  width: 110px; /* Slightly smaller for mobile */
  height: 110px; /* Slightly smaller for mobile */
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 2px solid ${({ theme }) => theme.colors.primaryLight};
  transition: all 0.3s ease;
  
  svg {
    font-size: 2rem; /* Slightly smaller icon */
    color: ${({ theme }) => theme.colors.primary};
    transition: all 0.3s ease;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 140px;
    height: 140px;
    
    svg {
      font-size: 2.5rem;
    }
  }
`;

const CategoryTitle = styled.h3`
 font-size: 1rem; /* Slightly smaller font */
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.colors.dark};
  text-align: center;
  transition: all 0.3s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px; /* Fixed width for mobile cards */
  flex: 0 0 auto; /* Prevent shrinking/growing */
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem;
  
  &:hover {
    transform: translateY(-8px);
    
    ${CategoryIcon} {
      background: ${({ theme }) => theme.colors.primary};
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
      
      svg {
        color: ${({ theme }) => theme.colors.white};
      }
    }
    
    ${CategoryTitle} {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 160px;
    padding: 0;
  }
`;

const CategoryCount = styled.p`
 color: ${({ theme }) => theme.colors.primary};
  font-size: 0.8125rem; /* Slightly smaller font */
  font-weight: 600;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 0.875rem;
  }
`;

const CategoriesContainer = styled.div`
 display: flex;
  flex-wrap: nowrap; /* Prevent wrapping */
  overflow-x: auto; /* Enable horizontal scrolling */
  gap: 1.5rem;
  padding: 1rem 0.5rem 2rem; /* Add padding for scroll area */
  margin-top: 1rem;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome/Safari */
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: wrap;
    justify-content: center;
    overflow-x: visible;
    gap: 2.5rem;
    padding: 0;
    margin-top: 2rem;
  }
`;

// --- COMPONENTS ---
const Hero = () => (
  <HeroSection>
    <Container>
      <HeroGrid>
        <HeroContent>
          <Eyebrow>Transform Your Future</Eyebrow>
          <HeroTitle>
            Master Skills with <Highlight>World-Class</Highlight> Courses
          </HeroTitle>
          <HeroDescription>
            Join thousands of students learning from industry experts. Gain
            practical skills and advance your career.
          </HeroDescription>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Button as={Link} to="/course" className="primary">
              Explore Courses <FaArrowRight />
            </Button>
            <Button as={Link} to="/signup" className="secondary">
              Join Free
            </Button>
          </div>
          <HeroStats>
            <StatItem>
              <FaUserGraduate /> <strong>15K+</strong> Students
            </StatItem>
            <StatItem>
              <FaChalkboardTeacher /> <strong>320+</strong> Instructors
            </StatItem>
            <StatItem>
              <FaStar /> <strong>4.9/5</strong> Avg Rating
            </StatItem>
          </HeroStats>
        </HeroContent>
        <HeroImage>
          <img src="/Siddha.jpg" alt="Learning online" />
        </HeroImage>
      </HeroGrid>
    </Container>
  </HeroSection>
);

const Features = () => (
  <Section className="bg-primary-light">
    <Container>
      <SectionHeader>
        <Eyebrow>Our Approach</Eyebrow>
        <Title>Learn Differently, Learn Better</Title>
      </SectionHeader>
      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>
            <FaChalkboardTeacher />
          </FeatureIcon>
          <FeatureTitle>Expert-Led Learning</FeatureTitle>
          <FeatureText>
            Learn from industry leaders with years of practical experience in
            their fields.
          </FeatureText>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>
            <FaBookMedical />
          </FeatureIcon>
          <FeatureTitle>Practical Curriculum</FeatureTitle>
          <FeatureText>
            Project-based courses designed to build real-world skills you can
            apply immediately.
          </FeatureText>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>
            <FaUserGraduate />
          </FeatureIcon>
          <FeatureTitle>Career Advancement</FeatureTitle>
          <FeatureText>
            Gain certifications and skills that employers value in today's
            competitive job market.
          </FeatureText>
        </FeatureCard>
      </FeaturesGrid>
    </Container>
  </Section>
);

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Siddha Healing Fundamentals",
      category: "Wellness",
      instructor: "Dr. Aruna M.",
      price: "Free",
      rating: 4.8,
      reviews: 135,
      image: "/Siddha.jpg",
    },
    {
      id: 2,
      title: "Varma Kalai Masterclass",
      category: "Energy Medicine",
      instructor: "Master Selvam",
      price: "$89",
      rating: 4.9,
      reviews: 105,
      image: "/y21.jpg",
    },
    {
      id: 3,
      title: "Ayurvedic Nutrition & Lifestyle",
      category: "Holistic Health",
      instructor: "Vaidya Priya S.",
      price: "$59",
      rating: 4.7,
      reviews: 260,
      image: "/ad.png",
    },
  ];

  return (
    <Section className="bg-light">
      <Container>
        <SectionHeader>
          <Eyebrow>Featured Programs</Eyebrow>
          <Title>Most Popular Courses</Title>
        </SectionHeader>
        <CoursesGrid>
          {courses.map((course) => (
            <CourseCard to={`/course`}>
              <CourseImage>
                <img src={course.image} alt={course.title} />
              </CourseImage>
              <CourseContent>
                <CourseCategory>{course.category}</CourseCategory>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseInstructor>By {course.instructor}</CourseInstructor>
                <CourseMeta>
                  <CoursePrice
                    className={course.price === "Free" ? "free" : ""}
                  >
                    {course.price}
                  </CoursePrice>
                  <CourseRating>
                    <FaStar /> {course.rating} ({course.reviews})
                  </CourseRating>
                </CourseMeta>
              </CourseContent>
            </CourseCard>
          ))}
        </CoursesGrid>
      </Container>
    </Section>
  );
};

const Categories = () => {
  const categories = [
    { name: "Siddha", icon: <FaBookMedical />, count: "18", path: "/course" },
    {
      name: "Varma Arts",
      icon: <FaHandHoldingHeart />,
      count: "12",
      path: "/course",
    },
    { name: "Ayurveda", icon: <FaLeaf />, count: "22", path: "/course" },
    { name: "Tech", icon: <FaLaptopCode />, count: "60", path: "/course" },
  ];

  return (
    <CategoriesSection>
      <Container>
        <SectionHeader>
          <Eyebrow>Explore Subjects</Eyebrow>
          <Title>Browse by Category</Title>
        </SectionHeader>
        <CategoriesContainer>
          {categories.map((category) => (
            <CategoryCard key={category.name} to={category.path}>
              <CategoryIcon>{category.icon}</CategoryIcon>
              <CategoryTitle>{category.name}</CategoryTitle>
              <CategoryCount>{category.count}+ Courses</CategoryCount>
            </CategoryCard>
          ))}
        </CategoriesContainer>
      </Container>
    </CategoriesSection>
  );
};

// --- MAIN COMPONENT ---
const HomePageContent = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalContainer>
        <Hero />
        <Features />
        <Courses />
        <Categories />
      </GlobalContainer>
    </ThemeProvider>
  );
};

export default HomePageContent;
