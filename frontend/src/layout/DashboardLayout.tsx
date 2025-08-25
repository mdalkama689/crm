import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <Sidebar />
      <Topbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
