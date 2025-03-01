"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileDocument, getFiles } from "@/lib/actions/files.actions";
import { Thumbnail } from "@/components/thumbnail";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { useDebounce } from "use-debounce";
import Image from "next/image";

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileDocument[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setIsOpen(false);
        return router.push(pathname.replace(searchParams.toString(), ""));
      }

      const files = await getFiles({
        searchText: debouncedQuery,
      });

      setResults(files);
      setIsOpen(true);
    };

    fetchFiles();
  }, [pathname, debouncedQuery, router, searchParams]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: FileDocument) => {
    setIsOpen(false);
    setResults([]);
    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${file.name}`,
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />

        {isOpen && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
