import { Route, Routes } from 'react-router-dom';
import AdminSignUp from './pages/auth/admin/SignUp';
import CompanyDetails from './pages/auth/admin/CompanyDetails';
import AdminNewsLetter from './pages/auth/admin/NewsLetter';
import AdminForgotPassword from './pages/auth/admin/ForgotPassword';
import AdminResetPassword from './pages/auth/admin/ResetPassword';
import AdminSignIn from './pages/auth/admin/SignIn';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/auth/employee/SignUp';
import SignIn from './pages/auth/employee/SignIn';
import SendInvitation from './pages/auth/admin/SendInvitation';
import NewsLetter from './pages/auth/employee/NewsLetter';
import ForgotPassword from './pages/auth/employee/ForgotPassword';
import ResetPassword from './pages/auth/employee/ResetPassword';
import AuthWrapper from './components/AuthWrapper';
import PublicWrapper from './components/PublicWrapper';
import RoleProtectRoute from './components/RoleProtectRoute';
import NotFound from './pages/NotFound';
import AllEmployee from './components/AllEmployee';

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicWrapper />}>
          <Route path="/admin/sign-up" element={<AdminSignUp />} />
          <Route path="/admin/company-details" element={<CompanyDetails />} />
          <Route
            path="/admin/forgot-password"
            element={<AdminForgotPassword />}
          />
          <Route
            path="/admin/reset-password"
            element={<AdminResetPassword />}
          />
          <Route path="/admin/sign-in" element={<AdminSignIn />} />
        </Route>

        <Route element={<RoleProtectRoute allowedRole={['owner', 'admin']} />}>
          <Route path="/send-invitation" element={<SendInvitation />} />
          <Route path="/employees" element={<AllEmployee />} />
        </Route>

        <Route element={<AuthWrapper />}>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/admin/subscribe-news-letter"
            element={<AdminNewsLetter />}
          />
          <Route path="/subscribe-news-letter" element={<NewsLetter />} />
        </Route>
        <Route element={<PublicWrapper />}>
          <Route path="/invite" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
