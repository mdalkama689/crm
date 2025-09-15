import {
  CircleUserRound,
  Link2,
  ListChecks,
  MessageCircle,
} from 'lucide-react';
import { Checkbox } from '../../ui/checkbox';
import { Button } from '../../ui/button';
import type { Task } from '../types';
import { axiosInstance } from '../../../api/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../slices/store/store';
import React, { useState } from 'react';
import type { ApiResponse } from '../../../types/ApiResponse';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

interface EachTaskProps {
  task: Task;
  onClick: () => void;
  isAnyTaskSubmitting: boolean;
  setIsAnyTaskSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}
type TaskStatusProps = 'PENDING' | 'HOLD' | 'DONE';

const EachTask = ({
  task,
  onClick,
  isAnyTaskSubmitting,
  setIsAnyTaskSubmitting,
}: EachTaskProps) => {
  const { project } = useSelector((state: RootState) => state.project);

  const [isTaskChecked, setTaskIsChecked] = useState<boolean>(
    task.status === 'DONE' ? true : false,
  );
  const [currentTask, setCurrentTask] = useState(task);

  const handleToggleTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();

      let statusValue: TaskStatusProps;

      if (task.status === 'PENDING' || task.status === 'HOLD') {
        statusValue = 'DONE';
        setTaskIsChecked(true);
      } else {
        statusValue = 'PENDING';
        setTaskIsChecked(false);
      }

      if (!project) return;
      setIsAnyTaskSubmitting(true);

      const response = await axiosInstance.patch<ApiResponse>(
        `/project/${project.id}/task/${task.id}/toggle`,
      );

      if (response.data.success) {
        toast.success('Task updating task item checked');
        setCurrentTask({ ...currentTask, status: statusValue });
      } else {
        toast.error('Failed to update task. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update task. Please try again.', error);
      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage = axiosError?.response?.data?.message
        ? axiosError.response.data.message
        : 'Failed to update task. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsAnyTaskSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center mt-3 cursor-pointer justify-between border border-gray-400 rounded-xl px-2 py-2"
    >
      <div
        className={`flex items-center gap-2 ${isTaskChecked && 'line-through text-gray-700'}`}
      >
        <Checkbox
          disabled={isAnyTaskSubmitting}
          onClick={handleToggleTask}
          checked={isTaskChecked}
        />

        <span className="text-base font-medium">{currentTask.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <ListChecks />
          <span>
            {currentTask.completeTaskItem}/{currentTask.totalTaskItem}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Link2 />
          <span>{currentTask.totalAttachment}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle />
          <span>{currentTask.totalComment}</span>
        </div>

        <Button className="bg-gray-200 hover:bg-gray-300 text-slate-900 font-bold">
          {currentTask.status}
        </Button>
        <div className="relative">
          <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-300 cursor-pointer peer">
            <CircleUserRound className="text-gray-600" />
          </div>

          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
               whitespace-nowrap px-3 py-1 rounded-lg bg-gray-800 
               text-white text-xs shadow-md hidden peer-hover:flex"
          >
            {currentTask.employee.fullname.charAt(0).toUpperCase() +
              currentTask.employee.fullname.slice(
                1,
                currentTask.employee.fullname.length,
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EachTask;
