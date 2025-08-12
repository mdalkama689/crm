import { Bolt, ChevronDown, Globe, Grid, Plus } from "lucide-react";
import SearchBar from "../components/SearchBar";
import { Button } from "../components/ui/button";

const Topbar = () => {
return (
   <div
   className="fixed top-0 left-[300px] flex items-center w-[100%] bg-[#e6e0e0] h-[60px]"
   >
      <div className="flex gap-1 items-center justify-start p-2 cursor-pointer">
              <Grid className="h-5 w-5 hover:text-black" />
              <p className="font-medium leading-5  text-[18px] text-black">
               Dashboard 
              </p>
            </div>
            <SearchBar />
            {/*  */}

     <div className="flex gap-3 items-center">
        <Button className="bg-transparent text-black hover:bg-transparent">
          <Globe size={24} color="#667085" />
          <span className="font-normal text-[14px] leading-[21px] text-[#101828]">
            EN
          </span>{' '}
          <ChevronDown size={16} color="#667085" />
        </Button>
       <Bolt size={24} color="#667085" />
       <Button className="flex items-center justify-center gap-2 cursor-pointer bg-[#A176F7] hover:bg-[#9d6dfd] rounded-full">
        <span className="text-[#fefefe]">Add</span>
        <Plus size={24} color="#fefefe" />
       </Button>
      </div>

            {/*  */}
   </div>
)
};

export default Topbar;

