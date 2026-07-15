"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useConvex, useMutation, useQuery } from "convex/react";
import { ImagePlus, Pen, Plus, Trash2, Check, ChevronsUpDown, GraduationCap, MapPin, Loader2, X } from "lucide-react";
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
import { Doc, Id } from "@/convex/_generated/dataModel";
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

const formatPlatformName = (name: string) => {
  if (name.toLowerCase() === "x") return "Twitter / X";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const profileFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  firstName: z.string(),
  lastName: z.string(),
  location: z.string(),
  locationCountryCode: z.string(), 
  bio: z.string(),
  education: z.array(
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
  skills: z.array(z.string()).max(10, "You can add up to 10 skills"),
  socials: z.array(
    z.object({
      platform: z.string(),
      url: z.string().min(1, "URL is required"),
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

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileButtonProps {
  profile: Doc<"profiles">;
  avatarSrc: string;
}

export function EditProfileButton({ profile, avatarSrc }: EditProfileButtonProps) {
  const user = useQuery(api.auth.getCurrentUser);
  const { username } = profile;

  if (user?.username !== username) return null;

  const profileStateKey = `${profile.username}-${profile.firstName}-${profile.lastName}-${profile.bio}-${profile.profilePic}-${profile.location}`;

  return (
    <EditProfileDialog
      key={profileStateKey}
      profile={profile}
      avatarSrc={avatarSrc}
    >
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
    
  const convex = useConvex();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [locationQuery, setLocationQuery] = useState("");
  const [locationOptions, setLocationOptions] = useState<{label: string, countryCode?: string}[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const generateUploadUrl = useMutation(api.profiles.generateUploadUrl);

  const runUpdateProfile = useMutation(api.profiles.updateProfile)
    .withOptimisticUpdate((localStore, args) => {
      const oldUsername = profile.username;
      const newUsername = args.username ?? oldUsername;

      const currentProfile = localStore.getQuery(
        api.profiles.getProfileByUsername, 
        { username: oldUsername }
      );

      if (currentProfile) {
        const updatedProfile = {
          ...currentProfile,
          username: newUsername,
          firstName: args.firstName ?? currentProfile.profile?.firstName,
          lastName: args.lastName ?? currentProfile.profile?.lastName,
          profilePic: args.profilePic ?? currentProfile.profile?.profilePic,
          location: args.location ?? currentProfile.profile?.location,
          locationCountryCode: args.locationCountryCode ?? currentProfile.profile?.locationCountryCode,
          bio: args.bio ?? currentProfile.profile?.bio,
          education: args.education ?? currentProfile.profile?.education,
          skills: args.skills ?? currentProfile.profile?.skills,
          socials: args.socials ?? currentProfile.profile?.socials,
        };

        localStore.setQuery(
          api.profiles.getProfileByUsername, 
          { username: oldUsername }, 
          updatedProfile
        );

        if (oldUsername !== newUsername) {
          localStore.setQuery(
            api.profiles.getProfileByUsername, 
            { username: newUsername }, 
            updatedProfile
          );
        }
      }
  });

  const updateImage = useMutation(api.auth.updateAuthImage);

  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile.username || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      location: profile.location || "",
      locationCountryCode: profile.locationCountryCode || "",
      bio: profile.bio || "",
      education: ((profile.education as any) || []).map((edu: any) => ({
        ...edu,
        isCommitted: true,
      })),
      skills: profile.skills || [],
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

  const { 
    fields: educationFields, 
    append: appendEducation, 
    remove: removeEducation,
    update: updateEducation 
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const watchedSkills = form.watch("skills") || [];
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | -1>(-1);
  const [editingEduIndex, setEditingEduIndex] = useState<number | -1>(-1);

  useEffect(() => {
    if (!locationQuery.trim() || locationQuery.trim().length < 3) {
      setLocationOptions([]);
      setIsLoadingLocation(false);
      return;
    }

    setIsLoadingLocation(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationQuery.trim()
          )}&featuretype=settlement&addressdetails=1&limit=6`
        );
        const data = await res.json();
        
        const formattedCities = data.map((item: any) => {
          const city = item.address.city || item.address.town || item.address.village || item.display_name.split(",")[0];
          const state = item.address.state;
          const country = item.address.country;
          const label = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
          
          return {
            label,
            countryCode: item.address?.country_code
          };
        });

        const uniqueCities = formattedCities.filter(
          (value: any, index: number, self: any[]) =>
            self.findIndex((t) => t.label === value.label) === index
        );

        setLocationOptions(uniqueCities);
      } catch (err) {
        console.error("Error collecting global geocode data:", err);
      } finally {
        setIsLoadingLocation(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [locationQuery]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      form.reset();
      setLocationQuery("");
    }
  };

    const handleStartAddingSocial = () => {
      if (fields.length >= 7 || editingSocialIndex !== -1) return;

      const firstFreePlatform = AVAILABLE_PLATFORMS.find(
        (platform) => !fields.some((field) => field.platform === platform)
      );

      const platformToSelect = firstFreePlatform || AVAILABLE_PLATFORMS[0] || "x";

      append({ platform: platformToSelect, url: "" });
      setEditingSocialIndex(fields.length);
    };

    const handleCommitSocial = async (index: number) => {
      const isValid = await form.trigger(`socials.${index}.url`);
      if (isValid) {
          const currentField = form.getValues(`socials.${index}`);
          const cleanUrl = currentField.url.trim().startsWith("http")
          ? currentField.url.trim()
          : `https://${currentField.url.trim()}`;

          update(index, { ...currentField, url: cleanUrl });
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
    if (!publicImageUrl) return;
    try {
      setIsSubmitting(true);
      await updateImage({ image: publicImageUrl });
    } catch (error) {
      console.error("Failed to update auth session image:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsOpen(false); 

    const uploadPromise = handleUpload();

    const profilePromise = (async () => {
      const storageId = await uploadPromise; 
      
      const finalStorageId = storageId || profile.profilePic;

      await runUpdateProfile({
        id: profile._id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        profilePic: finalStorageId,
        location: data.location,
        locationCountryCode: data.locationCountryCode,
        bio: data.bio,
        education: data.education.map(({ degree, subject, institution }) => ({ degree, subject, institution })),
        skills: data.skills,
        socials: data.socials.map(({ platform, url }) => ({ platform, url })),
      });

      if (profile.username !== data.username) {
        startTransition(() => {
          router.push(`/${data.username}`);
        });
      }
    })();

    profilePromise.catch((error) => {
      console.error("Background profile sync failed:", error);
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewSrc(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (): Promise<Id<"_storage"> | undefined> => {
    if (!selectedFile) return undefined;

    try {
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) throw new Error("Upload failed");

      const data = (await result.json()) as { storageId: Id<"_storage"> };
      
      return data.storageId;
        
    } catch (error) {
      console.error("Upload failed:", error);
      return undefined;
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
              
              <div className="flex-1 overflow-y-auto px-6 pb-4 grid gap-4 no-scrollbar">
                <div className="relative p-2 w-fit">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" 
                  />
                  <Avatar className="h-16 w-16 border-2 border-muted">
                    <AvatarImage src={previewSrc || avatarSrc} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="absolute inset-2 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                    aria-label="Change avatar"
                  >
                    <ImagePlus className="h-5 w-5" />
                  </button>
                </div>

                <Field>
                  <FieldLabel>Username</FieldLabel>
                  <div className="relative w-full">
                    <Input type="text" {...form.register("username")} placeholder="john.doe48" className="pr-9" />
                    {form.watch("username") && (
                      <button 
                        onClick={() => form.setValue("username", "", { shouldValidate: true })} 
                        type="button" 
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
                      >
                        <X className="h-3.5 w-3.5 stroke-[2]" />
                      </button>
                    )}
                  </div>
                  {form.formState.errors.username && (
                    <span className="text-xs text-destructive">{form.formState.errors.username.message}</span>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel>First Name</FieldLabel>
                    <div className="relative w-full">
                      <Input type="text" {...form.register("firstName")} placeholder="John" className="pr-9" />
                      {form.watch("firstName") && (
                        <button onClick={() => form.setValue("firstName", "", { shouldValidate: true })} type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"><X className="h-3.5 w-3.5 stroke-[2]" /></button>
                      )}
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel>Last Name</FieldLabel>
                    <div className="relative w-full">
                      <Input type="text" {...form.register("lastName")} placeholder="Doe" className="pr-9" />
                      {form.watch("lastName") && (
                        <button onClick={() => form.setValue("lastName", "", { shouldValidate: true })} type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"><X className="h-3.5 w-3.5 stroke-[2]" /></button>
                      )}
                    </div>
                  </Field>
                </div>

                <LocationField
                  locationCountryCode={profile.locationCountryCode}
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
                    <Textarea {...form.register("bio")} placeholder="Hi! My name is John Doe and I am a tech professional..." className="pr-9 pt-2.5" />
                    {form.watch("bio") && (
                      <button onClick={() => form.setValue("bio", "", { shouldValidate: true })} type="button" className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"><X className="h-3.5 w-3.5 stroke-[2]" /></button>
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
                  fields={fields}
                  remove={remove}
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
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
  );
}