import { useEffect, useState } from "react";
import { allBgGradient, months } from "../constant";
import { Calendar } from "lucide-react";
import { Progress } from "../../ui/progress";


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
  const [bgGradient, setBgGradient] = useState<string[]>([]);

  const handleRandomGradient = () => {
    const randomNumber = Math.floor(Math.random() * allBgGradient.length);
    setBgGradient([...bgGradient, allBgGradient[randomNumber]]);
  };


  const [readableDueDate, setReadableDueDate] = useState<string>('');

  useEffect(() => {
    if (!dueDate) return;

    const [year, month, day] = dueDate.split('-');
    const monthName = months[Number(month) - 1];

    setReadableDueDate(`${day} ${monthName} ${year}`);
  }, [dueDate]);

  useEffect(() => {
    if (!assignEmployee) return;
    handleRandomGradient();
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
            {assignEmployee &&
              assignEmployee.slice(0, 5).map((empl, ind) => (
                <div className="group" key={empl.id}>
                  <p className="invisible group-hover:visible">
                    {empl.fullname.charAt(0).toUpperCase() +
                      empl.fullname.slice(1, empl.fullname.length)}
                  </p>
                  <div
                    className={`w-9 h-9  text-white ${allBgGradient[ind]} group flex items-center justify-center rounded-full border-2 border-white shadow-sm`}
                  >
                    {empl.fullname.charAt(0).toUpperCase()}
                  </div>
                </div>
              ))}

            {assignEmployee.length > 5 && (
              <p className="ml-4 font-semibold text-base">
                {' '}
                +{assignEmployee.length - 5}
              </p>
            )}
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
 

export default Overview 