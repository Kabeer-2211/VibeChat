import React from "react";

import { Toaster } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main>
            <Toaster closeButton={true} richColors={true} duration={2} />
            {children}
        </main>
    )
}

export default Layout