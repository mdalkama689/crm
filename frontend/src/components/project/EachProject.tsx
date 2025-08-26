import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import type { ApiResponse } from '../../types/ApiResponse';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { menuItems } from './constant';
import type { IProject } from './types';
import Overview from './tabs/Overview';
import Task from './tabs/Task';
import Desk from './tabs/Desk';
import Activity from './tabs/Activity';
import File from './tabs/File';
import Report from './tabs/Report';
import Setting from './tabs/Setting';

interface ProjectResponse extends ApiResponse {
  project: IProject;
}

const EachProject = () => {
  const params = useParams();
  const projectId = params.id;

  if (!projectId) return;

  const [currentTab, setCurrentTab] = useState('overview');
  const [project, setProject] = useState<IProject | null>(null);

  const handleCurrentTab = (tabName: string) => {
    setCurrentTab(tabName.toLowerCase());
  };

  useEffect(() => {
    console.log(' curret ta b : ', currentTab);
  }, [currentTab]);

  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    try {
      const response = await axiosInstance.get<ProjectResponse>(
        `/project/${projectId}`,
      );
      if (response.data.success) {
        setProject(response.data.project);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError
        ? axiosError.response?.data.message
        : 'Something went wrong';
      toast.error(errorMessage);
      navigate('/');
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  if (!project) return;

  return (
    <DashboardLayout>
      <div className="flex gap-1 mt-8 ml-[300px]">
        <div className="mt-12 ml-12 w-[calc(100%-300px)]">
          <div className="flex items-center justify-start">
            <span className="font-normal text-gray-600">Project </span>
            <ChevronRight size={18} />{' '}
            <span className="font-semibold">{project.name}</span>
          </div>

          <div className="mt-5 w-full">
            {menuItems.map((menu) => (
              <Button
                className={`rounded-full mr-3  text-slate-900 cursor-pointer hover:bg-purple-500 hover:text-white ${currentTab.toLowerCase() === menu.name.toLowerCase() ? 'bg-purple-500 text-white' : 'bg-[#E2E8F0]'}`}
                key={menu.id}
                onClick={() => handleCurrentTab(menu.name)}
              >
                {menu.name}{' '}
              </Button>
            ))}
          </div>
          {currentTab === 'overview' && (
            <Overview
              description={project.description}
              dueDate={project.dueDate}
              assignEmployee={project.assignToEmployee}
            />
          )}

          {currentTab === 'task' && <Task />}
          {currentTab === 'desk' && <Desk />}
          {currentTab === 'activity' && <Activity />}
          {currentTab === 'files' && <File />}
          {currentTab === 'reports' && <Report />}
          {currentTab === 'settings' && <Setting />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EachProject;
