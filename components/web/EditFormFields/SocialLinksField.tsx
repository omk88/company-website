import React from "react";
import { useFormContext } from "react-hook-form";
import { Plus, Check, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { ProfileFormValues } from "../EditProfileButton";

interface SocialFieldItem {
  id: string;
  platform: string;
  url: string;
  isPrimary?: boolean;
}

interface SocialLinksFieldsProps {
  fields: SocialFieldItem[];
  remove: (index: number) => void;
  editingSocialIndex: number;
  setEditingSocialIndex: (index: number) => void;
  handleStartAddingSocial: () => void;
  handleCommitSocial: (index: number) => void;
  ICON_MAP: Record<string, React.ComponentType<{ className?: string }>>;
  AVAILABLE_PLATFORMS: string[];
  formatPlatformName: (platform: string) => string;
}

export const SocialLinksFields: React.FC<SocialLinksFieldsProps> = ({
  fields,
  remove,
  editingSocialIndex,
  setEditingSocialIndex,
  handleStartAddingSocial,
  handleCommitSocial,
  ICON_MAP,
  AVAILABLE_PLATFORMS,
  formatPlatformName,
}) => {
  const form = useFormContext<ProfileFormValues>();

  const handleSetPrimary = (selectedIndex: number) => {
    fields.forEach((_, idx) => {
      form.setValue(`socials.${idx}.isPrimary`, idx === selectedIndex, {
        shouldDirty: true,
      });
    });
  };

  return (
    <Field>
      <div className="flex items-center justify-between mb-1">
        <FieldLabel>Social Links</FieldLabel>
        {fields.length < Math.min(7, AVAILABLE_PLATFORMS.length) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer h-7 px-2 text-xs"
            onClick={handleStartAddingSocial}
            disabled={editingSocialIndex !== -1}
          >
            <Plus className="mr-1 h-3 w-3" /> Add 
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => {
          const isCommitted = index !== editingSocialIndex;
          const SavedIcon = ICON_MAP[field.platform];
          const rowError = form.formState.errors.socials?.[index]?.url;
          const activePlatform = form.watch(`socials.${index}.platform`);
          const isPrimary = form.watch(`socials.${index}.isPrimary`);

          if (isCommitted) {
            return (
              <div 
                key={field.id} 
                className={`flex items-center justify-between p-2.5 border rounded-md transition-colors ${
                  isPrimary ? "bg-amber-500/10 border-amber-400/50" : "bg-secondary/20"
                }`}
              >
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
                  {isPrimary && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium px-1.5 py-0.5 rounded shrink-0">
                      Primary
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title={isPrimary ? "Primary Link" : "Set as Primary"}
                    className={`h-8 w-8 cursor-pointer ${
                      isPrimary ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500"
                    }`}
                    onClick={() => handleSetPrimary(index)}
                  >
                    <Star className={`h-4 w-4 ${isPrimary ? "fill-amber-500" : ""}`} />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer h-8 w-8 hover:bg-destructive/10"
                    onClick={() => {
                      remove(index);
                      if (editingSocialIndex === index) setEditingSocialIndex(-1);
                      if (isPrimary && fields.length > 1) {
                        const newPrimaryIndex = index === 0 ? 1 : 0;
                        handleSetPrimary(newPrimaryIndex);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div key={field.id} className="flex items-start gap-2 p-3 border rounded-md w-full flex-col space-y-2">
              <div className="flex items-start gap-2 w-full">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="w-fit min-w-[140px]">
                    <Select
                      value={activePlatform}
                      onValueChange={(val) => form.setValue(`socials.${index}.platform`, val)}
                    >
                      <SelectTrigger className="cursor-pointer h-9 text-xs bg-white">
                        <div className="flex items-center gap-2">
                          {ICON_MAP[activePlatform] && (() => {
                            const CurrentIcon = ICON_MAP[activePlatform];
                            return <CurrentIcon className="h-3.5 w-3.5 opacity-70" />;
                          })()}
                          <span>{formatPlatformName(activePlatform) || "Select platform"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent position="popper" className="w-[180px]">
                        {AVAILABLE_PLATFORMS.map((p) => {
                          const isPlatformAlreadyUsed = fields.some(
                            (f, idx) => f.platform === p && idx !== index
                          );

                          if (isPlatformAlreadyUsed) return null;

                          const DropdownIcon = ICON_MAP[p];
                          return (
                            <SelectItem key={p} value={p} className="cursor-pointer text-xs">
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
                    className="cursor-pointer h-9 w-9 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => {
                      handleCommitSocial(index);
                      if (fields.length === 1 || !fields.some((_, i) => form.getValues(`socials.${i}.isPrimary`))) {
                        handleSetPrimary(index);
                      }
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer h-9 w-9 hover:bg-destructive/10 text-destructive"
                    onClick={() => {
                      remove(index);
                      setEditingSocialIndex(-1);
                    }}
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
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No social links added yet.</p>
        )}
      </div>
    </Field>
  );
};