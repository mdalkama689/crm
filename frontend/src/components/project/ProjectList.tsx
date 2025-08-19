import { MoreHorizontal, User } from "lucide-react"
import { Button } from "../ui/button"

const ProjectList   = () => {
  const projects = [
    {
      name: "Dribbble Website",
      category: "Development",
      tasks: { completed: 90, total: 90 },
      budget: "$1,500.00",
      dueDate: "August 24, 2024",
      iconColor: "bg-purple-500",
      progressColor: "bg-purple-500"
    },
    {
      name: "Theme Development", 
      category: "Development",
      tasks: { completed: 43, total: 50 },
      budget: "$2,000.00",
      dueDate: "July 15, 2024",
      iconColor: "bg-purple-500",
      progressColor: "bg-purple-500"
    },
    {
      name: "Dropbox App Design",
      category: "Design", 
      tasks: { completed: 15, total: 35 },
      budget: "$900.00",
      dueDate: "June 9, 2024",
      iconColor: "bg-cyan-400",
      progressColor: "bg-cyan-400"
    },
    {
      name: "UI Presentation Design",
      category: "Design",
      tasks: { completed: 78, total: 90 },
      budget: "$299.00", 
      dueDate: "May 10, 2024",
      iconColor: "bg-cyan-400",
      progressColor: "bg-cyan-400"
    },
    {
      name: "Social Media Promotion",
      category: "Social",
      tasks: { completed: 55, total: 75 },
      budget: "$899.00",
      dueDate: "April 5, 2024", 
      iconColor: "bg-red-400",
      progressColor: "bg-red-400"
    },
    {
      name: "E-commerce App Design",
      category: "Design",
      tasks: { completed: 40, total: 45 },
      budget: "$100.00",
      dueDate: "March 1, 2024",
      iconColor: "bg-cyan-400", 
      progressColor: "bg-cyan-400"
    },
    {
      name: "CRM Dashboard Development",
      category: "Development", 
      tasks: { completed: 80, total: 80 },
      budget: "$3,500.00",
      dueDate: "October 10, 2023",
      iconColor: "bg-purple-500",
      progressColor: "bg-purple-500"
    }
  ]

  const getProgressPercentage = (completed, total) => {
    return (completed / total) * 100
  }

  return (
    <div className="bg-white rounded-lg border w-full overflow-hidden">
  
      <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
        <div>Projects</div>
        <div>Tasks</div>
        <div>Budget</div>
        <div>Due Date</div>
        <div>Members</div>
        <div></div>
      </div>


      <div className="divide-y divide-gray-100">
        {projects.map((project, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-gray-50">
 
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 ${project.iconColor} rounded-lg flex items-center justify-center`}>
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">{project.name}</div>
                <div className="text-sm text-gray-500">{project.category}</div>
              </div>
            </div>

            <div>
              <div className="font-medium text-gray-900">
                {project.tasks.completed}/{project.tasks.total}
              </div>
              <div className="text-sm text-gray-500">Tasks</div>
            </div>

            <div>
              <div className="font-medium text-gray-900">{project.budget}</div>
              <div className="text-sm text-gray-500">Budget</div>
            </div>

            <div>
              <div className="font-medium text-gray-900">{project.dueDate}</div>
              <div className="text-sm text-gray-500">Due Date</div>
            </div>

            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                    <User size={14} className="text-gray-600" />
                  </div>
                ))}
                <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  +5
                </div>
          
            
              </div>
                                
              <Button className="hover:bg-gray-100  bg-transparent rounded-full h-9 w-9 border border-gray-300">
                <MoreHorizontal size={16} className="text-gray-400" />
              </Button>
          
            </div>

          

          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectList 