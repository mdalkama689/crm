import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpSchema } from 'shared/src/schema/sign-up-schema';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios'; 
import { axiosInstance } from '../../../api/axios';
import type { ApiResponse } from '../../../types/ApiResponse';
import Header from '../../../layout/Header';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  type FormData = z.infer<typeof signUpSchema>;

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post<ApiResponse>('/admin/sign-up', data);

      if (response.data.success) {
        toast.success('Account created successfully!');
        navigate(`/admin/company-details?email=${data.email}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'Error during creating an account!';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    if (errors.fullname) {
      return toast.error(errors.fullname.message);
    }
    if (errors.email) {
      return toast.error(errors.email.message);
    }

    if (errors.password) {
      return toast.error(errors.password.message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gray-200">
      <Header />

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
                htmlFor="fullname"
                className="font-normal text-[#101828] text-[14px] leading-[21px]"
              >
                Full Name
              </Label>
              <Input
                id="fullname"
                type="text"
                {...register('fullname')}
                placeholder="Enter your name"
                className="rounded-full py-4 px-5 h-[52px] text-black"
                disabled={isSubmitting}
              />
            </div>

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
                  className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
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
              disabled={isSubmitting}
              type="submit"
              className="h-[60px] py-[18px] bg-[#F16334] cursor-pointer hover:bg-[#F16334] rounded-[360px] font-medium text-[16px] leading-[24px] text-[#101828]"
            >
              {' '}
              Sign up{' '}
            </Button>
          </form>
          <p className="text-center mt-4 font-normal text-[14px] leading-[21px] text-[#475467]">
            -- Or sign up with --{' '}
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
              <img src="/auth/facebook-logo.png" alt="" className="h-[25px]" />
              <p>Facebook </p>
            </div>
          </div>

          <p className="text-center mt-6 text-[#101828] font-normal text-[14px] leading-[21px]">
            Already have an account?{' '}
            <Link to="/admin/sign-in" className="text-[#A176F7] font-semibold">
              Sign in
            </Link>
          </p>

          <p className="text-[12px] text-center mt-2 font-semibold leading-[18px]">
            By "Sign Up", you agree to the our{' '}
            <Link
              to="/term-and-conditions"
              className="text-[#A176F7] font-bold"
            >
              {' '}
              Terms of Use{' '}
            </Link>
            and{' '}
            <Link to="/privacy-and-policy" className="text-[#A176F7] font-bold">
              {' '}
              Privacy Policy
            </Link>{' '}
          </p>
          <div className="pb-10"></div>
        </div>
      </div>
      <div className="pb-[300px]"></div>
    </div>
  );
};

export default SignUp;
