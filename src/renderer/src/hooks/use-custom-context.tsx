import { useContext } from "react";

export const useCustomContext = <T,>(
  customContext: React.Context<T | undefined>,
  hookName: string,
  providerName: string,
): T => {
  const context = useContext(customContext);

  if (!context) {
    throw new Error(`${hookName} hook must be used within a ${providerName}`);
  }

  return context;
};
