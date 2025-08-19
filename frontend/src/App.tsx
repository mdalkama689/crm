import { Route, Routes } from 'react-router-dom';
import CreateCompany from './pages/CreateCompany';
import CompanyDetails from './pages/CompanyDetails';
import NewsLetter from './pages/NewsLetter';
import PublicWrapper from './components/PublicWrapper';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SignIn from './pages/SignIn';
import RoleProtectRoute from './components/RoleProtectRoute';
import SendInvitation from './pages/SendInvitation';
import AuthWrapper from './components/AuthWrapper';
import Dashboard from './pages/Dashboard';
import Invite from './pages/Invite';
import EachProject from './components/project/EachProject';

function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicWrapper />}>
          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="/company-details" element={<CompanyDetails />} />
           <Route
            path="/subscribe-news-letter"
            element={<NewsLetter />}
          />
    <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />
          <Route path="/sign-in" element={<SignIn />} />  
           <Route path="/invite" element={<Invite  />} />
        </Route>  

        <Route element={<RoleProtectRoute allowedRole={[ 'admin']} />}>
          <Route path="/send-invitation" element={<SendInvitation />} />
          {/* <Route path="/employees" element={<AllEmployee />} /> */}
        </Route>

        <Route element={<AuthWrapper />}>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/projects" element={<Project />} /> */}
          
         
        </Route>
   <Route path="/project/:id" element={<EachProject />} /> 
    

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App;
