import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axios';
import type { ApiResponse } from '../types/ApiResponse';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import HomeLayout from '../layout/HomeLayout';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import Loader from './Loader';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export interface Employee {
  id: string;
  email: string;
  fullname: string;
  role: string;
}

export interface EmployeesApiResponse extends ApiResponse {
  employees: Employee[];
}

const allRoles = [
  {
    id: '1',
    value: 'admin',
    lable: 'Admin',
  },
  {
    id: '2',
    value: 'employee',
    lable: 'Employee',
  },
  {
    id: '3',
    value: 'client',
    lable: 'Client',
  },
];

const AllEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] =
    useState<boolean>(false);
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] =
    useState<string>('');
  const [selectedNewRole, setSelectedNewRole] = useState<string>('');
  const [isChangingRole, setIsChangingRole] = useState<boolean>(false);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response =
        await axiosInstance.get<EmployeesApiResponse>('/employees');
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'Something went wrong fetching all employee details!';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  interface FormData {
    email: string;
    role: string;
  }

  const updateEmployeeRole = async (data: FormData) => {
    try {
      setIsChangingRole(true);
      const response = await axiosInstance.post<ApiResponse>(
        '/admin/change-role',
        data,
      );

      if (response.data.success) {
        toast.success(
          response.data.message +
            ' ' +
            'Refresh the page to see the latest changes',
        );
      }
    } catch (error) {
      console.error(' error : ', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        'Something went wrong  while changing the role';
      toast.error(errorMessage);
    } finally {
      setIsChangingRole(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const promptRoleChange = (email: string, role: string) => {
    setSelectedEmployeeEmail(email);
    setSelectedNewRole(role);
    setIsRoleChangeDialogOpen(true);
  };

  const confirmRoleChange = () => {
    if (selectedEmployeeEmail && selectedNewRole) {
      const payload: FormData = {
        email: selectedEmployeeEmail,
        role: selectedNewRole,
      };

      updateEmployeeRole(payload);
    }
  };

  const cancelRoleChange = () => {
    setSelectedEmployeeEmail('');
    setSelectedNewRole('');
  };

  return (
    <HomeLayout>
      <div className="p-6 space-y-6 mt-24">
        <AlertDialog
          open={isRoleChangeDialogOpen}
          onOpenChange={() =>
            setIsRoleChangeDialogOpen(!isRoleChangeDialogOpen)
          }
        >
          <AlertDialogTrigger></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you absolutely sure you want to change the role?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelRoleChange}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmRoleChange}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">All Employees</h1>
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Change Role</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {employees &&
                employees.map((emp, ind) => (
                  <TableRow key={emp.id}>
                    <TableCell>{ind + 1}.</TableCell>
                    <TableCell className="font-medium">
                      {emp.fullname.charAt(0).toUpperCase() +
                        emp.fullname.slice(1)}
                    </TableCell>

                    <TableCell>{emp.email}</TableCell>

                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {emp.role}
                      </span>
                    </TableCell>

                    <TableCell>
                      {isChangingRole && selectedEmployeeEmail === emp.email ? (
                        <span className="text-sm text-blue-600 font-medium">
                          Changing role...
                        </span>
                      ) : (
                        <Select
                          defaultValue={emp.role}
                          onValueChange={(value) =>
                            promptRoleChange(emp.email, value)
                          }
                        >
                          <SelectTrigger className="max-w-[150px] w-full border rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {allRoles.map((role) => (
                              <SelectItem key={role.id} value={role.value}>
                                {role.lable}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AllEmployee;
