import { cn, formatDateTime } from "@/lib/utils";

interface FormattedDateTimeProps {
  date: string;
  className?: string;
}

export function FormattedDateTime({ date, className }: FormattedDateTimeProps) {
  return (
    <time dateTime={date} className={cn("body-1 text-light-200", className)}>
      {formatDateTime(date)}
    </time>
  );
}
