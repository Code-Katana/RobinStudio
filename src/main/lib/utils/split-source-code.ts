export const splitSourceCode = (input: string, minChunkSize: number = 128): string[] => {
  const chunks: string[] = [];
  let currentChunk = "";

  const addChunk = (): void => {
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
  };

  for (const part of input.split(/(\s+)/)) {
    if (currentChunk.length + part.length > minChunkSize && currentChunk.trim()) {
      addChunk();
    }
    currentChunk += part;
  }

  addChunk();

  return chunks;
};
