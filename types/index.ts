import { actionsDropdownItems } from "@/constants";

export type FileType = "document" | "image" | "video" | "audio" | "other";

export interface ActionType {
  label: string;
  icon: string;
  value: (typeof actionsDropdownItems)[number]["value"];
}

export type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export type SortType = `${string}-${string}`;
