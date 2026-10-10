import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function MarkdownTable({ children, ...props }: React.ComponentPropsWithoutRef<"table">) {
  return (
    <div className="not-prose my-4 w-full border border-neutral-200 dark:border-neutral-800 rounded-none overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap pb-3">
        <Table className="!m-0 w-full border-collapse" {...props}>
          {children}
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export function MarkdownTableHeader({ children, ...props }: React.ComponentPropsWithoutRef<"thead">) {
  return <TableHeader className="!m-0" {...props}>{children}</TableHeader>;
}

export function MarkdownTableBody({ children, ...props }: React.ComponentPropsWithoutRef<"tbody">) {
  return <TableBody className="!m-0" {...props}>{children}</TableBody>;
}

export function MarkdownTableRow({ children, ...props }: React.ComponentPropsWithoutRef<"tr">) {
  return <TableRow className="!m-0 border-b last:border-b-0 border-neutral-200 dark:border-neutral-800" {...props}>{children}</TableRow>;
}

export function MarkdownTableHead({ children, ...props }: React.ComponentPropsWithoutRef<"th">) {
  return (
    <TableHead 
      className="!m-0 py-3.5 px-4 bg-muted text-sm font-bold text-neutral-900 dark:text-neutral-100" 
      {...props}
    >
      {children}
    </TableHead>
  );
}

export function MarkdownTableCell({ children, ...props }: React.ComponentPropsWithoutRef<"td">) {
  return (
    <TableCell 
      className="!m-0 py-3.5 px-4 text-sm font-medium [&:first-child]:font-bold [&:first-child]:text-neutral-900 dark:[&:first-child]:text-neutral-100" 
      {...props}
    >
      {children}
    </TableCell>
  );
}