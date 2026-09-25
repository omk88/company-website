"use client"

import { Message } from "@/components/ui/message"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  ArrowUpIcon,
  GlobeIcon,
  ImageIcon,
  PaperclipIcon,
  PlusIcon,
  RotateCwIcon,
  TelescopeIcon,
} from "lucide-react"

export default function MessagingContent() {
  return (
    <MessageScrollerProvider>
      <div className="flex flex-col h-full w-full">

        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">New Chat</h1>
            <p className="text-sm text-muted-foreground">
              Hello, how can I help you today?
            </p>
          </div>
          <Button variant="outline" size="icon" aria-label="Reset conversation">
            <RotateCwIcon className="h-4 w-4" />
          </Button>
        </header>

        <main className="flex-1 overflow-hidden">
          <MessageScroller className="h-full">
            <MessageScrollerViewport className="h-full w-full">
              <MessageScrollerContent className="mx-auto p-6 space-y-4">
                <MessageScrollerItem>
                  <Message>Hello! How can I help you build your layout today?</Message>
                </MessageScrollerItem>
                <MessageScrollerItem>
                  <Message>I need help structuring my full-screen UI layout.</Message>
                </MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </main>

        <footer className="p-4 md:px-6">
          <div className="mx-auto w-full">
            <form onSubmit={(e) => e.preventDefault()} className="w-full">
              <InputGroup className="flex-col">
                <div className="min-h-[56px] w-full px-3 py-2">
                  <textarea
                    placeholder="Type a message..."
                    className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    rows={2}
                  />
                </div>

                <InputGroupAddon
                  align="block-end"
                  className="pt-1 flex justify-between items-center w-full px-2 pb-2"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton
                        aria-label="Add files"
                        type="button"
                        size="icon-sm"
                        variant="outline"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </InputGroupButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="top" className="w-48">
                      <DropdownMenuItem>
                        <PaperclipIcon className="mr-2 h-4 w-4" />
                        Add Photos & Files
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Create Image
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TelescopeIcon className="mr-2 h-4 w-4" />
                        Deep Research
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <GlobeIcon className="mr-2 h-4 w-4" />
                        Web Search
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <InputGroupButton type="submit" variant="default" size="icon-sm">
                    <ArrowUpIcon className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
          </div>
        </footer>

      </div>
    </MessageScrollerProvider>
  )
}