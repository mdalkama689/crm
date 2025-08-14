import { Mail, MoveLeft } from 'lucide-react';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useNavigateToBack } from '../../../utils/navigateToBack';
import { axiosInstance } from '../../../api/axios';
import type { ApiResponse } from '../../../types/ApiResponse';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import VeifyOtp from './VerifyOtp';
import HomeLayout from '../../../layout/HomeLayout';

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showOtpForm, setShowOtpForm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [otpMinute, setOtpMinute] = useState<number>(0);
  const [otpSecond, setOtpSecond] = useState<number>(0);
  const navigateToBack = useNavigateToBack();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailSchema = z.object({
    email: z
      .string({ error: 'Email is required' })
      .regex(new RegExp(emailRegex), 'Invalid email format.'),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  type ForgotPasswordFormData = z.infer<typeof emailSchema>;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post<ApiResponse>(
        '/forgot-password',
        data,
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail(data.email);
        setShowOtpForm(true);
        startOtpTime();
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

  const startOtpTime = () => {
    let timeLeft = 10 * 60;

    const intervalid = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 1;

        const minute = Math.floor(timeLeft / 60);
        const second = timeLeft % 60;

        setOtpMinute(minute);
        setOtpSecond(second);
      } else {
        clearInterval(intervalid);
      }
    }, 1000);
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
                Lost your password?
              </p>
              <p className="font-semibold text-2xl leading-8 tracking-normal">
                Enter your detail to recover
              </p>
              <p className="text-gray-700 pt-2 font-normal text-[16px] leading-[24px]">
                Please enter your email address account to send the OTP
                verification to reset your password
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
                    disabled={isSubmitting}
                    className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[60px] py-[18px] text-white bg-[#1D2939] cursor-pointer hover:bg-[#1D2939] rounded-[360px] font-medium text-[16px] leading-[24px]"
              >
                Continue
              </Button>
            </form>
            {showOtpForm && (
              <p className="text-[#FC6F6D] font-semibold text-[16px] leading-[24px] text-center py-3">
                OTP expires in {otpMinute >= 10 ? otpMinute : `0${otpMinute}`}m
                : {otpSecond >= 10 ? otpSecond : `0${otpSecond}`}s
              </p>
            )}
            {showOtpForm && <VeifyOtp email={email} />}

            <div className="pb-10"></div>
          </div>
        </div>
        <div className="pb-[300px]"></div>
      </div>
    </HomeLayout>
  );
};

export default ForgotPassword;
