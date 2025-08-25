import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarDemo } from "@/components/ui/demo";

export default async function TaskPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      <SidebarDemo />
    </div>
  );
}