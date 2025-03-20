import { IFileWatcherTableProps } from "../interfaces/file-watcher-table.props";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table";

const FileWatcherTable = ({ events }: IFileWatcherTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Type</TableHead>
          <TableHead>Path</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event, index) => (
          <TableRow key={index}>
            <TableCell className="font-semibold">{event.type.toUpperCase()}</TableCell>
            <TableCell>{event.path}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { FileWatcherTable };
