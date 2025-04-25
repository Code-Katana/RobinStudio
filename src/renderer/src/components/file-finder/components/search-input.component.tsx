import { Search } from "@renderer/assets/icons";
import { Button } from "@renderer/components/ui/button";
import { DialogClose } from "@renderer/components/ui/dialog";
import { X } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center gap-2 px-2 py-1 border-b border-neutral-600">
      <div className="relative flex-1">
        <Search className="absolute w-5 h-5 -translate-y-1/2 left-2 top-1/2 text-neutral-600" />

        <input
          type="text"
          placeholder="Type a file name to search..."
          className="w-full p-2 pl-8 bg-transparent border-0 focus:outline-none focus:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DialogClose asChild>
        <Button variant="ghost" className="grid rounded-md size-8 place-items-center">
          <X className="w-5 h-5 text-neutral-600" />
        </Button>
      </DialogClose>
    </div>
  );
};
