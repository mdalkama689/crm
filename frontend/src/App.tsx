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

function App() {
  return (
    <>
      <Routes>
        {/* admin routes */}
        <Route path="/admin/sign-up" element={<AdminSignUp />} />
        <Route path="/admin/company-details" element={<CompanyDetails />} />
        <Route
          path="/admin/subscribe-news-letter"
          element={<AdminNewsLetter />}
        />
        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPassword />}
        />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/admin/sign-in" element={<AdminSignIn />} />
        <Route path="/send-invitation" element={<SendInvitation />} />
        <Route path="/" element={<Dashboard />} />

        {/* employee routes  */}
        <Route path="/invite" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/subscribe-news-letter" element={<NewsLetter />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
