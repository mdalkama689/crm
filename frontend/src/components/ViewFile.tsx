import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axios';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const ViewFile = () => {
  const search = useLocation().search;
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');

  const fetchFile = async (file: string) => {
    try {
      const pathname = file.substring(1);
      const getFileType = pathname.split('.').pop();
      if (!getFileType) return;
      setFileType(getFileType);
      const response = await axiosInstance.post(
        '/download/file',
        { fileUrl: pathname },
        { responseType: 'blob' },
      );

      if (getFileType === 'pdf') {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setSelectedFile(url);
      }
      if (
        getFileType === 'png' ||
        getFileType === 'jpeg' ||
        getFileType === 'jpg'
      ) {
        const blob = new Blob([response.data]);
        setSelectedFile(URL.createObjectURL(blob));
        setFileType(getFileType);
      }
    } catch (error) {
      toast.error('Something went wrong while view the file');
      console.error('Error : ', error);
    }
  };

  useEffect(() => {
    const url = new URLSearchParams(search).get('pathname');

    if (!url) return;

    fetchFile(url);
  }, [search]);

  return (
    <div>
      {fileType === 'pdf' ? (
        <iframe
          src={selectedFile}
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        />
      ) : (
        <div>
          <div className="flex justify-center items-center w-full h-screen bg-black">
            <img
              src={selectedFile}
              alt="preview"
              className="w-[90%] h-[90%] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFile;
