import { useEffect, useRef, useState } from 'react';

const Extra = () => {
  const extraRef = useRef<HTMLInputElement>(null);

  const [show, setShow] = useState(false);

  useEffect(() => {
    const outSideClick = (e: MouseEvent) => {
      if (extraRef.current && !extraRef.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', outSideClick);
    return () => {
      document.removeEventListener('mousedown', outSideClick);
    };
  }, [extraRef]);

  return (
    <div>
      {show && <div className="h-52 w-52 bg-red-700" ref={extraRef}></div>}

      <button onClick={() => setShow(!show)}>toggle</button>
    </div>
  );
};

export default Extra;
