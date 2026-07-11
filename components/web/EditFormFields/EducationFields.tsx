import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { GraduationCap, Trash2, Plus, ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldLabel } from "@/components/ui/field";
import { ProfileFormValues } from "../EditProfileButton";

interface EducationFieldsProps {
  editingEduIndex: number;
  setEditingEduIndex: (index: number) => void;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  handleStartAddingEducation: () => void;
  handleCommitEducation: (index: number) => void;
  ALLOWED_SUBJECTS: string[];
  ALLOWED_INSTITUTIONS: string[];
}

export const EducationFields: React.FC<EducationFieldsProps> = ({
  editingEduIndex,
  setEditingEduIndex,
  openDropdown,
  setOpenDropdown,
  handleStartAddingEducation,
  handleCommitEducation,
  ALLOWED_SUBJECTS,
  ALLOWED_INSTITUTIONS,
}) => {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ProfileFormValues>();

  const { fields: educationFields, remove: removeEducation, append: appendEducation, update: updateEducation } = useFieldArray({
    control,
    name: "education",
  });

  

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
                handleStartAddingEducation(); 
                
                appendEducation({
                    degree: "",
                    subject: "",
                    institution: "",
                });
            }}
        >
            <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
        )}
      </div>

      <div className="space-y-3">
        {educationFields.map((field, index) => {
          const isCommitted = index !== editingEduIndex;
          const selectedDegree = watch(`education.${index}.degree`);
          const selectedSubject = watch(`education.${index}.subject`);
          const selectedInstitution = watch(`education.${index}.institution`);

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
                      <SelectItem value="bachelors" className="text-xs">Bachelors</SelectItem>
                      <SelectItem value="masters" className="text-xs">Masters</SelectItem>
                      <SelectItem value="phd" className="text-xs">PhD</SelectItem>
                      <SelectItem value="associates" className="text-xs">Associates</SelectItem>
                      <SelectItem value="diploma" className="text-xs">Diploma</SelectItem>
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
                                  setValue(`education.${index}.subject`, subject, { shouldValidate: true });
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
                                  setValue(`education.${index}.institution`, inst, { shouldValidate: true });
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
                    
                    updateEducation(index, {
                        ...currentValues,
                    });

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