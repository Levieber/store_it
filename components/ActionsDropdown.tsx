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
import { FileDocument } from "@/lib/actions/files.actions";
import { ActionType } from "@/types";
import { useState } from "react";
import Image from "next/image";
import { constructDownloadUrl } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ActionsDropdownProps {
  file: FileDocument;
}

export function ActionsDropdown({ file }: ActionsDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [fileName, setFileName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);

  const cancelAction = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setFileName(file.name);
  };

  const handleAction = async () => {
    setIsLoading(true);
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

            {["rename", "delete", "share"].includes(action.value) && (
              <DialogFooter className="flex flex-col gap-3 md:flex-row">
                <Button
                  disabled={isLoading}
                  onClick={cancelAction}
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
