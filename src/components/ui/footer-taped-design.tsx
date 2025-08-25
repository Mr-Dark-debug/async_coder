"use client";

import { cn } from "@/lib/utils";
import Link from 'next/link'
import { Linkedin, Twitter, Github } from 'lucide-react';

const tape = <svg xmlns="http://www.w3.org/2000/svg" width="95" height="80" viewBox="0 0 95 80" fill="none">
<path d="M1 45L70.282 5L88.282 36.1769L19 76.1769L1 45Z" fill="#222222"/>
</svg>

export const Component = () => {
  const currentYear = new Date().getFullYear();

  return (
   <footer className="my-8 px-4 max-w-5xl text-gray-900 dark:text-white mx-auto">
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-200 dark:border-gray-700">
        <div className="hidden md:block absolute -top-4 -left-8 w-[80px] h-[36px] scale-75">
          {tape}
        </div>
        <div className="hidden md:block absolute -top-4 -right-8 rotate-90 w-[80px] h-[36px] scale-75">
          {tape}
        </div>
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-10 px-2 md:px-8 flex-1">
          <div className='flex flex-col items-start gap-2'>
            <Link
              href="/"
              className="flex flex-row gap-3 items-center justify-start text-2xl font-bold text-gray-900 dark:text-white"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Async Coder
              </span>
            </Link>
            <p className='text-gray-600 dark:text-gray-300 font-medium text-base w-full md:w-4/5'>
              The last AI assistant you'll ever need for coding. Open-source, autonomous development with full control.
            </p>
          </div>

          <div className='flex flex-col md:mx-4 md:flex-row gap-2 md:gap-20 items-start md:items-start'>
            <div className='flex flex-col gap-1 md:gap-4'>
              <h4 className='uppercase font-bold text-md text-gray-500 dark:text-gray-400 font-semibold'>Product</h4>
              <div className="flex flex-wrap md:flex-col gap-2 text-sm text-gray-700 dark:text-gray-300 items-start ">
                <Link className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="#features">Features</Link>
                <Link className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="#ai-backends">AI Backends</Link>
                <Link className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="#quick-start">Quick Start</Link>
                <Link className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="#roadmap">Roadmap</Link>
                <a className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="https://github.com/your-org/async-coder">Documentation</a>
              </div>
            </div>

            <div className='hidden md:flex flex-col gap-1 md:gap-4'>
              <h4 className='uppercase whitespace-nowrap font-bold text-md text-gray-500 dark:text-gray-400 font-semibold'>Community</h4>
              <div className="flex gap-2 flex-wrap md:flex-col text-sm text-gray-700 dark:text-gray-300 items-start ">
                <a className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="https://github.com/your-org/async-coder/discussions">Discussions</a>
                <a className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="https://github.com/your-org/async-coder/issues">Issues</a>
                <a className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="https://discord.gg/asynccoder">Discord</a>
                <a className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="https://twitter.com/asynccoder">Twitter</a>
              </div>
            </div>
            
            <div className='hidden md:flex flex-col gap-1 md:gap-4'>
              <h4 className='uppercase whitespace-nowrap font-bold text-md text-gray-500 dark:text-gray-400 font-semibold'>Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300 items-start ">
                <a className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="https://github.com/your-org/async-coder/blob/main/LICENSE">Apache 2.0</a>
                <Link className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="/privacy">Privacy Policy</Link>
                <Link className='text-gray-600 dark:text-gray-300 whitespace-nowrap font-medium hover:text-blue-600 dark:hover:text-blue-400' href="/terms">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="my-3 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-start sm:items-center">
          <p className="whitespace-nowrap">
            ©{currentYear} Async Coder. All rights reserved.
          </p>
          <div className="flex flex-row gap-4">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Open Source</span>
            </span>
            <span className="flex items-center space-x-2">
              <span>🚀</span>
              <span>v0.1.0-alpha</span>
            </span>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <a
            href="https://github.com/your-org/async-coder"
            target="_blank"
            rel="nofollow noopener"
            aria-label="GitHub"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/company/async-coder"
            target="_blank"
            rel="nofollow noopener"
            aria-label="LinkedIn"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/asynccoder"
            target="_blank"
            rel="nofollow noopener"
            aria-label="Twitter"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};