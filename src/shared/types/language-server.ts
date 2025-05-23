export type Method = "initialize" | "tokenize";

export type LSPArray = LSPAny[];

export type LSPObject = { [key: string]: LSPAny };

export type LSPAny = LSPObject | LSPArray | string | number | boolean | null;

export interface Message {
  jsonrpc: string;
}

export interface RequestMessage extends Message {
  id: number;
  method: Method;
  params?: LSPArray | LSPObject;
}

export interface ResponseMessage extends Message {
  id: number | null;
  result?: LSPAny;
  error?: ResponseError;
}

export interface ResponseError {
  code: number;
  message: string;
  data?: LSPAny;
}

export interface NotificationMessage extends Message {
  method: string;
  params?: LSPArray | LSPObject;
}
