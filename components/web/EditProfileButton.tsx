"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ImagePlus, Pen, Plus, Trash2, Check, ChevronsUpDown, GraduationCap, MapPin, Loader2 } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { AVAILABLE_PLATFORMS, ICON_MAP } from "@/lib/socials";
import { ALLOWED_SKILLS } from "@/lib/skills";
import { ALLOWED_SUBJECTS, ALLOWED_INSTITUTIONS } from "@/lib/data";

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
  education: z.array(
    z.object({
      degree: z.string().min(1, "Degree type is required"),
      subject: z.string().min(1, "Subject is required"),
      institution: z.string().min(1, "Institution is required"),
      isCommitted: z.boolean(),
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
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [locationQuery, setLocationQuery] = useState("");
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile.username || "",
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      location: profile.location || "",
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
  const hasActiveDraft = fields.some((field) => !field.isCommitted);
  const hasActiveEducationDraft = educationFields.some((field) => !field.isCommitted);

  useEffect(() => {
    if (locationQuery.trim().length < 3) {
      setLocationOptions([]);
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
          return state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;
        });

        setLocationOptions([...new Set(formattedCities)] as string[]);
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

  const handleToggleSkill = (skill: string) => {
    const currentSkills = form.getValues("skills");
    if (currentSkills.includes(skill)) {
      form.setValue("skills", currentSkills.filter((s) => s !== skill));
    } else {
      if (currentSkills.length >= 10) return;
      form.setValue("skills", [...currentSkills, skill]);
    }
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

  const handleStartAddingEducation = () => {
    if (educationFields.length >= 3 || hasActiveEducationDraft) return;
    appendEducation({ degree: "", subject: "", institution: "", isCommitted: false });
  };

  const handleCommitEducation = async (index: number) => {
    const isDegreeValid = await form.trigger(`education.${index}.degree`);
    const isSubjectValid = await form.trigger(`education.${index}.subject`);
    const isInstValid = await form.trigger(`education.${index}.institution`);
    
    const isArrayValid = await form.trigger("education");
    
    if (isDegreeValid && isSubjectValid && isInstValid && isArrayValid) {
      const currentField = form.getValues(`education.${index}`);
      updateEducation(index, {
        ...currentField,
        isCommitted: true,
      });
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    const cleanedSocials = data.socials.map(({ platform, url }) => ({ platform, url }));
    const cleanedEducation = data.education.map(({ degree, subject, institution }) => ({ degree, subject, institution }));
    console.log("Saving changes...", { ...data, socials: cleanedSocials, education: cleanedEducation });
    setIsOpen(false); 
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="-mx-4 max-h-[60vh] overflow-y-auto px-4 pb-2 grid gap-4 no-scrollbar">
            <div className="relative p-2 w-fit">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" 
                />

                <Avatar className="h-16 w-16 border-2 border-muted">
                    <AvatarImage src={ previewSrc || avatarSrc } />
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
            <Input type="text" {...form.register("username")} />
            {form.formState.errors.username && (
              <span className="text-xs text-destructive">{form.formState.errors.username.message}</span>
            )}
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input type="text" {...form.register("firstName")} />
            </Field>
            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input type="text" {...form.register("lastName")} />
            </Field>
          </div>

          <Field>
            <FieldLabel>Location</FieldLabel>
            <Popover open={openDropdown === "location"} onOpenChange={(open) => setOpenDropdown(open ? "location" : null)}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal text-xs h-9 bg-white text-left"
                >
                  <span className="truncate flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {form.watch("location") || "Search city or town globally..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[340px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput 
                    value={locationQuery}
                    onValueChange={setLocationQuery}
                    placeholder="Type city name (e.g. Paris, Austin)..." 
                    className="text-xs" 
                  />
                  <CommandList>
                    {isLoadingLocation && (
                      <div className="p-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching cities...
                      </div>
                    )}
                    {!isLoadingLocation && locationQuery.trim().length >= 3 && locationOptions.length === 0 && (
                      <CommandEmpty>No results matching your query.</CommandEmpty>
                    )}
                    {locationQuery.trim().length < 3 && !isLoadingLocation && (
                      <div className="p-3 text-center text-xs text-muted-foreground italic">
                        Type at least 3 characters to query data
                      </div>
                    )}
                    <CommandGroup>
                      {locationOptions.map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={() => {
                            form.setValue("location", city, { shouldValidate: true });
                            setOpenDropdown(null);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          <Check
                            className={`mr-2 h-3.5 w-3.5 ${
                              form.watch("location") === city ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {city}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </Field>

          <Field>
            <FieldLabel>Bio</FieldLabel>
            <Textarea {...form.register("bio")} />
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Education</FieldLabel>
              {educationFields.length < 3 && !hasActiveEducationDraft && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleStartAddingEducation}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {educationFields.map((field, index) => {
                const isCommitted = field.isCommitted;
                const selectedDegree = form.watch(`education.${index}.degree`);
                const selectedSubject = form.watch(`education.${index}.subject`);
                const selectedInstitution = form.watch(`education.${index}.institution`);

                if (isCommitted) {
                  const displayDegree = selectedDegree ? selectedDegree.charAt(0).toUpperCase() + selectedDegree.slice(1) : "";
                  return (
                    <div key={field.id} className="flex items-center justify-between p-2.5 border rounded-md bg-secondary/20">
                      <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                        <p className="text-xs text-foreground">
                          {displayDegree} in {selectedSubject} from {selectedInstitution}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 hover:bg-destructive/10"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  );
                }

                return (
                  <div key={field.id} className="p-3 border rounded-md bg-muted/30 space-y-3 relative flex gap-3 items-start">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Select
                          value={selectedDegree}
                          onValueChange={(val) => form.setValue(`education.${index}.degree`, val, { shouldValidate: true })}
                        >
                          <SelectTrigger className="h-9 text-xs bg-white">
                            <SelectValue placeholder="Degree" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bachelors" className="text-xs">Bachelors</SelectItem>
                            <SelectItem value="masters" className="text-xs">Masters</SelectItem>
                            <SelectItem value="phd" className="text-xs">PhD</SelectItem>
                            <SelectItem value="associates" className="text-xs">Associates</SelectItem>
                            <SelectItem value="diploma" className="text-xs">Diploma</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors.education?.[index]?.degree && (
                          <p className="text-[10px] font-medium text-destructive mt-0.5">
                            {form.formState.errors.education[index]?.degree?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Popover 
                          open={openDropdown === `subject-${index}`} 
                          onOpenChange={(open) => setOpenDropdown(open ? `subject-${index}` : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between font-normal text-xs h-9 bg-white text-left"
                            >
                              <span className="truncate">
                                {selectedSubject || "Search and select subject..."}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[340px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search subject..." className="text-xs" />
                              <CommandList>
                                <CommandEmpty>No subject found.</CommandEmpty>
                                <CommandGroup className="max-h-[200px] overflow-y-auto">
                                  {ALLOWED_SUBJECTS.map((subject) => (
                                    <CommandItem
                                      key={subject}
                                      value={subject}
                                      onSelect={() => {
                                        form.setValue(`education.${index}.subject`, subject, { shouldValidate: true });
                                        setOpenDropdown(null);
                                      }}
                                      className="text-xs"
                                    >
                                      <Check
                                        className={`mr-2 h-3.5 w-3.5 ${
                                          selectedSubject === subject ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                      {subject}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {form.formState.errors.education?.[index]?.subject && (
                          <p className="text-[10px] font-medium text-destructive mt-0.5">
                            {form.formState.errors.education[index]?.subject?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Popover 
                          open={openDropdown === `institution-${index}`} 
                          onOpenChange={(open) => setOpenDropdown(open ? `institution-${index}` : null)}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between font-normal text-xs h-9 bg-white text-left"
                            >
                              <span className="truncate">
                                {selectedInstitution || "Search and select institution..."}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[340px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search institution / university..." className="text-xs" />
                              <CommandList>
                                <CommandEmpty>No institution found.</CommandEmpty>
                                <CommandGroup className="max-h-[200px] overflow-y-auto">
                                  {ALLOWED_INSTITUTIONS.map((inst) => (
                                    <CommandItem
                                      key={inst}
                                      value={inst}
                                      onSelect={() => {
                                        form.setValue(`education.${index}.institution`, inst, { shouldValidate: true });
                                        setOpenDropdown(null);
                                      }}
                                      className="text-xs"
                                    >
                                      <Check
                                        className={`mr-2 h-3.5 w-3.5 ${
                                          selectedInstitution === inst ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                      {inst}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {form.formState.errors.education?.[index]?.institution && (
                          <p className="text-[10px] font-medium text-destructive mt-0.5">
                            {form.formState.errors.education[index]?.institution?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={() => handleCommitEducation(index)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-destructive/10 text-destructive"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {educationFields.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No education history added yet.</p>
              )}
            </div>
            {form.formState.errors.education?.root && (
              <span className="text-xs text-destructive mt-1 block">{form.formState.errors.education.root.message}</span>
            )}
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Skills ({watchedSkills.length}/10)</FieldLabel>
            </div>
            
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between font-normal text-xs text-muted-foreground h-9 bg-white"
                  disabled={watchedSkills.length >= 10}
                >
                  {watchedSkills.length >= 10 
                    ? "Max skills reached" 
                    : "Search and add tech skills..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[360px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search skills (e.g. Next.js, Rust)..." className="text-xs" />
                  <CommandList>
                    <CommandEmpty>No tech skill found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {ALLOWED_SKILLS.map((skill) => {
                        const isSelected = watchedSkills.includes(skill);
                        return (
                          <CommandItem
                            key={skill}
                            value={skill}
                            onSelect={() => {
                              handleToggleSkill(skill);
                            }}
                            className="text-xs"
                          >
                            <Check
                              className={`mr-2 h-3.5 w-3.5 ${
                                isSelected ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {skill}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {watchedSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="text-[11px] px-2 py-0.5 flex items-center gap-1 bg-secondary/50"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className="hover:bg-muted rounded-full p-0.5 transition-colors"
                  >
                    <Plus className="h-3 w-3 rotate-45 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
              {watchedSkills.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No skills selected yet.</p>
              )}
            </div>
            {form.formState.errors.skills && (
              <span className="text-xs text-destructive mt-1">{form.formState.errors.skills.message}</span>
            )}
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
                      <div className="flex items-center gap-2.5 overflow-hidden pr-2">
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
                          className="h-9 w-9 hover:bg-destructive/10 text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
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