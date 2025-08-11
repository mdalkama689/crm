import { MoveLeft } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companyDetailsSchema } from 'shared/src/schema/sign-up-schema';
import * as z from 'zod';

import { toast } from 'sonner';
import type { AxiosError } from 'axios'; 
import { useNavigateToBack } from '../../../utils/navigateToBack';
import { axiosInstance } from '../../../api/axios';
import type { ApiResponse } from '../../../types/ApiResponse';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../layout/Header';
import { Button } from '../../../components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';

const employeeRangeOptions = [
  {
    value: 'RANGE_1_10',
    option: '1-10',
  },
  {
    value: 'RANGE_10_50',
    option: '10-50',
  },
  {
    value: 'RANGE_50_100',
    option: '50-100',
  },
  {
    value: 'RANGE_100_PLUS',
    option: '100+',
  },
];

const CompanyDetails = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const email = search.get('email') ?? '';

  const navigateToBack = useNavigateToBack()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  type FormData = z.infer<typeof companyDetailsSchema>;

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(companyDetailsSchema) });

  const selectedEmployeeRange = watch('employeeRange');

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post<ApiResponse>(
        '/admin/company-details',
        data,
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/admin/subscribe-news-letter');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        'Error while adding company details';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // need to fix this 
  const onError = () => {
    if (errors.address) {
    }
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-gray-200">
      <Header />

      <div className="flex items-center justify-center pt-[100px] ">
        <div className="max-w-[506px] w-full  bg-[#FFFFFF] rounded-[12px]">
          <div className="flex items-start  flex-col mt-[32px] px-8">
            <Button type='button' onClick={navigateToBack} className="py-2 px-4 bg-[#1D2939] hover:bg-[#1D2939] cursor-pointer rounded-[360px] w-[85px] h-[36px]">
              <MoveLeft /> <span>Back</span>
            </Button>
            <p className="font-semibold text-2xl leading-8 tracking-normal mt-4">
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
            <div className="hidden">
              <Label
                htmlFor="email"
                className="font-normal text-[#101828] text-[14px] leading-[21px]"
              >
                Email
              </Label>

              <Input
                id="email"
                type="text"
                defaultValue={email}
                {...register('email')}
                placeholder="sample@email.com"
                className="rounded-full py-4  px-5 pl-8 h-[52px] text-[#98A2B3]"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <Label
                htmlFor="companyName"
                className="font-normal text-[#101828] text-[14px] leading-[21px]"
              >
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                {...register('companyName')}
                disabled={isSubmitting}
                placeholder="Enter your company name"
                className="rounded-full py-4 px-5 h-[52px] text-black"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <Label
                htmlFor="employeeRange"
                className="font-normal text-[#101828] text-[14px] leading-[21px]"
              >
                Employee Range
              </Label>
              <Select
                value={selectedEmployeeRange || ''}
                onValueChange={(value) =>
                  setValue('employeeRange', value as FormData['employeeRange'])
                }
                disabled={isSubmitting}
              >
                <SelectTrigger
                  className="rounded-full py-4 px-5  text-black w-full "
                  style={{
                    height: '52px',
                  }}
                >
                  <SelectValue
                    placeholder="Select employee range"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent>
                  {employeeRangeOptions.map((item) => (
                    <SelectItem value={item.value}>{item.option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-[6px]">
              <Label
                htmlFor="businessType"
                className="font-normal text-[#101828] text-[14px] leading-[21px]"
              >
                Business{' '}
              </Label>
              <Input
                id="businessType"
                type="text"
                {...register('businessType')}
                disabled={isSubmitting}
                placeholder="Example: F&B, Finace, etc"
                className="rounded-full py-4 px-5 h-[52px] text-black"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <Label
                htmlFor="address"
                className="font-normal text-[#101828] text-[14px] leading-[21px]"
              >
                Address{' '}
              </Label>
              <Textarea
                id="address"
                placeholder="Enter the description"
                {...register('address')}
                disabled={isSubmitting}
                className="rounded-[15px] py-4 px-5 h-[150px] text-black"
              />
            </div>

            <div className="flex gap-3">
              <Button
              type='button'
                className="h-[60px] w-[50%] py-[18px] border border-gray-300 bg-transparent cursor-pointer hover:bg-transparent rounded-[360px] font-medium text-[16px] leading-[24px] text-[#101828]"
                onClick={navigateToHome}
              >
                {' '}
                Skip{' '}
              </Button>
              <Button
                type="submit"
                className="h-[60px] w-[50%] py-[18px] bg-[#A176F7] cursor-pointer hover:bg-[#A176F7] rounded-[360px] font-medium text-[16px] leading-[24px] text-white"
              >
                {' '}
                Next{' '}
              </Button>
            </div>
          </form>
          <div className="pb-10"></div>
        </div>
      </div>
      <div className="pb-[300px]"></div>
    </div>
  );
};

export default CompanyDetails;
