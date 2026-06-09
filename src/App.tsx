import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import PlanList from './pages/Plans/PlanList';
import PlanForm from './pages/Plans/PlanForm';
import PlanDetail from './pages/Plans/PlanDetail';
import ReviewList from './pages/Review/ReviewList';
import ReviewDetail from './pages/Review/ReviewDetail';
import TrainingProgram from './pages/TrainingProgram/TrainingProgram';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="plans" element={<PlanList />} />
          <Route path="plans/new" element={<PlanForm />} />
          <Route path="plans/:id" element={<PlanDetail />} />
          <Route path="plans/:id/edit" element={<PlanForm />} />
          <Route path="review" element={
            <ProtectedRoute allowedRoles={['college_admin', 'academic_admin', 'system_admin']}>
              <ReviewList />
            </ProtectedRoute>
          } />
          <Route path="review/:id" element={
            <ProtectedRoute allowedRoles={['college_admin', 'academic_admin', 'system_admin']}>
              <ReviewDetail />
            </ProtectedRoute>
          } />
          <Route path="training-programs" element={
            <ProtectedRoute allowedRoles={['system_admin', 'academic_admin']}>
              <TrainingProgram />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
