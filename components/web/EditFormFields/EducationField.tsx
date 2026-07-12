import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { GraduationCap, Trash2, Plus, ChevronsUpDown, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldLabel } from "@/components/ui/field";
import { ProfileFormValues } from "../EditProfileButton";
import { DEGREE_TYPES } from "@/data/degrees";

interface EducationFieldsProps {
  editingEduIndex: number;
  setEditingEduIndex: (index: number) => void;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  handleStartAddingEducation: () => void;
  handleCommitEducation: (index: number) => void;
  ALLOWED_SUBJECTS: string[];
}

interface HipoUniversity {
  name: string;
  country: string;
}

export const EducationFields: React.FC<EducationFieldsProps> = ({
  editingEduIndex,
  setEditingEduIndex,
  openDropdown,
  setOpenDropdown,
  handleCommitEducation,
  ALLOWED_SUBJECTS,
}) => {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ProfileFormValues>();

  const { fields: educationFields, remove: removeEducation, append: appendEducation, update: updateEducation } = useFieldArray({
    control,
    name: "education",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setInstitutions([]);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `http://universities.hipolabs.com/search?name=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data: HipoUniversity[] = await response.json();
          const uniqueNames = Array.from(new Set(data.map((uni) => uni.name))).slice(0, 20);
          setInstitutions(uniqueNames);
        }
      } catch (error) {
        console.error("Failed fetching universities:", error);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (!openDropdown || !openDropdown.startsWith("institution-")) {
      setSearchQuery("");
      setInstitutions([]);
    }
  }, [openDropdown]);

  return (
    <Field>
      <div className="flex items-center justify-between mb-1">
        <FieldLabel>Education</FieldLabel>
        {educationFields.length < 3 && editingEduIndex === -1 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              const nextIndex = educationFields.length;
              appendEducation({ degree: "", subject: "", institution: "" });
              setEditingEduIndex(nextIndex);
            }}
          >
            <Plus className="mr-1 h-3 w-3" /> Add
          </Button>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3">
        {educationFields.map((field, index) => {
          const isCommitted = index !== editingEduIndex;
          const selectedDegree = watch(`education.${index}.degree`);
          const selectedSubject = watch(`education.${index}.subject`);
          const selectedInstitution = watch(`education.${index}.institution`);

          if (isCommitted) {
            const matchingDegree = DEGREE_TYPES.find((d) => d.value === selectedDegree);
            let displayDegree = selectedDegree || "";

            if (matchingDegree) {
              const shorthandMatch = matchingDegree.label.match(/\(([^)]+)\)/);
              displayDegree = shorthandMatch ? shorthandMatch[1] : matchingDegree.label;
            }

            return (
              <div key={field.id} className="flex items-center justify-between p-2.5 border rounded-md bg-secondary/20">
                <div className="flex items-start gap-2.5 overflow-hidden pr-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  
                  <p className="text-xs text-foreground break-words whitespace-normal">
                    {displayDegree} in {selectedSubject} from {selectedInstitution}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 hover:bg-destructive/10 self-start" /* Added self-start to keep delete button aligned near top */
                  onClick={() => {
                    removeEducation(index);
                    if (editingEduIndex === index) setEditingEduIndex(-1);
                  }}
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
                    onValueChange={(val) => setValue(`education.${index}.degree`, val, { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-9 text-xs bg-white">
                      <SelectValue placeholder="Degree" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEGREE_TYPES.map((degree) => (
                        <SelectItem 
                          key={degree.value} 
                          value={degree.value} 
                          className="text-xs"
                        >
                          {degree.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.education?.[index]?.degree && (
                    <p className="text-[10px] font-medium text-destructive mt-0.5">
                      {errors.education[index]?.degree?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Popover
                    open={openDropdown === `subject-${index}`}
                    onOpenChange={(open) => {
                      setOpenDropdown(open ? `subject-${index}` : null);
                      if (!open) setSearchQuery("");
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal text-xs h-9 bg-white text-left"
                      >
                        <span className="truncate">{selectedSubject || "Search and select subject..."}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput 
                          placeholder="Search subject..." 
                          className="text-xs" 
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          {(() => {
                            const filtered = ALLOWED_SUBJECTS.filter((subject) =>
                              subject.toLowerCase().includes(searchQuery.toLowerCase())
                            ).slice(0, 15);

                            if (filtered.length === 0) {
                              return <CommandEmpty>No subject found.</CommandEmpty>;
                            }

                            return (
                              <CommandGroup className="max-h-[200px] overflow-y-auto">
                                {filtered.map((subject) => (
                                  <CommandItem
                                    key={subject}
                                    value={subject}
                                    onSelect={() => {
                                      setValue(`education.${index}.subject`, subject, { shouldValidate: true });
                                      setOpenDropdown(null);
                                      setSearchQuery("");
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
                            );
                          })()}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.education?.[index]?.subject && (
                    <p className="text-[10px] font-medium text-destructive mt-0.5">
                      {errors.education[index]?.subject?.message}
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
                        <span className="truncate">{selectedInstitution || "Search and select institution..."}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput 
                          placeholder="Type to search global universities..." 
                          className="text-xs"
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          {isLoading && (
                            <div className="flex items-center justify-center py-6 text-xs text-muted-foreground gap-2">
                              <Loader2 className="h-3 w-3 animate-spin" /> Fetching universities...
                            </div>
                          )}
                          {!isLoading && institutions.length === 0 && searchQuery.trim().length > 0 && (
                            <CommandEmpty>No universities found.</CommandEmpty>
                          )}
                          {!isLoading && searchQuery.trim().length === 0 && (
                            <div className="p-4 text-xs text-muted-foreground text-center">Start typing to search...</div>
                          )}
                          <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {institutions.map((inst) => (
                              <CommandItem
                                key={inst}
                                value={inst}
                                onSelect={() => {
                                  setValue(`education.${index}.institution`, inst, { shouldValidate: true });
                                  setOpenDropdown(null);
                                }}
                                className="text-xs"
                              >
                                <Check className={`mr-2 h-3.5 w-3.5 ${selectedInstitution === inst ? "opacity-100" : "opacity-0"}`} />
                                {inst}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.education?.[index]?.institution && (
                    <p className="text-[10px] font-medium text-destructive mt-0.5">
                      {errors.education[index]?.institution?.message}
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
                  onClick={() => {
                    const currentValues = watch(`education.${index}`);
                    updateEducation(index, { ...currentValues });
                    handleCommitEducation(index);
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-destructive/10 text-destructive"
                  onClick={() => {
                    removeEducation(index);
                    if (editingEduIndex === index) setEditingEduIndex(-1);
                  }}
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
      {errors.education?.root && (
        <span className="text-xs text-destructive mt-1 block">{errors.education.root.message}</span>
      )}
    </Field>
  );
};