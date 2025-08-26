import {
  BarChart2,
  Bell,
  Bolt,
  Calendar,
  CheckSquare,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  Globe,
  Grid,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  Package,
  Plus,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import SearchBar from '../components/Searchbar';
import Profile from '../components/Profile';
import { useState } from 'react';
import CreateMenu from '../components/CreateMenu';
import { useSelector } from 'react-redux';
import type { RootState } from '../slices/store';

const iconList = [
  { label: 'dashboard', icon: <Grid className="h-5 w-5 hover:text-black" /> },
  { label: 'projects', icon: <Folder className="h-5 w-5 hover:text-black" /> },
  {
    label: 'tasks',
    icon: <CheckSquare className="h-5 w-5 hover:text-black" />,
  },
  {
    label: 'workspaces',
    icon: <LayoutGrid className="h-5 w-5 hover:text-black" />,
  },
  {
    label: 'calendar',
    icon: <Calendar className="h-5 w-5 hover:text-black" />,
  },
  { label: 'contacts', icon: <Users className="h-5 w-5 hover:text-black" /> },
  {
    label: 'messages',
    icon: <MessageSquare className="h-5 w-5 hover:text-black" />,
  },
  { label: 'products', icon: <Package className="h-5 w-5 hover:text-black" /> },
  {
    label: 'invoices',
    icon: <FileText className="h-5 w-5 hover:text-black" />,
  },
  {
    label: 'filebrowser',
    icon: <FolderOpen className="h-5 w-5 hover:text-black" />,
  },
  {
    label: 'notifications',
    icon: <Bell className="h-5 w-5 hover:text-black" />,
  },
  {
    label: 'reports',
    icon: <BarChart2 className="h-5 w-5 hover:text-black" />,
  },
  {
    label: 'helpcenter',
    icon: <HelpCircle className="h-5 w-5 hover:text-black" />,
  },
];

const Topbar = () => {
  const [showCreateMenu, setShowCreateMenu] = useState<boolean>(false);
  const { isSideBarOpen, currentSideBarTab } = useSelector(
    (state: RootState) => state.sidebar,
  );

  const getIcon = (type: string | undefined) => {
    if (!type) return;

    const match = iconList.find(
      (icon) => icon.label.trim().toLowerCase() === type.trim().toLowerCase(),
    );

    if (match) {
      return match.icon;
    }
  };

  return (
    <div
      className={`fixed top-0  flex items-center  ${isSideBarOpen ? 'left-[300px] w-[calc(100%-300px)]' : 'left-[80px] w-[calc(100%-80px)]'} bg-[#e6e0e0] py-2`}
    >
      <div className="flex items-center justify-between w-full px-5">
        <div className="flex gap-1 items-center justify-start p-2 cursor-pointer">
          {getIcon(currentSideBarTab)}

          <p className="font-medium leading-5  text-[18px] text-black">
            {currentSideBarTab.charAt(0).toUpperCase() +
              currentSideBarTab.slice(1, currentSideBarTab.length)}
          </p>
        </div>
        <SearchBar />

        <div className="flex gap-3 items-center relative">
          <Button className="bg-transparent text-black hover:bg-transparent">
            <Globe size={24} color="#667085" />
            <span className="font-normal text-[14px] leading-[21px] text-[#101828]">
              EN
            </span>{' '}
            <ChevronDown size={16} color="#667085" />
          </Button>
          <Bolt size={24} color="#667085" />
          <div>
            <Button
              className="flex items-center justify-center gap-2 cursor-pointer bg-[#A176F7] hover:bg-[#9d6dfd] rounded-full"
              onClick={() => setShowCreateMenu(!showCreateMenu)}
            >
              <span className="text-[#fefefe]">Add</span>
              <Plus size={24} color="#fefefe" />
            </Button>
            <CreateMenu
              open={showCreateMenu}
              onClose={() => setShowCreateMenu(false)}
            />
          </div>
        </div>
        <Profile />
      </div>
    </div>
  );
};

export default Topbar;
