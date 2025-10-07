import {
  Bell,
  Bolt,
  Calendar,
  Lock,
  Pen,
  Trash,
  Upload,
  UserPen,
  UserRoundPen,
} from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { useEffect, useState } from 'react';
import { allBgGradient } from '../constant';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../slices/store/store';
import type { EditorProps } from '../../Editor';
import ReactQuill from 'react-quill-new';

const Setting = () => {
  const { project } = useSelector((state: RootState) => state.project);

  const [content, setContent] = useState<string>('');
  const [delta, setDelta] = useState<string>('');
  const [bgGradients, setBgGradients] = useState<string[]>([]);

  const generateRandomGradient = () => {
    const number = Math.floor(Math.random() * allBgGradient.length);
    setBgGradients((prev) => [...prev, allBgGradient[number]]);
  };

  useEffect(() => {
    if (!project) return;

    // project.assignToEmployee.length

    for (let i = 0; i < 10; i++) {
      generateRandomGradient();
    }
  }, []);

  useEffect(() => {
    console.log(' bg gradient : ', bgGradients);
  }, [bgGradients]);

  const isEditing = useState<boolean>(true);

  return (
    <div className="flex items-center gap-6 pb-10">
      <div>
        <div className="flex items-center gap-3 pt-8">
          <img
            className="h-6 w-6 "
            src="https://imgs.search.brave.com/NniphtMag3GzcQcgE3v-JubzPQkKKp2cT9eMmvoDWjk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni81MzYvNTM2NDUz/LnBuZz9zZW10PWFp/c193aGl0ZV9sYWJl/bA"
            alt=""
          />
          <p className="text-[#A176F7] font-normal">Change project icon </p>
        </div>
        <div className="pt-5">
          <Label className="text-slate-700">Project's Name </Label>
          <Input
            className="mt-3 rounded-3xl py-5 px-5 text-slate-700"
            value={project?.name}
          />
        </div>

        <div className="pt-5">
          <Label className="text-slate-700">Due Date</Label>
          <div className="mt-3 relative">
            <Calendar className="absolute top-2 left-4" color="#6B7280" />
            <Input
              className="mt-3 rounded-3xl py-5 px-12 text-slate-700"
              value={project?.dueDate}
            />
          </div>
        </div>

        <div className="pt-5">
          <Label className="text-slate-700">Assigned To </Label>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white border ${bgGradients[0]}`}
              >
                K
              </div>

              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white border ${bgGradients[1]}`}
              >
                K
              </div>

              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white border ${bgGradients[1]}`}
              >
                K
              </div>
            </div>{' '}
            <span className="-ml-3">+5</span>
            <Button className="ml-3 rounded-full"> Add Member </Button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-slate-700 font-semibold">Project's Description</p>
          {project?.description ? (
            <Editor
              content={content}
              setContent={setContent}
              setDelta={setDelta}
            />
          ) : (
            <Editor
              content={content}
              setContent={setContent}
              setDelta={setDelta}
            />
          )}
        </div>

        <div className="mt-5">
          {/* <span className="text-sm font-medium">
              {attachment instanceof File && `Selected: ${attachment.name} `}
            </span> */}

          <Label htmlFor="attachment" className="mt-3">
            <div className="flex items-center bg-transparent space-x-2 text-purple-500 hover:text-purple-600 hover:bg-transparent transition-colors cursor-pointer group">
              <Input
                type="file"
                name="attachment"
                className="hidden"
                id="attachment"
              />

              <Upload className="h-4 w-4 group-hover:scale-110 transition-transform" />

              <p className="text-sm font-medium">
                {true ? 'Change' : 'Upload'} your attachment
              </p>
            </div>
          </Label>
        </div>

        <div>
          {!isEditing ? (
            <Button className="flex mt-5 items-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition">
              <Pen className="w-4 h-4" />
              <span>Edit Settings</span>
            </Button>
          ) : (
            <div className="mt-10 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                className="px-5 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </Button>

              <Button className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition">
                Update Setting
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex gap-4 flex-col">
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Bolt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                General Information
              </p>
              <p className="text-xs text-gray-500">Main settings and details</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <UserPen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Account & Apps
              </p>
              <p className="text-xs text-gray-500">
                Connect tools and services
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Privacy </p>
              <p className="text-xs text-gray-500">Private or public project</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <UserRoundPen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Billing </p>
              <p className="text-xs text-gray-500">Setup billing method</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Notification{' '}
              </p>
              <p className="text-xs text-gray-500">
                Set your email notification
              </p>
            </div>
          </div>
        </div>
        <Button className="flex  bg-transparent mt-4 items-center gap-6 w-full px-14 cursor-pointer py-9 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
          <Trash className="w-8 h-8 text-gray-400 flex-shrink-0" />

          <div className="flex flex-col text-left">
            <p className="text-sm font-medium text-red-500">Delete Project</p>
            <p className="text-xs text-gray-500">
              Hide & disable current project
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Setting;

const Editor = ({ content, setContent, setDelta }: EditorProps) => {
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    ['link', 'formula'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
  ];

  return (
    <div className="flex  items-center  bg-gray-50 mt-2">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-4 border border-gray-200">
        <ReactQuill
          modules={{ toolbar: toolbarOptions }}
          theme="snow"
          value={content}
          onChange={(html, _, __, editor) => {
            setDelta(editor.getContents());
            setContent(html);
          }}
          placeholder="Start typing..."
          className="rounded-lg"
        />
      </div>
    </div>
  );
};
