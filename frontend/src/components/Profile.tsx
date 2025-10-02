import { ChevronDown, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../slices/store/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { logout } from '../slices/AuthSlice';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, avatarUrl } = useSelector((state: RootState) => state.auth);

  if (!user) return;

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    dispatch(logout());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="h-[40px] w-[40px] bg-[#D0D5DD] rounded-full flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[#F16334] text-lg font-medium">
                {user.fullname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <p className="font-semibold">{user.fullname}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link to={'/profile'}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
