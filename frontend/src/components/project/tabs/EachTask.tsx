import {
  CircleUserRound,
  Link2,
  ListChecks,
  MessageCircle,
} from 'lucide-react';
import { Checkbox } from '../../ui/checkbox';
import { Button } from '../../ui/button';
import type { Task } from '../types';

interface EachTaskProps {
  task: Task;
  onClick: () => void;
}

const EachTask = ({ task, onClick }: EachTaskProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center mt-3 cursor-pointer justify-between border border-gray-400 rounded-xl px-2 py-2"
    >
      <div className="flex items-center gap-2">
        <Checkbox />

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
          Done
        </Button>

        <div className="bg-gray-200 hover:bg-gray-300 h-10 w-10 rounded-full flex items-center justify-center">
          <CircleUserRound />
        </div>
      </div>
    </div>
  );
};

export default EachTask;
