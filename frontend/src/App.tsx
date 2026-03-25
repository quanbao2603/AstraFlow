import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/home/Home';
import ExplorePage from './pages/explore/ExplorePage';
import CommunityPage from './pages/community/CommunityPage';
import AuthPage from './pages/auth/AuthPage';
import { ROUTES } from './config/routes';

// Studio Pages
import StudioLayout from './layouts/StudioLayout';
import LibraryPage from './pages/studio/LibraryPage';
import CreateStoryPage from './pages/studio/CreateStoryPage';
import ImportStoryPage from './pages/studio/ImportStoryPage';
import ApiSettingsPage from './pages/studio/ApiSettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Shared Layout */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.PUBLIC.HOME} element={<Home />} />
          <Route path={ROUTES.PUBLIC.EXPLORE} element={<ExplorePage />} />
          <Route path={ROUTES.PUBLIC.COMMUNITY} element={<CommunityPage />} />
        </Route>
        
        {/* Auth Route without the public layout */}
        <Route path={ROUTES.PUBLIC.AUTH} element={<AuthPage />} />

        {/* Studio Routes */}
        <Route path={ROUTES.STUDIO.ROOT} element={<StudioLayout />}>
          <Route index element={<Navigate to={ROUTES.STUDIO.LIBRARY} replace />} />
          <Route path={ROUTES.STUDIO.LIBRARY} element={<LibraryPage />} />
          <Route path={ROUTES.STUDIO.CREATE} element={<CreateStoryPage />} />
          <Route path={ROUTES.STUDIO.IMPORT} element={<ImportStoryPage />} />
          <Route path={ROUTES.STUDIO.API_KEYS} element={<ApiSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;