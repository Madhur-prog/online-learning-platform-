import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetails from './pages/CourseDetails';
import VideoLessonPlayer from './pages/VideoLessonPlayer';
import StudyMaterials from './pages/StudyMaterials';
import QuizAttempt from './pages/QuizAttempt';
import QuizResults from './pages/QuizResults';
import AssignmentSubmission from './pages/AssignmentSubmission';
import AssignmentStatus from './pages/AssignmentStatus';
import CourseDiscussionForum from './pages/CourseDiscussionForum';
import StudentDashboard from './pages/StudentDashboard';
import MyLearning from './pages/MyLearning';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseManagement from './pages/CourseManagement';
import QuizAndAssignmentManagement from './pages/QuizAndAssignmentManagement';
import StudentSubmissionReview from './pages/StudentSubmissionReview';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & General Routes with Navbar & Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/materials" element={<StudyMaterials />} />
            
            {/* Student Assessment & Discussion Pages */}
            <Route
              path="/quizzes/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <QuizAttempt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quizzes/results/:attemptId"
              element={
                <ProtectedRoute allowedRoles={['student', 'instructor']}>
                  <QuizResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AssignmentSubmission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments/:id/status"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AssignmentStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id/discussions"
              element={
                <ProtectedRoute allowedRoles={['student', 'instructor']}>
                  <CourseDiscussionForum />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['student', 'instructor']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Dedicated Full-Screen Video Lesson Player */}
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={
              <ProtectedRoute allowedRoles={['student', 'instructor']}>
                <VideoLessonPlayer />
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/my-learning" element={<MyLearning />} />
          </Route>

          {/* Instructor Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<CourseManagement />} />
            <Route path="/instructor/quizzes" element={<QuizAndAssignmentManagement />} />
            <Route path="/instructor/submissions" element={<StudentSubmissionReview />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
