import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';

const Header = () => {
  return (
    <header className="flex items-center fixed top-0 left-0 w-full z-10 justify-between bg-[#FFFFFF] shadow-lg py-3 px-6">
      <p>ENPOINT </p>

      <div className="flex gap-3 items-center">
        <Button className="bg-transparent text-black hover:bg-transparent">
          <Globe size={24} color="#667085" />
          <span className="font-normal text-[14px] leading-[21px] text-[#101828]">
            EN
          </span>{' '}
          <ChevronDown size={16} color="#667085" />
        </Button>
        <Button className="bg-transparent border border-[#EAECF0] text-[#101828]  px-5 py-5 rounded-[360px] w-[144px] h-[52px] font-medium text-[14px] leading-[21px] cursor-pointer hover:bg-transparent">
          Request Demo
        </Button>
        <Button className="bg-[#F16334] text-[#101828]  px-5 py-5 rounded-[360px] w-[144px] h-[52px] font-medium text-[14px] leading-[21px] cursor-pointer hover:bg-[#F16334]">
          Sign in{' '}
        </Button>
      </div>
    </header>
  );
};

export default Header;
