"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent, DragEvent, ClipboardEvent } from "react";
import {
  Bold,
  Italic,
  Heading,
  Code,
  Link,
  List,
  ListOrdered,
  ChevronRight,
  ImagePlus,
  MoreHorizontal,
  Strikethrough,
  Table,
  Code2,
  CheckSquare,
  Asterisk,
  BookOpen,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MarkdownTextEditor() {
  const [content, setContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return textToInsert;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText =
      content.substring(0, start) +
      textToInsert +
      content.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    return textToInsert;
  };

  const uploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const altText = file.name.replace(/\.[^/.]+$/, "");
    const placeholder = `![Uploading ${file.name}...]()`;

    insertTextAtCursor(placeholder);

    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Failed to upload image.");

      const { storageId } = await result.json();
      const imageUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;
      const finalMarkdown = `![${altText}](${imageUrl})`;

      setContent((prevContent) => prevContent.replace(placeholder, finalMarkdown));
    } catch (error) {
      console.error("Image upload failed:", error);
      setContent((prevContent) =>
        prevContent.replace(placeholder, `![Upload failed: ${file.name}]()`)
      );
    }
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAndInsertImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          uploadAndInsertImage(file);
        }
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/")) {
          uploadAndInsertImage(file);
        }
      }
    }
  };

  const insertInlineMarkdown = (
    prefix: string,
    suffix: string = "",
    defaultText: string = "text"
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;

    const newText =
      content.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      content.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const newSelectionStart = start + prefix.length;
      const newSelectionEnd = newSelectionStart + selectedText.length;
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
    }, 0);
  };

  const insertLinePrefix = (prefix: string, defaultText: string = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = content.indexOf("\n", start);
    if (lineEnd === -1) lineEnd = content.length;

    const currentLine = content.substring(lineStart, lineEnd);

    const existingPrefixMatch = currentLine.match(/^(#{1,6}\s+|> \s*|\d+\.\s+|- \s*|\*\s*)/);

    if (existingPrefixMatch) {
      const existingPrefix = existingPrefixMatch[0];

      const isSamePrefix =
        existingPrefix.trim() === prefix.trim() ||
        (prefix === "1. " && /^\d+\.\s+$/.test(existingPrefix));

      if (isSamePrefix) {
        const lineWithoutPrefix = currentLine.substring(existingPrefix.length);
        const newText =
          content.substring(0, lineStart) +
          lineWithoutPrefix +
          content.substring(lineEnd);

        setContent(newText);
        setTimeout(() => {
          textarea.focus();
          const newPos = Math.max(lineStart, start - existingPrefix.length);
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
        return;
      }

      const lineWithoutPrefix = currentLine.substring(existingPrefix.length);
      const textToKeep = lineWithoutPrefix.trim().length > 0 ? lineWithoutPrefix : defaultText;
      
      const newText =
        content.substring(0, lineStart) +
        prefix +
        textToKeep +
        content.substring(lineEnd);

      setContent(newText);

      setTimeout(() => {
        textarea.focus();
        const newStart = lineStart + prefix.length;
        const newEnd = newStart + textToKeep.length;
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
      return;
    }

    const selectedText = currentLine.length > 0 ? currentLine : defaultText;
    const beforeLine = content.substring(0, lineStart);
    const afterLine = content.substring(lineEnd);

    const newText = beforeLine + prefix + selectedText + afterLine;

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const newStart = lineStart + prefix.length;
      const newEnd = newStart + selectedText.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    const currentLine = content.substring(lineStart, start);

    const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s+(.*)/);
    const unorderedMatch = currentLine.match(/^(\s*)([-*])\s+(.*)/);

    if (orderedMatch) {
      e.preventDefault();
      const indent = orderedMatch[1];
      const num = parseInt(orderedMatch[2], 10);
      const text = orderedMatch[3];

      if (!text.trim()) {
        const newText = content.substring(0, lineStart) + content.substring(start);
        setContent(newText);
        setTimeout(() => {
          textarea.setSelectionRange(lineStart, lineStart);
        }, 0);
        return;
      }

      const prefix = `\n${indent}${num + 1}. `;
      const newText = content.substring(0, start) + prefix + content.substring(start);
      setContent(newText);

      setTimeout(() => {
        const nextPos = start + prefix.length;
        textarea.setSelectionRange(nextPos, nextPos);
      }, 0);
    } else if (unorderedMatch) {
      e.preventDefault();
      const indent = unorderedMatch[1];
      const bullet = unorderedMatch[2];
      const text = unorderedMatch[3];

      if (!text.trim()) {
        const newText = content.substring(0, lineStart) + content.substring(start);
        setContent(newText);
        setTimeout(() => {
          textarea.setSelectionRange(lineStart, lineStart);
        }, 0);
        return;
      }

      const prefix = `\n${indent}${bullet} `;
      const newText = content.substring(0, start) + prefix + content.substring(start);
      setContent(newText);

      setTimeout(() => {
        const nextPos = start + prefix.length;
        textarea.setSelectionRange(nextPos, nextPos);
      }, 0);
    }
  };

  const tableSnippet = `| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |`;
  const codeBlockSnippet = "```js\n// Your code here\n```";
  const footnoteSnippet = "Here is text with a footnote.[^1]\n\n[^1]: Footnote text content.";
  const defListItemSnippet = "Term\n: Definition goes here";

  const toolbarActions = [
    {
      label: "Bold",
      icon: Bold,
      action: () => insertInlineMarkdown("**", "**", "bold text"),
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => insertInlineMarkdown("*", "*", "italic text"),
    },
    {
      label: "Heading",
      icon: Heading,
      action: () => insertLinePrefix("## ", "Heading"),
    },
    {
      label: "Inline Code",
      icon: Code,
      action: () => insertInlineMarkdown("`", "`", "code"),
    },
    {
      label: "Link",
      icon: Link,
      action: () => insertInlineMarkdown("[", "](https://example.com)", "link text"),
    },
    {
      label: "Unordered List",
      icon: List,
      action: () => insertLinePrefix("- ", "List item"),
    },
    {
      label: "Ordered List",
      icon: ListOrdered,
      action: () => insertLinePrefix("1. ", "List item"),
    },
    {
      label: "Blockquote",
      icon: ChevronRight,
      action: () => insertLinePrefix("> ", "Quote text"),
    },
    {
      label: "Image",
      icon: ImagePlus,
      action: insertImage,
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full max-w-2xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <TooltipProvider delayDuration={200}>
        <div className="flex items-center justify-between p-1 bg-muted/50 border rounded-md">
          <div className="flex items-center gap-1">
            {toolbarActions.map((item, index) => {
              const Icon = item.icon;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={item.action}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{item.label}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                    <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More formatting</span>
                    </Button>
                </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                <p className="text-xs">More options</p>
                </TooltipContent>
            </Tooltip>

            <DropdownMenuContent
                align="end"
                className="w-52"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                Extended Formatting
            </DropdownMenuLabel>

            <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => insertInlineMarkdown("~~", "~~", "strikethrough text")}
            >
                <Asterisk className="mr-2 h-4 w-4" />
                <span>Strikethrough</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => insertTextAtCursor(codeBlockSnippet)}
            >
                <Code2 className="mr-2 h-4 w-4" />
                <span>Code Block</span>
            </DropdownMenuItem>

            <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => insertTextAtCursor(tableSnippet)}
            >
                <Table className="mr-2 h-4 w-4" />
                <span>Table</span>
            </DropdownMenuItem>

            <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => insertLinePrefix("- [ ] ", "Task item")}
            >
                <CheckSquare className="mr-2 h-4 w-4" />
                <span>Task List</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => insertTextAtCursor(footnoteSnippet)}
            >
                <Asterisk className="mr-2 h-4 w-4" />
                <span>Footnote</span>
            </DropdownMenuItem>

            <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => insertTextAtCursor(defListItemSnippet)}
            >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Definition List</span>
            </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </TooltipProvider>

      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        placeholder="Post Content (Markdown) — Drop or paste images here"
        rows={10}
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-y min-h-[300px] transition-colors",
          isDragging && "border-primary bg-primary/5 ring-2 ring-primary"
        )}
      />
    </div>
  );
}