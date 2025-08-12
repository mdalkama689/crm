import { Info, Search } from 'lucide-react' 
import { Label } from './ui/label'
import { Input } from './ui/input'

const SearchBar = () => {
  return (
<div className='relative ml-5 w-[30%] h-[40px]'>
            <Search  className='absolute top-2.5 left-4' size={20}/>
    <Label></Label>
<Input placeholder='Search' 
  className="px-10 h-full w-full border border-gray-400 rounded-full 
             focus:outline-none focus:ring-0 focus:border-transparent" />

  
          <Info className='absolute top-2.5 right-4' size={20} />
</div>
  )
}

export default SearchBar