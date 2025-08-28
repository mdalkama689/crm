import { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, Filter, Grid2X2, List } from 'lucide-react';
import ProjectList from './ProjectList';
import ProjectGrid from './ProjectGrid';

const ProjectToolbar = () => {
  const [showProjectList, setShowProjectList] = useState<boolean>(false);

  return (
    <div>
      <div className="flex items-center gap-4 bg-white p-2 rounded-lg border ">
        <div className="flex p-1">
          <Button
            className={`flex items-center gap-2 px-4 py-2 bg-transparent text-black hover:bg-purple-600 hover:text-white rounded-full cursor-pointer text-sm font-medium ${showProjectList && 'bg-purple-500 text-white'}`}
            onClick={() => setShowProjectList(true)}
          >
            <List size={16} />
            List View
          </Button>

          <Button
            className={`flex items-center ml-3 gap-2 px-4 py-2 bg-transparent text-black hover:bg-purple-600 hover:text-white rounded-full cursor-pointer text-sm font-medium ${!showProjectList && 'bg-purple-500 text-white'}`}
            onClick={() => setShowProjectList(false)}
          >
            <Grid2X2 size={16} />
            Grid View
          </Button>
        </div>

        <div className="flex items-center gap-2 text-gray-600 border border-red-900">
          <Button className="p-2 text-gray-500 bg-transparent hover:bg-transparent hover:text-gray-700">
            <Filter size={20} />
          </Button>

          <span className="text-sm">Sort:</span>
          <Button className="flex items-center gap-1 text-sm font-medium bg-transparent hover:bg-transparen text-gray-900">
            <span>A-Z</span>
            <ChevronDown size={16} className="bg-transparent" />
          </Button>
        </div>
      </div>

      <div>{showProjectList ? <ProjectList /> : <ProjectGrid />}</div>
    </div>
  );
};

export default ProjectToolbar;
