import React, { createContext } from 'react'

import { toast } from 'sonner';

export interface ErrorContextType {
    showError: (message: string) => void;
    showMessage: (message: string) => void;
}

export const errorContext = createContext<ErrorContextType | undefined>(undefined);

const ErrorProvider = ({ children }: { children: React.ReactNode }) => {

    const showError = (message: string): void => {
        toast.error(message);
    }
    const showMessage = (message: string): void => {
        toast.success(message);
    }

    return (
        <errorContext.Provider value={{ showError, showMessage }}>
            {children}
        </errorContext.Provider>
    )
}

export default ErrorProvider