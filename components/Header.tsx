import { FileUploader } from "@/components/FileUploader";
import { Search } from "@/components/Search";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/actions/users.actions";
import Image from "next/image";

interface HeaderProps {
  accountId: string;
  ownerId: string;
}

export function Header({ accountId, ownerId }: HeaderProps) {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader accountId={accountId} ownerId={ownerId} />

        <form
          action={async () => {
            "use server";

            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="Logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
}
