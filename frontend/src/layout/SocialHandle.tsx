import { IoLogoInstagram } from 'react-icons/io5';
import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FaLinkedinIn } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const socialIcons = [
  {
    id: '1',
    icon: <IoLogoInstagram />,
    link: 'https://www.instagram.com/betasauruscom',
  },
  {
    id: '2',
    icon: <FaFacebookF />,
    link: 'https://www.facebook.com/betasauruscom/',
  },
  {
    id: '3',
    icon: <FaXTwitter />,
    link: 'https://x.com/betasauruscom',
  },
  {
    id: '4',
    icon: <FaLinkedinIn />,
    link: 'https://www.linkedin.com/company/betasaurus/',
  },
];

const SocialHandle = () => {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    const date = new Date();
    setYear(date.getFullYear());
  }, []);

  return (
    <div className="mt-12 mx-5">
      <div>
        <p className="text-[#98A2B3] text-[18px] font-normal">
          Follow our social media{' '}
        </p>
        <div className="flex gap-3 mt-3">
          {socialIcons.map((icon) => (
            <Link
              to={icon.link}
              key={icon.id}
              className="text-[#98A2B3] text-[25px]"
            >
              {icon.icon}
            </Link>
          ))}
        </div>
      </div>

      {year && (
        <p className="text-[#98A2B3] mt-3 text-start">
          &copy; {year} Betasaurus. All rights reserved.
        </p>
      )}
    </div>
  );
};

export default SocialHandle;
