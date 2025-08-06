import {  Mail, MoveLeft } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Header from '../../layout/Header';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="bg-gray-200">
      <Header />

      <div className="flex items-center justify-center pt-[100px] ">
        <div className="max-w-[506px] w-full  bg-[#FFFFFF] rounded-[12px]">
          <div className="flex items-start  flex-col mt-[32px] px-8">
            <Button className="py-2 px-4 bg-[#1D2939] hover:bg-[#1D2939] cursor-pointer rounded-[360px] w-[85px] h-[36px]">
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

          <form className="flex gap-4 flex-col pt-12 px-8">
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
                  className="rounded-full py-4  px-5 pl-8 h-[52px] text-[#98A2B3]"
                />
              </div>
            </div>

            <Button className="h-[60px] py-[18px] text-white bg-[#1D2939] cursor-pointer hover:bg-[#1D2939] rounded-[360px] font-medium text-[16px] leading-[24px]">
              Continue
            </Button>
          </form>
          <p className="text-[#FC6F6D] font-semibold text-[16px] leading-[24px] text-center py-3">
            01:00 Sec
          </p>

          <form className="flex gap-4 flex-col pt-12 px-8">
            <div className="flex flex-col gap-[6px]">
              <Label
                htmlFor="email"
                className="font-normal text-[#101828] text-[14px] leading-[21px]"
              >
                OTP
              </Label>

              <Input
                id="email"
                type="text"
                placeholder="Enter OTP code"
                className="rounded-full py-4  px-5 pl-8 h-[52px] text-[#98A2B3]"
              />
            </div>

            <Button className="h-[60px] py-[18px] text-black bg-[#F16334] cursor-pointer hover:bg-[#F16334] rounded-[360px] font-medium text-[16px] leading-[24px]">
              Continue
            </Button>
          </form>

          <div className="pb-10"></div>
        </div>
      </div>
      <div className="pb-[300px]"></div>
    </div>
  );
};

export default ForgotPassword;
