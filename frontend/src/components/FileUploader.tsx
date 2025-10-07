import { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import ImageEditor from '@uppy/image-editor';
import XHRUpload from '@uppy/xhr-upload';
import Webcam from '@uppy/webcam';
import { baseURL } from '../api/axios';
import { toast } from 'sonner';

interface FileUploaderProps {
  open: any;
  onClose: any;
  setFileUrl: any;
  setFileName: any;
  setFileSize: any;
}

const FileUploader = ({
  open,
  onClose,
  setFileUrl,
  setFileName,
  setFileSize,
}: FileUploaderProps) => {
  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      id: 'file-uploader',
      restrictions: {
        minNumberOfFiles: 1,
        maxNumberOfFiles: 1,
        maxFileSize: 25 * 1024 * 1024,
      },
      autoProceed: false,
    });

    uppyInstance.use(ImageEditor);
    uppyInstance.use(XHRUpload, {
      endpoint: `${baseURL}upload-file`,
      fieldName: 'file',
      formData: true,
      withCredentials: true,
    });

    uppyInstance.use(Webcam);

    return uppyInstance;
  });

  useEffect(() => {
    uppy.on('upload-success', (file, response) => {
      const fileUrl = response?.body?.url;

      setFileUrl(fileUrl);
      const fileName = file?.name;
      setFileName(fileName);
      setFileSize(file?.size);
    });

    uppy.on('upload-error', () => {
      toast.error('Error while uploading a file');
    });
  }, [uppy]);

  return (
    <DashboardModal
      uppy={uppy}
      open={open}
      onRequestClose={onClose}
      plugins={['Webcam', 'ScreenCapture']}
      proudlyDisplayPoweredByUppy={false}
      note="You can upload one file with a maximum size of 25MB."
    />
  );
};

export default FileUploader;
