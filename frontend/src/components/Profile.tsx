import { ChevronDown, Power } from 'lucide-react';
import { axiosInstance } from '../api/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../slices/store';

const Profile = () => {
  const { user, avatarUrl } = useSelector((state: RootState) => state.auth);

  if (!user) return;

  const handleLogout = async () => {
    await axiosInstance.post('/log-out');
  };

  return (
    <div className="flex gap-2 items-center justify-center">
      <div className="h-[50px] w-[50px] bg-[#D0D5DD] rounded-full flex items-center justify-center text-black font-bold">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-7" />
        ) : (
          <p className="text-[#F16334] text-[24px] font-medium">
            {user.fullname.charAt(0).toUpperCase()}
          </p>
        )}
      </div>
      <div>
        <p className="font-semibold text-[15px]">
          {user.fullname.charAt(0).toUpperCase() +
            user.fullname.slice(1, user.fullname.length)}
        </p>
        <p className="font-normal text-[15px]">{user.email}</p>
      </div>
      <ChevronDown />
      <Power className="cursor-pointer" onClick={handleLogout} />
    </div>
  );
};

export default Profile;
