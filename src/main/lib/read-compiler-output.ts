import fs from "fs";

export function readCompilerOutput<T>(outputFilePath: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    fs.readFile(outputFilePath, "utf8", (readError, data) => {
      if (readError) {
        console.error(`Read Error: ${readError.message}`);
        return reject(readError);
      }

      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (err) {
        console.error(`Parse Error: ${err}`);
        reject(err);
      }
    });
  });
}
