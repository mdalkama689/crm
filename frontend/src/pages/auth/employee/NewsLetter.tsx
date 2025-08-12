import {  Mail, MoveLeft } from 'lucide-react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod" 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; 
import type { AxiosError } from 'axios'; 
import { useNavigateToBack } from '../../../utils/navigateToBack';
import { axiosInstance } from '../../../api/axios';
import type { ApiResponse } from '../../../types/ApiResponse';
import Header from '../../../layout/Header';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailSchema = z.object({
 email: z
    .string({ error: 'Email is required' })
    .regex(new RegExp(emailRegex), 'Invalid email format.'), 
}) 
const NewsLetter = () => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const navigateToBack = useNavigateToBack()
  const {register, handleSubmit, formState: {errors}}  = useForm({resolver: zodResolver(emailSchema)})
 
type FormData = z.infer<typeof emailSchema>
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)

      const response  = await axiosInstance.post<ApiResponse>('/subscribe-news-letter', data)

      if(response.data.success){
        toast.success(response.data.message)
        navigate('/admin/sign-in')
      }

    } catch (error) { 
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || "Error during newsletter subscription"

      toast.error(errorMessage)
    } finally{
      setIsSubmitting(false)
    }
  }


  const onError = () => {
    if(errors.email){
      toast.error(errors.email.message)
    }
  }


  const navigate = useNavigate()

  const navigateToHome = () => {
navigate('/')
  }


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
              Registeration complete.
            </p>
            <p className="font-semibold text-2xl leading-8 tracking-normal">
              Subscribe to our newletters.
            </p>
            <p className="text-gray-700 pt-2 font-normal text-[16px] leading-[24px]">
              Now you can setup your projet and teams
            </p>
          </div>

          <form className="flex gap-4 flex-col pt-12 px-8"
          onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div className="flex flex-col gap-[6px]">
              <Label
                htmlFor="email"
                className="font-normal text-[#101828] text-[14px] leading-[21px]"
              >
                Email(optional)
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
                  {...register("email")}
                  className="rounded-full py-4  px-5 pl-8 h-[52px] text-black"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type='button' className="h-[60px] w-[50%] py-[18px] border border-gray-300 bg-transparent cursor-pointer hover:bg-transparent rounded-[360px] font-medium text-[16px] leading-[24px] text-[#101828]"
              disabled={isSubmitting}
                            onClick={navigateToHome}
              >
                {' '}
                Skip{' '}
              </Button>
              <Button
               type='submit'
                            disabled={isSubmitting}
              className="h-[60px] w-[50%] py-[18px] bg-[#A176F7] cursor-pointer hover:bg-[#A176F7] rounded-[360px] font-medium text-[16px] leading-[24px] text-white">
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

export default NewsLetter;

