import { useContext } from "react";
import { userContext, UserContextType } from "@/contexts/UserContext";

export function useSession(): UserContextType {
  const context = useContext(userContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
}
  return context;
}
