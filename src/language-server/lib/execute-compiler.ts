// import { ScannerOptions } from "@shared/types";
import { exec } from "child_process";
import path from "path";

const COMPILER_PATH = path.resolve("./resources/bin", "rbn.exe");

export const OUTPUT_PATH = path.resolve("./resources/debug", "compiler_output.json");

export function executeCompiler(
  inputFilePath: string,
  scanner: string,
  action: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const command = `${COMPILER_PATH} -s "${scanner}" -a "${action}" -o "${OUTPUT_PATH}" "${inputFilePath}"`;

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
