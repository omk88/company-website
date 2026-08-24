"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {  Check, Loader2, Pen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { AVAILABLE_PLATFORMS, ICON_MAP } from "@/lib/socials";
import { SKILLS } from "@/data/skills";
import { EducationFields } from "./EditFormFields/EducationField";
import { LocationField } from "./EditFormFields/LocationField";
import majorsData from "@/data/majors.json";
import { SkillsFields } from "./EditFormFields/SkillsField";
import { SocialLinksFields } from "./EditFormFields/SocialLinksField";
import { useRouter } from "next/navigation";
import { UploadAvatar } from "./UploadAvatar";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useLocationSearch } from "@/stores/useLocationSearch";
import { useDebounce } from "@/hooks/use-debounce";

const formatPlatformName = (name: string) => {
  if (name.toLowerCase() === "x") return "Twitter / X";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const profileFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  displayName: z.string(),
  location: z.string(),
  locationCountryCode: z.string(),
  bio: z.string(),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, "Degree type is required"),
        subject: z.string().min(1, "Subject is required"),
        institution: z.string().min(1, "Institution is required"),
      })
    )
    .max(3, "You can add up to 3 education histories")
    .superRefine((educationList, ctx) => {
      const seenCombinations = new Set<string>();

      educationList.forEach((edu, index) => {
        if (!edu.degree || !edu.subject || !edu.institution) return;

        const comboKey = `${edu.degree.toLowerCase().trim()}|${edu.subject.toLowerCase().trim()}|${edu.institution.toLowerCase().trim()}`;

        if (seenCombinations.has(comboKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This exact education record has already been added.",
            path: [index, "institution"],
          });
        } else {
          seenCombinations.add(comboKey);
        }
      });
    }),
  skills: z.array(z.string()).max(6, "You can add up to 6 skills"),
  socials: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().min(1, "URL is required"),
      })
    )
    .superRefine((socials, ctx) => {
      socials.forEach((social, index) => {
        if (!social.url) return;

        try {
          const cleanUrl = social.url.trim().startsWith("http")
            ? social.url.trim()
            : `https://${social.url.trim()}`;
          const parsedUrl = new URL(cleanUrl);
          const domain = parsedUrl.hostname.toLowerCase();
          const platformKey = social.platform.toLowerCase();

          const isValid =
            platformKey === "x"
              ? domain.includes("x.com") || domain.includes("twitter.com")
              : domain.includes(platformKey);

          if (!isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Not a valid ${
                social.platform === "x" ? "Twitter/X" : formatPlatformName(social.platform)
              } link.`,
              path: [index, "url"],
            });
          }
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid URL structure.",
            path: [index, "url"],
          });
        }
      });
    }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileButtonProps {
  profile: Doc<"profiles">;
  avatarSrc: string;
  defaultAvatarSrc: string;
}

export function EditProfileButton({ profile, avatarSrc, defaultAvatarSrc }: EditProfileButtonProps) {
  return (
    <EditProfileDialog profile={profile} avatarSrc={avatarSrc} defaultAvatarSrc={defaultAvatarSrc}>
      <Button variant="ghost" size="icon" className="cursor-pointer">
        <Pen className="h-4 w-4" />
      </Button>
    </EditProfileDialog>
  );
}

interface EditProfileDialogProps {
  profile: Doc<"profiles">;
  avatarSrc: string;
  defaultAvatarSrc: string;
  children: React.ReactNode;
}

export function EditProfileDialog({ profile, avatarSrc, defaultAvatarSrc, children }: EditProfileDialogProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingSocialIndex, setEditingSocialIndex] = useState<number>(-1);
  const [editingEduIndex, setEditingEduIndex] = useState<number>(-1);

  const [locationQuery, setLocationQuery] = useState("");
  const { options: locationOptions, isLoading: isLoadingLocation } = useLocationSearch(locationQuery);

  const [isAvatarChanged, setIsAvatarChanged] = useState(false);
  const [pendingStorageId, setPendingStorageId] = useState<Id<"_storage"> | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const uploadPromiseRef = useRef<Promise<Id<"_storage"> | undefined> | null>(null);

  const updateImage = useMutation(api.auth.updateAuthImage);
  const runUpdateProfile = useMutation(api.profiles.updateProfile).withOptimisticUpdate((localStore, args) => {
    const oldUsername = profile.username;
    const newUsername = args.username ?? oldUsername;

    const currentProfile = localStore.getQuery(api.profiles.getProfileByUsername, { username: oldUsername });

    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        username: newUsername,
        displayName: args.displayName ?? currentProfile.profile?.displayName,
        profilePic: args.profilePic ?? currentProfile.profile?.profilePic,
        location: args.location ?? currentProfile.profile?.location,
        locationCountryCode: args.locationCountryCode ?? currentProfile.profile?.locationCountryCode,
        bio: args.bio ?? currentProfile.profile?.bio,
        education: args.education ?? currentProfile.profile?.education,
        skills: args.skills ?? currentProfile.profile?.skills,
        socials: args.socials ?? currentProfile.profile?.socials,
      };

      localStore.setQuery(api.profiles.getProfileByUsername, { username: oldUsername }, updatedProfile);

      if (oldUsername !== newUsername) {
        localStore.setQuery(api.profiles.getProfileByUsername, { username: newUsername }, updatedProfile);
      }
    }
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: getProfileDefaultValues(profile),
    mode: "onChange",
  });

  const watchedUsername = form.watch("username") || "";
  const debouncedUsername = useDebounce(watchedUsername, 400);

  const isUsernameModified = debouncedUsername.trim().toLowerCase() !== (profile.username || "").toLowerCase();
  const isLocalUsernameValid = debouncedUsername.trim().length >= 2 && !form.formState.errors.username;
  const shouldCheckUsername = isUsernameModified && isLocalUsernameValid;

  const isUsernameTaken = useQuery(
    api.profiles.isUsernameTaken,
    shouldCheckUsername
      ? { username: debouncedUsername, currentUserId: profile.userId }
      : "skip"
  );

  const isCheckingUsername =
    shouldCheckUsername && (watchedUsername !== debouncedUsername || isUsernameTaken === undefined);

  useEffect(() => {
    if (!shouldCheckUsername) return;

    if (isUsernameTaken === true) {
      form.setError("username", {
        type: "manual",
        message: "This username is already taken.",
      });
    } else if (isUsernameTaken === false && form.formState.errors.username?.type === "manual") {
      form.clearErrors("username");
    }
  }, [isUsernameTaken, shouldCheckUsername, form]);

  const { fields: socialFields, append: appendSocial, remove: removeSocial, update: updateSocial } = useFieldArray({
    control: form.control,
    name: "socials",
  });

  const { fields: educationFields, append: appendEducation, update: updateEducation } = useFieldArray({
    control: form.control,
    name: "education",
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(getProfileDefaultValues(profile));
      setLocationQuery("");
      setIsAvatarChanged(false);
      setPendingStorageId(null);
      setEditingSocialIndex(-1);
      setEditingEduIndex(-1);
    }
  }, [isOpen, profile, form]);

  const handleStartAddingSocial = () => {
    if (socialFields.length >= 7 || editingSocialIndex !== -1) return;

    const firstFreePlatform = AVAILABLE_PLATFORMS.find(
      (platform) => !socialFields.some((field) => field.platform === platform)
    );

    appendSocial({ platform: firstFreePlatform || AVAILABLE_PLATFORMS[0] || "x", url: "" });
    setEditingSocialIndex(socialFields.length);
  };

  const handleCommitSocial = async (index: number) => {
    const isValid = await form.trigger(`socials.${index}.url`);
    if (isValid) {
      const currentField = form.getValues(`socials.${index}`);
      const cleanUrl = currentField.url.trim().startsWith("http")
        ? currentField.url.trim()
        : `https://${currentField.url.trim()}`;

      updateSocial(index, { ...currentField, url: cleanUrl });
      setEditingSocialIndex(-1);
    }
  };

  const handleStartAddingEducation = () => {
    if (educationFields.length >= 3 || editingEduIndex !== -1) return;
    setEditingEduIndex(educationFields.length);
  };

  const handleCommitEducation = async (index: number) => {
    const isDegreeValid = await form.trigger(`education.${index}.degree`);
    const isSubjectValid = await form.trigger(`education.${index}.subject`);
    const isInstValid = await form.trigger(`education.${index}.institution`);
    const isArrayValid = await form.trigger("education");

    if (isDegreeValid && isSubjectValid && isInstValid && isArrayValid) {
      const currentField = form.getValues(`education.${index}`);
      updateEducation(index, currentField);
      setEditingEduIndex(-1);
    }
  };

  const updateSessionProfilePicture = async (publicImageUrl: string) => {
    if (!publicImageUrl && publicImageUrl !== defaultAvatarSrc) return;
    try {
      await updateImage({ image: publicImageUrl || defaultAvatarSrc });
    } catch (error) {
      console.error("Failed to update auth session image:", error);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (isCheckingUsername || isUsernameTaken === true) return;

    setIsOpen(false);

    let finalStorageId = profile.profilePic;

    if (isAvatarChanged) {
      if (pendingStorageId) {
        finalStorageId = pendingStorageId;
      } else if (isAvatarUploading && uploadPromiseRef.current) {
        finalStorageId = await uploadPromiseRef.current;
      } else {
        finalStorageId = undefined;
      }
    }

    const updateResult = await runUpdateProfile({
      id: profile._id,
      username: data.username,
      displayName: data.displayName,
      profilePic: finalStorageId,
      location: data.location,
      locationCountryCode: data.locationCountryCode,
      bio: data.bio,
      education: data.education.map(({ degree, subject, institution }) => ({ degree, subject, institution })),
      skills: data.skills,
      socials: data.socials.map(({ platform, url }) => ({ platform, url })),
    });

    if (isAvatarChanged) {
      const targetUrl = finalStorageId && updateResult?.publicImageUrl ? updateResult.publicImageUrl : defaultAvatarSrc;
      await updateSessionProfilePicture(targetUrl);
    }

    if (profile.username !== data.username) {
      startTransition(() => {
        router.push(`/${data.username}`);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 pb-4 grid gap-4 no-scrollbar">
              
              <UploadAvatar
                avatarSrc={avatarSrc}
                defaultAvatarSrc={defaultAvatarSrc}
                onPendingIdChange={(id) => {
                  setPendingStorageId(id);
                  setIsAvatarChanged(true);
                }}
                onUploadingStatusChange={setIsAvatarUploading}
                onPromiseCreated={(promise) => {
                  uploadPromiseRef.current = promise;
                }}
              />

              <Field>
                <FieldLabel>Username</FieldLabel>
                <div className="relative w-full">
                  <Input
                    type="text"
                    {...form.register("username")}
                    placeholder="john.doe48"
                    className="pr-14"
                  />

                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {isCheckingUsername && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}

                    {!isCheckingUsername &&
                      shouldCheckUsername &&
                      isUsernameTaken === false &&
                      !form.formState.errors.username && (
                        <Check className="h-4 w-4 text-emerald-500" />
                      )}

                    {watchedUsername && (
                      <button
                        onClick={() => form.setValue("username", "", { shouldValidate: true })}
                        type="button"
                        className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
                      >
                        <X className="h-3.5 w-3.5 stroke-[2]" />
                      </button>
                    )}
                  </div>
                </div>

                {form.formState.errors.username && (
                  <span className="text-xs text-destructive">
                    {form.formState.errors.username.message}
                  </span>
                )}
              </Field>

              <Field>
                <FieldLabel>Display Name</FieldLabel>
                <div className="relative w-full">
                  <Input type="text" {...form.register("displayName")} placeholder="John Doe" className="pr-9" />
                  {form.watch("displayName") && (
                    <ClearButton onClick={() => form.setValue("displayName", "", { shouldValidate: true })} />
                  )}
                </div>
              </Field>

              <LocationField
                locationCountryCode={profile.locationCountryCode || ""}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                locationQuery={locationQuery}
                setLocationQuery={setLocationQuery}
                locationOptions={locationOptions}
                isLoadingLocation={isLoadingLocation}
              />

              <Field>
                <FieldLabel>Bio</FieldLabel>
                <div className="relative w-full">
                  <Textarea
                    {...form.register("bio")}
                    placeholder="Hi! My name is John Doe and I am a tech professional..."
                    className="pr-9 pt-2.5"
                  />
                  {form.watch("bio") && (
                    <button
                      onClick={() => form.setValue("bio", "", { shouldValidate: true })}
                      type="button"
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
                    >
                      <X className="h-3.5 w-3.5 stroke-[2]" />
                    </button>
                  )}
                </div>
              </Field>

              <EducationFields
                editingEduIndex={editingEduIndex}
                setEditingEduIndex={setEditingEduIndex}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                handleStartAddingEducation={handleStartAddingEducation}
                handleCommitEducation={handleCommitEducation}
                ALLOWED_SUBJECTS={majorsData}
              />

              <SkillsFields comboboxOpen={comboboxOpen} setComboboxOpen={setComboboxOpen} ALLOWED_SKILLS={SKILLS} />

              <SocialLinksFields
                fields={socialFields}
                remove={removeSocial}
                editingSocialIndex={editingSocialIndex}
                setEditingSocialIndex={setEditingSocialIndex}
                handleStartAddingSocial={handleStartAddingSocial}
                handleCommitSocial={handleCommitSocial}
                ICON_MAP={ICON_MAP}
                AVAILABLE_PLATFORMS={AVAILABLE_PLATFORMS}
                formatPlatformName={formatPlatformName}
              />
            </div>

            <DialogFooter className="p-6 pt-2 border-t bg-background gap-2 sm:gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isCheckingUsername || isUsernameTaken === true}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

function getProfileDefaultValues(profile: Doc<"profiles">): ProfileFormValues {
  return {
    username: profile.username || "",
    displayName: profile.displayName || "",
    location: profile.location || "",
    locationCountryCode: profile.locationCountryCode || "",
    bio: profile.bio || "",
    education: ((profile.education as any) || []).map((edu: any) => ({
      ...edu,
      isCommitted: true,
    })),
    skills: profile.skills || [],
    socials: ((profile.socials as { platform: string; url: string }[]) || []).map((s) => ({
      ...s,
      isCommitted: true,
    })),
  };
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
    >
      <X className="h-3.5 w-3.5 stroke-[2]" />
    </button>
  );
}