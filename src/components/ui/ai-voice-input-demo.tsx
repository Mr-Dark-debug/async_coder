"use client";

import { AIVoiceInput } from "@/components/ui/ai-voice-input";

export function AIVoiceInputDemo() {
  const handleStop = (duration: number) => {
    console.log('Recording duration:', duration);
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

