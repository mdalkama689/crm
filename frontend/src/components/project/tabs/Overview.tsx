import { useEffect, useState } from 'react';
import { allBgGradient, months } from '../constant';
import { Calendar, Download } from 'lucide-react';
import { Progress } from '../../ui/progress';
import { Button } from '../../ui/button';
import { axiosInstance } from '../../../api/axios';
import { toast } from 'sonner';

interface ProjectOverview {
  description: string | null;
  dueDate: string | null;
  assignEmployee: { id: string; fullname: string }[];
  attachmentUrl: string | null;
}

const Overview = ({
  description,
  dueDate,
  assignEmployee,
  attachmentUrl,
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

  const downloadAttachment = async (attachmentUrl: string) => {
    try {
      const attachmentUrlObject = new URL(attachmentUrl);
      const pathname = attachmentUrlObject.pathname.substring(1);
      const fileType = pathname.split('.').pop();
      const response = await axiosInstance.post(
        '/download/file',
        { fileUrl: pathname },
        { responseType: 'blob' },
      );

      const goodUrl = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = goodUrl;
      a.download = `attachment.${fileType}`;
      a.click();
      URL.revokeObjectURL(goodUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download attachment!');
    }
  };

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

        {attachmentUrl && (
          <Button
            className="mt-7 mb-2 cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => downloadAttachment(attachmentUrl)}
          >
            <Download /> <span>Download Attachment</span>
          </Button>
        )}

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
