import { ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../../src/assets/logo/logo.png';
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
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../slices/store';
import {
  setCurrentSideBarTab, 
  setNotificationCount, 
  toggleSidebar,
} from '../slices/sidebar/SideBarSlice';
import { useNavigate } from 'react-router-dom' 
import { toast } from 'sonner';
import { axiosInstance } from '../api/axios';
import type { NotificationResponse } from '../components/notification/type';
import { useEffect } from 'react';

const menuItems = [
  { id: 1, label: 'Dashboard', icon: Grid, url: '/' },
  { id: 2, label: 'Projects', icon: Folder, url: '/projects' },
  { id: 3, label: 'Tasks', icon: CheckSquare, url: '/tasks' },
  { id: 4, label: 'Workspaces', icon: LayoutGrid, url: '/workspaces' },
  { id: 5, label: 'Calendar', icon: Calendar, url: '/calendar' },
  { id: 6, label: 'Contacts', icon: Users, url: '/contacts' },
  { id: 7, label: 'Messages', icon: MessageSquare, url: '/messages' },
  { id: 8, label: 'Products', icon: Package, url: '/products' },
  { id: 9, label: 'Invoices', icon: FileText, url: '/invoices' },
  { id: 10, label: 'File Browser', icon: FolderOpen, url: '/files' },
  { id: 11, label: 'Notifications', icon: Bell, url: '/notifications' },
  { id: 12, label: 'Reports', icon: BarChart2, url: '/reports' },
  { id: 13, label: 'Help Center', icon: HelpCircle, url: '/help' },
];

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSideBarOpen, currentSideBarTab,notificationCount } = useSelector(
    (state: RootState) => state.sidebar,
  );

  const handleToggleSideBar = () => {
    dispatch(toggleSidebar());
  };

  const navigate = useNavigate();

  const navigateTo = (url: string) => {
    navigate(`${url}`);
  };

  const handleCurrentSideBarTab = (lable: string, url: string) => {
    dispatch(setCurrentSideBarTab(lable.replace(/\s+/g, '')));

    navigateTo(url);
  };

 

useEffect(() => {

  const getNotificationCount =  async () => {
    try { 
      const response = await axiosInstance.get<NotificationResponse>("/notification/all")
    if(response.data.success){
  const unseenNotificationCount = response.data.notifications.filter((notify) => !notify.seen).length
dispatch(setNotificationCount(unseenNotificationCount))

}
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch notification count!")
    }
  }


  getNotificationCount() 
}, [])

  return (
    <div
      className={`fixed top-0 left-0 bg-[#101828] h-screen overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out 
    ${isSideBarOpen ? 'w-[300px]' : 'w-[80px]'} 
    [&::-webkit-scrollbar]:hidden`}
    >
      <div
        className="absolute top-1 right-[-10px] bg-slate-700 cursor-pointer p-1 rounded-lg"
        onClick={handleToggleSideBar}
      >
        {isSideBarOpen ? (
          <ChevronLeft className="text-white" />
        ) : (
          <ChevronRight className="text-white" />
        )}
      </div>

      <div className="flex items-center gap-3 pt-3 px-4">
        <img src={logo} alt="logo" className="h-[50px] w-[50px]" />
        <div
          className={`flex flex-col gap-2 transition-all duration-300 ease-in-out ${
            isSideBarOpen
              ? 'opacity-100 w-auto'
              : 'opacity-0 w-0 overflow-hidden'
          }`}
        >
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
            <div
              key={menu.id}
              className={`flex items-center gap-3 mt-2 ${menu.label.toLowerCase() === currentSideBarTab ? 'bg-[#F16334]' : 'bg-transparent'} hover:bg-[#F16334] group p-2 mx-4 rounded-lg cursor-pointer transition-colors duration-300`}
              onClick={() => handleCurrentSideBarTab(menu.label, menu.url)}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 text-[#98A2B3] group-hover:text-black ${
                    menu.label.toLowerCase() === currentSideBarTab
                      ? 'text-black'
                      : ''
                  }`}
                />

                {menu.label.trim().toLowerCase() === 'notifications' &&
                  notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {notificationCount}
                    </span>
                  )}
              </div>

              <span
                className={`font-normal leading-5 ${menu.label.toLowerCase() === currentSideBarTab ? 'text-black' : ''}  text-[#98A2B3] text-[18px] group-hover:text-black transition-all duration-300 ${
                  isSideBarOpen
                    ? 'opacity-100 w-auto'
                    : 'opacity-0 w-0 overflow-hidden'
                }`}
              >
                {menu.label}
              </span>
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
