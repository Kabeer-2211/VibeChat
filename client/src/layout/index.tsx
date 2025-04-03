import React from "react";

import { Toaster } from "sonner";


const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <main className="h-screen bg-gray-100">
      {children}
      <Toaster closeButton={true} richColors={true} />
    </main>
  );
};

export default Layout;
