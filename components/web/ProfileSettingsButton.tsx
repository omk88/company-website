"use client";

import { ReactNode, useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import z from "zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

const profileSettingsFormSchema = z.object({
  emailNotifications: z.boolean(),
});

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsFormSchema>;

interface ProfileSettingsButtonProps {
  userId: string;
}

export function ProfileSettingsButton({ userId }: ProfileSettingsButtonProps) {
    return (
        <ProfileSettingsDialog userId={userId}>
            <Button variant="ghost" size="icon" className="cursor-pointer">
                <Settings className="size-5 md:size-4" />
            </Button>
        </ProfileSettingsDialog>
    );
}

interface ProfileSettingsDialogProps {
  userId: string;
  children: React.ReactNode;
}

function ProfileSettingsDialog({ userId, children }: ProfileSettingsDialogProps) {

    const [isOpen, setIsOpen] = useState(false);

    const settings = useQuery(
        api.settings.getProfileSettings,
        userId ? { userId } : "skip"
    );

    const form = useForm<ProfileSettingsFormValues>({
        resolver: zodResolver(profileSettingsFormSchema),
        defaultValues: {
            emailNotifications: true,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (settings) {
        form.reset({
            emailNotifications: settings.emailNotifications,
        });
        }
    }, [settings, form]);

    const updateProfileSettingsMutation = useMutation(
        api.settings.updateProfileSettings
    ).withOptimisticUpdate((localStore, args) => {
        const currentSettings = localStore.getQuery(
            api.settings.getProfileSettings,
            { userId: args.userId }
        );

        if (
            currentSettings &&
            currentSettings._id &&
            currentSettings._creationTime !== undefined &&
            args.emailNotifications !== undefined
        ) {
            localStore.setQuery(
            api.settings.getProfileSettings,
            { userId: args.userId },
            {
                ...currentSettings,
                emailNotifications: args.emailNotifications,
            }
            );
        }
    });

    const onSubmit = async (data: ProfileSettingsFormValues) => {
        try {
            await updateProfileSettingsMutation({
                userId,
                emailNotifications: data.emailNotifications,
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update settings:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                </DialogHeader>

                <FormProvider {...form}>
                    <form id="profile-settings-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <Field className="flex">
                            <FieldLabel htmlFor="emailNotifications">Email Notifications</FieldLabel>
                                <Controller
                                    control={form.control}
                                    name="emailNotifications"
                                    render={({ field }) => (
                                    <Switch
                                        id="emailNotifications"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="cursor-pointer"
                                />
                                )}
                            />
                        </Field>
                    </form>
                </FormProvider>
                <div className="hidden md:flex">
                    <Button
                        type="submit"
                        className={cn(
                            "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 p-2 w-full sm:w-auto cursor-pointer"
                        )}
                    >
                        Connect Bank Account
                    </Button>
                </div>
                <DialogFooter className="border-t bg-background gap-2 sm:gap-2">
                    <DialogClose asChild>
                        <Button className="cursor-pointer" type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button className="cursor-pointer" type="submit" form="profile-settings-form" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}