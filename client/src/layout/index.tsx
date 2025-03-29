import React from "react";

import { Toaster } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      {children}
      <Toaster closeButton={true} richColors={true} />
    </main>
  );
};

export default Layout;
