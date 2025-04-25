import { Search } from "@renderer/assets/icons";
import { Button } from "@renderer/components/ui/button";

export const SearchButton = () => {
  return (
    <Button variant="ghost" className="-ms-2 flex items-center gap-2 px-2 py-0 text-sm">
      <Search className="h-5 w-5 text-neutral-600" />
      <p className="">Search Files...</p>
    </Button>
  );
};
