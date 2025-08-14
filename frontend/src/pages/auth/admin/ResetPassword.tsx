import { Eye, EyeOff, KeyRound, MoveLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from 'shared/src/schema/reset-password-schema';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { useNavigateToBack } from '../../../utils/navigateToBack';
import { axiosInstance } from '../../../api/axios';
import type { ApiResponse } from '../../../types/ApiResponse';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import HomeLayout from '../../../layout/HomeLayout';

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigateToBack = useNavigateToBack();

  const [params] = useSearchParams();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const getEmail = params.get('email');
    const getToken = params.get('token');
    if (getEmail && getToken) {
      setValue('email', getEmail);
      setValue('token', getToken);
    }
  }, [setValue, params]);

  const navigate = useNavigate();

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      if (data.newPassword !== data.confirmNewPassword) {
        return toast.error('New password and confirm passowrd must be same.');
      }

      setIsSubmitting(true);
      const response = await axiosInstance.post<ApiResponse>(
        '/admin/reset-password',
        data,
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/admin/sign-in');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'Something went wrong during reset passowrd!';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPassword = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const onError = () => {
    if (errors.email) {
      toast.error(errors.email.message);
    }

    if (errors.token) {
      toast.error(errors.token.message);
    }
    if (errors.newPassword) {
      return toast.error(errors.newPassword.message);
    }

    if (errors.confirmNewPassword) {
      return toast.error(errors.confirmNewPassword.message);
    }
  };

  return (
    <HomeLayout>
      <div className="bg-gray-200">
        <div className="flex items-center justify-center pt-[100px] ">
          <div className="max-w-[506px] w-full  bg-[#FFFFFF] rounded-[12px]">
            <div className="flex items-start  flex-col mt-[32px] px-8">
              <Button
                type="button"
                onClick={navigateToBack}
                className="py-2 px-4 bg-[#1D2939] hover:bg-[#1D2939] cursor-pointer rounded-[360px] w-[85px] h-[36px]"
              >
                <MoveLeft /> <span>Back</span>
              </Button>
              <p className="font-semibold text-2xl leading-8 tracking-normal mt-4">
                Create
              </p>
              <p className="font-semibold text-2xl leading-8 tracking-normal">
                New Password
              </p>
              <p className="text-gray-700 pt-2 font-normal text-[16px] leading-[24px]"></p>
            </div>

            <form
              className="flex gap-4 flex-col pt-12 px-8"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <div className="hidden flex-col gap-[6px]">
                <Label
                  htmlFor="email"
                  className="font-normal text-[#101828] text-[14px] leading-[21px]"
                >
                  Email
                </Label>

                <Input
                  id="email"
                  {...register('email')}
                  type="text"
                  placeholder="email"
                  className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
                />
              </div>

              <div className="hidden flex-col gap-[6px]">
                <Label
                  htmlFor="token"
                  className="font-normal text-[#101828] text-[14px] leading-[21px]"
                >
                  {' '}
                </Label>

                <Input
                  id="token"
                  {...register('token')}
                  type="text"
                  placeholder="Enter password"
                  className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <Label
                  htmlFor="new-password"
                  className="font-normal text-[#101828] text-[14px] leading-[21px]"
                >
                  New Password{' '}
                </Label>
                <div className="flex items-center justify-center relative">
                  <KeyRound
                    size={18}
                    color="#667085"
                    className="absolute left-3 top-[18px]"
                  />
                  <Input
                    id="new-password"
                    {...register('newPassword')}
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    disabled={isSubmitting}
                    className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
                  />
                  {showNewPassword ? (
                    <Eye
                      size={18}
                      color="#000000"
                      className="absolute right-[32px] top-[18px] cursor-pointer"
                      onClick={toggleNewPassword}
                    />
                  ) : (
                    <EyeOff
                      size={18}
                      color="#000000"
                      className="absolute right-[32px] top-[18px] cursor-pointer"
                      onClick={toggleNewPassword}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <Label
                  htmlFor="confirm-new-password"
                  className="font-normal text-[#101828] text-[14px] leading-[21px]"
                >
                  Confirm New Password{' '}
                </Label>
                <div className="flex items-center justify-center relative">
                  <KeyRound
                    size={18}
                    color="#667085"
                    className="absolute left-3 top-[18px]"
                  />
                  <Input
                    id="confirm-new-password"
                    {...register('confirmNewPassword')}
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    disabled={isSubmitting}
                    placeholder="Enter password"
                    className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
                  />
                  {showConfirmNewPassword ? (
                    <Eye
                      size={18}
                      color="#000000"
                      className="absolute right-[32px] top-[18px] cursor-pointer"
                      onClick={toggleConfirmNewPassword}
                    />
                  ) : (
                    <EyeOff
                      size={18}
                      color="#000000"
                      className="absolute right-[32px] top-[18px] cursor-pointer"
                      onClick={toggleConfirmNewPassword}
                    />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[60px] py-[18px] bg-[#F16334] cursor-pointer hover:bg-[#F16334] rounded-[360px] font-medium text-[16px] leading-[24px] text-[#101828]"
              >
                {' '}
                Confirm New Password{' '}
              </Button>
            </form>

            <div className="pb-10"></div>
          </div>
        </div>
        <div className="pb-[300px]"></div>
      </div>
    </HomeLayout>
  );
};

export default ResetPassword;
