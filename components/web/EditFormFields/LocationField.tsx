import React from "react";
import { useFormContext } from "react-hook-form";
import { MapPin, Check, Loader2, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldLabel } from "@/components/ui/field";
import { ProfileFormValues } from "../EditProfileButton";

interface LocationOption {
  label: string;
  countryCode?: string;
}

interface LocationFieldProps {
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  locationQuery: string;
  setLocationQuery: (query: string) => void;
  locationOptions: LocationOption[];
  isLoadingLocation: boolean;
}

export const LocationField: React.FC<LocationFieldProps> = ({
  openDropdown,
  setOpenDropdown,
  locationQuery,
  setLocationQuery,
  locationOptions,
  isLoadingLocation,
}) => {
  const { watch, setValue } = useFormContext<ProfileFormValues>();
  const selectedLocation = watch("location");
  const selectedCountryCode = watch("locationCountryCode");
  
  const isOpen = openDropdown === "location";
  const hasValue = !!selectedLocation || !!locationQuery;

  const showFlag = selectedCountryCode && !isOpen;

  const inputLeftPadding = showFlag ? "pl-15" : "pl-9";

  return (
    <Field>
      <FieldLabel>Location</FieldLabel>
      <Popover 
        open={isOpen} 
        onOpenChange={(open) => {
          setOpenDropdown(open ? "location" : null);
          if (!open) setLocationQuery(""); 
        }}
      >
        <PopoverAnchor asChild>
          <div className="relative w-full cursor-text">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
              {isOpen ? (
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
            </div>

            {showFlag && (
              <div className="absolute left-9 top-1/2 -translate-y-[56%] flex items-center pointer-events-none z-10">
                <img
                  src={`https://flagcdn.com/${selectedCountryCode.toLowerCase()}.svg`}
                  width="18"
                  alt=""
                  className="shrink-0 object-contain aspect-[3/2]" 
                />
              </div>
            )}

            <input
              type="text"
              className={`w-full flex h-9 rounded-md border border-input bg-white ${inputLeftPadding} pr-9 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              autoComplete="one-time-code"
              placeholder="Search city or town..."
              
              value={isOpen ? locationQuery : (selectedLocation || "")}
              
              onChange={(e) => {
                if (!isOpen) setOpenDropdown("location");
                setLocationQuery(e.target.value);
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen) {
                  setOpenDropdown("location");
                  if (selectedLocation) setLocationQuery(selectedLocation);
                }
              }}
            />

            {hasValue && (
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  setValue("location", "", { shouldValidate: true }); 
                  setValue("locationCountryCode", "", { shouldValidate: true }); 
                  setLocationQuery(""); 
                  setOpenDropdown(null); 
                }} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-sm hover:bg-muted"
              >
                <X className="h-3.5 w-3.5 stroke-[2]" />
              </button>
            )}
          </div>
        </PopoverAnchor>

        <PopoverContent 
          className="w-[340px] p-0" 
          align="start" 
          onOpenAutoFocus={(e) => e.preventDefault()} 
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("input") || target.closest(".cursor-text")) {
              e.preventDefault();
            }
          }}
        >
          <Command shouldFilter={false}>
            <CommandList>
              {isLoadingLocation && (
                <div className="p-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching results...
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
                {locationOptions.map((option) => (
                  <CommandItem
                    key={option.label}
                    value={option.label}
                    onSelect={() => {
                      setValue("location", option.label, { shouldValidate: true });
                      setValue("locationCountryCode", option.countryCode || "", { shouldValidate: true });
                      setOpenDropdown(null);
                      setLocationQuery("");
                    }}
                    className="text-xs cursor-pointer flex items-center justify-between py-2 px-3 data-[selected=true]:bg-accent"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden text-ellipsis whitespace-nowrap">
                      {option.countryCode ? (
                        <img
                          src={`https://flagcdn.com/${option.countryCode.toLowerCase()}.svg`}
                          width="18"
                          alt=""
                          className="shrink-0 object-contain aspect-[3/2]" 
                        />
                      ) : (
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      )}
                      
                      <span className="truncate">{option.label}</span>
                    </div>
                    {selectedLocation === option.label && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-foreground" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
};