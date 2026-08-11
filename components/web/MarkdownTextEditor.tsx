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
  X,
  AlertCircle,
} from "lucide-react";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
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
import { Id } from "@/convex/_generated/dataModel";
import imageCompression from "browser-image-compression";

interface MarkdownTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  minLength?: number;
}

const compressImage = async (file: File): Promise<File> => {
  if (file.type === "image/gif") return file;

  const options = {
    maxSizeMB: 1.0,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp" as const,
    initialQuality: 0.85,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const newFileName = `${originalNameWithoutExt}.webp`;

    return new File([compressedBlob], newFileName, {
      type: "image/webp",
    });
  } catch (error) {
    console.warn("Image compression failed, using original file:", error);
    return file; 
  }
};

export function MarkdownTextEditor({
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Post Content (Markdown)",
  error = false,
  errorMessage,
  minLength = 500,
}: MarkdownTextEditorProps) {
  const [internalContent, setInternalContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const content = value !== undefined ? value : internalContent;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const convex = useConvex();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleContentChange = (newContent: string) => {
    if (onChange) {
      onChange(newContent);
    } else {
      setInternalContent(newContent);
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return textToInsert;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText =
      content.substring(0, start) +
      textToInsert +
      content.substring(end);

    handleContentChange(newText);

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
    const placeholderText = `![Uploading ${file.name}...](#)`;

    insertTextAtCursor(placeholderText);

    try {
      const fileToUpload = await compressImage(file);

      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": fileToUpload.type },
        body: fileToUpload,
      });

      if (!result.ok) throw new Error("Failed to upload image.");

      const { storageId } = (await result.json()) as { storageId: Id<"_storage"> };

      const imageUrl = await convex.query(api.files.getImageUrl, { storageId });

      if (!imageUrl) throw new Error("Could not retrieve image URL from Convex");

      const finalMarkdown = `![${altText}](${imageUrl})`;

      if (textareaRef.current) {
        const currentText = textareaRef.current.value;
        handleContentChange(currentText.replace(placeholderText, finalMarkdown));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      if (textareaRef.current) {
        const currentText = textareaRef.current.value;
        handleContentChange(
          currentText.replace(placeholderText, `![Upload failed: ${file.name}](#)`)
        );
      }
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

    handleContentChange(newText);

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

        handleContentChange(newText);
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

      handleContentChange(newText);

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

    handleContentChange(newText);

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
        handleContentChange(newText);
        setTimeout(() => {
          textarea.setSelectionRange(lineStart, lineStart);
        }, 0);
        return;
      }

      const prefix = `\n${indent}${num + 1}. `;
      const newText = content.substring(0, start) + prefix + content.substring(start);
      handleContentChange(newText);

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
        handleContentChange(newText);
        setTimeout(() => {
          textarea.setSelectionRange(lineStart, lineStart);
        }, 0);
        return;
      }

      const prefix = `\n${indent}${bullet} `;
      const newText = content.substring(0, start) + prefix + content.substring(start);
      handleContentChange(newText);

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

  const getCounterColor = (length: number, min: number) => {
    if (length < min * 0.5) return "text-destructive font-medium";
    if (length < min) return "text-amber-500 dark:text-amber-400";
    return "text-emerald-500 dark:text-emerald-400";
  };

  const isMet = content.length >= minLength;

  return (
    <div className="w-full max-w-2xl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      <div
        className={cn(
          "flex flex-col w-full rounded-md border border-input bg-background overflow-hidden transition-all",
          isFocused && !error && "ring-2 ring-ring ring-offset-2 border-transparent",
          isDragging && "border-primary bg-primary/5 ring-2 ring-primary",
          error && "border-destructive focus-within:ring-2 focus-within:ring-destructive focus-within:ring-offset-2 focus-within:border-transparent",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center justify-between p-1 border-b border-border/60">
            <div className="flex items-center gap-0.5">
              {toolbarActions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={disabled}
                        className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
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

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={disabled}
                      className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
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
                  <Strikethrough className="mr-2 h-4 w-4" />
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

        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            value={content}
            disabled={disabled}
            onChange={(e) => handleContentChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            placeholder={placeholder}
            rows={9}
            className="w-full bg-transparent p-3 pr-14 text-xs focus:outline-none disabled:opacity-50 resize-y min-h-[150px]"
          />

          {content && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                handleContentChange("");
                textareaRef.current?.focus();
              }}
              className={cn(
                "absolute top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted cursor-pointer transition-colors z-10",
                errorMessage ? "right-7" : "right-2"
              )}
              title="Clear content"
            >
              <X className="h-3.5 w-3.5 stroke-[2]" />
            </button>
          )}

          {errorMessage && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <div className="absolute top-2.5 right-2 flex items-center justify-center text-destructive cursor-help z-10">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" variant="destructive">
                  <p>{errorMessage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center justify-end px-2.5 py-1 bg-muted/20 border-t border-border/40 text-[10px]">
          <span className={cn("font-mono transition-colors", getCounterColor(content.length, minLength))}>
            {isMet ? (
              <span>✓ {content.length}</span>
            ) : (
              <span>{content.length}/{minLength}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}