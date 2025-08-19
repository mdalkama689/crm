import { useEffect, useState } from 'react';
import { Label } from '../components/ui/label';  
import { Input } from '../components/ui/input';  
import { Button } from '../components/ui/button';  
import { Mail } from 'lucide-react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { axiosInstance } from '../api/axios';  
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types/ApiResponse'; 
import HomeLayout from '../layout/HomeLayout';  
import {  useSelector } from 'react-redux';
import { type RootState } from '../slices/store';

const SendInvitation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailSchema = z.object({
    email: z
      .string({ error: 'Email is required' })
      .regex(new RegExp(emailRegex), 'Invalid email format.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    const getLoggedValueFromLocalStorage = localStorage.getItem('login');

    if (getLoggedValueFromLocalStorage) {
      setIsLoggedIn(true);
    }
  }, []);

  type FormData = z.infer<typeof emailSchema>;


  const {user} = useSelector((state: RootState) => state.auth)

  const onSubmit = async (data: FormData) => {
    try {
      
      setIsSubmitting(true);
      console.log(" data : ", data)
      const payload = {
        ...data,
        tenantId: user?.tenantId 
      }
      const response = await axiosInstance.post<ApiResponse>(
        '/send-invitation',
        payload,
      );

      console.log(response.data)
      if (response.data.success) {
        return toast.info(response.data.message);
      } else {
        return toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        'Something went wrong during forgotting password.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    if (errors.email) {
      return toast.error(errors.email.message);
    }
  };

  if (!isLoggedIn) {
    return <p>Please login to continue</p>;
  }

  return (
    <HomeLayout>
      <div className="bg-gray-200">
        <div className="flex items-center justify-center pt-[100px] ">
          <div className="max-w-[506px] w-full  bg-[#FFFFFF] rounded-[12px]">
            <div className="flex items-center justify-center flex-col ">
              <p className="font-semibold text-2xl leading-8 tracking-normal mt-[32px]">
                Welcome to our CRM
              </p>
              <p className="font-semibold text-2xl leading-8 tracking-normal">
                Sign Up to getting started
              </p>
              <p className="text-gray-700 pt-2 font-normal text-[16px] leading-[24px]">
                Enter your detail to proceed further
              </p>
            </div>

            <form
              className="flex gap-4 flex-col pt-12 px-8"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <div className="flex flex-col gap-[6px]">
                <Label
                  htmlFor="email"
                  className="font-normal text-[#101828] text-[14px] leading-[21px]"
                >
                  Email
                </Label>
                <div className="flex items-center justify-center relative">
                  <Mail
                    size={18}
                    color="#667085"
                    className="absolute left-3 top-[18px]"
                  />
                  <Input
                    id="email"
                    type="text"
                    {...register('email')}
                    placeholder="sample@email.com"
                    className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button
                disabled={isSubmitting}
                type="submit"
                className="h-[60px] py-[18px] bg-[#F16334] cursor-pointer hover:bg-[#F16334] rounded-[360px] font-medium text-[16px] leading-[24px] text-[#101828]"
              >
                {' '}
                Send Invitation{' '}
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

export default SendInvitation;
