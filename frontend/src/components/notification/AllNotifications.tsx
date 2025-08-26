import DashboardLayout from '../../layout/DashboardLayout';
import Notification from './Notification';

const AllNotifications = () => {
  return (
    <DashboardLayout>
      <div className="flex gap-1 mt-8 ml-[300px]">
        <div className="mt-12 ml-12 w-[calc(100%-300px)]">
          <Notification />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllNotifications;
