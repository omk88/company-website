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
                <Settings className="h-4 w-4" />
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