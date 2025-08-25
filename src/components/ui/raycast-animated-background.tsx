"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const Component = () => {
  const { width, height } = useWindowSize();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !width || !height) {
    return (
      <div className={cn("absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse")} />
    );
  }

  return (
    <div className={cn("absolute inset-0 w-full h-full blur-sm")}>
      <UnicornScene
        production={true}
        projectId="cbmTT38A0CcuYxeiyj5H"
        width={width}
        height={height}
      />
    </div>
  );
};