"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Sort() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultValue =
    sortTypes.find((sort) => sort.value === searchParams.get("sort")) ??
    sortTypes[0];

  const handleSort = (value: string) => {
    router.push(`${pathname}?sort=${value}`);
  };

  return (
    <Select onValueChange={handleSort} defaultValue={defaultValue.value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={defaultValue.label} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.value}
            value={sort.value}
            className="shad-select-item"
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
