"use server";

import { getCurrentUser, User } from "@/lib/actions/users.actions";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from "@/lib/utils";
import { FileType } from "@/types";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

export const uploadFile = async ({
  file,
  accountId,
  ownerId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );

    const { type, extension } = getFileType(bucketFile.name);

    const fileDocument = {
      type,
      extension,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to save file");
      });

    revalidatePath(path);

    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

export const createQueries = async (currentUser: User) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  return queries;
};

export interface FileDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  url: string;
  type: FileType;
  bucketFileId: string;
  accountId: string;
  owner: User;
  extension: string;
  size: number;
  users: string[];
}

export const getFiles = async () => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const queries = await createQueries(currentUser);

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries,
    );

    return parseStringify<FileDocument[]>(
      files.documents as unknown as FileDocument[],
    );
  } catch (error) {
    handleError(error, "Failed to retrieve files");
    return [];
  }
};

interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const newName = `${name}.${extension}`;

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      },
    );

    revalidatePath(path);

    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename the file");
  }
};

interface ShareFileProps {
  fileId: string;
  emails: string[];
  path: string;
}

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: ShareFileProps) => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      },
    );

    revalidatePath(path);

    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to share the file");
  }
};
