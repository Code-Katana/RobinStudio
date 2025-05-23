import { Method, ResponseMessage } from "@shared/types";
import { useEffect, useState } from "react";

export const useLanguageClient = (method: Method) => {
  const [state, setState] = useState<ResponseMessage | undefined>(undefined);

  useEffect(() => {
    window.lsp.onMethod(method, (value) => {
      setState(value as ResponseMessage);
    });
  }, []);

  return state;
};
