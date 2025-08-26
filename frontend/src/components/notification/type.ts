import type { ApiResponse } from '../../types/ApiResponse';

export type TypeIcon = 'TASK' | 'PROJECT' | 'COMMENT';
export interface NotificationProps {
  id: string;
  createdAt: Date;
  employeeId: string;
  enitityId: string;
  entityType: TypeIcon;
  seen: boolean;
  text: string;
}

export interface NotificationResponse extends ApiResponse {
  notifications: NotificationProps[];
}
