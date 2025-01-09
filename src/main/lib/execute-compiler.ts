import { ScannerOptions } from "@shared/types";
import { exec } from "child_process";

export function executeCompiler(
  exePath: string,
  scanner: ScannerOptions,
  action: string,
  inputFilePath: string,
  outputFilePath: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const command = `"${exePath}" "${scanner}" "RecursiveDecent" "${action}" "${inputFilePath}" "${outputFilePath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Exec Stderr: ${stderr}`);
        return reject(new Error(stderr));
      }
      console.log(`Exec Stdout: ${stdout || "Executed successfully"}`);
      resolve();
    });
  });
}
