import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@renderer/components/ui/table";
import { ITokensTableProps } from "../interfaces/tokens-table.props";

export const TokensTable = ({ tokens, scannerOption }: ITokensTableProps): JSX.Element => {
  return (
    <Table className="mb-[80svh]">
      <TableCaption>
        Using {scannerOption} scanner (Total {tokens.length} tokens).
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-medium">Index</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Line</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.map((tk, idx) => (
          <TableRow key={idx}>
            <TableCell className="pl-4 font-medium">{idx}</TableCell>
            <TableCell>{tk.type}</TableCell>
            <TableCell>{tk.value}</TableCell>
            <TableCell>{tk.line}</TableCell>
            <TableCell>{tk.start}</TableCell>
            <TableCell>{tk.end}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
