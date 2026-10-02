import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Gavel, ChevronRight } from "lucide-react";
import { useMutation } from "convex/react";

import { PLATFORM_RULES } from "@/constants/rules";
import { api } from "@/convex/_generated/api";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const banUserSchema = z.object({
  violations: z.array(z.string()).min(1, "Select at least one violation rule"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  duration: z.string().min(1, "Please select a ban duration"),
});

type BanUserFormValues = z.infer<typeof banUserSchema>;
type DialogStep = "manage" | "ban";

interface BanUserButtonProps {
  userId: string;
}

export function BanUserButton({ userId }: BanUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("manage");

  const banUser = useMutation(api.manageUsers.banUser);

  const banForm = useForm<BanUserFormValues>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      violations: [],
      reason: "",
      duration: "7",
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setStep("manage"), 200);
      banForm.reset();
    }
  };

  const onBanSubmit = async (data: BanUserFormValues) => {
    try {
      const durationMs =
        data.duration === "permanent"
          ? null
          : Number(data.duration) * 24 * 60 * 60 * 1000;

      await banUser({
        userId,
        reason: data.reason,
        violations: data.violations,
        durationMs,
      });

      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="cursor-pointer h-7 w-7 rounded-full"
        >
          <Gavel className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] h-[480px] flex flex-col justify-between overflow-hidden">
        <DialogHeader className="space-y-2">
          <DialogTitle>
            {step === "manage" ? "Manage User" : "Ban User"}
          </DialogTitle>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                {step === "ban" ? (
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => setStep("manage")}
                  >
                    Manage User
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>Manage User</BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {step === "ban" && (
                <>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Ban User</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {step === "manage" ? (
            <div className="space-y-4">
              <Button
                variant="destructive"
                className="w-fit rounded-full justify-start cursor-pointer"
                onClick={() => setStep("ban")}
              >
                Ban User Form
              </Button>
            </div>
          ) : (
            <form
              id="ban-user-form"
              onSubmit={banForm.handleSubmit(onBanSubmit)}
              className="space-y-3"
            >
              <Controller
                name="violations"
                control={banForm.control}
                render={({ field }) => (
                  <ScrollArea className="h-[150px] rounded-md border p-1">
                    <div className="space-y-2 pr-3">
                      {PLATFORM_RULES.map((rule) => {
                        const isChecked = field.value?.includes(rule.id);
                        return (
                          <label
                            key={rule.id}
                            htmlFor={`rule-${rule.id}`}
                            className={`flex items-start space-x-3 rounded-lg border p-2.5 transition-colors cursor-pointer ${
                              isChecked
                                ? "border-destructive/50 bg-destructive/5"
                                : "border-border hover:bg-muted/50"
                            }`}
                          >
                            <Checkbox
                              id={`rule-${rule.id}`}
                              className="mt-0.5"
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    rule.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (val) => val !== rule.id
                                    )
                                  );
                                }
                              }}
                            />
                            <div className="space-y-0.5 select-none">
                              <span className="text-xs font-semibold leading-none block">
                                {rule.title}
                              </span>
                              <span className="text-[11px] text-muted-foreground line-clamp-1 block">
                                {rule.description}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              />
              {banForm.formState.errors.violations && (
                <p className="text-xs text-destructive">
                  {banForm.formState.errors.violations.message}
                </p>
              )}

              <div className="space-y-1">
                <Label htmlFor="duration">Ban Duration</Label>
                <Controller
                  name="duration"
                  control={banForm.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger id="duration" className="w-full cursor-pointer">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem
                          value="permanent"
                          className="text-destructive font-medium"
                        >
                          Permanent
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {banForm.formState.errors.duration && (
                  <p className="text-xs text-destructive">
                    {banForm.formState.errors.duration.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="reason">Reason for Ban</Label>
                <Textarea
                  className="h-20"
                  id="reason"
                  placeholder="Enter the violation details..."
                  {...banForm.register("reason")}
                />
                {banForm.formState.errors.reason && (
                  <p className="text-xs text-destructive">
                    {banForm.formState.errors.reason.message}
                  </p>
                )}
              </div>
            </form>
          )}
        </ScrollArea>

        <DialogFooter className="border-t bg-background pt-3 gap-2 sm:gap-2">
          {step === "manage" ? (
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
          ) : (
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => setStep("manage")}
              >
                Back
              </Button>
              <Button
                variant="destructive"
                type="submit"
                form="ban-user-form"
                disabled={banForm.formState.isSubmitting}
              >
                {banForm.formState.isSubmitting ? "Banning..." : "Confirm Ban"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}