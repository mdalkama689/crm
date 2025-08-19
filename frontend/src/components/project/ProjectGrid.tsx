import { MoreHorizontal, User, ChevronLeft, ChevronRight } from "lucide-react"

const ProjectGrid  = () => {
    
  const projects = [
    {
      name: "Dribbble Website",
      category: "Development", 
      tasks: { completed: 90, total: 90 },
      dueDate: "July 15, 2024",
      iconColor: "bg-purple-500",
      progressColor: "bg-purple-500"
    },
    {
      name: "Theme Development",
      category: "Development",
      tasks: { completed: 43, total: 50 },
      dueDate: "July 15, 2024", 
      iconColor: "bg-purple-500",
      progressColor: "bg-purple-500"
    },
    {
      name: "Dropbox App Design",
      category: "Design",
      tasks: { completed: 15, total: 35 },
      dueDate: "June 9, 2024",
      iconColor: "bg-cyan-400",
      progressColor: "bg-cyan-400"
    },
    {
      name: "UI Presentation Design", 
      category: "Design",
      tasks: { completed: 78, total: 90 },
      dueDate: "May 10, 2024",
      iconColor: "bg-cyan-400",
      progressColor: "bg-cyan-400"
    },
    {
      name: "Social Media Promotion",
      category: "Social",
      tasks: { completed: 55, total: 75 },
      dueDate: "April 5, 2024",
      iconColor: "bg-red-400", 
      progressColor: "bg-red-400"
    },
    {
      name: "E-commerce App Design",
      category: "Design",
      tasks: { completed: 40, total: 45 },
      dueDate: "March 1, 2024",
      iconColor: "bg-cyan-400",
      progressColor: "bg-cyan-400"
    },
    {
      name: "CRM Dashboard Development",
      category: "Development",
      tasks: { completed: 80, total: 80 },
      dueDate: "October 10, 2023", 
      iconColor: "bg-purple-500",
      progressColor: "bg-purple-500"
    }
  ]

  const getProgressPercentage = (completed, total) => {
    return (completed / total) * 100
  }

  return (
    <div className="bg-white w-full p-6">
      {/* Header */}
      <div className="grid grid-cols-5 gap-4 mb-6 text-sm font-medium text-gray-600">
        <div>Projects</div>
        <div>Tasks</div>
        <div>Budget</div>
        <div>Due Date</div>
        <div>Members</div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {projects.slice(0, 7).map((project, index) => (
          <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-sm text-gray-500">{project.dueDate}</div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Project Icon and Name */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className={`w-12 h-12 ${project.iconColor} rounded-xl flex items-center justify-center mb-3`}>
                <div className="w-6 h-6 bg-white rounded-md"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.category}</p>
            </div>

            {/* Tasks Progress */}
            <div className="mb-4">
              <div className="flex justify-center mb-2">
                <span className="font-medium text-gray-900">
                  {project.tasks.completed}/{project.tasks.total}
                </span>
              </div>
              <div className="text-xs text-gray-500 text-center mb-2">Tasks</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${project.progressColor}`}
                  style={{ width: `${getProgressPercentage(project.tasks.completed, project.tasks.total)}%` }}
                ></div>
              </div>
            </div>

            {/* Team Members */}
            <div className="flex items-center justify-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                    <User size={10} className="text-gray-600" />
                  </div>
                ))}
                <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                  +5
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
          <ChevronLeft size={16} />
          Prev
        </button>
        
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded text-sm text-gray-600 hover:bg-gray-100">1</button>
          <button className="w-8 h-8 rounded text-sm bg-orange-500 text-white">2</button>
          <button className="w-8 h-8 rounded text-sm text-gray-600 hover:bg-gray-100">3</button>
          <button className="w-8 h-8 rounded text-sm text-gray-600 hover:bg-gray-100">4</button>
          <button className="w-8 h-8 rounded text-sm text-gray-600 hover:bg-gray-100">5</button>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default ProjectGrid 