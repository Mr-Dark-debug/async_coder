"use client";

import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { useState } from "react";

export function AIVoiceInputDemo() {
  const [recordings, setRecordings] = useState<{ duration: number; timestamp: Date }[]>([]);

  const handleStop = (duration: number) => {
    setRecordings(prev => [...prev.slice(-4), { duration, timestamp: new Date() }]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <AIVoiceInput 
          onStart={() => console.log('Recording started')}
          onStop={handleStop}
        />   
      </div>
    </div>
  );
}

