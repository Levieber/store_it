import { FileDocument } from "@/lib/actions/files.actions";

interface CardProps {
  file: FileDocument;
}

export function Card({ file }: CardProps) {
  return <div>{file.name}</div>;
}
