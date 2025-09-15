import { useSelector } from 'react-redux';
import type { RootState } from '../../../slices/store/store';
import { axiosInstance } from '../../../api/axios';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../.././ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../.././ui/pagination';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  UserRound,
} from 'lucide-react';
import type { ApiResponse } from '../../../types/ApiResponse';
import { Button } from '../../ui/button';
import { allBgGradient } from '../constant';
import { toast } from 'sonner';
import Loader from '../../Loader';

interface Employee {
  fullname: string;
}

interface FileItem {
  id: string;
  assigedEmployees: Employee[];
  attachmentUrl: string;
  attachmentSize: string;
  employee: { fullname: string };
}

interface FileResponse extends ApiResponse {
  allFile: FileItem[];
  count: number;
}

const File = () => {
  return (
    <div className="mt-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead className="text-right">Members</TableHead>
          </TableRow>
        </TableHeader>
        <TableContent />
      </Table>
      <div className="mt-5 mb-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default File;

const TableContent = () => {
  const { project } = useSelector((state: RootState) => state.project);

  if (!project) return;

  const [allAttachment, setAllAttachment] = useState<FileItem[]>([]);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);

  const fetchAllFiles = async () => {
    try {
      setIsFileLoading(true);
      const response = await axiosInstance.get<FileResponse>(
        `/projects/${project.id}/files`,
      );
      console.log(response);
      if (response.data.success) {
        setAllAttachment(response.data.allFile);
        console.log(' response.data.allFile : ', typeof response.data.count);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFileLoading(false);
    }
  };

  useEffect(() => {
    if (!project) return;

    fetchAllFiles();
  }, [project.id]);

  const [attachmentId, setAttachmentId] = useState('');

  const toggleDownloadButton = (id: string) => {
    console.log(id);

    if (id === attachmentId) {
      setAttachmentId('');
    } else {
      setAttachmentId('');
      setAttachmentId(id);
    }
  };

  const getAttachmanentName = (attachmentFileName: string) => {
    const pathname = new URL(attachmentFileName).pathname;
    const filename = pathname.replace('/uploads/', ' ');
    return decodeURIComponent(filename);
  };

  const getAttachmanentSize = (attachmentSize: string) => {
    const inMb = Number(attachmentSize) / (1024 * 1024);
    return inMb.toFixed(2);
  };

  const capitalizeFirstChar = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleRandomGradient = () => {
    const randomNumber = Math.floor(Math.random() * allBgGradient.length);
    return allBgGradient[randomNumber];
  };

  const downloadAttachment = async (attachmentUrl: string) => {
    try {
      console.log(' attachment url : ', attachmentUrl);
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

  const getFileColor = (attachmentUrl: string) => {
    const fileType = new URL(attachmentUrl).pathname.split('.').pop();
    if (fileType === 'pdf') {
      return 'bg-red-600';
    } else if (
      fileType === 'msword' ||
      fileType === 'doc' ||
      fileType === 'docx'
    ) {
      return 'bg-blue-600';
    } else if (fileType === 'jpg' || fileType === 'jpeg') {
      return 'bg-green-600';
    } else if (fileType === 'png') {
      return 'bg-yellow-600';
    } else {
      return 'bg-gray-500';
    }
  };

  if (isFileLoading) {
    return <Loader />;
  }

  return (
    <>
      {allAttachment.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4 text-gray-500">
          <p>No files available</p>
        </div>
      ) : (
        allAttachment.map((attachment) => (
          <>
            <div className="mt-5"></div>
            <TableBody className="border border-gray-300 rounded-xl mt-5">
              <TableRow className="border-none hover:bg-gray-50">
                <TableCell className="font-medium flex items-center gap-3 py-4">
                  <div
                    className={`${getFileColor(attachment.attachmentUrl)} h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center text-white text-sm font-medium`}
                  >
                    {new URL(attachment.attachmentUrl).pathname
                      .split('.')
                      .pop()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getAttachmanentName(attachment.attachmentUrl)}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 py-4">
                  {getAttachmanentSize(attachment.attachmentSize)} Mb
                </TableCell>
                <TableCell className="text-gray-600 py-4">
                  {capitalizeFirstChar(attachment.employee.fullname)}{' '}
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex -space-x-2 items-center">
                      {attachment.assigedEmployees.slice(0, 5).map((empl) => (
                        <div className="group relative">
                          <div
                            className={`${handleRandomGradient()} border-2 border-white h-8 w-8 flex items-center justify-center rounded-full`}
                          >
                            <UserRound className="h-4 w-4 text-white" />
                          </div>
                          <p className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded">
                            {empl.fullname}
                          </p>
                        </div>
                      ))}
                      {attachment.assigedEmployees.length > 5 && (
                        <span className="ml-2 text-gray-600 font-normal text-sm">
                          +{attachment.assigedEmployees.length - 5}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      {attachmentId === attachment.id && (
                        <div
                          className="absolute -top-10 right-0 flex items-center gap-2 cursor-pointer bg-white border rounded-md px-3 py-2 shadow-md z-10"
                          onClick={() =>
                            downloadAttachment(attachment.attachmentUrl)
                          }
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Attachment</span>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleDownloadButton(attachment.id)}
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </>
        ))
      )}
    </>
  );
};
