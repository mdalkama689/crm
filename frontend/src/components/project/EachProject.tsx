import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import type { ApiResponse } from '../../types/ApiResponse';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { menuItems } from './constant';
import type { IProject } from './types';
import Overview from './tabs/Overview';
import Desk from './tabs/Desk';
import Activity from './tabs/Activity';
import File from './tabs/File';
import Report from './tabs/Report';
import Setting from './tabs/Setting';
import Loader from '../Loader';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../slices/store/store';
import { setProject } from '../../slices/ProjectSlice';
import Task from './tabs/Task';

export interface ProjectResponse extends ApiResponse {
  project: IProject;
  description: string;
}

const EachProject = () => {
  const params = useParams();
  const projectId = params.id;

  if (!projectId) return;
  const dispatch = useDispatch<AppDispatch>();

  const { project } = useSelector((state: RootState) => state.project);

  const [currentTab, setCurrentTab] = useState('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleCurrentTab = (tabName: string) => {
    setCurrentTab(tabName.toLowerCase());
  };

  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<ProjectResponse>(
        `/project/${projectId}`,
      );
      if (response.data.success) {
        dispatch(setProject(response.data.project));
      } else {
        navigate('/');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError
        ? axiosError.response?.data.message
        : 'Something went wrong';
      toast.error(errorMessage);
      navigate('/');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex gap-1 pt-8 ml-[300px]">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="mt-12 ml-12 w-[calc(100%-300px)]">
            <div className="flex items-center justify-start">
              <Link
                to="/projects"
                className="font-semibold text-gray-800 hover:text-gray-700"
              >
                Project{' '}
              </Link>
              <ChevronRight size={18} />{' '}
              {project && <span className="font-semibold">{project.name}</span>}
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
            {currentTab === 'overview' && project && (
              <Overview
                description={project.description}
                dueDate={project.dueDate}
                assignEmployee={project.assignToEmployee}
                attachmentUrl={
                  project.attachmentUrl ? project.attachmentUrl : null
                }
              />
            )}

            {currentTab === 'task' && <Task />}
            {currentTab === 'desk' && <Desk />}
            {currentTab === 'activity' && <Activity />}
            {currentTab === 'files' && <File />}
            {currentTab === 'reports' && <Report />}
            {currentTab === 'settings' && <Setting />}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EachProject;
