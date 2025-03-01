import { Header } from "@/components/Header";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Sidebar } from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentUser;

  try {
    currentUser = await getCurrentUser();
  } catch {
    redirect("/sign-in");
  }

  if (!currentUser) redirect("/sign-in");

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} ownerId={currentUser.$id} />
        <Header ownerId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
