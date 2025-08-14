import HomeLayout from '../layout/HomeLayout';
import Sidebar from '../layout/Sidebar';
import Topbar from '../layout/Topbar';

const Dashboard = () => {
  return (
    <HomeLayout>
      <Sidebar />
      <Topbar />
    </HomeLayout>
  );
};

export default Dashboard;
