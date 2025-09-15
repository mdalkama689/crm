import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { axiosInstance } from '../api/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../slices/store/store';
import { limit } from './project/constant';
import type { ApiResponse } from '../types/ApiResponse';
import type { AxiosError } from 'axios';
import type {
  PagignationProps,
  ProjectTaskPagesResponse,
} from './project/types';

const Pagignation = ({ onPageChange }: PagignationProps) => {
  const [totalPages, setTotalPages] = useState<number>(0);

  const { project } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    if (!project?.id) return;

    const fetchProjectTaskPages = async () => {
      try {
        const response = await axiosInstance.get<ProjectTaskPagesResponse>(
          `/project/${project.id}/task-pages?limit=${limit}`,
        );

        if (response.data.success) {
          setTotalPages(Number(response.data.taskPagesLength));
        }
      } catch (error) {
        console.error('Error : ', error);
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage =
          axiosError.response?.data.message ||
          'Something went wrong while fething the tasks of the length';
        toast.error(errorMessage);
      }
    };

    fetchProjectTaskPages();
  }, [project?.id]);

  const initial = 1;

  const [currentPage, setCurrentPage] = useState<number>(initial);

  const windowSize = Math.min(4, totalPages);
  const step = windowSize === 4 ? 3 : windowSize;

  const handlePrev = () => {
    const max = Math.max(1, currentPage - 1);
    onPageChange(max);

    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const handleNext = () => {
    const min = Math.min(totalPages, currentPage + 1);
    onPageChange(min);

    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const getPageNumbers = () => {
    let start = Math.floor((currentPage - 1) / step) * step + 1;

    const maxStart = Math.max(1, totalPages - (windowSize - 1));
    if (start > maxStart) start = maxStart;

    const end = Math.min(start + windowSize - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPageNumbers();

  const handleCurrentPage = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <Button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition"
      >
        Prev
      </Button>

      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handleCurrentPage(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              page === currentPage
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagignation;
