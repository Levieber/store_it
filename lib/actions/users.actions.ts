"use server";

import { avatarPlaceholderUrl } from "@/constants";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { handleError, parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

interface CreateAccountProps {
  fullName: string;
  email: string;
}

export const createAccount = async ({
  fullName,
  email,
}: CreateAccountProps) => {
  const userAlreadyExists = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error("Failed to send an OTP");

  if (!userAlreadyExists) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        accountId,
        avatar: avatarPlaceholderUrl,
      },
    );
  }

  return parseStringify({ accountId });
};

interface VerifySecretProps {
  accountId: string;
  otp: string;
}

export const verifySecret = async ({ accountId, otp }: VerifySecretProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, otp);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export interface User {
  $id: string;
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
}

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient();

  const result = await account.get();

  const user = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("accountId", result.$id)],
  );

  if (user.total <= 0) return null;

  return parseStringify<User>(user.documents[0] as unknown as User);
};

export const signOutUser = async () => {
  try {
    const { account } = await createSessionClient();

    await account.deleteSession("current");

    (await cookies()).delete("appwrite-session");

    redirect("/sign-in");
  } catch (error) {
    handleError(error, "Failed to sign out the user");
  }
};

interface SignInUserProps {
  email: string;
}

export const signInUser = async ({ email }: SignInUserProps) => {
  try {
    const userAlreadyExists = await getUserByEmail(email);

    if (userAlreadyExists) {
      await sendEmailOTP({ email });
      return parseStringify<{ accountId: string }>({
        accountId: userAlreadyExists.accountId,
      });
    }

    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in the user");
    return parseStringify({ accountId: null, error: "Failed to sign in" });
  }
};
