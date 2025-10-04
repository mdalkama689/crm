import { X, Plus, Upload, CalendarDays } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import z from 'zod';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import type { ApiResponse } from '../../types/ApiResponse';
import { axiosInstance } from '../../api/axios';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { allBgGradient, allowedAttachmentTypes } from './constant';
import type { Employee } from './types';
import type { EmployeesApiResponse } from '../AllEmployee';
import Editor from '../Editor';

interface CreateProjectResponse extends ApiResponse {
  projectId: string;
}

const CreateProjectForm = () => {
  const [openCalender, setOpenCalender] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [allEmployee, setAllEmployee] = useState<Employee[]>([]);
  const [bgGradient, setBgGradient] = useState<string[]>([]);
  const [projectIcon, setProjectIcon] = useState<File | string>('');
  const [projectIconPreview, setProjectIconPreview] = useState<string>('');
  const [attachment, setAttachment] = useState<File | string>('');
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [dueDate, setDueDate] = useState<string>('');
  const [assignedEmpoloyee, setAssignedEmployee] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  const handlePreviewProjectIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const files = target.files;
    if (!files) return;
    const file = files[0];
    const fileSize = file.size;
    const maxSizeOfIcon = 5 * 1024 * 1024;

    if (maxSizeOfIcon < fileSize) {
      return toast.error(
        'Icon size cannot exceed 5 MB. Please choose a smaller file.',
      );
    }

    setProjectIcon(file);
    setProjectIconPreview(URL.createObjectURL(file));
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const fileSize = file.size;

    if (file && !allowedAttachmentTypes.includes(file.type)) {
      return toast.error('This attachment type not allowed!');
    }

    const maxSizeOfAttachment = 25 * 1024 * 1024;

    if (maxSizeOfAttachment < fileSize) {
      return toast.error('Max size of attachment cannot be more than 25mb');
    }
    setAttachment(file);
  };

  useEffect(() => {
    try {
      const fetchAllEmployees = async () => {
        const response = await axiosInstance.get<EmployeesApiResponse>(
          '/fetch-all-employees-for-tenant',
        );
        setAllEmployee(response.data.employees);
      };

      fetchAllEmployees();
    } catch (error) {
      console.error('Error : ', error);
      toast.error('Failed to load employees. Please try again.');
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
  });

  const onSubmit = async (data: createProjectInput) => {
    try {
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
      formData.append('icon', projectIcon);
      formData.append('name', data.name);
      formData.append('dueDate', formatInYYYYMMDDDueDate);
      formData.append('attachment', attachment);
      formData.append('assignToEmployee', JSON.stringify(allAssignedId));
      formData.append('description', delta ? JSON.stringify(delta) : '');

      setIsSubmitting(true);

      const response = await axiosInstance.post<CreateProjectResponse>(
        '/create-project',
        formData,
      );

      if (response.data.success) {
        toast.success('Project created successfully!');
        const projectId = response.data.projectId;

        navigate(`/project/${projectId}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || 'Error during creating project!';
      toast.error(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    if (errors.name) {
      return toast.error(errors.name.message);
    }
  };

  const today = new Date();
  const twoYearsLater = new Date(today.getFullYear() + 2, 11, 31);

  const handleAssignedEmployee = (employee: Employee) => {
    setAssignedEmployee([...assignedEmpoloyee, employee]);
    setAllEmployee((empl) => empl.filter((emp) => emp.id !== employee.id));
    handleRandomGradient();
  };

  const handleRandomGradient = () => {
    const randomNumber = Math.floor(Math.random() * allBgGradient.length);
    setBgGradient([...bgGradient, allBgGradient[randomNumber]]);
  };

  const handleRemoveAssignedEmployee = (employee: Employee) => {
    setAssignedEmployee((empl) =>
      empl.filter((emp) => {
        return emp.id !== employee.id;
      }),
    );
    setAllEmployee([...allEmployee, employee]);
  };

  useEffect(() => {
    if (!isFirstRender) {
      if (!date) return;

      const parsedDate = date instanceof Date ? date : new Date(date);

      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth();
      const day = parsedDate.getDate();
      const formatDueDate = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year.toString()}`;
      setDueDate(formatDueDate);
      setOpenCalender(false);
    } else {
      setIsFirstRender(false);
    }
  }, [date]);

  const navigateToHome = () => {
    navigate('/');
  };

  const [content, setContent] = useState<string>('');
  const [delta, setDelta] = useState();

  return (
    <div className="absolute top-0 inset-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center p-4 h-fit z-50 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
        <Button
          onClick={navigateToHome}
          disabled={isSubmitting}
          className="text-slate-900 bg-transparent  hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors absolute right-0 top-0"
        >
          <X className="h-5 w-5" />
        </Button>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Project
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

          <div className="mb-8">
            <Label htmlFor="icon">
              <div className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-400 transition-colors cursor-pointer group ">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="icon"
                  id="icon"
                  disabled={isSubmitting}
                  onChange={handlePreviewProjectIcon}
                />

                {projectIconPreview ? (
                  <img
                    src={projectIconPreview}
                    className="h-full w-full rounded-xl"
                  />
                ) : (
                  <Plus className="h-6 w-6 text-purple-500 group-hover:text-purple-600" />
                )}
              </div>
            </Label>

            <p className="text-sm text-purple-500 mt-3 font-medium">
              {projectIconPreview ? 'Change' : 'Add'} project's icon
            </p>
          </div>

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
              {...register('name')}
              disabled={isSubmitting}
              placeholder="Enter your project's name"
              className="w-full px-4 py-6 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900 transition-all"
            />
          </div>

          <div className="flex flex-col gap-6 mb-6">
            <div onClick={() => setOpenCalender(!openCalender)}>
              <Label className="block text-sm font-semibold text-gray-700 mb-3">
                Due Date
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={dueDate}
                  disabled={isSubmitting}
                  className="w-full px-4 py-5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-11 placeholder-gray-400 text-gray-900 transition-all"
                />
                <CalendarDays className="absolute left-3 top-2  text-gray-400" />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-3">
                Assign to
              </Label>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {assignedEmpoloyee.length > 0 &&
                    assignedEmpoloyee.map((emp, ind) => (
                      <div className="relative" key={emp.id}>
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
            </div>
          </div>

          <div className="mb-8">
            <Label
              className="block text-sm font-semibold text-gray-700 mb-3"
              htmlFor="description"
            >
              Project's Description
            </Label>

            <Editor
              content={content}
              setContent={setContent}
              setDelta={setDelta}
            />
          </div>

          <div className="mb-10">
            <span className="text-sm font-medium">
              {attachment instanceof File && `Selected: ${attachment.name} `}
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
              disabled={isSubmitting}
              onClick={navigateToHome}
              className="flex-1 px-6 border bg-transparent py-6 border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting}
              className="flex-1 py-6 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
            >
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required!'),
  description: z.json().optional(),
});

type createProjectInput = z.infer<typeof createProjectSchema>;
