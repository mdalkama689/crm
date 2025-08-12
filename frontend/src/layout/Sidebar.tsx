import { ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../src/assets/logo/logo.png';
import { useState } from 'react';
import {
  Grid,
  Folder,
  CheckSquare,
  LayoutGrid,
  Calendar,
  Users,
  MessageSquare,
  Package,
  FileText,
  FolderOpen,
  Bell,
  BarChart2,
  HelpCircle,
} from 'lucide-react';
import SocialHandle from './SocialHandle';

const menuItems = [
  { id: 1, label: 'Dashboard', icon: Grid },
  { id: 2, label: 'Projects', icon: Folder },
  { id: 3, label: 'Tasks', icon: CheckSquare },
  { id: 4, label: 'Workspaces', icon: LayoutGrid },
  { id: 5, label: 'Calendar', icon: Calendar },
  { id: 6, label: 'Contacts', icon: Users },
  { id: 7, label: 'Messages', icon: MessageSquare },
  { id: 8, label: 'Products', icon: Package },
  { id: 9, label: 'Invoices', icon: FileText },
  { id: 10, label: 'File Browser', icon: FolderOpen },
  { id: 11, label: 'Notifications', icon: Bell },
  { id: 12, label: 'Reports', icon: BarChart2 },
  { id: 13, label: 'Help Center', icon: HelpCircle },
];

const Sidebar = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-[300px] bg-[#101828] h-screen overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-[-100px]'} [&::-webkit-scrollbar]:hidden scrollbar-hide`}
    >
      <div
        className="absolute top-1 right-[-10px] bg-slate-700 cursor-pointer p-1 rounded-lg"
        onClick={toggleSidebar}
      >
        {isVisible ? (
          <ChevronLeft className="text-white" />
        ) : (
          <ChevronRight className="text-white" />
        )}
      </div>
      <div className="flex items-start justify-center gap-3 pt-3 px-4">
        <img src={logo} alt="logo" className="h-[50px] w-[50px]" />
        <div className="flex flex-col gap-2">
          <p className="font-medium text-[22px] leading-4 text-white">
            OnPoint
          </p>
          <p className="font-light text-[13px] leading-3 text-white">
            CRM Template Design
          </p>
        </div>
      </div>

      <div className="pt-5">
        {menuItems.map((menu) => {
          const Icon = menu.icon;
          return (
            <div className="flex gap-1 items-center justify-start bg-transparent mt-2  transition-transform duration-300 ease-in-out hover:bg-[#F16334] group p-2 mx-4 rounded-lg cursor-pointer">
              <Icon className="h-5 w-5 text-[#98A2B3] group-hover:text-black" />
              <p className="font-normal leading-5 text-[#98A2B3]  text-[18px] group-hover:text-black">
                {menu.label}
              </p>
            </div>
          );
        })}
      </div>
      <SocialHandle />

      <div className="pb-12"></div>
    </div>
  );
};

export default Sidebar;
