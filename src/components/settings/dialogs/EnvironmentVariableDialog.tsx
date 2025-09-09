"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';

interface EnvironmentVariableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  type: 'environment' | 'secret';
}

interface Variable {
  id: string;
  key: string;
  value: string;
}

export function EnvironmentVariableDialog({ 
  open, 
  onOpenChange,
  title,
  type
}: EnvironmentVariableDialogProps) {
  const [variables, setVariables] = useState<Variable[]>([
    { id: '1', key: '', value: '' }
  ]);

  const addVariable = () => {
    const newId = Date.now().toString();
    setVariables(prev => [...prev, { id: newId, key: '', value: '' }]);
  };

  const removeVariable = (id: string) => {
    if (variables.length > 1) {
      setVariables(prev => prev.filter(v => v.id !== id));
    }
  };

  const updateVariable = (id: string, field: 'key' | 'value', value: string) => {
    setVariables(prev => prev.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700 text-white max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg">
              {title}
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {variables.map((variable, index) => (
            <div key={variable.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Key"
                    value={variable.key}
                    onChange={(e) => updateVariable(variable.id, 'key', e.target.value)}
                    className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type={type === 'secret' ? 'password' : 'text'}
                    placeholder="Value"
                    value={variable.value}
                    onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                    className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariable(variable.id)}
                  disabled={variables.length === 1}
                  className="text-neutral-400 hover:text-white hover:bg-neutral-700 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            onClick={addVariable}
            variant="outline"
            className="bg-transparent border-neutral-600 text-white hover:bg-neutral-700 w-full"
          >
            Add {type === 'environment' ? 'Environment Variable' : 'Secret'}
          </Button>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-neutral-600 text-white hover:bg-neutral-700"
          >
            Cancel
          </Button>
          <Button
            className="bg-white text-black hover:bg-neutral-100"
            onClick={() => onOpenChange(false)}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}