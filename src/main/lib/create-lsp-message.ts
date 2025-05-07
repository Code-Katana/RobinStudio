export function createLspMessage(json: string): string {
  return `Content-Length: ${json.length}\r\n\r\n${json}`;
}
