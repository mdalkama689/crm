import {
  Calendar,
  Upload,
  X,
  MoreHorizontal,
  Download,
  Paperclip,
  Link2,
  Smile,
} from 'lucide-react';
import { Label } from '../../ui/label';
import { Progress } from '../../ui/progress';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../slices/store/store';
import React, { useEffect, useRef, useState } from 'react';
import { allBgGradient, allowedAttachmentTypes, months } from '../constant';
import { axiosInstance } from '../../../api/axios';
import type {
  AssignedEmployeeProps,
  DateProps,
  Task,
  TaskApiResponseProps,
  TaskItemProps,
} from '../types';
import { toast } from 'sonner';
import type { ApiResponse } from '../../../types/ApiResponse';
import type { AxiosError } from 'axios';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface TaskItemComponentProps {
  task: Task;
  setTaskValue: React.Dispatch<React.SetStateAction<Task | undefined>>;
  setShowTaskItemForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskItem = ({
  task,
  setTaskValue,
  setShowTaskItemForm,
}: TaskItemComponentProps) => {
  const { project } = useSelector((state: RootState) => state.project);

  const [parsedDate, setParsedDate] = useState<DateProps>();
  const [taskName, setTaskName] = useState<string>('');
  const [allTaskItem, setAllTaskItem] = useState<TaskItemProps[]>([]);
  const [assignedEmployee, setAssignedEmployee] = useState<
    AssignedEmployeeProps[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [taskItemLoading, setTaskItemLoading] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<File | string>('');
  const [isAttachmentSubmitting, setIsAttachmentSubmitting] =
    useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [commentAttachment, setCommentAttachment] = useState<File | null>(null);
  const [isCommentSubmitting, setIsCommentSubmitting] =
    useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const emojiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [emojiRef]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const getDateComponents = (date: Date) => ({
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  });

  useEffect(() => {
    if (!task) return;
    const response = getDateComponents(new Date(task.createdAt));
    setParsedDate(response);
  }, [task]);

  useEffect(() => {
    if (!task.id || !project?.id) return;

    const fetchAllTaskItem = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<TaskApiResponseProps>(
          `/project/${project.id}/task/${task.id}/items`,
        );

        if (response.data.success) {
          setAllTaskItem(response.data.task.taskItems);
          setAssignedEmployee(response.data.task.assigedEmployees);
        }
      } catch (error) {
        console.error(' Error : ', error);
        const axiosError = error as AxiosError<ApiResponse>;

        const errorMessage = axiosError
          ? axiosError.response?.data.message
          : 'Something went wrong while fetching task items!';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTaskItem();
  }, [task.id, project?.id]);

  interface AddTaskItemResponse extends ApiResponse {
    taskItem: TaskItemProps;
  }

  const handleAddTaskItem = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      try {
        setIsSubmitting(true);
        const response = await axiosInstance.post<AddTaskItemResponse>(
          `/project/${project?.id}/task/${task.id}/items`,
          { taskItemName: taskName },
        );

        if (response.data.success) {
          toast.success('Task item added successfully!');
          setAllTaskItem([...allTaskItem, response.data.taskItem]);
          setTaskName('');
        }
      } catch (error) {
        console.error('Error : ', error);
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage =
          axiosError.response?.data.message || 'Error while adding task item!';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleToggleTaskItem = async (taskitemId: string) => {
    try {
      if (!project) return;
      setTaskItemLoading(true);
      setAllTaskItem((prevTaskItems) =>
        prevTaskItems.map((taskItem) =>
          taskItem.id === taskitemId
            ? { ...taskItem, completed: !taskItem.completed }
            : taskItem,
        ),
      );

      const response = await axiosInstance.patch<ApiResponse>(
        `/project/${project.id}/task/${task.id}/taskItem/${taskitemId}/toggle `,
      );

      if (!response.data.success) {
        setAllTaskItem((prevTaskItems) =>
          prevTaskItems.map((taskItem) =>
            taskItem.id === taskitemId
              ? { ...taskItem, completed: !taskItem.completed }
              : taskItem,
          ),
        );
        toast.error('Failed to update task item. Please try again.');
      }

      toast.success('Task item updating task item checked');
    } catch (error) {
      console.error('Failed to update task item. Please try again.', error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage = axiosError?.response?.data?.message
        ? axiosError.response.data.message
        : 'Failed to update task item. Please try again.';

      toast.error(errorMessage);

      setAllTaskItem((prevTaskItems) =>
        prevTaskItems.map((taskItem) =>
          taskItem.id === taskitemId
            ? { ...taskItem, completed: !taskItem.completed }
            : taskItem,
        ),
      );
    } finally {
      setTaskItemLoading(false);
    }
  };

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

  const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const fileSize = file.size;

    if (file && !allowedAttachmentTypes.includes(file.type)) {
      return toast.error('This attachment type is not allowed!');
    }

    const maxSizeOfAttachment = 25 * 1024 * 1024;

    if (fileSize > maxSizeOfAttachment) {
      return toast.error('Max size of attachment cannot be more than 25mb');
    }

    setAttachment(file);
  };

  interface UploadOrChangeAttachmentResponse extends ApiResponse {
    url: string;
  }

  const handleUploadOrChangeAttachment = async () => {
    try {
      if (!project) return;

      const formData = new FormData();
      formData.append('attachment', attachment);

      setIsAttachmentSubmitting(true);
      const response =
        await axiosInstance.patch<UploadOrChangeAttachmentResponse>(
          `/project/${project.id}/task/${task.id}/update-attachment`,
          formData,
        );

      if (response.data.success) {
        toast.success('Attachment update successfully!');
        setTaskValue({
          ...task,
          attachmentUrl: response.data.url,
        });

        setAttachment('');
      }
    } catch (error) {
      console.error('Error : ', error);
      const axiosError = error as AxiosError<AxiosError>;
      const errorMessage =
        axiosError.response?.data.message || 'Error while updating attachment';
      toast.error(errorMessage);
    } finally {
      setIsAttachmentSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    try {
      if (!project) return;
      if (!commentAttachment && !comment.trim()) {
        return toast.error('Please provide either text or an attachment');
      }
      setIsCommentSubmitting(true);
      const formData = new FormData();
      formData.append('attachment', commentAttachment ? commentAttachment : '');
      formData.append('text', comment);
      const response = await axiosInstance.post<ApiResponse>(
        `/project/${project.id}/task/${task.id}/add-comment`,
        formData,
      );

      if (response.data.success) {
        setComment('');
        setCommentAttachment(null);
      }
    } catch (error) {
      console.error(' Error : ', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'Something went  wrong while adding comment';

      toast.error(errorMessage);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleCommentAttachment = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const fileSize = file.size;
    const maxSizeOfAttachment = 25 * 1024 * 1024;

    if (file && !allowedAttachmentTypes.includes(file.type)) {
      return toast.error('This attachment type is  not allowed!');
    }
    if (fileSize > maxSizeOfAttachment) {
      return toast.error('Max size of attachment cannot be more than 25mb');
    }

    setCommentAttachment(file);
  };

  const removeCommentAttachment = () => {
    setCommentAttachment(null);
  };

  const handleRandomGradient = () => {
    const randomNumber = Math.floor(Math.random() * allBgGradient.length);
    return allBgGradient[randomNumber];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-3xl mx-auto relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Checkbox id="mark-complete" checked={task.status === 'DONE'} />
          <Label
            htmlFor="mark-complete"
            className="text-sm font-medium text-gray-700"
          >
            Mark as Completed
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setShowTaskItemForm(false)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {task?.name}
        </h2>
        {parsedDate && (
          <p className="text-sm text-gray-500">
            Task created on {months[parsedDate.month]} {parsedDate.day},{' '}
            {parsedDate.year} -{' '}
            {parsedDate.hour > 12
              ? (parsedDate.hour - 12).toString().padStart(2, '0')
              : parsedDate.hour}
            :{parsedDate.minute.toString().padStart(2, '0')}{' '}
            {parsedDate.hour > 12 ? 'PM' : 'AM'}
          </p>
        )}
      </div>

      <div className="mb-6">
        <Label className="font-semibold text-base text-gray-700 mb-2 block">
          Description
        </Label>
        <p className="text-sm text-gray-600 leading-relaxed">
          {project?.description}
        </p>
      </div>

      <div className="mb-6">
        <Label className="font-semibold text-base text-gray-700 mb-3 block">
          Due Date
        </Label>
        <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-3 py-3 w-fit">
          <Calendar className="h-4 w-4 text-gray-600" />
          {parsedDate && (
            <span className="text-sm text-gray-700">
              {months[parsedDate.month]} 24, 2024
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <Label className="font-semibold text-base text-gray-700 mb-3 block">
          Assign to
        </Label>
        {isLoading ? (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"
              ></div>
            ))}
          </div>
        ) : assignedEmployee.length === 0 ? (
          <p className="text-sm text-gray-500">No employee assigned</p>
        ) : (
          <div className="flex -space-x-2 items-center">
            {assignedEmployee &&
              assignedEmployee.slice(0, 5).map((empl) => (
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

            {assignedEmployee.length > 5 && (
              <p className="ml-4 font-semibold text-base">
                {' '}
                +{assignedEmployee.length - 5}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Label className="font-semibold text-base text-gray-700">
            Overall Progress
          </Label>
          <span className="text-sm text-gray-600">
            {allTaskItem.filter((task) => task.completed).length}/
            {allTaskItem.length}
          </span>
        </div>
        <Progress
          value={
            (allTaskItem.filter((task) => task.completed).length * 100) /
            allTaskItem.length
          }
          className="h-2"
        />
      </div>

      <div className="mb-6">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-6 w-40 bg-gray-200 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        ) : allTaskItem.length === 0 ? (
          <p className="text-sm text-gray-500">No task items available</p>
        ) : (
          allTaskItem.map((task) => (
            <div className="flex items-center gap-3" key={task.id}>
              <Checkbox
                className="cursor-pointer"
                disabled={taskItemLoading}
                checked={task.completed}
                onClick={() => handleToggleTaskItem(task.id)}
              />
              <p className="text-xl flex-1 font-normal  text-gray-700">
                {task.name}
              </p>
            </div>
          ))
        )}

        <div className="mt-4 ">
          <div className="flex items-center">
            <Input
              placeholder="Type to add more"
              className="border-none shadow-none px-0 text-sm placeholder:text-gray-400 focus-visible:ring-0"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyDown={handleAddTaskItem}
              disabled={isSubmitting}
            />
            {isSubmitting && (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Attachment</h3>

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">
              {attachment instanceof File && `Selected : ${attachment.name}`}
            </span>

            {attachment && (
              <Button
                className="bg-transparent text-blue-600 cursor-pointer hover:bg-transparent"
                disabled={isAttachmentSubmitting}
                onClick={handleUploadOrChangeAttachment}
              >
                Confirm
              </Button>
            )}
          </div>
        </div>

        {task.attachmentUrl ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Paperclip className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Attached file</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                disabled={isAttachmentSubmitting}
                onClick={() => downloadAttachment(task.attachmentUrl)}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                <Download className="h-3 w-3" />
                Download
              </Button>

              <Label
                htmlFor="attachment"
                className={`inline-flex bg-transparent ${isAttachmentSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors`}
              >
                <Input
                  className="hidden"
                  disabled={isAttachmentSubmitting}
                  name="attachment"
                  id="attachment"
                  type="file"
                  onChange={handleAttachment}
                />
                <Upload className="h-3 w-3 " />
                Change
              </Label>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              Upload attachment
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Drag and drop or click to browse
            </p>
            <Label
              htmlFor="attachment"
              className="inline-flex cursor-pointer items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Input
                className="hidden"
                disabled={isAttachmentSubmitting}
                name="attachment"
                id="attachment"
                type="file"
                onChange={handleAttachment}
              />
              <Upload className="h-4 w-4" />
              Choose File
            </Label>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
        <div className="flex-grow">
          <Input
            className="w-full rounded-full p-5"
            placeholder="Add comment here"
            disabled={isCommentSubmitting}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Label
            htmlFor="comment-attachment"
            className={`${isCommentSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Input
              type="file"
              onChange={handleCommentAttachment}
              disabled={isCommentSubmitting}
              className="hidden"
              name="comment-attachment"
              id="comment-attachment"
            />
            <div
              className={`bg-gray-100 hover:bg-gray-200 rounded-full border border-slate-300 p-1.5 ${isCommentSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Link2 color="#4B5563" />
            </div>
          </Label>

          <div
            className={`bg-gray-100 hover:bg-gray-200 rounded-full border border-slate-300 p-1.5 ${isCommentSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={toggleEmojiPicker}
          >
            <Smile color="#4B5563" />
          </div>

          <Button
            className="bg-[#F16334] hover:bg-[#f55621] rounded-full cursor-pointer"
            onClick={handleAddComment}
            disabled={isCommentSubmitting}
          >
            Submit
          </Button>
        </div>
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-[120px] right-0" ref={emojiRef}>
          <Picker
            data={data}
            theme="dark"
            previewPosition="none"
            onEmojiSelect={(emoji: { native: string }) =>
              setComment((pre) => pre + emoji.native)
            }
          />
        </div>
      )}

      {commentAttachment && (
        <div className="border border-gray-300 bg-gray-100 px-3 py-3 rounded-xl mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Paperclip className="h-4 w-4 text-blue-600" />
            </div>

            <span>{commentAttachment.name}</span>
          </div>

          <Button
            type="button"
            className="w-8 h-8 bg-transparent hover:bg-blue-100 rounded-lg flex items-center justify-center"
            disabled={isCommentSubmitting}
            onClick={removeCommentAttachment}
          >
            <X className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
