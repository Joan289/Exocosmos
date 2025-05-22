import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Auth from "../pages/Auth";
import Profile from "../pages/Profile";
import Menu from "../pages/Menu";
import EditUser from "../pages/EditUser";
import NotFound from "../pages/NotFound";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoutes";
import PublicUserProfile from "../pages/PublicUserProfile";
import SystemDetail from "../pages/SystemDetail";
import SystemCreate from "../pages/SystemCreate";
import Test3D from "../pages/Test3D";
import TestPlanet3D from "../pages/TestPlanet3D";
import SystemEdit from "../pages/SystemEdit";
import StarDetail from "../pages/StarDetail";
import StarEdit from "../pages/StarEdit";
import PlanetTypeSelector from "../pages/PlanetTypeSelector";
import PlanetDetail from "../pages/PlanetDetail";
import PlanetEdit from "../pages/PlanetEdit";
import Explore from "../pages/Explore";

// Importación de las páginas de la guía
import GuideIndex from "../pages/guide/index";
import GuidePrefaci from "../pages/guide/prefaci";
import GuidePrimeresPasses from "../pages/guide/primeres-passes";
import GuideSistemes from "../pages/guide/sistemes";
import GuideEstrelles from "../pages/guide/estrelles";
import GuidePlanetes from "../pages/guide/planetes";
import GuidePerfil from "../pages/guide/perfil";
import GuideFAQ from "../pages/guide/faq";
import GuideResolucioProblemes from "../pages/guide/resolucio-problemes";

const AppRouter = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/test3d" element={<Test3D />} />
        <Route path="/test-planet" element={<TestPlanet3D />} />

        {/* User Guide */}
        <Route path="/guide">
          <Route path="index" element={<GuideIndex />} />
          <Route path="prefaci" element={<GuidePrefaci />} />
          <Route path="primeres-passes" element={<GuidePrimeresPasses />} />
          <Route path="sistemes" element={<GuideSistemes />} />
          <Route path="estrelles" element={<GuideEstrelles />} />
          <Route path="planetes" element={<GuidePlanetes />} />
          <Route path="perfil" element={<GuidePerfil />} />
          <Route
            path="resolucio-problemes"
            element={<GuideResolucioProblemes />}
          />
          <Route path="faq" element={<GuideFAQ />} />

          <Route index element={<Navigate to="index" replace />} />
        </Route>

        {/* Private routes with AuthProvider */}
        <Route path="/app" element={<ProtectedRoute />}>
          <Route path="menu" element={<Menu />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/app/explore/:resourceType?" element={<Explore />} />

          <Route path="users">
            <Route path="edit" element={<EditUser />} />
            <Route path=":id" element={<PublicUserProfile />} />
          </Route>

          <Route path="systems">
            <Route path=":id" element={<SystemDetail />} />
            <Route path="create" element={<SystemCreate />} />
            <Route path=":id/edit" element={<SystemEdit />} />
          </Route>

          <Route path="stars">
            <Route path=":id" element={<StarDetail />} />
            <Route path=":id/edit" element={<StarEdit />} />
          </Route>

          <Route path="planets">
            <Route path=":id" element={<PlanetDetail />} />
            <Route path=":systemId/create" element={<PlanetTypeSelector />} />
            <Route path=":id/edit" element={<PlanetEdit />} />
          </Route>

          {/* Default /app page*/}
          <Route index element={<Navigate to="menu" replace />} />
        </Route>

        {/* Catch unmatched public routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRouter;
