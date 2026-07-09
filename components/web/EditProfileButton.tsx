"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ImagePlus, Pen, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Doc } from "@/convex/_generated/dataModel";
import { Input } from "../ui/input";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_PLATFORMS, ICON_MAP } from "@/lib/socials";

const formatPlatformName = (name: string) => {
  if (name.toLowerCase() === "x") return "Twitter / X";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const profileFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  socials: z.array(
    z.object({
      platform: z.string(),
      url: z.string().min(1, "URL is required"),
      isCommitted: z.boolean(), 
    })
  ).superRefine((socials, ctx) => {
    socials.forEach((social, index) => {
      if (!social.url) return;
      
      try {
        const cleanUrl = social.url.trim().startsWith("http") 
          ? social.url.trim() 
          : `https://${social.url.trim()}`;
        const parsedUrl = new URL(cleanUrl);
        const domain = parsedUrl.hostname.toLowerCase();
        
        const platformKey = social.platform.toLowerCase();
        
        const isValid = platformKey === "x" 
          ? (domain.includes("x.com") || domain.includes("twitter.com"))
          : domain.includes(platformKey);

        if (!isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Not a valid ${social.platform === 'x' ? 'Twitter/X' : formatPlatformName(social.platform)} link.`,
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

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileButtonProps {
  profile: Doc<"profiles">;
  avatarSrc: string;
}

export function EditProfileButton({ profile, avatarSrc }: EditProfileButtonProps) {
  const user = useQuery(api.auth.getCurrentUser);
  const { username } = profile;

  if (user?.username !== username) return null;

  return (
    <EditProfileDialog profile={profile} avatarSrc={avatarSrc}>
      <Button variant="ghost" size="icon">
        <Pen className="h-4 w-4" />
      </Button>
    </EditProfileDialog>
  );
}

interface EditProfileDialogProps {
  profile: Doc<"profiles">;
  avatarSrc: string;
  children: React.ReactNode;
}

export function EditProfileDialog({ profile, avatarSrc, children }: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [educationList, setEducationList] = useState<string[]>(profile.education || []);
  const [skillsList, setSkillsList] = useState<string[]>(profile.skills || []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile.username || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      location: profile.location || "",
      bio: profile.bio || "",
      socials: ((profile.socials as { platform: string; url: string }[]) || []).map(s => ({
        ...s,
        isCommitted: true,
      })),
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "socials",
  });

  const hasActiveDraft = fields.some((field) => !field.isCommitted);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      form.reset();
      setEducationList(profile.education || []);
      setSkillsList(profile.skills || []);
    }
  };

  const handleAddEducation = () => {
    if (educationList.length < 3) setEducationList([...educationList, ""]);
  };
  const handleRemoveEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };
  const handleEducationChange = (index: number, value: string) => {
    const updated = [...educationList];
    updated[index] = value;
    setEducationList(updated);
  };

  const handleAddSkill = () => {
    if (skillsList.length < 10) setSkillsList([...skillsList, ""]);
  };
  const handleRemoveSkill = (index: number) => {
    setSkillsList(skillsList.filter((_, i) => i !== index));
  };
  const handleSkillChange = (index: number, value: string) => {
    const updated = [...skillsList];
    updated[index] = value;
    setSkillsList(updated);
  };

  const handleStartAddingSocial = () => {
    if (fields.length >= 7 || hasActiveDraft) return;
    append({ platform: AVAILABLE_PLATFORMS[0] || "x", url: "", isCommitted: false });
  };

  const handleCommitSocial = async (index: number) => {
    const isValid = await form.trigger(`socials.${index}.url`);
    
    if (isValid) {
      const currentField = form.getValues(`socials.${index}`);
      const cleanUrl = currentField.url.trim().startsWith("http")
        ? currentField.url.trim()
        : `https://${currentField.url.trim()}`;

      update(index, {
        ...currentField,
        url: cleanUrl,
        isCommitted: true,
      });
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    const cleanedSocials = data.socials.map(({ platform, url }) => ({ platform, url }));
    console.log("Saving changes...", { ...data, socials: cleanedSocials, educationList, skillsList });
    setIsOpen(false); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="-mx-4 max-h-[60vh] overflow-y-auto px-4 pb-2 grid gap-4 no-scrollbar">
          <div className="relative p-2 w-fit">
            <Avatar className="h-16 w-16 border-2 border-muted">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <button
              type="button"
              onClick={() => console.log("Avatar clicked!")}
              className="absolute inset-2 flex items-center justify-center rounded-full bg-black/40 text-white"
              aria-label="Change avatar"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
          </div>

          <Field>
            <FieldLabel>Username</FieldLabel>
            <Input type="text" {...form.register("username")} />
            {form.formState.errors.username && (
              <span className="text-xs text-destructive">{form.formState.errors.username.message}</span>
            )}
          </Field>
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <Input type="text" {...form.register("firstName")} />
          </Field>
          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <Input type="text" {...form.register("lastName")} />
          </Field>
          <Field>
            <FieldLabel>Location</FieldLabel>
            <Input type="text" {...form.register("location")} />
          </Field>
          <Field>
            <FieldLabel>Bio</FieldLabel>
            <Textarea {...form.register("bio")} />
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Education</FieldLabel>
              {educationList.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleAddEducation}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {educationList.map((edu, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={edu}
                    placeholder="e.g., B.S. in Computer Science"
                    onChange={(e) => handleEducationChange(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => handleRemoveEducation(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {educationList.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No education added yet.</p>
              )}
            </div>
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Skills</FieldLabel>
              {skillsList.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleAddSkill}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {skillsList.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={skill}
                    placeholder="e.g., React, TypeScript, Node.js"
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => handleRemoveSkill(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {skillsList.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No skills added yet.</p>
              )}
            </div>
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Social Links</FieldLabel>
              {fields.length < 7 && !hasActiveDraft && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleStartAddingSocial}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => {
                const isCommitted = field.isCommitted;
                const SavedIcon = ICON_MAP[field.platform];
                const rowError = form.formState.errors.socials?.[index]?.url;
                const activePlatform = form.watch(`socials.${index}.platform`);

                if (isCommitted) {
                  return (
                    <div key={field.id} className="flex items-center justify-between p-2.5 border rounded-md bg-secondary/20">
                      <div className="flex items-center gap-2 overflow-hidden pr-2">
                        {SavedIcon && <SavedIcon className="h-4 w-4 text-muted-foreground shrink-0" />}
                        <a 
                          href={form.getValues(`socials.${index}.url`)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-primary truncate hover:underline"
                        >
                          {form.getValues(`socials.${index}.url`)}
                        </a>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 hover:bg-destructive/10"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  );
                }

                return (
                  <div key={field.id} className="flex items-start gap-2 p-3 border rounded-md bg-muted/30 w-full flex-col space-y-2">
                    <div className="flex items-start gap-2 w-full">
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="w-fit min-w-[140px]">
                          <Select
                            value={activePlatform}
                            onValueChange={(val) => form.setValue(`socials.${index}.platform`, val)}
                          >
                            <SelectTrigger className="h-9 text-xs bg-white">
                              <div className="flex items-center gap-2">
                                {ICON_MAP[activePlatform] && (() => {
                                  const CurrentIcon = ICON_MAP[activePlatform];
                                  return <CurrentIcon className="h-3.5 w-3.5 opacity-70" />;
                                })()}
                                <span>{formatPlatformName(activePlatform)}</span>
                              </div>
                            </SelectTrigger>
                            <SelectContent position="popper" className="w-[180px]">
                              {AVAILABLE_PLATFORMS.map((p) => {
                                const DropdownIcon = ICON_MAP[p];
                                return (
                                  <SelectItem key={p} value={p} className="text-xs">
                                    <div className="flex items-center gap-2">
                                      {DropdownIcon && <DropdownIcon className="h-3.5 w-3.5 opacity-70" />}
                                      <span>{formatPlatformName(p)}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <Input
                          type="text"
                          placeholder="Paste profile link..."
                          {...form.register(`socials.${index}.url` as const)}
                          className="h-9 w-full bg-white text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); 
                              handleCommitSocial(index);
                            }
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() => handleCommitSocial(index)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-destructive/10"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    {rowError && (
                      <p className="text-[11px] font-medium text-destructive mt-1">
                        {rowError.message}
                      </p>
                    )}
                  </div>
                );
              })}

              {fields.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No social links added yet.</p>
              )}
            </div>
          </Field>

          <DialogFooter className="gap-2 sm:gap-2 pt-2 col-span-full">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}