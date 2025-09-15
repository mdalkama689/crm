import { useEffect, useState } from 'react';
import { allBgGradient, months } from '../constant';
import { Calendar } from 'lucide-react';
import { Progress } from '../../ui/progress';

interface ProjectOverview {
  description: string | null;
  dueDate: string | null;
  assignEmployee: { id: string; fullname: string }[];
}

const Overview = ({
  description,
  dueDate,
  assignEmployee,
}: ProjectOverview) => {
  const [readableDueDate, setReadableDueDate] = useState<string>('');

  const handleRandomGradient = () => {
    const randomNumber = Math.floor(Math.random() * allBgGradient.length);
    return allBgGradient[randomNumber];
  };

  useEffect(() => {
    if (!dueDate) return;

    const [year, month, day] = dueDate.split('-');
    const monthName = months[Number(month) - 1];

    setReadableDueDate(`${day} ${monthName} ${year}`);
  }, [dueDate]);

  useEffect(() => {
    if (!assignEmployee) return;
  }, [assignEmployee]);

  return (
    <div className="mt-10">
      <p className="font-semibold text-lg"> Description </p>
      <p className="mt-3">
        {' '}
        {description ? description : 'Nothing aadeed in description'}
      </p>

      <div className="mt-4 ">
        <p className="font-semibold text-lg">Due to </p>
        <div className="mt-3 flex items-center gap-3 border border-gray-500  rounded-2xl  px-3 py-3 w-[200px]">
          <Calendar />{' '}
          <span className="text-base">
            {readableDueDate ? readableDueDate : 'No due date set'}{' '}
          </span>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-lg">Assigned To </p>

          <div className="flex -space-x-2 items-center">
            {assignEmployee.slice(0, 5).map((empl) => (
              <div key={empl.id} className="relative group">
                <div
                  className={`w-9 h-9 text-white ${handleRandomGradient()} flex items-center justify-center rounded-full border-2 border-white shadow-sm`}
                >
                  {empl.fullname.charAt(0).toUpperCase()}
                </div>

                <p
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
   invisible group-hover:visible bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg"
                >
                  {empl.fullname.charAt(0).toUpperCase() +
                    empl.fullname.slice(1)}
                </p>
              </div>
            ))}
          </div>

          {!assignEmployee && <p>You don't have any assigned employee</p>}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-6">
          <p className="font-semibold text-lg">Overall Progress </p>
          <p className="font-semibold text-lg">50%</p>
        </div>
        <Progress value={33} className="mt-4 w-[200px]" />
      </div>
    </div>
  );
};

export default Overview;

// store value
