"use client";

import { useLocalSearch } from "@/components/web/SearchContext";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { Tag } from "lucide-react";

export function SidebarTags() {
  const { sortOrder, setSortOrder } = useLocalSearch();

  return (
    <Select
      value={sortOrder}
      onValueChange={setSortOrder}
    >
      <SelectTrigger className="w-full text-xs bg-background border-border/50 focus:ring-1">
        <span className="flex flex-row gap-2"><Tag />Tags</span>
      </SelectTrigger>
      
      <SelectContent position="popper">
        <FieldGroup className="gap-3 p-2">
            <Field
                orientation="horizontal"
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
                <Checkbox id="all" name="all" defaultChecked />
                <FieldLabel htmlFor="all" className="font-normal"> <span className="!text-xs">All Topics</span> </FieldLabel>
            </Field>
            <Field
                orientation="horizontal"
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
                <Checkbox id="product" name="product" defaultChecked />
                <FieldLabel htmlFor="product" className="font-normal"> <span className="!text-xs">Product</span> </FieldLabel>
            </Field>
            <Field
                orientation="horizontal"
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
                <Checkbox id="research" name="research" defaultChecked />
                <FieldLabel htmlFor="research" className="font-normal"> <span className="!text-xs">Research</span> </FieldLabel>
            </Field>
            <Field
                orientation="horizontal"
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
                <Checkbox id="design" name="design" defaultChecked />
                <FieldLabel htmlFor="design" className="font-normal"> <span className="!text-xs">Design</span> </FieldLabel>
            </Field>
            <Field
                orientation="horizontal"
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
                <Checkbox id="technology" name="technology" defaultChecked />
                <FieldLabel htmlFor="technology" className="font-normal"> <span className="!text-xs">Technology</span> </FieldLabel>
            </Field>
            <Field
                orientation="horizontal"
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
                <Checkbox id="opinion" name="opinion" defaultChecked />
                <FieldLabel htmlFor="opinion" className="font-normal"> <span className="!text-xs">Opinion</span> </FieldLabel>
            </Field>
            <Field
                orientation="horizontal"
                className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            >
                <Checkbox id="tutorials" name="tutorials" defaultChecked />
                <FieldLabel htmlFor="tutorials" className="font-normal"> <span className="!text-xs">Tutorials</span> </FieldLabel>
            </Field>
        </FieldGroup>
      </SelectContent>
    </Select>
  );
}