import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronsUpDown, Check, Plus, X } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldLabel } from "@/components/ui/field";
import { ProfileFormValues } from "../EditProfileButton";

interface SkillsFieldsProps {
  comboboxOpen: boolean;
  setComboboxOpen: (open: boolean) => void;
  ALLOWED_SKILLS: string[];
}

export const SkillsFields: React.FC<SkillsFieldsProps> = ({
  comboboxOpen,
  setComboboxOpen,
  ALLOWED_SKILLS,
}) => {
  const { watch, setValue, formState: { errors } } = useFormContext<ProfileFormValues>();

  const watchedSkills: string[] = watch("skills") || [];
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!comboboxOpen) {
      setSearchQuery("");
    }
  }, [comboboxOpen]);

  const handleToggleSkill = (skill: string) => {
    const isSelected = watchedSkills.includes(skill);
    let updatedSkills: string[];

    if (isSelected) {
      updatedSkills = watchedSkills.filter((s) => s !== skill);
    } else {
      if (watchedSkills.length >= 10) return;
      updatedSkills = [...watchedSkills, skill];
    }

    setValue("skills", updatedSkills, { shouldValidate: true });
  };

  const handleClearAllSkills = () => {
    setValue("skills", [], { shouldValidate: true });
  };

  const filteredSkills = ALLOWED_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20);

  return (
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
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search skills (e.g. Next.js, Rust)..." 
              className="text-xs" 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {filteredSkills.length === 0 && (
                <CommandEmpty>No tech skill found.</CommandEmpty>
              )}
              
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {filteredSkills.map((skill) => {
                  const isSelected = watchedSkills.includes(skill);
                  return (
                    <CommandItem
                      key={skill}
                      value={skill}
                      onSelect={() => handleToggleSkill(skill)}
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

      <div className="relative w-full mt-2">
        <div className="min-h-[110px] max-h-[140px] overflow-y-auto border border-dashed rounded-md p-2 pr-9 bg-muted/10 flex flex-wrap gap-1.5 content-start transition-all">
          {watchedSkills.map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className="text-[11px] px-2 py-0.5 flex items-center gap-1 bg-secondary/50 h-6 select-none shrink-0"
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
            <p className="text-xs text-muted-foreground italic self-center pl-1">
              No skills selected yet.
            </p>
          )}
        </div>

        {watchedSkills.length > 0 && (
          <button 
            onClick={handleClearAllSkills} 
            type="button" 
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
          >
            <X className="h-3.5 w-3.5 stroke-[2]" />
          </button>
        )}
      </div>
      
      {errors.skills && (
        <span className="text-xs text-destructive mt-1 block">
          {errors.skills.message}
        </span>
      )}
    </Field>
  );
};