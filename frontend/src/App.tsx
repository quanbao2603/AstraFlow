// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/home/Home';
import ExplorePage from './pages/explore/ExplorePage';
import CommunityPage from './pages/community/CommunityPage';
import AuthPage from './pages/auth/AuthPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import ReaderPage from './pages/reader/ReaderPage';
import ProfilePage from './pages/reader/ProfilePage';
import { ROUTES } from './config/routes';

// Studio Pages
import StudioLayout from './layouts/StudioLayout';
import LibraryPage from './pages/studio/LibraryPage';
import CreateStoryPage from './pages/studio/CreateStoryPage';
import ImportStoryPage from './pages/studio/ImportStoryPage';
import ApiSettingsPage from './pages/studio/ApiSettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Shared Layout */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.PUBLIC.HOME} element={<Home />} />
            <Route path={ROUTES.PUBLIC.EXPLORE} element={<ExplorePage />} />
            <Route path={ROUTES.PUBLIC.COMMUNITY} element={<CommunityPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>
          
          {/* Auth Route without the public layout */}
          <Route path={ROUTES.PUBLIC.AUTH} element={<AuthPage />} />
          <Route path={ROUTES.PUBLIC.AUTH_CALLBACK} element={<AuthCallbackPage />} />
          <Route path="/read/:storyId" element={<ReaderPage />} />

          {/* Studio Routes - Fully Protected */}
          <Route 
            path={ROUTES.STUDIO.ROOT} 
            element={
              <ProtectedRoute>
                <StudioLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={ROUTES.STUDIO.LIBRARY} replace />} />
            <Route path={ROUTES.STUDIO.LIBRARY} element={<LibraryPage />} />
            <Route path={ROUTES.STUDIO.CREATE} element={<CreateStoryPage />} />
            <Route path={ROUTES.STUDIO.IMPORT} element={<ImportStoryPage />} />
            <Route path={ROUTES.STUDIO.API_KEYS} element={<ApiSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;