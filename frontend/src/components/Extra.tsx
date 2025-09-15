import { memo, useState } from 'react';
import { toast } from 'sonner';

const Extra = () => {
  const [count, setCount] = useState(0);

  const handleChange = () => {
    toast.error(' erro ');
  };

  return (
    <div className="mt-10 ml-12">
      <p>Count : {count}</p>

      <button onClick={handleChange}>click me </button>

      <ChangeState count={count} setCount={setCount} />
    </div>
  );
};

export default Extra;

const ChangeState = memo(function ({ count, setCount }) {
  return (
    <div className="flex items-center gap-5">
      <button className="cursor-pointer" onClick={() => setCount(count - 1)}>
        decrease{' '}
      </button>
      <button className="cursor-pointer" onClick={() => setCount(count + 1)}>
        increase{' '}
      </button>
    </div>
  );
});
