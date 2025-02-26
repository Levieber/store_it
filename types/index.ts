import { actionsDropdownItems } from "@/constants";

export type FileType = "document" | "image" | "video" | "audio" | "other";

export interface ActionType {
  label: string;
  icon: string;
  value: (typeof actionsDropdownItems)[number]["value"];
}
