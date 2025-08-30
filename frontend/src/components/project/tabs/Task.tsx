import { CalendarDays, ChevronDown, CircleUserRound, Link2, ListChecks, MessageCircle, Plus, Upload, X } from 'lucide-react';
import { Button } from '../../ui/button';
import React, { useEffect, useState } from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { axiosInstance } from '../../../api/axios';
import { useParams } from 'react-router-dom';
import { allBgGradient } from '../constant';
import { Calendar } from '../../ui/calendar';
import z from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AddTaskResponse, AssignedEmployeeResponse, Employee, Task, TaskResponse } from '../types';
import type { ApiResponse } from '../../../types/ApiResponse';
import type { AxiosError } from 'axios';
import { Checkbox } from '../../ui/checkbox';
import Loader from '../../Loader';




const Task = () => {
  const params = useParams();
  const projectId = params.id;

  const [openTaskForm, setOpenTaskForm] = useState<boolean>(false);
  const [openAssigedEmployeeTab, setOpenAssignedEmployeeTab] =
    useState<boolean>(false);
  const [allEmployee, setAllEmployee] = useState<Employee[]>([]);
  const [assignedEmpoloyee, setAssignedEmployee] = useState<Employee[]>([]);
  const [openCalender, setOpenCalender] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [dueDate, setDueDate] = useState<string>('');
  const [attachment, setAttachment] = useState<File | string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
const [isTaksLoading, setIsTaskLoading] = useState<boolean>(true)

  const getRandomBgColor = () => {
    const randomNumber = Math.floor(Math.random() * allBgGradient.length);
    const color = allBgGradient[randomNumber];
    return color;
  };

  const fetchAllAssignedUserForProject = async () => {
    try {
      const response = await axiosInstance.get<AssignedEmployeeResponse>(
        `/project/${projectId}/assigned-employees`,
      );

      if (response.data.success) {
        console.log(' data : ', response.data.employees);
        setAllEmployee(response.data.employees);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    const fileSize = file.size;

    const maxSizeOfAttachment = 25 * 1024 * 1024;

    if (fileSize > maxSizeOfAttachment) {
      return toast.error('Max size of ayttachment cannot be more than 25mb');
    }

    setAttachment(file);
  };

  useEffect(() => {
    if (!projectId) return;

    fetchAllAssignedUserForProject();
    fetchProjectTasks()
  }, [projectId]);

  const toggleAssigedEmployeeTab = () => {
    setOpenAssignedEmployeeTab(!openAssigedEmployeeTab);
  };

  const handleAssignedEmployee = (employee: Employee) => {
    setAssignedEmployee([...assignedEmpoloyee, employee]);
    setAllEmployee(allEmployee.filter((empl) => employee.id !== empl.id));
  };

  const handleRemoveAssignedEmployee = (employee: Employee) => {
    setAssignedEmployee((empl) =>
      empl.filter((emp) => {
        return emp.id !== employee.id;
      }),
    );

    setAllEmployee([...allEmployee, employee]);
  };

  const today = new Date();
  const twoYearsLater = new Date(today.getFullYear() + 2, 11, 31);

  useEffect(() => {
    if (!isFirstRender) {
      if (!date) return;

      const parsedDate = date instanceof Date ? date : new Date(date);

      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth();
      const day = parsedDate.getDate();
      const formatDueDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year.toString()}`;
      setDueDate(formatDueDate);
    } else {
      setIsFirstRender(false);
    }
  }, [date]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = async (data: createTaskInput) => {
    try {
      setIsSubmitting(true);
      const allAssignedId = [];
      if (assignedEmpoloyee.length > 0) {
        for (let i = 0; i < assignedEmpoloyee.length; i++) {
          allAssignedId.push(assignedEmpoloyee[i].id);
        }
      }

      let formatInYYYYMMDDDueDate = '';

      if (dueDate) {
        const splitDate = dueDate.split('/');
        const [day, month, year] = splitDate;
        formatInYYYYMMDDDueDate = `${year}-${month}-${day}`;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('dueDate', formatInYYYYMMDDDueDate);
      formData.append('description', data.description ? data.description : '');
      formData.append('attachment', attachment);
      formData.append('assignedEmployee', JSON.stringify(allAssignedId));

      const response = await axiosInstance.post<AddTaskResponse>(
        `/add-task/${projectId}`,
        formData,
      );

      if (response.data.success) {
        setDueDate('');
        setAttachment('');
        setAssignedEmployee([]);
        reset();
        toast.success('Task added successfully!');
        setOpenTaskForm(false); 
        setAllTasks([...allTasks, response.data.task])
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'Something went wrong while adding the task. Please try again.';
      toast.error(errorMessage);
      console.log('Error while adding task: ', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    if (errors.name) {
      return toast.error(errors.name.message);
    }
  };

  const toggleCalender = () => {
    setOpenCalender(!openCalender);
  };

  const toggleTaskForm = () => {
    setOpenTaskForm(!openTaskForm);
  };




  const [allTasks, setAllTasks] = useState<Task[]>([])

  const fetchProjectTasks = async  () => {
    try {
      
    setIsTaskLoading(true)
      const response = await axiosInstance.get<TaskResponse>(`project/${projectId}/tasks`)
      
      if(response.data.success){
        console.log(response.data.tasks)
setAllTasks(response.data.tasks)
}
    } catch (error) {

  console.error("Error : ", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message || "SOmething went wrong while fething the tasks"
      toast.error(errorMessage)
    } finally{
      setIsTaskLoading(false)
    }
  }
  return (
    <>
      <div className="mt-3 relative">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-lg">Tasks</p>
          <Button
            onClick={() => setOpenTaskForm(!openTaskForm)}
            className="bg-purple-500 hover:bg-purple-600 cursor-pointer"
          >
            {' '}
            <Plus />
            Add Task{' '}
          </Button>
        </div>
    
{isTaksLoading ? (
  <Loader />
) : (
    <div className="mt-6 overflow-y-auto h-[450px] p-3 pb-10 border border-gray-300 rounded-lg shadow-sm">
  {allTasks.map((task) => (
    <EachTask task={task} key={task.id} />
  ))}
</div>
 
)}
    
      </div>

      {openTaskForm && (
        <div className="absolute top-0 inset-0 flex items-center justify-center p-4 h-fit z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            <Button
              className="text-slate-900 bg-transparent  hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors absolute right-0 top-0"
              onClick={isSubmitting ? undefined : toggleTaskForm}
            >
              <X className="h-5 w-5" />
            </Button>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create New Task
                </h2>
              </div>

              {openCalender && (
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

              <div className="mb-6">
                <Label
                  className="block text-sm font-semibold text-gray-700 mb-3"
                  htmlFor="name"
                >
                  Task Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your task name"
                  {...register('name')}
                  className="w-full px-4 py-6 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col gap-6 mb-6">
                <div onClick={isSubmitting ? undefined : toggleCalender}>
                  <Label className="block text-sm font-semibold text-gray-700 mb-3">
                    Due Date
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="w-full px-4 py-5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-11 placeholder-gray-400 text-gray-900 transition-all"
                      disabled={isSubmitting}
                      value={dueDate}
                    />
                    <CalendarDays className="absolute left-3 top-2  text-gray-400" />
                  </div>
                </div>

                <div className="flex flex-col gap-6 mb-6">
                  <Label className="block text-sm font-semibold text-gray-700 mb-3">
                    Assigned Employee
                  </Label>

                  <div
                    className={`${assignedEmpoloyee.length > 0 ? 'flex' : 'hidden'} items-center gap-3`}
                  >
                    <div className="flex -space-x-2 flex-wrap">
                      {assignedEmpoloyee.length > 0 &&
                        assignedEmpoloyee.map((emp) => (
                          <div className="relative" key={emp.id}>
                            <div
                              className={`w-9 h-9 ${getRandomBgColor()} group flex items-center justify-center rounded-full border-2 border-white shadow-sm`}
                            >
                              {emp.fullname.charAt(0).toUpperCase()}

                              <Button
                                className="absolute group-hover:flex hidden -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full  items-center justify-center shadow-md transition-colors duration-200"
                                onClick={() =>
                                  handleRemoveAssignedEmployee(emp)
                                }
                              >
                                <X size={12} className="text-white" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 w-fit bg-gray-100 text-slate-700 
  rounded-xl  hover:bg-gray-200 transition-shadow shadow-sm ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={
                      isSubmitting ? undefined : toggleAssigedEmployeeTab
                    }
                  >
                    <Plus size={18} />
                    <span className="font-medium text-sm">Add Member</span>
                    <ChevronDown size={16} />
                  </div>

                  {openAssigedEmployeeTab && (
                    <div className="max-h-[200px] border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden overflow-y-auto">
                      <div className="h-full overflow-y-auto p-4">
                        {allEmployee.length === 0 ? (
                          <p className="text-center py-4 m-auto">
                            No available employees
                          </p>
                        ) : (
                          allEmployee.map((employee, index) => (
                            <div
                              key={index}
                              onClick={() => handleAssignedEmployee(employee)}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 cursor-pointer transition"
                            >
                              <div
                                className={`h-9 w-9 rounded-full text-white font-medium ${getRandomBgColor()} flex items-center justify-center`}
                              >
                                {employee.fullname.charAt(0).toUpperCase()}
                              </div>
                              <p className="text-gray-800 font-medium">
                                {employee.fullname}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
                  {...register('description')}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder-gray-400 text-gray-900 transition-all"
                />
              </div>

              <div className="mb-10">
                <span className="text-sm font-medium">
                  {attachment instanceof File &&
                    `Selected: ${attachment.name} `}
                </span>

                <Label htmlFor="attachment" className="mt-3">
                  <div className="flex items-center bg-transparent space-x-2 text-purple-500 hover:text-purple-600 hover:bg-transparent transition-colors cursor-pointer group">
                    <Input
                      type="file"
                      name="attachment"
                      className="hidden"
                      id="attachment"
                      disabled={isSubmitting}
                      onChange={handleAttachment}
                    />

                    <Upload className="h-4 w-4 group-hover:scale-110 transition-transform" />

                    <p className="text-sm font-medium">
                      {attachment ? 'Change' : 'Upload'} your attachment
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={isSubmitting ? undefined : toggleTaskForm}
                  type="button"
                  className="flex-1 px-6 border bg-transparent py-6 border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
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
  );
};

export default Task;

const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required!'),
  description: z.string().optional(),
});

type createTaskInput = z.infer<typeof createTaskSchema>;


const EachTask = ({task}: {task: Task}) => {



  return ( 
    
    <div className='flex items-center mt-3 justify-between border border-gray-400 rounded-xl px-2 py-2'>
    <div className='flex items-center gap-2'>
        <Checkbox />
        
        <span className='text-base font-medium'>{task.name}</span>
    </div>

<div className='flex items-center gap-3'>
 
 <div className='flex items-center gap-1'>
   <ListChecks />
   <span>1/2</span>
 </div>

 <div className='flex items-center gap-1'>
  <Link2 />
   <span>7</span>
 </div>

  <div className='flex items-center gap-1'>
  <MessageCircle />
   <span>9</span>
 </div>

<Button className='bg-gray-200 hover:bg-gray-300 text-slate-900 font-bold'>Done</Button>

<div
className='bg-gray-200 hover:bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center'
>
  <CircleUserRound />
</div>
</div>
    
    </div>
 
  )
}