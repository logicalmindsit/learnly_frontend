// // src/pages/HomePageContent.js
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styled, { css, ThemeProvider } from 'styled-components';
// import {
//   FaStar, FaRegFileAlt, FaUniversity, FaUserGraduate, FaRegBuilding,
//   FaRegSun, FaArrowRight, FaArrowLeft, FaPlay, FaCheck, FaPlus, FaMinus
// } from 'react-icons/fa';

// // --- THEME AND BREAKPOINTS ---
// const theme = {
//   colors: {
//     primary: '#0862F7',
//     secondary: '#0A033C',
//     text: '#696984',
//     green: '#22C55E',
//     lightBlueBg: '#F0F6FF',
//     lightGrayBg: '#F7F8FA',
//     white: '#FFFFFF',
//     border: '#E9EAF0',
//     yellow: '#FFC221',
//     darkBlue: '#0A033C',
//     lightText: '#A3A3A3',
//   },
//   font: "'Poppins', sans-serif",
//   shadows: {
//     small: '0 2px 8px rgba(0,0,0,0.1)',
//     medium: '0 4px 12px rgba(0,0,0,0.15)',
//     large: '0 8px 24px rgba(0,0,0,0.2)',
//   },
//   spacing: {
//     section: '6rem',
//     sectionMobile: '3rem',
//     component: '2rem',
//   },
//   transitions: {
//     default: 'all 0.3s ease-in-out',
//     fast: 'all 0.15s ease-in-out',
//   },
// };

// const breakpoints = {
//   xs: '400px',
//   sm: '576px',
//   md: '768px',
//   lg: '992px',
//   xl: '1200px',
//   xxl: '1400px',
// };

// const media = Object.keys(breakpoints).reduce((acc, label) => {
//   acc[label] = (...args) => css`
//     @media (max-width: ${breakpoints[label]}) {
//       ${css(...args)}
//     }
//   `;
//   return acc;
// }, {});

// // --- GLOBAL STYLES ---
// const GlobalContainer = styled.div`
//   font-family: ${({ theme }) => theme.font};
//   color: ${({ theme }) => theme.colors.text};
//   line-height: 1.6;
//   overflow-x: hidden;
  
//   * {
//     box-sizing: border-box;
//     margin: 0;
//     padding: 0;
//   }
  
//   h1, h2, h3, h4, h5, h6 {
//     color: ${({ theme }) => theme.colors.secondary};
//     line-height: 1.2;
//     margin-bottom: 1rem;
//   }
  
//   p {
//     margin-bottom: 1rem;
//   }
  
//   img {
//     max-width: 100%;
//     height: auto;
//     display: block;
//   }
// `;

// const SectionWrapper = styled.section`
//   padding: ${({ theme }) => theme.spacing.section} 5%;
//   position: relative;
  
//   ${media.lg} {
//     padding: ${({ theme }) => theme.spacing.sectionMobile} 5%;
//   }
  
//   ${media.sm} {
//     padding: ${({ theme }) => theme.spacing.sectionMobile} 1.5rem;
//   }
// `;

// const Container = styled.div`
//   max-width: 1280px;
//   margin: 0 auto;
//   width: 100%;
//   padding: 0 1rem;
// `;

// const SectionHeader = styled.div`
//   text-align: center;
//   margin-bottom: 3rem;
  
//   ${media.md} {
//     margin-bottom: 2rem;
//   }
// `;

// const SectionSubtitle = styled.p`
//   color: ${({ theme }) => theme.colors.text};
//   font-weight: 500;
//   font-size: 0.875rem;
//   letter-spacing: 1px;
//   text-transform: uppercase;
//   margin-bottom: 0.75rem;
// `;

// const SectionTitle = styled.h2`
//   font-size: 2.5rem;
//   font-weight: 700;
//   margin: 0;
  
//   ${media.md} {
//     font-size: 2rem;
//   }
  
//   ${media.sm} {
//     font-size: 1.75rem;
//   }
// `;

// const Highlight = styled.span`
//   color: ${({ theme, color }) =>
//     color === 'blue' ? theme.colors.primary :
//     color === 'green' ? theme.colors.green :
//     theme.colors.secondary};
// `;

// const Button = styled.button`
//   background-color: ${({ theme, variant }) =>
//     variant === 'primary' ? theme.colors.primary :
//     variant === 'outline' ? 'transparent' :
//     theme.colors.white};
//   color: ${({ theme, variant }) =>
//     variant === 'primary' ? theme.colors.white :
//     variant === 'outline' ? theme.colors.primary :
//     theme.colors.secondary};
//   padding: ${({ size }) =>
//     size === 'lg' ? '1.125rem 2rem' :
//     size === 'sm' ? '0.5rem 1rem' :
//     '0.75rem 1.5rem'};
//   border-radius: 0.5rem;
//   border: ${({ theme, variant }) =>
//     variant === 'outline' ? `1px solid ${theme.colors.primary}` :
//     `1px solid ${theme.colors.border}`};
//   font-weight: 600;
//   font-size: ${({ size }) =>
//     size === 'lg' ? '1rem' :
//     size === 'sm' ? '0.875rem' :
//     '0.9375rem'};
//   cursor: pointer;
//   transition: ${({ theme }) => theme.transitions.default};
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.5rem;
//   white-space: nowrap;
  
//   &:hover {
//     background-color: ${({ theme, variant }) =>
//       variant === 'primary' ? '#0753d0' :
//       variant === 'outline' ? theme.colors.lightBlueBg :
//       theme.colors.lightGrayBg};
//     transform: translateY(-2px);
//     box-shadow: ${({ theme }) => theme.shadows.small};
//   }
  
//   &:active {
//     transform: translateY(0);
//   }
  
//   ${media.sm} {
//     width: ${({ fullWidthMobile }) => fullWidthMobile ? '100%' : 'auto'};
//     white-space: ${({ fullWidthMobile }) => fullWidthMobile ? 'normal' : 'nowrap'};
//   }
// `;

// // --- HERO SECTION ---
// const HeroSection = styled(SectionWrapper)`
//   background-color: ${({ theme }) => theme.colors.white};
//   padding-top: 5rem;
//   padding-bottom: 5rem;
  
//   ${media.md} {
//     padding-top: 3rem;
//     padding-bottom: 3rem;
//   }
// `;

// const HeroContainer = styled(Container)`
//   display: flex;
//   align-items: center;
//   gap: 3rem;
  
//   ${media.lg} {
//     flex-direction: column;
//     gap: 2rem;
//     text-align: center;
//   }
// `;

// const HeroContent = styled.div`
//   flex: 1;
//   max-width: 600px;
  
//   ${media.lg} {
//     max-width: 100%;
//     text-align: center;
//   }
// `;

// const HeroImageContainer = styled.div`
//   flex: 1;
//   position: relative;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 400px;
  
//   ${media.lg} {
//     min-height: auto;
//     width: 100%;
//   }
// `;

// const HeroSpecialDeal = styled.p`
//   color: ${({ theme }) => theme.colors.text};
//   font-weight: 600;
//   font-size: 0.875rem;
//   letter-spacing: 1px;
//   text-transform: uppercase;
//   margin-bottom: 1rem;
// `;

// const HeroTitle = styled.h1`
//   font-size: 3.5rem;
//   font-weight: 700;
//   margin-bottom: 1.5rem;
//   line-height: 1.2;
  
//   ${media.xl} {
//     font-size: 3rem;
//   }
  
//   ${media.lg} {
//     font-size: 2.5rem;
//   }
  
//   ${media.md} {
//     font-size: 2.25rem;
//   }
  
//   ${media.sm} {
//     font-size: 2rem;
//   }
// `;

// const HeroImageBackground = styled.div`
//   position: absolute;
//   width: 80%;
//   height: 80%;
//   background-color: ${({ theme }) => theme.colors.lightBlueBg};
//   border-radius: 1.25rem;
//   z-index: 1;
  
//   ${media.lg} {
//     width: 90%;
//     height: 90%;
//   }
// `;

// const HeroMainImage = styled.img`
//   width: 75%;
//   border-radius: 1.25rem;
//   position: relative;
//   z-index: 2;
//   box-shadow: ${({ theme }) => theme.shadows.large};
  
//   ${media.lg} {
//     width: 90%;
//   }
  
//   ${media.md} {
//     width: 100%;
//   }
// `;

// const HeroRatingCard = styled.div`
//   position: absolute;
//   bottom: 2.5rem;
//   left: 1.25rem;
//   background-color: ${({ theme }) => theme.colors.white};
//   padding: 1rem 1.25rem;
//   border-radius: 0.625rem;
//   box-shadow: ${({ theme }) => theme.shadows.medium};
//   z-index: 3;
//   display: flex;
//   align-items: center;
//   gap: 1rem;
  
//   ${media.md} {
//     position: static;
//     margin: 1.5rem auto 0;
//     box-shadow: none;
//     border: 1px solid ${({ theme }) => theme.colors.border};
//     width: fit-content;
//   }
// `;

// const HeroRatingScore = styled.div`
//   background-color: ${({ theme }) => theme.colors.yellow};
//   color: ${({ theme }) => theme.colors.secondary};
//   padding: 0.625rem;
//   border-radius: 0.5rem;
//   font-weight: 700;
//   font-size: 1.125rem;
// `;

// const HeroRatingText = styled.div`
//   line-height: 1.4;
// `;

// const HeroRatingLabel = styled.p`
//   font-weight: 600;
//   color: ${({ theme }) => theme.colors.secondary};
//   margin: 0;
//   font-size: 1rem;
// `;

// const HeroRatingReviews = styled.p`
//   color: ${({ theme }) => theme.colors.text};
//   font-size: 0.875rem;
//   margin: 0;
// `;

// const HeroDots = styled.div`
//   position: absolute;
//   bottom: -2.5rem;
//   left: 50%;
//   transform: translateX(-50%);
//   color: ${({ theme }) => theme.colors.yellow};
//   letter-spacing: 0.5rem;
//   font-size: 1.25rem;
//   opacity: 0.5;
  
//   ${media.md} {
//     display: none;
//   }
// `;

// const HeroComponent = () => {
//   return (
//     <HeroSection>
//       <HeroContainer>
//         <HeroContent>
//           <HeroSpecialDeal>Special deal for users</HeroSpecialDeal>
//           <HeroTitle>
//             Enjoy over <Highlight color="blue">1.2K courses</Highlight> for creatives for <Highlight color="green">free</Highlight>
//           </HeroTitle>
//           <Button variant="primary" size="lg" fullWidthMobile>Explore Course Packages</Button>
//         </HeroContent>
//         <HeroImageContainer>
//           <HeroImageBackground />
//           <HeroMainImage src="/y20.jpg" alt="Happy student" />
//           <HeroRatingCard>
//             <HeroRatingScore>4.85</HeroRatingScore>
//             <HeroRatingText>
//               <HeroRatingLabel>Average Rating</HeroRatingLabel>
//               <HeroRatingReviews>183,406 Learner reviews</HeroRatingReviews>
//             </HeroRatingText>
//           </HeroRatingCard>
//           <HeroDots> • • • • • • • • • • </HeroDots>
//         </HeroImageContainer>
//       </HeroContainer>
//     </HeroSection>
//   );
// };

// // --- FEATURES SECTION ---
// const FeaturesSection = styled(SectionWrapper)`
//   background-color: ${({ theme }) => theme.colors.lightGrayBg};
// `;

// const FeaturesContainer = styled(Container)`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//   gap: 2rem;
  
//   ${media.sm} {
//     grid-template-columns: 1fr;
//   }
// `;

// const FeatureItem = styled.div`
//   display: flex;
//   align-items: flex-start;
//   gap: 1.5rem;
//   background-color: ${({ theme }) => theme.colors.white};
//   padding: 2rem;
//   border-radius: 1rem;
//   box-shadow: ${({ theme }) => theme.shadows.small};
//   transition: ${({ theme }) => theme.transitions.default};
  
//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: ${({ theme }) => theme.shadows.medium};
//   }
  
//   ${media.sm} {
//     flex-direction: column;
//     align-items: center;
//     text-align: center;
//   }
// `;

// const FeatureIcon = styled.div`
//   min-width: 4.375rem;
//   height: 4.375rem;
//   border-radius: 50%;
//   background-color: ${({ theme }) => theme.colors.white};
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: ${({ theme }) => theme.colors.primary};
//   font-size: 1.75rem;
//   box-shadow: ${({ theme }) => theme.shadows.small};
//   flex-shrink: 0;
// `;

// const FeatureContent = styled.div``;

// const FeatureTitle = styled.h3`
//   font-size: 1.25rem;
//   font-weight: 600;
//   margin-bottom: 0.5rem;
// `;

// const FeatureDescription = styled.p`
//   color: ${({ theme }) => theme.colors.text};
//   font-size: 0.9375rem;
//   line-height: 1.6;
// `;

// const FeaturesComponent = () => {
//   const featureData = [
//     { icon: <FaRegFileAlt />, title: "Short courses", description: "Acquire new abilities at your own pace with our flexible online courses." },
//     { icon: <FaRegBuilding />, title: "ExpertTracks", description: "Elevate your expertise with a curated series of specialized courses." },
//     { icon: <FaRegSun />, title: "Microcredentials", description: "Achieve recognized professional or academic credentials." },
//   ];
  
//   return (
//     <FeaturesSection>
//       <Container>
//         <SectionHeader>
//           <SectionSubtitle>Features</SectionSubtitle>
//           <SectionTitle>Why Choose <Highlight color="blue">Us</Highlight></SectionTitle>
//         </SectionHeader>
//         <FeaturesContainer>
//           {featureData.map((feature, index) => (
//             <FeatureItem key={index}>
//               <FeatureIcon>{feature.icon}</FeatureIcon>
//               <FeatureContent>
//                 <FeatureTitle>{feature.title}</FeatureTitle>
//                 <FeatureDescription>{feature.description}</FeatureDescription>
//               </FeatureContent>
//             </FeatureItem>
//           ))}
//         </FeaturesContainer>
//       </Container>
//     </FeaturesSection>
//   );
// };

// // --- COURSES SECTION ---
// const CoursesSection = styled(SectionWrapper)`
//   background-color: ${({ theme }) => theme.colors.white};
// `;

// const CoursesGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//   gap: 1.5rem;
//   margin-top: 2rem;
  
//   ${media.sm} {
//     grid-template-columns: 1fr;
//   }
// `;

// const CourseCard = styled.div`
//   background-color: ${({ theme }) => theme.colors.white};
//   border-radius: 0.9375rem;
//   overflow: hidden;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   transition: ${({ theme }) => theme.transitions.default};
//   cursor: pointer;
//   position: relative;
  
//   &:hover {
//     transform: translateY(-0.5rem);
//     box-shadow: ${({ theme }) => theme.shadows.large};
//   }
// `;

// const CourseImageContainer = styled.div`
//   position: relative;
// `;

// const CourseImage = styled.img`
//   width: 100%;
//   height: 180px;
//   object-fit: cover;
//   display: block;
// `;

// const ImageOverlay = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(8, 98, 247, 0.7);
//   opacity: ${({ isHovered }) => isHovered ? 1 : 0};
//   transition: ${({ theme }) => theme.transitions.default};
// `;

// const CategoryTag = styled.div`
//   position: absolute;
//   top: 0.9375rem;
//   right: 0.9375rem;
//   background-color: rgba(255,255,255,0.9);
//   color: ${({ theme }) => theme.colors.secondary};
//   padding: 0.3125rem 0.75rem;
//   border-radius: 1.25rem;
//   font-size: 0.8125rem;
//   font-weight: 600;
//   z-index: 2;
// `;

// const CourseContent = styled.div`
//   padding: 1.25rem;
//   height: 12.5rem;
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;

// const DefaultContent = styled.div`
//   opacity: ${({ isHovered }) => isHovered ? 0 : 1};
//   transform: translateY(${({ isHovered }) => isHovered ? '-1.25rem' : '0'});
//   transition: ${({ theme }) => theme.transitions.default};
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   padding: 1.25rem;
//   box-sizing: border-box;
// `;

// const HoverContent = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   padding: 1.25rem;
//   box-sizing: border-box;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
//   opacity: ${({ isHovered }) => isHovered ? 1 : 0};
//   transform: translateY(${({ isHovered }) => isHovered ? '0' : '1.25rem'});
//   transition: ${({ theme }) => theme.transitions.default};
//   pointer-events: ${({ isHovered }) => isHovered ? 'auto' : 'none'};
// `;

// const HoverDescription = styled.p`
//   color: ${({ theme }) => theme.colors.text};
//   font-size: 0.875rem;
//   margin-bottom: 1.25rem;
// `;

// const ViewDetailButton = styled(Link)`
//   background-color: ${({ theme }) => theme.colors.primary};
//   color: white;
//   border: none;
//   border-radius: 0.5rem;
//   padding: 0.75rem 1.5rem;
//   font-weight: 600;
//   font-size: 0.9375rem;
//   text-decoration: none;
//   display: inline-block;
//   transition: ${({ theme }) => theme.transitions.default};
  
//   &:hover {
//     background-color: #0753d0;
//     transform: translateY(-2px);
//   }
// `;

// const InfoBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 0.9375rem;
// `;

// const LevelTag = styled.div`
//   background-color: ${({ theme }) => theme.colors.lightBlueBg};
//   color: ${({ theme }) => theme.colors.primary};
//   padding: 0.3125rem 0.75rem;
//   border-radius: 1.25rem;
//   font-size: 0.8125rem;
//   font-weight: 600;
// `;

// const Price = styled.div`
//   font-size: 1.125rem;
//   font-weight: 700;
//   color: ${({ theme, price }) => price === "Free" ? theme.colors.green : theme.colors.primary};
// `;

// const SlashedPrice = styled.span`
//   color: ${({ theme }) => theme.colors.text};
//   text-decoration: line-through;
//   font-size: 0.875rem;
//   margin-left: 0.3125rem;
// `;

// const CourseTitle = styled.h3`
//   font-size: 1.125rem;
//   font-weight: 600;
//   margin: 0 0 0.9375rem 0;
//   line-height: 1.4;
//   min-height: 3.125rem;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
//   text-overflow: ellipsis;
// `;

// const Stats = styled.div`
//   display: flex;
//   gap: 1.25rem;
//   color: ${({ theme }) => theme.colors.text};
//   font-size: 0.875rem;
//   border-top: 1px solid ${({ theme }) => theme.colors.border};
//   padding-top: 0.9375rem;
  
//   ${media.xs} {
//     flex-direction: column;
//     gap: 0.5rem;
//   }
// `;

// const StatItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
// `;

// const Controls = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-top: 3rem;
  
//   ${media.md} {
//     flex-direction: column;
//     gap: 1.25rem;
//   }
// `;

// const Arrows = styled.div`
//   display: flex;
//   gap: 0.9375rem;
// `;

// const ArrowButton = styled.button`
//   width: 2.5rem;
//   height: 2.5rem;
//   border-radius: 50%;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   background-color: ${({ theme }) => theme.colors.lightGrayBg};
//   color: ${({ theme }) => theme.colors.text};
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: ${({ theme }) => theme.transitions.default};
  
//   &:hover {
//     background-color: ${({ theme }) => theme.colors.primary};
//     color: ${({ theme }) => theme.colors.white};
//     border-color: ${({ theme }) => theme.colors.primary};
//   }
// `;

// const CoursesComponent = () => {
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const coursesData = [
//     {
//       path: '/',
//       image: '/y20.jpg',
//       category: 'Siddha',
//       level: 'Beginner',
//       price: 'Free',
//       title: 'Introduction to Siddha Medicine',
//       students: 357,
//       lessons: 15,
//       description: 'Learn the fundamental principles and practices of ancient Siddha healing.'
//     },
//     {
//       path: '/varma',
//       image: '/y21.jpg',
//       category: 'Varma',
//       level: 'Private I-I',
//       price: 'From $39',
//       title: 'Introduction to Varmas',
//       students: 10,
//       lessons: 11,
//       description: 'Explore the vital energy points (Varmas) for diagnosis and therapeutic purposes.'
//     },
//     {
//       path: '/ayurvedha',
//       image: '/ad.png',
//       category: 'Ayurveda',
//       level: 'Intermediate',
//       price: 'Only $49',
//       oldPrice: '$59',
//       title: 'Ayurveda - Introduction',
//       students: 38,
//       lessons: 11,
//       description: 'A comprehensive guide to the holistic science of Ayurveda for balance and wellness.'
//     },
//     {
//       path: '/siddha-herbal',
//       image: '/y20.jpg',
//       category: 'Siddha',
//       level: 'Intermediate',
//       price: 'Free',
//       title: 'Herbal Healing in Siddha Medicine',
//       students: 116,
//       lessons: 14,
//       description: 'Discover the power of herbs in Siddha medicine for treating various ailments.'
//     },
//   ];
  
//   return (
//     <CoursesSection>
//       <Container>
//         <SectionHeader>
//           <SectionSubtitle>Our Courses</SectionSubtitle>
//           <SectionTitle>Explore top <Highlight color="blue">courses</Highlight></SectionTitle>
//         </SectionHeader>
        
//         <CoursesGrid>
//           {coursesData.map((course, index) => (
//             <CourseCard
//               key={index}
//               onMouseEnter={() => setHoveredCard(index)}
//               onMouseLeave={() => setHoveredCard(null)}
//             >
//               <CourseImageContainer>
//                 <CourseImage src={course.image} alt={course.title} />
//                 <ImageOverlay isHovered={hoveredCard === index} />
//                 <CategoryTag>{course.category}</CategoryTag>
//               </CourseImageContainer>
              
//               <CourseContent>
//                 <DefaultContent isHovered={hoveredCard === index}>
//                   <InfoBar>
//                     <LevelTag>{course.level}</LevelTag>
//                     <Price price={course.price}>
//                       {course.price}
//                       {course.oldPrice && <SlashedPrice>{course.oldPrice}</SlashedPrice>}
//                     </Price>
//                   </InfoBar>
//                   <CourseTitle>{course.title}</CourseTitle>
//                   <Stats>
//                     <StatItem><FaUserGraduate /> {course.students} Students</StatItem>
//                     <StatItem><FaRegFileAlt /> {course.lessons} Lessons</StatItem>
//                   </Stats>
//                 </DefaultContent>
                
//                 <HoverContent isHovered={hoveredCard === index}>
//                   <HoverDescription>{course.description}</HoverDescription>
//                   <ViewDetailButton to={course.path}>View Detail</ViewDetailButton>
//                 </HoverContent>
//               </CourseContent>
//             </CourseCard>
//           ))}
//         </CoursesGrid>
        
//         <Controls>
//           <Arrows>
//             <ArrowButton><FaArrowLeft /></ArrowButton>
//             <ArrowButton><FaArrowRight /></ArrowButton>
//           </Arrows>
//           <Button variant="outline" fullWidthMobile>View All Courses</Button>
//         </Controls>
//       </Container>
//     </CoursesSection>
//   );
// };

// // --- CATEGORIES SECTION ---
// const CategoriesSection = styled(SectionWrapper)`
//   background-color: ${({ theme }) => theme.colors.lightBlueBg};
// `;

// const CategoriesContainer = styled.div`
//   background-color: ${({ theme }) => theme.colors.white};
//   border-radius: 1.25rem;
//   padding: 3.75rem;
//   text-align: center;
  
//   ${media.md} {
//     padding: 2rem 1.5rem;
//   }
// `;

// const CategoriesGrid = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: center;
//   gap: 0.9375rem;
//   margin-top: 2rem;
// `;

// const CategoryButton = styled.button`
//   background-color: ${({ theme }) => theme.colors.white};
//   color: ${({ theme }) => theme.colors.text};
//   padding: 0.75rem 1.5rem;
//   border-radius: 0.5rem;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   font-size: 1rem;
//   font-weight: 500;
//   cursor: pointer;
//   transition: ${({ theme }) => theme.transitions.fast};
  
//   &:hover {
//     background-color: ${({ theme }) => theme.colors.primary};
//     color: ${({ theme }) => theme.colors.white};
//     border-color: ${({ theme }) => theme.colors.primary};
//   }
  
//   ${media.sm} {
//     padding: 0.5rem 1rem;
//     font-size: 0.875rem;
//   }
// `;

// const CategoriesComponent = () => {
//   const categories = ["Siddha", "Varma", "Ayurveda", "Health", "IT", "Marketing", "Photography", "Teaching Online", "Technology"];
  
//   return (
//     <CategoriesSection>
//       <Container>
//         <CategoriesContainer>
//           <SectionHeader>
//             <SectionSubtitle>Choose From Any These</SectionSubtitle>
//             <SectionTitle>Courses <Highlight color="blue">categories</Highlight></SectionTitle>
//           </SectionHeader>
//           <CategoriesGrid>
//             {categories.map((cat, i) => (
//               <CategoryButton key={i}>{cat}</CategoryButton>
//             ))}
//           </CategoriesGrid>
//         </CategoriesContainer>
//       </Container>
//     </CategoriesSection>
//   );
// };

// // --- PREMIUM SECTION ---
// const PremiumSection = styled(SectionWrapper)`
//   background-color: ${({ theme }) => theme.colors.white};
// `;

// const PremiumContainer = styled(Container)`
//   display: flex;
//   align-items: center;
//   gap: 3rem;
  
//   ${media.lg} {
//     flex-direction: column-reverse;
//     gap: 2rem;
//   }
// `;

// const PremiumContent = styled.div`
//   flex: 1;
// `;

// const PremiumImageContainer = styled.div`
//   flex: 1;
//   position: relative;
//   display: flex;
//   justify-content: center;
  
//   ${media.lg} {
//     width: 100%;
//   }
// `;

// const AccordionContainer = styled.div`
//   background-color: ${({ theme }) => theme.colors.lightBlueBg};
//   border-radius: 0.9375rem;
//   padding: 1.25rem 2.5rem;
  
//   ${media.md} {
//     padding: 1.25rem;
//   }
// `;

// const AccordionItem = styled.div`
//   border-bottom: 1px solid ${({ theme }) => theme.colors.border};
//   padding: 1.25rem 0;
  
//   &:last-child {
//     border-bottom: none;
//   }
// `;

// const AccordionHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   cursor: pointer;
// `;

// const AccordionTitle = styled.h4`
//   font-size: 1.125rem;
//   font-weight: 600;
//   color: ${({ theme, isOpen }) => isOpen ? theme.colors.primary : theme.colors.secondary};
//   margin: 0;
//   transition: ${({ theme }) => theme.transitions.fast};
  
//   ${AccordionHeader}:hover & {
//     color: ${({ theme }) => theme.colors.primary};
//   }
  
//   ${media.sm} {
//     font-size: 1rem;
//   }
// `;

// const AccordionIcon = styled.div`
//   color: ${({ theme }) => theme.colors.primary};
//   font-size: 1.25rem;
// `;

// const AccordionContent = styled.div`
//   max-height: ${({ isOpen }) => isOpen ? '500px' : '0'};
//   overflow: hidden;
//   transition: ${({ theme }) => theme.transitions.default};
//   color: ${({ theme }) => theme.colors.text};
//   padding-top: ${({ isOpen }) => isOpen ? '0.9375rem' : '0'};
//   font-size: 0.9375rem;
//   line-height: 1.6;
// `;

// const PremiumImage = styled.img`
//   width: 85%;
//   border-radius: 1.25rem;
//   z-index: 2;
//   position: relative;
  
//   ${media.lg} {
//     width: 90%;
//   }
  
//   ${media.md} {
//     width: 100%;
//   }
// `;

// const BlueDots = styled.div`
//   position: absolute;
//   top: 1.25rem;
//   right: 0;
//   z-index: 1;
//   color: ${({ theme }) => theme.colors.primary};
//   opacity: 0.2;
//   font-size: 0.625rem;
//   line-height: 1.5;
//   letter-spacing: 0.3125rem;
  
//   ${media.lg} {
//     display: none;
//   }
// `;

// const PremiumComponent = () => {
//   const [openIndex, setOpenIndex] = useState(0);
//   const accordionData = [
//     {
//       title: 'Learn at your own pace',
//       content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.'
//     },
//     {
//       title: 'Learn from the best professionals',
//       content: 'Our instructors are industry leaders and experts in their fields, bringing real-world experience to every course.'
//     },
//     {
//       title: 'Share knowledge and ideas',
//       content: 'Join a vibrant community of learners, collaborate on projects, and expand your professional network.'
//     },
//     {
//       title: 'Connect with a global creative community',
//       content: 'Engage with students and creators from around the world, gaining diverse perspectives and insights.'
//     },
//   ];
  
//   return (
//     <PremiumSection>
//       <PremiumContainer>
//         <PremiumContent>
//           <SectionHeader>
//             <SectionSubtitle>Premium Learning</SectionSubtitle>
//             <SectionTitle>State of the art e-Learning <Highlight color="blue">Experience</Highlight></SectionTitle>
//           </SectionHeader>
          
//           <AccordionContainer>
//             {accordionData.map((item, index) => (
//               <AccordionItem key={index}>
//                 <AccordionHeader onClick={() => setOpenIndex(openIndex === index ? null : index)}>
//                   <AccordionTitle isOpen={openIndex === index}>{item.title}</AccordionTitle>
//                   <AccordionIcon>{openIndex === index ? <FaMinus /> : <FaPlus />}</AccordionIcon>
//                 </AccordionHeader>
//                 <AccordionContent isOpen={openIndex === index}>{item.content}</AccordionContent>
//               </AccordionItem>
//             ))}
//           </AccordionContainer>
//         </PremiumContent>
        
//         <PremiumImageContainer>
//           <PremiumImage src="/Siddha1.jpg" alt="Happy learner with laptop" />
//           <BlueDots>
//             {Array(10).fill(0).map((_, i) => <div key={i}>{Array(10).fill('•').join(' ')}</div>)}
//           </BlueDots>
//         </PremiumImageContainer>
//       </PremiumContainer>
//     </PremiumSection>
//   );
// };

// // --- MAIN COMPONENT ---
// const HomePageContent = () => {
//   return (
//     <ThemeProvider theme={theme}>
//       <GlobalContainer>
//         <HeroComponent />
//         <FeaturesComponent />
//         <CoursesComponent />
//         <CategoriesComponent />
//         <PremiumComponent />
//       </GlobalContainer>
//     </ThemeProvider>
//   );
// };

// export default HomePageContent;




// src/pages/HomePageContent.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css, ThemeProvider } from 'styled-components';
import {
  FaStar, FaRegFileAlt, FaUniversity, FaUserGraduate, FaRegBuilding,
  FaRegSun, FaArrowRight, FaArrowLeft, FaPlay, FaCheck, FaPlus, FaMinus
} from 'react-icons/fa';
import { FaBookMedical, FaHandHoldingHeart, FaLeaf, FaStethoscope, FaLaptopCode, FaBullhorn, FaCamera, FaChalkboardTeacher, FaMicrochip } from 'react-icons/fa';

// --- THEME AND BREAKPOINTS ---
const theme = {
  colors: {
    primary: '#0862F7',
    secondary: '#0A033C',
    text: '#696984',
    green: '#22C55E',
    lightBlueBg: '#F0F6FF',
    lightGrayBg: '#F7F8FA',
    white: '#FFFFFF',
    border: '#E9EAF0',
    yellow: '#FFC221',
    darkBlue: '#0A033C',
    lightText: '#A3A3A3',
  },
  font: "'Poppins', sans-serif",
  shadows: {
    small: '0 2px 8px rgba(0,0,0,0.1)',
    medium: '0 4px 12px rgba(0,0,0,0.15)',
    large: '0 8px 24px rgba(0,0,0,0.2)',
  },
  spacing: {
    section: '6rem',
    sectionMobile: '3rem',
    component: '2rem',
  },
  transitions: {
    default: 'all 0.3s ease-in-out',
    fast: 'all 0.15s ease-in-out',
  },
};

const breakpoints = {
  xs: '400px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
};

const media = Object.keys(breakpoints).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${breakpoints[label]}) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

// --- GLOBAL STYLES ---
const GlobalContainer = styled.div`
  font-family: ${({ theme }) => theme.font};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  overflow-x: hidden;
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.secondary};
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const SectionWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing.section} 5%;
  position: relative;
  
  ${media.lg} {
    padding: ${({ theme }) => theme.spacing.sectionMobile} 5%;
  }
  
  ${media.sm} {
    padding: ${({ theme }) => theme.spacing.sectionMobile} 1.5rem;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  ${media.md} {
    margin-bottom: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  
  ${media.md} {
    font-size: 2rem;
  }
  
  ${media.sm} {
    font-size: 1.75rem;
  }
`;

const Highlight = styled.span`
  color: ${({ theme, color }) => 
    color === 'blue' ? theme.colors.primary : 
    color === 'green' ? theme.colors.green : 
    theme.colors.secondary};
`;

const Button = styled.button`
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : 
    variant === 'outline' ? 'transparent' : 
    theme.colors.white};
  color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.white : 
    variant === 'outline' ? theme.colors.primary : 
    theme.colors.secondary};
  padding: ${({ size }) => 
    size === 'lg' ? '1.125rem 2rem' : 
    size === 'sm' ? '0.5rem 1rem' : 
    '0.75rem 1.5rem'};
  border-radius: 0.5rem;
  border: ${({ theme, variant }) => 
    variant === 'outline' ? `1px solid ${theme.colors.primary}` : 
    `1px solid ${theme.colors.border}`};
  font-weight: 600;
  font-size: ${({ size }) => 
    size === 'lg' ? '1rem' : 
    size === 'sm' ? '0.875rem' : 
    '0.9375rem'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ theme, variant }) => 
      variant === 'primary' ? '#0753d0' : 
      variant === 'outline' ? theme.colors.lightBlueBg : 
      theme.colors.lightGrayBg};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.small};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${media.sm} {
    width: ${({ fullWidthMobile }) => fullWidthMobile ? '100%' : 'auto'};
    white-space: ${({ fullWidthMobile }) => fullWidthMobile ? 'normal' : 'nowrap'};
  }
`;

// --- HERO SECTION ---
// --- HERO SECTION ---
const HeroSection = styled(SectionWrapper)`
  background-color: ${({ theme }) => theme.colors.white};
  padding-top: 5rem;
  padding-bottom: 5rem;
  
  ${media.md} {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
`;

const HeroContainer = styled(Container)`
  display: flex;
  align-items: center;
  gap: 3rem;
  
  ${media.lg} {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 600px;
  
  ${media.lg} {
    max-width: 100%;
    text-align: center;
  }
`;

// THIS IS THE CORRECTED PART
const HeroImageContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex; /* This line is essential for centering */
  justify-content: center;
  align-items: center;
  min-height: 400px;
  
  ${media.lg} {
    min-height: auto;
    width: 100%;
    margin-top: 2rem;
  }
`;

const HeroSpecialDeal = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  ${media.xl} {
    font-size: 3rem;
  }
  
  ${media.lg} {
    font-size: 2.5rem;
  }
  
  ${media.md} {
    font-size: 2.25rem;
  }
  
  ${media.sm} {
    font-size: 2rem;
  }
`;

const HeroImageBackground = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  background-color: ${({ theme }) => theme.colors.lightBlueBg};
  border-radius: 1.25rem;
  z-index: 1;
  
  ${media.lg} {
    width: 90%;
    height: 90%;
  }
`;

const HeroMainImage = styled.img`
  width: 75%;
  border-radius: 1.25rem;
  position: relative;
  z-index: 2;
  box-shadow: ${({ theme }) => theme.shadows.large};
  
  ${media.lg} {
    width: 90%;
  }
  
  ${media.md} {
    width: 100%;
  }
`;

const HeroRatingCard = styled.div`
  position: absolute;
  bottom: 2.5rem;
  left: 1.25rem;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 1rem 1.25rem;
  border-radius: 0.625rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  ${media.md} {
    position: static;
    margin: 1.5rem auto 0;
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.colors.border};
    width: fit-content;
  }
`;

const HeroRatingScore = styled.div`
  background-color: ${({ theme }) => theme.colors.yellow};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.625rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
`;

const HeroRatingText = styled.div`
  line-height: 1.4;
`;

const HeroRatingLabel = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
  font-size: 1rem;
`;

const HeroRatingReviews = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  margin: 0;
`;

const HeroDots = styled.div`
  position: absolute;
  bottom: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: ${({ theme }) => theme.colors.yellow};
  letter-spacing: 0.5rem;
  font-size: 1.25rem;
  opacity: 0.5;
  
  ${media.md} {
    display: none; // Hide dots on medium screens and smaller
  }
`;

// Replace your old HeroComponent with this one

const HeroComponent = () => {
  return (
    <HeroSection>
      <HeroContainer>
        
        {/* === Text Content === */}
        <HeroContent>
          <HeroSpecialDeal>Special deal for users</HeroSpecialDeal>
          <HeroTitle>
            Enjoy over <Highlight color="blue">1.2K courses</Highlight> for creatives for <Highlight color="green">free</Highlight>
          </HeroTitle>
          <Button variant="primary" size="lg" fullWidthMobile>Explore Course Packages</Button>
        </HeroContent>
        
        {/* === Image Content (Guaranteed to show) === */}
        <HeroImageContainer>
          <HeroImageBackground />
          <HeroMainImage src="/Siddha.jpg" alt="Happy student" />
          <HeroRatingCard>
            <HeroRatingScore>4.85</HeroRatingScore>
            <HeroRatingText>
              <HeroRatingLabel>Average Rating</HeroRatingLabel>
              <HeroRatingReviews>183,406 Learner reviews</HeroRatingReviews>
            </HeroRatingText>
          </HeroRatingCard>
          <HeroDots> • • • • • • • • • • </HeroDots>
        </HeroImageContainer>

      </HeroContainer>
    </HeroSection>
  );
};

// --- FEATURES SECTION ---
const FeaturesSection = styled(SectionWrapper)`
  background-color: ${({ theme }) => theme.colors.lightGrayBg};
`;

const FeaturesContainer = styled(Container)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  ${media.sm} {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const FeatureIcon = styled.div`
  min-width: 4.375rem;
  height: 4.375rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.75rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  flex-shrink: 0;
`;

const FeatureContent = styled.div``;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  line-height: 1.6;
`;

const FeaturesComponent = () => {
  const featureData = [
    { icon: <FaRegFileAlt />, title: "Short courses", description: "Acquire new abilities at your own pace with our flexible online courses." },
    { icon: <FaRegBuilding />, title: "ExpertTracks", description: "Elevate your expertise with a curated series of specialized courses." },
    { icon: <FaRegSun />, title: "Microcredentials", description: "Achieve recognized professional or academic credentials." },
  ];
  
  return (
    <FeaturesSection>
      <Container>
        <SectionHeader>
          <SectionSubtitle>Features</SectionSubtitle>
          <SectionTitle>Why Choose <Highlight color="blue">Us</Highlight></SectionTitle>
        </SectionHeader>
        <FeaturesContainer>
          {featureData.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureContent>
            </FeatureItem>
          ))}
        </FeaturesContainer>
      </Container>
    </FeaturesSection>
  );
};

// --- COURSES SECTION ---
const CoursesSection = styled(SectionWrapper)`
  background-color: ${({ theme }) => theme.colors.white};
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0.9375rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const CourseImageContainer = styled.div`
  position: relative;
`;

const CourseImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(8, 98, 247, 0.7);
  opacity: ${({ isHovered }) => isHovered ? 1 : 0};
  transition: ${({ theme }) => theme.transitions.default};
`;

const CategoryTag = styled.div`
  position: absolute;
  top: 0.9375rem;
  right: 0.9375rem;
  background-color: rgba(255,255,255,0.9);
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0.3125rem 0.75rem;
  border-radius: 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  z-index: 2;
`;

const CourseContent = styled.div`
  padding: 1.25rem;
  height: 12.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DefaultContent = styled.div`
  opacity: ${({ isHovered }) => isHovered ? 0 : 1};
  transform: translateY(${({ isHovered }) => isHovered ? '-1.25rem' : '0'});
  transition: ${({ theme }) => theme.transitions.default};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  box-sizing: border-box;
`;

const HoverContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: ${({ isHovered }) => isHovered ? 1 : 0};
  transform: translateY(${({ isHovered }) => isHovered ? '0' : '1.25rem'});
  transition: ${({ theme }) => theme.transitions.default};
  pointer-events: ${({ isHovered }) => isHovered ? 'auto' : 'none'};
`;

const HoverDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
`;

const ViewDetailButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  display: inline-block;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: #0753d0;
    transform: translateY(-2px);
  }
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9375rem;
`;

const LevelTag = styled.div`
  background-color: ${({ theme }) => theme.colors.lightBlueBg};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.3125rem 0.75rem;
  border-radius: 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
`;

const Price = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme, price }) => price === "Free" ? theme.colors.green : theme.colors.primary};
`;

const SlashedPrice = styled.span`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: line-through;
  font-size: 0.875rem;
  margin-left: 0.3125rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.9375rem 0;
  line-height: 1.4;
  min-height: 3.125rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Stats = styled.div`
  display: flex;
  gap: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 0.9375rem;
  
  ${media.xs} {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  
  ${media.md} {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const Arrows = styled.div`
  display: flex;
  gap: 0.9375rem;
`;

const ArrowButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.lightGrayBg};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CoursesComponent = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const coursesData = [
    { 
      path: '/', 
      image: '/Siddha.jpg', 
      category: 'Siddha', 
      level: 'Beginner', 
      price: 'Free', 
      title: 'Introduction to Siddha Medicine', 
      students: 357, 
      lessons: 15, 
      description: 'Learn the fundamental principles and practices of ancient Siddha healing.' 
    },
    { 
      path: '/varma', 
      image: '/y21.jpg', 
      category: 'Varma', 
      level: 'Private I-I', 
      price: 'From $39', 
      title: 'Introduction to Varmas', 
      students: 10, 
      lessons: 11, 
      description: 'Explore the vital energy points (Varmas) for diagnosis and therapeutic purposes.' 
    },
    { 
      path: '/ayurvedha', 
      image: '/ad.png', 
      category: 'Ayurveda', 
      level: 'Intermediate', 
      price: 'Only $49', 
      oldPrice: '$59', 
      title: 'Ayurveda - Introduction', 
      students: 38, 
      lessons: 11, 
      description: 'A comprehensive guide to the holistic science of Ayurveda for balance and wellness.' 
    },
    { 
      path: '/course', 
      image: '/Siddha1.jpg', 
      category: 'Siddha', 
      level: 'Intermediate', 
      price: 'Free', 
      title: 'Herbal Healing in Siddha Medicine', 
      students: 116, 
      lessons: 14, 
      description: 'Discover the power of herbs in Siddha medicine for treating various ailments.' 
    },
  ];
  
  return (
    <CoursesSection>
      <Container>
        <SectionHeader>
          <SectionSubtitle>Our Courses</SectionSubtitle>
          <SectionTitle>Explore top <Highlight color="blue">courses</Highlight></SectionTitle>
        </SectionHeader>
        
        <CoursesGrid>
          {coursesData.map((course, index) => (
            <CourseCard 
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CourseImageContainer>
                <CourseImage src={course.image} alt={course.title} />
                <ImageOverlay isHovered={hoveredCard === index} />
                <CategoryTag>{course.category}</CategoryTag>
              </CourseImageContainer>
              
              <CourseContent>
                <DefaultContent isHovered={hoveredCard === index}>
                  <InfoBar>
                    <LevelTag>{course.level}</LevelTag>
                    <Price price={course.price}>
                      {course.price}
                      {course.oldPrice && <SlashedPrice>{course.oldPrice}</SlashedPrice>}
                    </Price>
                  </InfoBar>
                  <CourseTitle>{course.title}</CourseTitle>
                  <Stats>
                    <StatItem><FaUserGraduate /> {course.students} Students</StatItem>
                    <StatItem><FaRegFileAlt /> {course.lessons} Lessons</StatItem>
                  </Stats>
                </DefaultContent>
                
                <HoverContent isHovered={hoveredCard === index}>
                  <HoverDescription>{course.description}</HoverDescription>
                  <ViewDetailButton to={course.path}>View Detail</ViewDetailButton>
                </HoverContent>
              </CourseContent>
            </CourseCard>
          ))}
        </CoursesGrid>
        
        <Controls>
          <Arrows>
            <ArrowButton><FaArrowLeft /></ArrowButton>
            <ArrowButton><FaArrowRight /></ArrowButton>
          </Arrows>
          <Button variant="outline" fullWidthMobile>View All Courses</Button>
        </Controls>
      </Container>
    </CoursesSection>
  );
};

// --- CATEGORIES SECTION ---


// --- Main Styled Components ---

const CategoriesSection = styled(SectionWrapper)`
  // A light, clean background to fit the white and blue theme
  background-color: ${({ theme }) => theme.colors.lightBlueBg || '#F7F8FA'};
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.75rem; // Space between the cards
`;

// The new card design for the white and blue theme
const CategoryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white || '#FFFFFF'};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border || '#E9EAF0'};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05); // A subtle shadow to lift the card

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    border-color: ${({ theme }) => theme.colors.primary || '#0862F7'};
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  // Soft blue background using the primary color with low opacity
  background-color: ${({ theme }) => `${theme.colors.primary}1A` || '#0862F71A'};
  color: ${({ theme }) => theme.colors.primary || '#0862F7'}; // Icon color is primary blue
  font-size: 1.75rem;
`;

const CardTitle = styled.h4`
  font-size: 1.15rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary || '#0A033C'}; // Dark text for readability
  margin: 0 0 0.25rem;
`;

const CardSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text || '#696984'}; // Softer gray for the subtitle
  margin: 0;
`;


const CategoriesComponent = () => {
  const categories = [
    { name: "Siddha", icon: <FaBookMedical />, courses: "12 Courses",image:"/y21.jpg"  },
    { name: "Varma", icon: <FaHandHoldingHeart />, courses: "8 Courses" },
    { name: "Ayurveda", icon: <FaLeaf />, courses: "15 Courses" },
    { name: "Health", icon: <FaStethoscope />, courses: "25 Courses" },
    { name: "IT", icon: <FaLaptopCode />, courses: "40+ Courses" },
    { name: "Marketing", icon: <FaBullhorn />, courses: "22 Courses" },
    { name: "Photography", icon: <FaCamera />, courses: "18 Courses" },
    { name: "Technology", icon: <FaMicrochip />, courses: "30 Courses" },
  ];
  
  return (
    <CategoriesSection>
      <Container>
        {/* The SectionHeader now uses white text to contrast with the dark background */}
        <SectionHeader>
          <SectionSubtitle>Choose From Any of These</SectionSubtitle>
          <SectionTitle>Courses <Highlight>Categories</Highlight></SectionTitle>
        </SectionHeader>
        
        <CategoriesGrid>
          {categories.map((cat) => (
            <CategoryCard key={cat.name}>
              <IconWrapper>{cat.icon}</IconWrapper>
              <CardTitle>{cat.name}</CardTitle>
              <CardSubtitle>{cat.courses}</CardSubtitle>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </Container>
    </CategoriesSection>
  );
};


// --- MAIN COMPONENT ---
const HomePageContent = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalContainer>
        <HeroComponent />
        <FeaturesComponent />

        <CategoriesComponent />
        
      </GlobalContainer>
    </ThemeProvider>
  );
};

export default HomePageContent;