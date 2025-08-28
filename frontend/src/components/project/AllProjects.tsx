import DashboardLayout from '../../layout/DashboardLayout';
import ChatPanel from './ChatPanel';
import ProjectToolbar from './ProjectToolbar';

const AllProjects = () => {
  return (
    <div className="relative">
      <DashboardLayout>
        <div className="ml-[80px]">
          <ChatPanel />
        </div>

        <div className="absolute top-[80px] left-[450px]">
          <ProjectToolbar />
        </div>
      </DashboardLayout>
    </div>
  );
};

export default AllProjects;
