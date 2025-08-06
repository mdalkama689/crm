import { Eye, EyeOff, KeyRound, Mail, MoveLeft } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import Header from '../../layout/Header';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false)


    const toggleNewPassword = () => {
  setShowNewPassword(!showNewPassword)
    }

    const toggleConfirmNewPassword = () => {
setShowConfirmNewPassword(!showConfirmNewPassword)
    }





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
         Create 
            </p>
            <p className="font-semibold text-2xl leading-8 tracking-normal">
       New Password 
            </p>
            <p className="text-gray-700 pt-2 font-normal text-[16px] leading-[24px]">
            
            </p>
          </div>

          <form
            className="flex gap-4 flex-col pt-12 px-8"
          >


            <div className="flex flex-col gap-[6px]">
              <Label
                htmlFor="password"
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
                  id="password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="rounded-full py-4  px-5 pl-8 h-[52px] text-[#98A2B3]"
    
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
                htmlFor="password"
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
                  id="password"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  className="rounded-full py-4  px-5 pl-8 h-[52px] text-[#98A2B3]"
    
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
  );
};



export default ResetPassword