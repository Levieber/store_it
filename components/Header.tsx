"use client";

import { FileUploader } from "@/components/FileUploader";
import { Search } from "@/components/Search";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />

        <Button className="sign-out-button" onClick={() => {}}>
          <Image
            src="/assets/icons/logout.svg"
            alt="Logout"
            width={24}
            height={24}
            className="w-6"
          />
        </Button>
      </div>
    </header>
  );
}
