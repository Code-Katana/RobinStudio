import { RequestMethod, ResponseMessage } from "@shared/types";
import { useEffect, useState } from "react";

export const useLanguageClient = (method: RequestMethod) => {
  const [state, setState] = useState<ResponseMessage | undefined>(undefined);

  useEffect(() => {
    window.lsp.onMethod(method, (value: ResponseMessage) => {
      setState(value);
    });

    return () => setState(undefined);
  }, [method]);

  return state;
};
