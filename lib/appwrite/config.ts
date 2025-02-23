import { env } from "@/lib/environment";

export const appwriteConfig = {
  endpointUrl: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: env.NEXT_PUBLIC_APPWRITE_PROJECT,
  databaseId: env.NEXT_PUBLIC_APPWRITE_DATABASE,
  usersCollectionId: env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION,
  filesCollectionId: env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
  bucketId: env.NEXT_PUBLIC_APPWRITE_BUCKET,
};
