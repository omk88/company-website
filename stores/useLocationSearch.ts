import { useState, useEffect } from "react";

export interface LocationOption {
  label: string;
  countryCode?: string;
}

export function useLocationSearch(query: string) {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 3) {
      setOptions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            trimmed
          )}&featuretype=settlement&addressdetails=1&limit=6`
        );
        const data = await res.json();

        const formattedCities: LocationOption[] = data.map((item: any) => {
          const city =
            item.address.city ||
            item.address.town ||
            item.address.village ||
            item.display_name.split(",")[0];
          const state = item.address.state;
          const country = item.address.country;
          const label = state ? `${city}, ${state}, ${country}` : `${city}, ${country}`;

          return { label, countryCode: item.address?.country_code };
        });

        const uniqueCities = formattedCities.filter(
          (value, index, self) => self.findIndex((t) => t.label === value.label) === index
        );

        setOptions(uniqueCities);
      } catch (err) {
        console.error("Error collecting global geocode data:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return { options, isLoading };
}