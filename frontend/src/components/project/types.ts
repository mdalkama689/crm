import type { ApiResponse } from '../../types/ApiResponse';

export interface IProject {
  id: string;
  name: string;
  iconUrl: string | null;
  createdAt: string;
  dueDate: string | null;
  description: string | null;
  attachmentUrl: string | null;
  createdBy: string;
  tenantId: string;
  assignToEmployee: { id: string; fullname: string }[];
}

export interface Employee {
  email: string;
  fullname: string;
  id: string;
}

export interface AssignedEmployeeResponse extends ApiResponse {
  employees: Employee[];
}

export interface Task {
  id: string;
  attachmentUrl: string;
  createdBy: string;
  totalTaskItem: number;
  completeTaskItem: true;
  totalComment: true;
  totalAttachment: true;
  employee: { fullname: string };
  description: string | null;
  dueDate: string | null;
  name: string;
  projectId: string;
  status: 'PENDING' | 'HOLD' | 'DONE';
  tenantId: string;
  createdAt: Date;
}

export interface TaskResponse extends ApiResponse {
  tasks: Task[];
  totalPages: number;
}

export interface AddTaskResponse extends ApiResponse {
  task: Task;
}

export interface AssignedEmployeeProps {
  id: string;
  fullname: string;
  email: string;
  password: string;
  role: string;
}

export interface TaskItemProps {
  id: string;
  completed: boolean;
  name: string;
  taskId: string;
}

interface TaskProps {
  id: string;
  name: string;
  dueDate: string;
  description: string;
  attachmentUrl: string;
  tenandtId: string;
  assigedEmployees: AssignedEmployeeProps[];
  createdBy: string;
  projectId: string;
  status: 'PENDING' | 'ON_HOLDING' | 'DONE';
  taskItems: TaskItemProps[];
}

export interface TaskApiResponseProps extends ApiResponse {
  task: TaskProps;
}

export interface DateProps {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
}

export interface CommentProps {
  id: string;
  createdAt: Date;
  employee: { fullname: string };
  projectId: string;
  taskId: string;
  creatorId: string;
  text?: string;
  attachmentUrl?: string;
}

export interface CommentResponse extends ApiResponse {
  allComments: CommentProps[];
}

export interface ProjectTaskPagesResponse extends ApiResponse {
  taskPagesLength: string;
}

export interface ProjectTaskPagesResponse extends ApiResponse {
  taskPagesLength: string;
}
export interface ProjectFilePagesResponse extends ApiResponse {
  totalPages: string;
}

export interface PagignationProps {
  type: string;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}
