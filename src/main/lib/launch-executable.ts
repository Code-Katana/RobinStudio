import { spawn } from "child_process";
import path from "path";

export function launchExecutable(exePath: string, args: string[] = []): Promise<number | null> {
  console.log("exePath: ", exePath);
  return new Promise((resolve, reject) => {
    const command = `start "" "${exePath}" ${args.map((arg) => `"${arg}"`).join(" ")}`;

    const child = spawn("cmd.exe", ["/c", command], {
      cwd: path.dirname(exePath),
      windowsHide: false,
      shell: true,
    });

    child.on("exit", (code) => {
      resolve(code);
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}
