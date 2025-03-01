"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { actionsDropdownItems } from "@/constants";
import {
  deleteFile,
  FileDocument,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/files.actions";
import { ActionType } from "@/types";
import { useState } from "react";
import Image from "next/image";
import { constructDownloadUrl } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/ActionsModalContent";

interface ActionsDropdownProps {
  file: FileDocument;
}

export function ActionsDropdown({ file }: ActionsDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [fileName, setFileName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setFileName(file.name);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    if (success) {
      setEmails(updatedEmails);
    }

    closeAllModals();
  };

  const handleAction = async () => {
    if (!action) return;

    setIsLoading(true);

    let result = null;

    const actions = {
      rename: async () =>
        await renameFile({
          fileId: file.$id,
          name: fileName,
          extension: file.extension,
          path,
        }),
      share: async () =>
        await updateFileUsers({ fileId: file.$id, emails, path }),
      delete: async () =>
        await deleteFile({
          fileId: file.$id,
          bucketFileId: file.bucketFileId,
          path,
        }),
    };

    if (!actions[action.value as keyof typeof actions]) return;

    result = await actions[action.value as keyof typeof actions]();

    if (result) closeAllModals();

    setIsLoading(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="Dropdown menu"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                if (
                  ["rename", "share", "delete", "details"].includes(
                    actionItem.value,
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {action && (
        <DialogContent className="shad-dialog button">
          <DialogHeader className="flex flex-col gap-3">
            <DialogTitle className="text-center text-light-100">
              {action.label}
            </DialogTitle>
            {action.value === "rename" && (
              <Input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            )}

            {action.value === "details" && <FileDetails file={file} />}

            {action.value === "share" && (
              <ShareInput
                file={file}
                onInputChange={setEmails}
                onRemove={handleRemoveUser}
              />
            )}

            {action.value === "delete" && (
              <p className="delete-confirmation">
                Are you sure you want to delete{" "}
                <span className="delete-file-name">{file.name}</span>?
              </p>
            )}

            {["rename", "delete", "share"].includes(action.value) && (
              <DialogFooter className="flex flex-col gap-3 md:flex-row">
                <Button
                  disabled={isLoading}
                  onClick={closeAllModals}
                  className="modal-cancel-button"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={handleAction}
                  className="modal-submit-button"
                >
                  <p className="capitalize">{action.value}</p>
                  {isLoading && (
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="Loader"
                      width={24}
                      height={24}
                      className="animate-spin"
                    />
                  )}
                </Button>
              </DialogFooter>
            )}
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}
