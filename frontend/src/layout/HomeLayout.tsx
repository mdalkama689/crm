import { type ReactNode } from 'react';
import Header from './Header';

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default HomeLayout;
