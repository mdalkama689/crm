import { ChevronDown,  Power } from 'lucide-react';
import { axiosInstance } from '../api/axios';
import type { ApiResponse } from '../types/ApiResponse';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner'; 

interface UserProfileResponse extends ApiResponse {
  user: {
    fullname: string;
    email: string;
  };
}

interface AvatarUrlReponse extends ApiResponse {
  avatarUrl: string;
}

const Profile = () => {
  const [email, setEmail] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [isAvatarUrl, setIsAvatarUrl] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [firstChar, setFirstChar] = useState<string>('');

  const fetchUserProfile = async () => {
    try {
      const profileResponse =
        await axiosInstance.get<UserProfileResponse>('/me');
     
      const gravatarReponse = await axiosInstance.get<AvatarUrlReponse>(
        '/get-avatar-url-from-gravatar',
      );

      if (profileResponse.data.success) {
        setEmail(profileResponse.data.user.email);
        setFullname(profileResponse.data.user.fullname);
      }

      if (gravatarReponse.data.success) {
        if (
          !gravatarReponse.data.avatarUrl.trim() ||
          gravatarReponse.data.avatarUrl.trim() == ''
        ) {
          setIsAvatarUrl(false);
          const getFirstChar = profileResponse.data.user.fullname
            .charAt(0)
            .toUpperCase();
          setFirstChar(getFirstChar);
        } else {
          setIsAvatarUrl(true);
          setAvatarUrl(gravatarReponse.data.avatarUrl);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'Error while fetching profile data!';

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
   await axiosInstance.post('/log-out')
 
  }
  return (
    <div className="flex gap-2 items-center justify-center">
      <div className="h-[50px] w-[50px] bg-[#D0D5DD] rounded-full flex items-center justify-center text-black font-bold">
        {isAvatarUrl ? (
          <img src={avatarUrl} alt="" className="h-7" />
        ) : (
          <p className="text-[#F16334] text-[24px] font-medium">{firstChar}</p>
        )}
      </div>
      <div>
        <p className="font-semibold text-[15px]">
          {fullname.charAt(0).toUpperCase() +
            fullname.slice(1, fullname.length)}
        </p>
        <p className="font-normal text-[15px]">{email}</p>
      </div>
      <ChevronDown /> 
  <Power 
    className="cursor-pointer" 
    onClick={handleLogout} 
  />
 

    </div>
  );
};

export default Profile;
