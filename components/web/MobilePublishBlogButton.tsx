import { cn } from "cn";
import { Button } from "../ui/button";

export function MobilePublishBlogButton() {
    return (
        <div className="md:hidden flex justify-end p-2 fixed bottom-0 z-50 border-t bg-white w-full">
          <Button
            form="blog-post-form"
            type="submit"
            size="lg"
            className={cn(
              "rounded-full text-lg bg-zinc-800 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900",
            )}
          >
            Publish
          </Button>
        </div>
    )
}