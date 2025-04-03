import { useContext } from "react";
import { errorContext, ErrorContextType } from "@/contexts/ErrorProvider";

export function useError(): ErrorContextType {
    const context = useContext(errorContext);
    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
}