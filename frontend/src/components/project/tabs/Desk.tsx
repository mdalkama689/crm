import { toast } from "sonner"
import { Button } from "../../ui/button"

const Desk = () => {
  const handleClick = () => {
    toast.info(" click div ")
  }


  return (
<div className="mt-10 flex justify-center">
  <div onClick={handleClick} className="w-[250px] border border-red-900 p-4 flex justify-between items-center rounded-md">
    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
      Add
    </button>
    <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition">
      Cancel
    </button>
  </div>
</div>


  )
}

export default Desk