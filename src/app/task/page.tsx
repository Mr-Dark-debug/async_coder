import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SidebarDemo } from "@/components/ui/demo";

const isClerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default async function TaskPage() {
  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-900">
        <div className="w-full max-w-lg text-center space-y-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-10 shadow-lg border border-white/40 dark:border-neutral-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Authentication setup required
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The task workspace needs Clerk credentials to protect access. Add your publishable and secret keys to continue, or explore the public product tour instead.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 text-white font-medium shadow-sm hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Return home
            </Link>
            <Link
              href="/#quick-start"
              className="inline-flex items-center justify-center rounded-lg border border-blue-200 px-5 py-2 text-blue-700 font-medium hover:bg-blue-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              View quick start
            </Link>
          </div>
        </div>
      </div>
    );
  }

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