import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-900">
        <div className="w-full max-w-md text-center space-y-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/40 dark:border-neutral-800">
          <div className="inline-flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">AC</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Async Coder
            </h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Authentication is disabled
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Add your Clerk publishable key to enable account creation. Until then, feel free to continue exploring the experience.
            </p>
          </div>
          <Link
            href="/#features"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 text-white font-medium shadow-sm hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            Discover features
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">AC</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Async Coder
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Get started today
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account to start coding with AI assistance
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignUp 
            path="/sign-up" 
            routing="path"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}