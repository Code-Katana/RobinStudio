import { MessageParams, NotificationMethod, RequestMethod } from "@shared/types";
import { useRef } from "react";

type LanguageServerRequest = {
  messageType: "request";
  method: RequestMethod;
  params: MessageParams[RequestMethod];
};

type LanguageServerNotification = {
  messageType: "notification";
  method: NotificationMethod;
  params: MessageParams[NotificationMethod];
};

type LanguageServerMessage = LanguageServerRequest | LanguageServerNotification;

export const useLanguageServer = () => {
  const requestId = useRef(0);

  const handler = (message: LanguageServerMessage) => {
    const { messageType, method, params } = message;

    window.lsp.send({
      jsonrpc: "2.0",
      id: messageType === "request" ? requestId.current++ : undefined,
      method,
      params,
    });
  };

  return handler;
};
