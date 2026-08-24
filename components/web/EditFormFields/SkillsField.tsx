import React, { useState, useEffect, useMemo, useDeferredValue } from "react";
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
  const deferredQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    if (!comboboxOpen) {
      setSearchQuery("");
    }
  }, [comboboxOpen]);

  const watchedSkillsSet = useMemo(() => new Set(watchedSkills), [watchedSkills]);

  const filteredSkills = useMemo(() => {
    if (!deferredQuery.trim()) return ALLOWED_SKILLS.slice(0, 20);

    const query = deferredQuery.toLowerCase();
    const result: string[] = [];

    for (let i = 0; i < ALLOWED_SKILLS.length; i++) {
      if (ALLOWED_SKILLS[i].toLowerCase().includes(query)) {
        result.push(ALLOWED_SKILLS[i]);
        if (result.length === 20) break;
      }
    }

    return result;
  }, [ALLOWED_SKILLS, deferredQuery]);

  const handleToggleSkill = (skill: string) => {
    const isSelected = watchedSkillsSet.has(skill);
    let updatedSkills: string[];

    if (isSelected) {
      updatedSkills = watchedSkills.filter((s) => s !== skill);
    } else {
      if (watchedSkills.length >= 6) return;
      updatedSkills = [...watchedSkills, skill];
    }

    setValue("skills", updatedSkills, { shouldValidate: true });
  };

  const handleClearAllSkills = () => {
    setValue("skills", [], { shouldValidate: true });
  };

  return (
    <Field>
      <div className="flex items-center justify-between mb-1">
        <FieldLabel>Skills ({watchedSkills.length}/6)</FieldLabel>
      </div>
      
      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={comboboxOpen}
            className="cursor-pointer w-full justify-between font-normal text-zinc-600 dark:text-zinc-400 h-9 text-sm"
            disabled={watchedSkills.length >= 6}
          >
            {watchedSkills.length >= 6 
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
              showClear={Boolean(searchQuery)}
              onClear={() => setSearchQuery("")}
            />
            
            <CommandList>
              {filteredSkills.length === 0 && (
                <CommandEmpty>No skills found.</CommandEmpty>
              )}
              
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {filteredSkills.map((skill) => {
                  const isSelected = watchedSkillsSet.has(skill);
                  return (
                    <CommandItem
                      key={skill}
                      value={skill}
                      onSelect={() => handleToggleSkill(skill)}
                      className="cursor-pointer text-xs"
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
        <div className="min-h-[135px] max-h-[165px] overflow-y-auto border rounded-md p-2 pr-9 flex flex-wrap gap-1.5 content-start transition-all">
          {watchedSkills.map((skill) => (
            <Badge 
              key={skill} 
              variant="outline" 
              className="font-mono text-[10px] px-1.5 py-0.5 whitespace-nowrap border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleToggleSkill(skill)}
                className="cursor-pointer hover:bg-muted rounded-full p-0.5 transition-colors"
              >
                <Plus className="h-3 w-3 rotate-45 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          
          {watchedSkills.length === 0 && (
            <p className="text-xs text-muted-foreground self-center pl-1">
              No skills added yet.
            </p>
          )}
        </div>

        {watchedSkills.length > 0 && (
          <button 
            onClick={handleClearAllSkills} 
            type="button" 
            className="cursor-pointer absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
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