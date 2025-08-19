import {
  Calendar,
  FilePlus,
  FileText,
  Layers,
  List,
  UserPlus,
} from 'lucide-react';

interface ICreateMenuProps {
  open: boolean;
  onClose: () => void;
}

const CreateMenu = ({ open, onClose }: ICreateMenuProps) => {
  const menuItems = [
    { id: '1', text: 'New Projects', icon: FilePlus },
    { id: '2', text: 'New Task', icon: List },
    { id: '3', text: 'New Contact', icon: UserPlus },
    { id: '4', text: 'New Event', icon: Calendar },
    { id: '5', text: 'New Product', icon: Layers },
    { id: '6', text: 'New Invoice', icon: FileText },
  ];

  if (!open) {
    return;
  }
  return (
    <div
      className="bg-white w-56 absolute top-[50px] right-0 rounded-2xl shadow-lg p-2"
      onClick={onClose}
    >
      {menuItems.map((menu) => {
        const Icon = menu.icon;
        return (
          <div
            key={menu.id}
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <Icon className="w-5 h-5" />
            <p className="text-sm font-medium">{menu.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CreateMenu;
