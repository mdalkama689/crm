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
