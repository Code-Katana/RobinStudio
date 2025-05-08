import { useRef } from "react";
import { Cross2Icon, FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "@renderer/components/ui/button";
import { TabsTrigger } from "@renderer/components/ui/tabs";
import { OpenFileType } from "@renderer/stores/current-project.store";
import { useDrag, useDrop } from "react-dnd/dist/hooks";

const ItemType = "TAB";

interface DraggableTabProps extends React.ComponentProps<typeof TabsTrigger> {
  file: OpenFileType;
  index: number;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onMoveTab: (dragIndex: number, hoverIndex: number) => void;
  fileIndicator: JSX.Element | null;
}

export const DraggableTab: React.FC<DraggableTabProps> = ({
  file,
  index,
  onClick,
  onClose,
  onMoveTab,
  fileIndicator,
  ...props
}) => {
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
    <div className="px-px py-1">
      <TabsTrigger
        ref={ref}
        {...props}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        className="cursor-pointer px-1.5 hover:bg-background/50 data-[state='active']:bg-primary/30"
        onClick={onClick}
      >
        <span className="text-primary">
          <FileTextIcon className="mr-1" />
        </span>
        <span className={`flex items-center gap-1 ${fileIndicator?.props.className}`}>
          {file.name} {fileIndicator}
        </span>
        <span>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 ml-2 size-6 hover:bg-primary-foreground/10"
            onClick={onClose}
          >
            <Cross2Icon />
          </Button>
        </span>
      </TabsTrigger>
    </div>
  );
};
