import { Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './lib/supabase';
import Navbar from './components/Navbar';
import ImportForm from './components/ImportForm';
import StatsBar from './components/StatsBar';
import CategoryFilter from './components/CategoryFilter';
import AnalysisResult from './components/AnalysisResult';
import ContentList from './components/ContentList';
import Toast from './components/Toast';
import TrashFAB from './components/TrashFAB';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';

function PrivateRoute({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AppHome() {
  return (
    <>
      <Navbar />
      <main>
        <ImportForm />
        <StatsBar />
        <CategoryFilter />
        <AnalysisResult />
        <ContentList />
      </main>
      <Toast />
      <TrashFAB />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <AppHome />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
