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
    id: string 
    attachmentUrl:  string, 
createdBy : string
description: string |null
dueDate: string | null
name: string, 
projectId: string, 
status:  "PENDING" | "ON_HOLDING" | "DONE", 
tenantId: string 
  }

  
  export interface TaskResponse  extends ApiResponse{
    tasks: Task[]
  }
    

  export interface AddTaskResponse extends ApiResponse {
    task : Task 
  }