import React from "react";
import { useFormContext } from "react-hook-form";
import { MapPin, Check, Loader2, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Field, FieldLabel } from "@/components/ui/field";
import { ProfileFormValues } from "../EditProfileButton";

const getCountryFlag = (countryCode?: string) => {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

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
  
  const isOpen = openDropdown === "location";

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
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {isOpen ? (
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
            </div>

            <input
              type="text"
              className="w-full flex h-9 rounded-md border border-input bg-white pl-9 pr-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              autoComplete="one-time-code"
              placeholder={selectedLocation || "Search city or town..."}
              value={locationQuery}
              onChange={(e) => {
                if (!isOpen) setOpenDropdown("location");
                setLocationQuery(e.target.value);
              }}
              onFocus={() => {
                if (!isOpen) setOpenDropdown("location");
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen) setOpenDropdown("location");
              }}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent 
          className="w-[340px] p-0" 
          align="start" 
          onOpenAutoFocus={(e) => e.preventDefault()} 
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