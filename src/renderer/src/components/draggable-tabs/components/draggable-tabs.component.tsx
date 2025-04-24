import { useRef } from "react";
import { Cross2Icon, FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { TabsTrigger } from "@renderer/components/ui/tabs";
import { OpenFileType } from "@renderer/providers/current-project.provider";
import { useDrag } from "react-dnd/dist/hooks";
import { useDrop } from "react-dnd/dist/hooks";

const ItemType = "TAB";

export const DraggableTab = ({
  file,
  index,
  onClick,
  onClose,
  onMoveTab,
  ...props
}: {
  file: OpenFileType;
  index: number;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onMoveTab: (dragIndex: number, hoverIndex: number) => void;
} & React.ComponentProps<typeof TabsTrigger>) => {
  const ref = useRef<HTMLButtonElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      onMoveTab(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <TabsTrigger
      ref={ref}
      {...props}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className="flex items-center justify-center gap-1 space-y-1 rounded-none border-r p-2 hover:bg-primary/50"
      onClick={onClick}
    >
      <span className="text-primary">
        <FileTextIcon className="mr-1" />
      </span>
      <span>{file.name}</span>
      <span>
        <Button
          variant="ghost"
          size="sm"
          className="size-6 p-1 hover:bg-primary-foreground/10"
          onClick={onClose}
        >
          <Cross2Icon />
        </Button>
      </span>
    </TabsTrigger>
  );
};
