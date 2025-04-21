import { spawn } from "child_process";
import path from "path";
import { createMessageConnection } from "vscode-jsonrpc";
import { StreamMessageReader, StreamMessageWriter } from "vscode-jsonrpc/node";

const robinLspBin = path.resolve("./resources/bin", "namepiece.exe");
export let robinConnection: ReturnType<typeof createMessageConnection>;

export const startRobinConnection = () => {
  const child = spawn(robinLspBin);

  const reader = new StreamMessageReader(child.stdout!);
  const writer = new StreamMessageWriter(child.stdin!);

  robinConnection = createMessageConnection(reader, writer);

  robinConnection.listen();
};
