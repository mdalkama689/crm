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
import React, { useEffect, useState } from 'react';
import type { ApiResponse } from '../../../types/ApiResponse';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

interface EachTaskProps {
  task: Task;
  onClick: () => void;
  isAnyTaskSubmitting: boolean;
  setIsAnyTaskSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const EachTask = ({
  task,
  onClick,
  isAnyTaskSubmitting,
  setIsAnyTaskSubmitting,
}: EachTaskProps) => {
  const { project } = useSelector((state: RootState) => state.project);

  const [isChecked, setIsChecked] = useState<boolean>(
    task.status === 'DONE' ? true : false,
  );
  const [isOnHold, setIsOnHold] = useState(task.status === 'ON_HOLDING');
  const [btnValue, setBtnValue] = useState<string>('');

  const handleToggleTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();

      if (!project) return;
      setIsAnyTaskSubmitting(true);
      setIsChecked(!isChecked);
      setIsOnHold(!isOnHold);

      const response = await axiosInstance.patch<ApiResponse>(
        `/project/${project.id}/task/${task.id}/toggle`,
      );

      if (!response.data.success) {
        setIsChecked(!isChecked);
        setIsOnHold(!isOnHold);
        toast.error('Failed to update task. Please try again.');
      }
      toast.success('Task updating task item checked');
    } catch (error) {
      setIsChecked(!isChecked);
      setIsOnHold(!isOnHold);

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

  useEffect(() => {
    if (isChecked && !isOnHold) {
      setBtnValue('DONE');
    } else if (!isChecked && isOnHold) {
      setBtnValue('ON HOLD');
    } else {
      setBtnValue('PENDING');
    }
  }, [isChecked, isOnHold]);

  return (
    <div
      onClick={onClick}
      className="flex items-center mt-3 cursor-pointer justify-between border border-gray-400 rounded-xl px-2 py-2"
    >
      <div className="flex items-center gap-2">
        <Checkbox
          disabled={isAnyTaskSubmitting}
          onClick={handleToggleTask}
          checked={isChecked ? true : false}
        />

        <span className="text-base font-medium">{task.name}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <ListChecks />
          <span>1/2</span>
        </div>

        <div className="flex items-center gap-1">
          <Link2 />
          <span>7</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle />
          <span>9</span>
        </div>

        <Button className="bg-gray-200 hover:bg-gray-300 text-slate-900 font-bold">
          {btnValue}
        </Button>

        <div className="bg-gray-200 hover:bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center">
          <CircleUserRound />
        </div>
      </div>
    </div>
  );
};

export default EachTask;
