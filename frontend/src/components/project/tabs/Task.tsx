import { CalendarDays, Plus, Upload, X } from "lucide-react"
import { Button } from "../../ui/button"
import { useState } from "react"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"

const Task = () => {
  const [openTaskForm, setOpenTaskForm] = useState<boolean>(false)

  
  // const fetchAllAssignedUserForProject = async () => {
  //   try {
      
  //     const 

  //   } catch (error) {
      
  //   }
  // }

  return (
    <> 
<div className="mt-3 relative">

  <div className="flex items-center justify-between">
    <p className="font-semibold text-lg">Tasks</p>
    <Button
    onClick={() => setOpenTaskForm(!openTaskForm)}
    className="bg-purple-500 hover:bg-purple-600 cursor-pointer"> <Plus />Add Task </Button>
  </div>

{/* {openTaskForm && (
   <div className="bg-amber-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
<p>Create New Task</p>

<form action=""></form>
</div>
)} */}

 
</div>


{openTaskForm && (

      <div className="absolute top-0 inset-0 flex items-center justify-center p-4 h-fit z-50 overflow-auto">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
          <Button 
            className="text-slate-900 bg-transparent  hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors absolute right-0 top-0"
onClick={() => setOpenTaskForm(!openTaskForm)}
>
            <X className="h-5 w-5" />
          </Button>
          <form  
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Project
              </h2>
            </div>
  
            {/* {openCalender && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border shadow-sm z-10"
                  captionLayout="dropdown"
                  defaultMonth={today}
                  disabled={{ before: today, after: twoYearsLater }}
                  startMonth={today}
                  endMonth={twoYearsLater}
                />
              </div>
            )}
   */}
            
  
            <div className="mb-6">
              <Label
                className="block text-sm font-semibold text-gray-700 mb-3"
                htmlFor="name"
              >
                Project's Name
              </Label>
              <Input
                type="text"
                id="name" 
                placeholder="Enter your project's name"
                className="w-full px-4 py-6 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900 transition-all"
              />
            </div>
  
            <div className="flex flex-col gap-6 mb-6">
              <div  >
                <Label className="block text-sm font-semibold text-gray-700 mb-3">
                  Due Date
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY" 
                    className="w-full px-4 py-5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-11 placeholder-gray-400 text-gray-900 transition-all"
                  />
                  <CalendarDays className="absolute left-3 top-2  text-gray-400" />
                </div>
              </div>
  
              {/* <div>
                <Label className="block text-sm font-semibold text-gray-700 mb-3">
                  Assign to
                </Label>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {assignedEmpoloyee.length > 0 &&
                      assignedEmpoloyee.map((emp, ind) => (
                        <div className="relative"     key={emp.id}>
                          <div
                            className={`w-9 h-9 ${bgGradient[ind]} group flex items-center justify-center rounded-full border-2 border-white shadow-sm`}
                        
                          >
                            {emp.fullname.charAt(0).toUpperCase()}
  
                            <Button
                              className="absolute group-hover:flex hidden -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full  items-center justify-center shadow-md transition-colors duration-200"
                              onClick={() => handleRemoveAssignedEmployee(emp)}
                            >
                              <X size={12} className="text-white" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                  <Button className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm">
                    Add Member
                  </Button>
                  {allEmployee &&
                    allEmployee.map((employee) => (
                      <p
                        onClick={() => handleAssignedEmployee(employee)}
                        key={employee.id}
                        className="cursor-pointer"
                      >
                        {employee.fullname.charAt(0).toUpperCase() +
                          employee.fullname.slice(1, employee.fullname.length)}
                      </p>
                    ))}
                </div>
              </div> */}

            </div>
  
            <div className="mb-8">
              <Label
                className="block text-sm font-semibold text-gray-700 mb-3"
                htmlFor="description"
              >
                Project's Description
              </Label>
              <Textarea
                placeholder="Enter the description"
                rows={4}
                // {...register('description')}
                // disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder-gray-400 text-gray-900 transition-all"
              />
            </div>
  
            <div className="mb-10">
              {/* <span className="text-sm font-medium">
                {attachment instanceof File && `Selected: ${attachment.name} `}
              </span> */}
  
              <Label htmlFor="attachment" className="mt-3">
                <div className="flex items-center bg-transparent space-x-2 text-purple-500 hover:text-purple-600 hover:bg-transparent transition-colors cursor-pointer group">
                  <Input
                    type="file"
                    name="attachment"
                    className="hidden"
                    id="attachment" 
                  />
  
                  <Upload className="h-4 w-4 group-hover:scale-110 transition-transform" />
  
                  <p className="text-sm font-medium">
                    Upload  your attachment
                  </p>
                </div>
              </Label>
            </div>
  
            <div className="flex space-x-4">
              <Button
               
                className="flex-1 px-6 border bg-transparent py-6 border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 py-6 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
              >
                Create Project
              </Button>
            </div>
          </form>
        </div>
      </div> 
)} 

</>
  )
}

export default Task