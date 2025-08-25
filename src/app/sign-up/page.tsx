import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
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