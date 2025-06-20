// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import styled from "styled-components";
// import { FaStar, FaRegClock, FaUserGraduate } from "react-icons/fa";

// const CourseGridContainer = styled.div`
//   padding: 2rem;
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//   gap: 2rem;
//   max-width: 1400px;
//   margin: 0 auto;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//     padding: 1rem;
//   }
// `;

// const CourseCard = styled(Link)`
//   text-decoration: none;
//   color: inherit;
//   transition: transform 0.3s ease, box-shadow 0.3s ease;
//   border-radius: 12px;
//   overflow: hidden;
//   background: #fff;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
//   }
// `;

// const Thumbnail = styled.div`
//   position: relative;
//   width: 100%;
//   height: 180px;
//   overflow: hidden;

//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     transition: transform 0.5s ease;
//   }

//   &:hover img {
//     transform: scale(1.05);
//   }
// `;

// const Badge = styled.span`
//   position: absolute;
//   top: 1rem;
//   left: 1rem;
//   background: ${props => props.theme.colors.primary};
//   color: white;
//   padding: 0.25rem 0.75rem;
//   border-radius: 20px;
//   font-size: 0.75rem;
//   font-weight: 600;
// `;

// const CourseInfo = styled.div`
//   padding: 1.5rem;
// `;

// const Title = styled.h3`
//   margin: 0 0 1rem 0;
//   font-size: 1.25rem;
//   font-weight: 600;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// `;

// const Instructor = styled.p`
//   color: #666;
//   font-size: 0.9rem;
//   margin-bottom: 1rem;
// `;

// const MetaInfo = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

// const Rating = styled.div`
//   display: flex;
//   align-items: center;
//   color: #f8b400;
//   font-weight: 600;
// `;

// const Duration = styled.div`
//   display: flex;
//   align-items: center;
//   color: #666;
//   font-size: 0.9rem;
// `;

// const PriceContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
// `;

// const CurrentPrice = styled.span`
//   font-size: 1.25rem;
//   font-weight: 700;
//   color: ${props => props.theme.colors.primary};
// `;

// const OriginalPrice = styled.span`
//   font-size: 0.9rem;
//   text-decoration: line-through;
//   color: #999;
// `;

// const CourseGrid = () => {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     fetch("https://learnly-backend-05ix.onrender.com/courses/user-view", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => setCourses(data.data || []));
//   }, []);

//   return (
//     <CourseGridContainer>
//       {courses.map(course => (
//         <CourseCard to={`/course/${course._id}`} key={course._id}>
//           <Thumbnail>
//             <img src={course.thumbnail || "/default-course.jpg"} alt={course.coursename} />
//             <Badge>{course.level.toUpperCase()}</Badge>
//           </Thumbnail>
//           <CourseInfo>
//             <Title>{course.coursename}</Title>
//             <Instructor>By {course.instructor?.name || "Unknown Instructor"}</Instructor>
            
//             <MetaInfo>
//               <Rating>
//                 <FaStar style={{ marginRight: "0.25rem" }} />
//                 {course.rating?.toFixed(1) || "4.5"}
//               </Rating>
//               <Duration>
//                 <FaRegClock style={{ marginRight: "0.25rem" }} />
//                 {course.contentduration?.hours || 0}h {course.contentduration?.minutes || 0}m
//               </Duration>
//             </MetaInfo>
            
//             <PriceContainer>
//               <CurrentPrice>₹{course.price.finalPrice}</CurrentPrice>
//               {course.price.discount > 0 && (
//                 <OriginalPrice>₹{course.price.amount}</OriginalPrice>
//               )}
//             </PriceContainer>
//           </CourseInfo>
//         </CourseCard>
//       ))}
//     </CourseGridContainer>
//   );
// };

// export default CourseGrid;

// // CourseGrid.js
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import styled, { useTheme } from "styled-components";
// import { FaStar, FaRegClock } from "react-icons/fa";

// const CourseGridContainer = styled.div`
//   padding: 2rem;
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//   gap: 2rem;
//   max-width: 1400px;
//   margin: 0 auto;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//     padding: 1rem;
//   }
// `;

// const CourseCard = styled(Link)`
//   text-decoration: none;
//   color: inherit;
//   transition: transform 0.3s ease, box-shadow 0.3s ease;
//   border-radius: 12px;
//   overflow: hidden;
//   background: #fff;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
//   }
// `;

// const Thumbnail = styled.div`
//   position: relative;
//   width: 100%;
//   height: 180px;
//   overflow: hidden;

//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     transition: transform 0.5s ease;
//   }

//   &:hover img {
//     transform: scale(1.05);
//   }
// `;

// const Badge = styled.span`
//   position: absolute;
//   top: 1rem;
//   left: 1rem;
//   background: ${props => props.theme?.colors?.primary || "#1976d2"};
//   color: white;
//   padding: 0.25rem 0.75rem;
//   border-radius: 20px;
//   font-size: 0.75rem;
//   font-weight: 600;
// `;

// const CourseInfo = styled.div`
//   padding: 1.5rem;
// `;

// const Title = styled.h3`
//   margin: 0 0 1rem 0;
//   font-size: 1.25rem;
//   font-weight: 600;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
// `;

// const Instructor = styled.p`
//   color: #666;
//   font-size: 0.9rem;
//   margin-bottom: 1rem;
// `;

// const MetaInfo = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

// const Rating = styled.div`
//   display: flex;
//   align-items: center;
//   color: #f8b400;
//   font-weight: 600;
// `;

// const Duration = styled.div`
//   display: flex;
//   align-items: center;
//   color: #666;
//   font-size: 0.9rem;
// `;

// const PriceContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
// `;

// const CurrentPrice = styled.span`
//   font-size: 1.25rem;
//   font-weight: 700;
//   color: ${props => props.theme?.colors?.primary || "#1976d2"};
// `;

// const OriginalPrice = styled.span`
//   font-size: 0.9rem;
//   text-decoration: line-through;
//   color: #999;
// `;

// const CourseGrid = () => {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     fetch("https://learnly-backend-05ix.onrender.com/courses/user-view", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(res => res.json())
//       .then(data => setCourses(data.data || []));
//   }, []);

//   return (
//     <CourseGridContainer>
//       {courses.map(course => (
//         <CourseCard to={`/course/${course._id}`} key={course._id}>
//           <Thumbnail>
//             <img src={course.thumbnail || "/default-course.jpg"} alt={course.coursename} />
//             <Badge>{course.level?.toUpperCase()}</Badge>
//           </Thumbnail>
//           <CourseInfo>
//             <Title>{course.coursename}</Title>
//             <Instructor>By {course.instructor?.name || "Unknown Instructor"}</Instructor>

//             <MetaInfo>
//               <Rating>
//                 <FaStar style={{ marginRight: "0.25rem" }} />
//                 {course.rating?.toFixed(1) || "4.5"}
//               </Rating>
//               <Duration>
//                 <FaRegClock style={{ marginRight: "0.25rem" }} />
//                 {course.contentduration?.hours || 0}h {course.contentduration?.minutes || 0}m
//               </Duration>
//             </MetaInfo>

//             <PriceContainer>
//               <CurrentPrice>₹{course.price?.finalPrice || 0}</CurrentPrice>
//               {course.price?.discount > 0 && (
//                 <OriginalPrice>₹{course.price.amount}</OriginalPrice>
//               )}
//             </PriceContainer>
//           </CourseInfo>
//         </CourseCard>
//       ))}
//     </CourseGridContainer>
//   );
// };

// export default CourseGrid;



// CourseGrid.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { FaStar, FaRegClock } from "react-icons/fa";

const CourseGridContainer = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const CourseCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${props => props.theme?.colors?.primary || "#1976d2"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CourseInfo = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Instructor = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  color: #f8b400;
  font-weight: 600;
`;

const Duration = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.primary || "#1976d2"};
`;

const OriginalPrice = styled.span`
  font-size: 0.9rem;
  text-decoration: line-through;
  color: #999;
`;

const CourseGrid = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://learnly-backend-05ix.onrender.com/courses/user-view", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCourses(data.data || []));
  }, []);

  return (
    <CourseGridContainer>
      {courses.map(course => (
        <CourseCard to={`/course/${course._id}`} key={course._id}>
          <Thumbnail>
            <img src={course.thumbnail || "/default-course.jpg"} alt={course.coursename} />
            <Badge>{course.level?.toUpperCase()}</Badge>
          </Thumbnail>
          <CourseInfo>
            <Title>{course.coursename}</Title>
            <Instructor>By {course.instructor?.name || "Unknown Instructor"}</Instructor>

            <MetaInfo>
              <Rating>
                <FaStar style={{ marginRight: "0.25rem" }} />
                {course.rating?.toFixed(1) || "4.5"}
              </Rating>
              <Duration>
                <FaRegClock style={{ marginRight: "0.25rem" }} />
                {course.contentduration?.hours || 0}h {course.contentduration?.minutes || 0}m
              </Duration>
            </MetaInfo>

            <PriceContainer>
              <CurrentPrice>₹{course.price?.finalPrice || 0}</CurrentPrice>
              {course.price?.discount > 0 && (
                <OriginalPrice>₹{course.price.amount}</OriginalPrice>
              )}
            </PriceContainer>
          </CourseInfo>
        </CourseCard>
      ))}
    </CourseGridContainer>
  );
};

export default CourseGrid;
