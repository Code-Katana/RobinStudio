import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { useCurrentProject } from "@renderer/hooks/use-current-project";
import { useDebounceValue } from "@renderer/hooks/use-debounce-value";
import { findFiles } from "@renderer/lib/utils";
import { useState } from "react";
import { SearchButton } from "./search-button.component";
import { SearchInput } from "./search-input.component";
import { SearchResults } from "./search-results.component";

export const FileFinder = () => {
  const { fileTree, rootPath } = useCurrentProject();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounceValue<string>(searchTerm);

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <SearchButton />
        </DialogTrigger>
        <DialogContent className="overflow-hidden p-0">
          <DialogHeader className="[&~button]:hidden">
            <DialogTitle className="sr-only">File Finder</DialogTitle>
            <DialogDescription className="sr-only">
              Search for a file in the current project
            </DialogDescription>

            <SearchInput searchTerm={searchTerm} setSearchTerm={handleSearchTermChange} />
          </DialogHeader>

          <SearchResults files={findFiles(fileTree, debouncedSearchTerm, rootPath!)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
