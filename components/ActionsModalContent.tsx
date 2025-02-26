import { FormattedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/thumbnail";
import { FileDocument } from "@/lib/actions/files.actions";
import { convertFileSize, formatDateTime } from "@/lib/utils";

interface ImageThumbnailProps {
  file: FileDocument;
}

const ImageThumbnail = ({ file }: ImageThumbnailProps) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

interface FileDetailsProps {
  file: FileDocument;
}

export function FileDetails({ file }: FileDetailsProps) {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
}
