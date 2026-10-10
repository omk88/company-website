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
    <div className="not-prose my-0 w-full border border-neutral-200 dark:border-neutral-800 rounded-none overflow-hidden">
      <ScrollArea className="w-full whitespace-nowrap">
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
  return <TableHead className="!m-0 py-2 px-3 text-xs font-semibold" {...props}>{children}</TableHead>;
}

export function MarkdownTableCell({ children, ...props }: React.ComponentPropsWithoutRef<"td">) {
  return <TableCell className="!m-0 py-2 px-3 text-sm align-middle" {...props}>{children}</TableCell>;
}