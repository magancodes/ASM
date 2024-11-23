import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, StepForward } from 'lucide-react';

interface EmulatorProps {
  onEmulate: (command: string) => void;
  output: string;
  isEmulating: boolean;
}

export default function Emulator({ onEmulate, output, isEmulating }: EmulatorProps) {
  const [traceOutput, setTraceOutput] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Parse emulator output into separate sections
  const parseOutput = (output: string) => {
    const sections = {
      registers: '',
      trace: '',
      memory: ''
    };

    if (!output) return sections;

    const lines = output.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      if (line.includes('REGISTERS:')) {
        currentSection = 'registers';
      } else if (line.includes('TRACE:')) {
        currentSection = 'trace';
      } else if (line.includes('MEMORY:')) {
        currentSection = 'memory';
      } else if (line.trim()) {
        sections[currentSection] += line + '\n';
      }
    });

    return sections;
  };

  const { registers, trace, memory } = parseOutput(output);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Emulator Controls</h3>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEmulate("-trace")}
            disabled={isEmulating}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEmulate("-step")}
            disabled={isEmulating}
          >
            <StepForward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-semibold">Registers</h4>
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <pre className="p-4 font-mono whitespace-pre">
              {registers}
            </pre>
          </ScrollArea>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Trace Log</h4>
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <pre className="p-4 font-mono whitespace-pre">
              {trace}
            </pre>
          </ScrollArea>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Memory Dump</h4>
        <ScrollArea className="h-[200px] w-full rounded-md border">
          <pre className="p-4 font-mono whitespace-pre">
            {memory}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}