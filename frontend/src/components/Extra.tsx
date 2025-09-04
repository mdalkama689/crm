import axios from 'axios';
import { appendErrors } from 'react-hook-form';
import { ur } from 'zod/v4/locales';

const url =
  'https://imgs.search.brave.com/F3raNabntEQ6GgrPzM3zTS9Lv83jWuox1EzCQ51WF68/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93MC5w/ZWFrcHguY29tL3dh/bGxwYXBlci82MDEv/NDI3L0hELXdhbGxw/YXBlci1zcmstbmV3/LWxvb2stZG9uMi1i/b2xseXdvb2Qtc3Jr/LWRvbi1kYXNoaW5n/LXRodW1ibmFpbC5q/cGc';

const Extra = () => {
  const handleDownloadOne = async () => {
    const response = await axios.get(url, { responseType: 'blob' });
    const goodUrl = URL.createObjectURL(response.data);

    const a = document.createElement('a');
    a.href = goodUrl;
    a.download = 'one.jpg';
    a.click();

    URL.revokeObjectURL(goodUrl);
    handleDownloadTwo();
    handleDownloadThree();
    handleDownloadFour();
    handleDownloadFIve();
    handleDownloadSix();
    handleDownloadSeven();
  };

  const handleDownloadTwo = async () => {
    const response = await axios.get(url, { responseType: 'blob' });
    const goodUrl = URL.createObjectURL(response.data);

    const a = document.createElement('a');
    a.href = goodUrl;
    a.download = 'two.jpg';
    a.click();
    URL.revokeObjectURL(goodUrl);
  };

  const handleDownloadThree = async () => {
    const response = await axios.get(url, { responseType: 'blob' });

    const goodUrl = URL.createObjectURL(response.data);

    const a = document.createElement('a');
    a.download = 'three.jpg';
    a.href = goodUrl;
    a.click();
    URL.revokeObjectURL(goodUrl);
  };

  const handleDownloadFour = async () => {
    const reposne = await axios.get(url, { responseType: 'blob' });

    const goodUrl = URL.createObjectURL(reposne.data);

    const a = document.createElement('a');
    a.href = goodUrl;
    a.download = '4.jpg';
    a.click();
    URL.revokeObjectURL(goodUrl);
  };

  const handleDownloadFIve = async () => {
    const response = await axios.get(url, { responseType: 'blob' });

    const goodUrl = URL.createObjectURL(response.data);

    const a = document.createElement('a');
    a.href = goodUrl;
    a.download = '5.jpg';
    a.click();
    URL.revokeObjectURL(goodUrl);
  };

  const handleDownloadSix = async () => {
    const response = await axios.get(url, { responseType: 'blob' });
    const goodUrl = URL.createObjectURL(response.data);

    const a = document.createElement('a');
    a.href = goodUrl;
    a.download = '6.jpg';
    a.click();
    URL.revokeObjectURL(goodUrl);
  };

  const handleDownloadSeven = async () => {
    const reposne = await axios.get(url, { responseType: 'blob' });

    const goodUrl = URL.createObjectURL(reposne.data);

    const a = document.createElement('a');
    a.href = goodUrl;
    a.download = '7.jpg';
    a.click();

    URL.revokeObjectURL(goodUrl);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <button
        onClick={handleDownloadOne}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Download
      </button>
    </div>
  );
};

export default Extra;
