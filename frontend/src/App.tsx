import { Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import CompanyDetails from './pages/auth/CompanyDetails';
import NewsLetter from './pages/auth/NewsLetter';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import SignIn from './pages/auth/SignIn';

function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/company-details" element={<CompanyDetails />} />
      <Route path="/subscribe-news-letter" element={<NewsLetter />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  );
}

export default App;
