import { Card } from "@/components/Card";
import { Sort } from "@/components/Sort";
import { getFiles } from "@/lib/actions/files.actions";
import { getFileTypesParams } from "@/lib/utils";
import { FileType, SearchParams, SortType } from "@/types";

interface TypeProps {
  params: Promise<{ type: FileType }>;
  searchParams: SearchParams;
}

export default async function Type({ params, searchParams }: TypeProps) {
  const type = (await params).type;
  const searchText = ((await searchParams).query as string) || "";
  const sort = ((await searchParams).sort as SortType) || "";

  const types = getFileTypesParams(type);

  const files = await getFiles({ types, searchText, sort });

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB{/* {totalSize} */}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>

            <Sort />
          </div>
        </div>
      </section>

      {files.length > 0 ? (
        <section className="file-list">
          {files.map((file) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
}
