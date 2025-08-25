import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  signInSchema,
  type SignInInputUser,
} from 'shared/src/schema/sign-in-schema';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { axiosInstance } from '../api/axios';
import type { ApiResponse } from '../types/ApiResponse';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import HomeLayout from '../layout/HomeLayout';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signInSchema) });
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const onSubmit = async (data: SignInInputUser) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post<ApiResponse>('/sign-in', data);
      if (response.data.success) {
        toast.success('Logged in successfully!');
        navigate('/');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || 'Error during sign in';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    if (errors.email) {
      return toast.error(errors.email.message);
    }
    if (errors.password) {
      return toast.error(errors.password.message);
    }
  };

  return (
    <HomeLayout>
      <div className="bg-gray-200">
        <div className="flex items-center justify-center pt-[100px] ">
          <div className="max-w-[506px] w-full  bg-[#FFFFFF] rounded-[12px]">
            <div className="flex items-center justify-center flex-col ">
              <p className="font-semibold text-2xl leading-8 tracking-normal mt-[32px]">
                Welcome back to our CRM
              </p>
              <p className="font-semibold text-2xl leading-8 tracking-normal">
                Sign In to getting started
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
                    placeholder="sample@email.com"
                    {...register('email')}
                    className="rounded-full py-4  px-5 pl-8 h-[52px] text-[#98A2B3]"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <Label
                  htmlFor="password"
                  className="font-normal text-[#101828] text-[14px] leading-[21px]"
                >
                  Password{' '}
                </Label>
                <div className="flex items-center justify-center relative">
                  <KeyRound
                    size={18}
                    color="#667085"
                    className="absolute left-3 top-[18px]"
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Enter password"
                    className="rounded-full py-4  px-5 pl-8 h-[52px] text-[#98A2B3]"
                    disabled={isSubmitting}
                  />
                  {showPassword ? (
                    <Eye
                      size={18}
                      color="#000000"
                      className="absolute right-[32px] top-[18px] cursor-pointer"
                      onClick={togglePassword}
                    />
                  ) : (
                    <EyeOff
                      size={18}
                      color="#000000"
                      className="absolute right-[32px] top-[18px] cursor-pointer"
                      onClick={togglePassword}
                    />
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="h-[60px] py-[18px] bg-[#F16334] cursor-pointer hover:bg-[#F16334] rounded-[360px] font-medium text-[16px] leading-[24px] text-[#101828]"
                disabled={isSubmitting}
              >
                {' '}
                Sign in{' '}
              </Button>
            </form>

            <div className="flex justify-between px-8 py-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  className="h-4 w-4 border border-gray-500 rounded-[4px] "
                />
                <Label
                  htmlFor="terms"
                  className="text-black font-normal text-[14px] leading-[21px]"
                >
                  Remember me
                </Label>
              </div>

              <Link
                to="/admin/forgot-password"
                className="text-[#A176F7] font-medium text-[14px] leading-[21px]"
              >
                Forgot Password
              </Link>
            </div>

            <p className="text-center mt-0 font-normal text-[14px] leading-[21px] text-[#475467]">
              -- Or sign in with --{' '}
            </p>

            <div className="flex items-center justify-center mt-5 gap-4">
              <div className="flex items-center justify-center gap-3 cursor-pointer border border-gray-400 rounded-full h-[52px] py-4 px-5">
                <img src="/auth/google-logo.png" alt="" className="h-[25px]" />
                <p>Google</p>
              </div>
              <div className="flex items-center justify-center cursor-pointer gap-3 border border-gray-400 rounded-full h-[52px] py-4 px-5">
                <img src="/auth/apple-logo.png" alt="" className="h-[25px]" />
                <p>Apple ID </p>
              </div>
              <div className="flex items-center justify-center cursor-pointer gap-3 border border-gray-400 rounded-full h-[52px] py-4 px-5">
                <img
                  src="/auth/facebook-logo.png"
                  alt=""
                  className="h-[25px]"
                />
                <p>Facebook </p>
              </div>
            </div>

            <p className="text-center mt-6 text-[#101828] font-normal text-[14px] leading-[21px]">
              Don't have any account?{' '}
              <Link
                to="/admin/sign-up"
                className="text-[#A176F7] font-semibold"
              >
                Sign Up
              </Link>
            </p>

            <p className="text-[12px] text-center mt-2 font-semibold leading-[18px]">
              By "Sign in", you agree to the our{' '}
              <Link
                to="/term-and-conditions"
                className="text-[#A176F7] font-bold"
              >
                {' '}
                Terms of Use{' '}
              </Link>
              and{' '}
              <Link
                to="/privacy-and-policy"
                className="text-[#A176F7] font-bold"
              >
                {' '}
                Privacy Policy
              </Link>{' '}
            </p>
            <div className="pb-10"></div>
          </div>
        </div>
        <div className="pb-[300px]"></div>
      </div>
    </HomeLayout>
  );
};

export default SignIn;
