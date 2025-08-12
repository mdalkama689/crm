import { useState } from 'react';
import {
  verifyOtpSchema,
  type VerifyOtpInput,
} from 'shared/src/schema/verify-otp-schema';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import type { ApiResponse } from '../../../types/ApiResponse';
import { axiosInstance } from '../../../api/axios';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

const VeifyOtp = ({ email }: { email: string }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyOtpSchema),
  });

  const navigate = useNavigate();

  interface VerifyOtpResponse extends ApiResponse {
    token: string;
  }

  const onSubmit = async (data: VerifyOtpInput) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post<VerifyOtpResponse>(
        '/admin/verify-otp',
        data,
      );

      if (response.data.success) {
        const token = response.data.token;
        navigate(`/reset-password?email=${email}&token=${token}`);
        toast.success(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'Something webt wrong while verying otp';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    if (errors.email) {
      return toast.error(errors.email.message);
    }

    if (errors.otp) {
      return toast.error(errors.otp.message);
    }
  };

  return (
    <form
      className="flex gap-4 flex-col pt-12 px-8"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <div className="hidden">
        <Label
          htmlFor="email"
          className="font-normal text-[#101828] text-[14px] leading-[21px]"
        >
          email
        </Label>

        <Input
          id="email"
          type="text"
          defaultValue={email}
          {...register('email')}
          placeholder="Enter email"
          className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
        />
      </div>

      <div className="flex flex-col gap-[6px]">
        <Label
          htmlFor="otp"
          className="font-normal text-[#101828] text-[14px] leading-[21px]"
        >
          OTP
        </Label>

        <Input
          id="otp"
          type="text"
          {...register('otp')}
          placeholder="Enter OTP code"
          className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
          disabled={isSubmitting}
        />
      </div>

      <Button
        disabled={isSubmitting}
        className="h-[60px] py-[18px] text-black bg-[#F16334] cursor-pointer hover:bg-[#F16334] rounded-[360px] font-medium text-[16px] leading-[24px]"
      >
        Continue
      </Button>
    </form>
  );
};

export default VeifyOtp;
