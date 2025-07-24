import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/page/LoginPage";
import SignupPage from "./components/page/SignupPage";

import Layout from "./pages/Homepage/Layout.js";
import HomePageContent from "./pages/Homepage/HomePageContent.js";
import MainDashBoard from "./pages/Dashboard/MainDashBoard.js";
import ProfilePage from "./pages/Dashboard/Porfile.js";
import CourseGrid from "./pages/Course/CourseGrid.js";
import CourseDetail from "./pages/Course/CourseDetail.js";
import CourseContent from "./pages/Course/CourseContent.js";
import PaymentPage from "./pages/Payment/Payment.js";
import PaymentPages from "./pages/Payment/User-Paymentpage.js";
import CoursePage from "./pages/Course/CourseDetail.js";

import ExamRecord from "./pages/Dashboard/ExamRecord.js";
import EnhancedBlog from "./pages/Homepage/EnhancedBlog.js";
import BlogPostDetail from "./pages/Homepage/BlogPostDetail.js";
import PurchasedCourses from "./pages/Dashboard/LessonStatus.js";



function App() {
  return (
    <Routes>
      {/* Routes without layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      
        <Route path="/" element={<Layout />}>
        <Route path="/Dashboard" element={<MainDashBoard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route index element={<HomePageContent />} />
        <Route path="/course" element={<CourseGrid />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/course/:id/content" element={<CourseContent />} />
        <Route path="/course/:courseId/payment" element={<PaymentPage />} />
        <Route path="/payment" element={<PaymentPages />} />
        <Route path="/Examrecord" element={<ExamRecord />} />
        <Route path="/blogpage" element={<EnhancedBlog />} />
        <Route path="/blog" element={<EnhancedBlog />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/lesson-status" element={<PurchasedCourses />} />

      </Route>
    </Routes>
  );
}

export default App;
