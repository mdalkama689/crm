import { useEffect, useState } from 'react';

const Extra = () => {
  const obj = {
    name: 'kirat',
    age: '30',
    role: 'eng',
  };

  const [value, setValue] = useState(obj);

  useEffect(() => {
    if (!value) return;
    console.log(' value : ', value);
  }, [value]);

  const chagValue = () => {
    setValue({
      ...value,
      age: '500',
    });
  };

  return (
    <div>
      <button onClick={chagValue}>change</button>
    </div>
  );
};

export default Extra;
