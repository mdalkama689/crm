import { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import ImageEditor from '@uppy/image-editor';
import XHRUpload from '@uppy/xhr-upload';
import WebCam from '@uppy/webcam';
import ScreenCapture from '@uppy/screen-capture';

const Extra = () => {
  const [uppy] = useState(() => {
    const uppyInstance = new Uppy({
      id: 'file-uploader',
      restrictions: {
        maxNumberOfFiles: 5,
      },
      autoProceed: false,
    });

    uppyInstance.use(ImageEditor, {
      cropperOptions: {
        aspectRatio: 1,
        viewMode: 1,
      },
      actions: {
        revert: true,
        rotate: true,
        granularRotate: true,
        flip: true,
        zoomIn: true,
        zoomOut: true,
        cropSquare: true,
        cropWidescreen: true,
        cropWidescreenVertical: true,
      },
    });

    uppyInstance.use(XHRUpload, {
      endpoint: 'http://localhost:8000/api/v1/upload',
      fieldName: 'file',
      formData: true,
      withCredentials: true,
    });

    uppyInstance.use(WebCam);
    uppyInstance.use(ScreenCapture);

    return uppyInstance;
  });

  useEffect(() => {
    const successHandler = (file: any, response: any) => {
      console.log('File upload successfully : ', file.name);
      console.log(' response : ', response);
    };

    const errorHandler = (file: any, error: any) => {
      console.log('Error uploading files : ', file);
      console.log('Error details : ', error);
    };

    const completeHandler = (result: any) => {
      console.log('Upload complete : ', result);
    };

    // Cleanup function
    return () => {
      uppy.off('upload-success', successHandler);
      uppy.off('upload-error', errorHandler);
      uppy.off('complete', completeHandler);
    };
  }, [uppy]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        File Uploader with Screen Capture
      </h2>
      <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Screen capture requires HTTPS in production.
          Make sure your browser supports screen capture API and you grant
          necessary permissions.
        </p>
      </div>
      <Dashboard
        uppy={uppy}
        height={450}
        plugins={['Webcam', 'ScreenCapture']} // ✅ show webcam + screen capture tabs
        note="Accepted file types: jpg, gif, png, pdf, video. Maximum size per file: 10MB"
        proudlyDisplayPoweredByUppy={false}
        showLinkToFileUploadResult={false}
        showRemoveButtonAfterComplete={false}
      />
    </div>
  );
};

export default Extra;

// const UploadEverythingWithBadUi = () => {
//   const [uppy] = useState(() => {
//     try {
//       return new Uppy().use(XHRUpload, {
//         endpoint: "http://localhost:8000/api/v1/upload",
//         withCredentials: true,
//         timeout: 0,
//         fieldName: "file",
//         formData: true,
//         getResponseError: (err, response) => {
//           console.log("getResponseError:", err, response);
//           return new Error(err);
//         },
//       });
//     } catch (err) {
//       console.error("Uppy init failed:", err);
//       return new Uppy(); // fallback
//     }
//   });

//   return <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false}

//   />;
// };
