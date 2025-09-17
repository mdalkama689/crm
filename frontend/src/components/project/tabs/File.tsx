import { useSelector } from 'react-redux';
import type { RootState } from '../../../slices/store/store';
import { axiosInstance } from '../../../api/axios';
import React, { useEffect, useRef, useState } from 'react';
import { Download, MoreHorizontal, UserRound } from 'lucide-react';
import type { ApiResponse } from '../../../types/ApiResponse';
import { Button } from '../../ui/button';
import { allBgGradient, limit } from '../constant';
import { toast } from 'sonner';
import Pagignation from '../../Pagignation';

interface FileItem {
  id: string;
  attachmentUrl: string;
  attachmentSize: string;
  employeefullname: string;
  assignedemployeefullnames: string | null;
}

interface FileResponse extends ApiResponse {
  allFile: FileItem[];
  count: number;
}

const File = () => {
  const { project } = useSelector((state: RootState) => state.project);

  if (!project) return;

  const fileRef = useRef<HTMLInputElement>(null);

  const [allAttachment, setAllAttachment] = useState<FileItem[]>([]);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [attachmentId, setAttachmentId] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchAllFiles = async () => {
    try {
      setIsFileLoading(true);
      const response = await axiosInstance.get<FileResponse>(
        `/projects/${project.id}/files?limit=${limit}&page=${currentPage}`,
      );

      if (response.data.success) {
        setAllAttachment(response.data.allFile);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch all attachment');
    } finally {
      setIsFileLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFiles();
  }, [currentPage]);

  const toggleDownloadButton = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string,
  ) => {
    e.stopPropagation();
    setAttachmentId((prev) => (prev === id ? '' : id));
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

  const downloadAttachment = async (
    e: React.MouseEvent<HTMLDivElement>,
    attachmentUrl: string,
  ) => {
    try {
      e.stopPropagation();
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
      setAttachmentId('');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download attachment!');
    }
  };

  const getFileColor = (attachmentUrl: string) => {
    const fileType = new URL(attachmentUrl).pathname.split('.').pop();
    if (fileType === 'pdf') {
      return 'bg-red-600';
    } else if (fileType === 'jpg' || fileType === 'jpeg') {
      return 'bg-green-600';
    } else if (fileType === 'png') {
      return 'bg-yellow-600';
    } else {
      return 'bg-gray-500';
    }
  };

  const viewFile = (attachmentUrl: string) => {
    const pathname = new URL(attachmentUrl).pathname;
    setAttachmentId('');
    window.open(`/view-file?pathname=${pathname}`, '_blank');
  };

  useEffect(() => {
    const handleOutSide = (e: MouseEvent) => {
      if (fileRef.current && !fileRef.current.contains(e.target as Node)) {
        setAttachmentId('');
      }
    };

    document.addEventListener('mousedown', handleOutSide);

    return () => {
      document.removeEventListener('mousedown', handleOutSide);
    };
  }, [fileRef]);

  return (
    <>
      {isFileLoading ? (
        <div className="h-[300px] w-[100%] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : allAttachment.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4 text-gray-500">
          <p>No files available</p>
        </div>
      ) : (
        <div className="overflow-auto h-[450px] mt-10 custom-scrollbar">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 text-black sticky top-[-1px] z-10">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left w-[300px]">
                  Name
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left w-[120px]">
                  Size
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left w-[120px]">
                  Tag
                </th>
                <th className="px-4 py-2 border border-gray-300 text-left w-[100px]">
                  Members
                </th>
              </tr>
            </thead>
            <tbody>
              {allAttachment.map((attachment) => (
                <tr
                  key={attachment.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => viewFile(attachment.attachmentUrl)}
                >
                  <td className="px-4 py-2 border border-gray-300 w-[250px]">
                    <div className="flex items-center gap-3">
                      <div
                        className={`${getFileColor(
                          attachment.attachmentUrl,
                        )} h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-medium`}
                      >
                        {new URL(attachment.attachmentUrl).pathname
                          .split('.')
                          .pop()}
                      </div>
                      <div>
                        <p className="font-normal text-[12px] text-gray-900">
                          {getAttachmanentName(attachment.attachmentUrl)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2 border border-gray-300 w-[100px] text-gray-600">
                    {getAttachmanentSize(attachment.attachmentSize)} Mb
                  </td>

                  <td className="px-4 py-2 border border-gray-300 w-[150px] text-gray-600">
                    {capitalizeFirstChar(attachment.employeefullname)}
                  </td>

                  <td className="px-4 py-2 border border-gray-300 w-[200px] text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex -space-x-2 items-center">
                        {attachment.assignedemployeefullnames &&
                          attachment.assignedemployeefullnames
                            .split(',')
                            .slice(0, 5)
                            .map((empl) => (
                              <div key={empl} className="group relative">
                                <div
                                  className={`${handleRandomGradient()} border-2 border-white h-8 w-8 flex items-center justify-center rounded-full`}
                                >
                                  <UserRound className="h-4 w-4 text-white" />
                                </div>
                                <p className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded z-30">
                                  {empl}
                                </p>
                              </div>
                            ))}
                        {[attachment.assignedemployeefullnames].length > 5 && (
                          <span className="ml-2 text-gray-600 font-normal text-sm">
                            +{[attachment.assignedemployeefullnames].length - 5}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        {attachmentId === attachment.id && (
                          <div
                            className="absolute -top-10 right-0 flex items-center gap-2 cursor-pointer bg-white border rounded-md px-3 py-2 shadow-md z-10 w-[220px]"
                            ref={fileRef}
                            onClick={(e) =>
                              downloadAttachment(e, attachment.attachmentUrl)
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
                          onClick={(e) =>
                            toggleDownloadButton(e, attachment.id)
                          }
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagignation type="file" onPageChange={setCurrentPage} />
    </>
  );
};

export default File;
