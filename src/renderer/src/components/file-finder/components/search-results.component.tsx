import { HnNode } from "@shared/types";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { Button } from "@renderer/components/ui/button";
import { OpenFileResponse } from "@shared/channels/file-system";
import { DialogClose } from "@renderer/components/ui/dialog";

interface SearchResultsProps {
  files: HnNode[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ files }) => {
  const { rootPath, currentFile, onOpenFile } = useCurrentProject();

  const handleOpenFile = async (file: HnNode) => {
    const response = (await window.fs.openFileByPath({
      path: window.fs.resolvePath(rootPath!, file.path),
    })) as OpenFileResponse;

    if (response === null || !response.content) {
      return;
    }

    console.log(rootPath + "/" + file.path);
    onOpenFile(file.name, response.path, response.content);
  };

  return (
    <div className="grid gap-1 p-2">
      {files.map((file) => (
        <DialogClose asChild key={file.path}>
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-2"
            onClick={() => handleOpenFile(file)}
          >
            <span>{file.name}</span>
            <span className="text-xs text-neutral-600">{file.path}</span>
            {currentFile?.path === file.path && (
              <span className="ml-auto text-xs text-neutral-600">currently open</span>
            )}
          </Button>
        </DialogClose>
      ))}
    </div>
  );
};
