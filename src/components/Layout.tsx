import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f3f8e8]">
      <Outlet />
    </div>
  );
};

export default Layout;
