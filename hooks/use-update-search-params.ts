import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useUpdateParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); 
    router.push(`${pathname}?${params.toString()}`);
  };

  return { searchParams, setParam };
}