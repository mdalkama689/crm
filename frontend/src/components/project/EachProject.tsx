import {ArrowLeftRight, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { ta } from "zod/v4/locales"


    const menuItems = [
        {id: '1',
            name: "TASK "
        }, 
                {id: '2',
            name: "DESK"
        }, 
                {id: '3',
            name: "ACTIVITY"
        }, 


                {id: '4',
            name: "FILES"
        }, 
                {id: '5',
            name: "REPORTS"
        }, 

                {id: '6',
            name: "SETTINGS"
        }, 
           
    ]


const EachProject = () => {


    const [currentTab, setCurrentTab] = useState("task")


    const handleCurrentTab  = (tabName: string) => {
 

        setCurrentTab(tabName.toLowerCase())
    }

    const allTasks = [
        {
            id: "1",
            name: "Go to gym"
        }, 
          {
            id: "1",
            name: "Go to gym"
        }, 
          {
            id: "1",
            name: "Go to gym"
        }, 

          {
            id: "1",
            name: "Go to gym"
        }, 
          {
            id: "1",
            name: "Go to gym"
        }, 

          {
            id: "1",
            name: "Go to gym"
        }, 
          {
            id: "1",
            name: "Go to gym"
        }, 
          {
            id: "1",
            name: "Go to gym"
        }, 

    ]

    

  return (
<div className="mt-12 ml-12">
    <div className="flex">
        <span className="font-normal text-gray-600">Project </span><ChevronRight /> <span>Dribble Project </span>
    </div>
 
    <div className="flex gap-1 mt-8">
      {menuItems.map((menu) => (
          <Button className={`bg-[#E2E8F0] rounded-full text-slate-900 cursor-pointer hover:bg-purple-500 hover:text-white ${currentTab.toLowerCase() === menu.name  && "bg-purple-500 text-white"}`} key={menu.id}
          onClick={() => handleCurrentTab(menu.name)}
          >{menu.name} </Button>
      ))}
    </div>
    {allTasks.map((task) => (
        <div>
            <p>{task.name}</p>
        </div>
    ))}
</div>
  )
}

export default EachProject