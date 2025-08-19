import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Sidebar />
      <Topbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
