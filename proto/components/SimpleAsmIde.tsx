"use client"
import { useRef } from 'react';
import { uploadFile, downloadFile } from '@/lib/api';
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Moon, Sun, Upload, Download, Play, Pause, StepForward, HelpCircle, Code, Terminal, Cpu } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import CodeEditor from './CodeEditor'
import AssemblerLogs from './AssembleLogs'
import Emulator from './Emulator'
import { assembleCode, emulateCode } from '@/lib/api'

export default function SimpleAsmIde() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [activeTab, setActiveTab] = useState("editor")
  const [code, setCode] = useState(`; SIMPLE ASM Code Example\nSTART:\n  MOV A, 5\n  MOV B, 10\n  ADD A, B\n  JMP END\nEND:\n  HLT`)
  const [assemblyResult, setAssemblyResult] = useState<{
    listing: string;
    log: string;
    object_file_path: string;
  } | null>(null)
  const [emulationResult, setEmulationResult] = useState<string>("")
  const [isAssembling, setIsAssembling] = useState(false)
  const [isEmulating, setIsEmulating] = useState(false)
  const { toast } = useToast()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    document.documentElement.classList.toggle('dark')
  }

  const handleAssemble = async () => {
    setIsAssembling(true)
    try {
      const result = await assembleCode(code)
      setAssemblyResult(result)
      toast({
        title: "Assembly successful",
        description: "Code assembled without errors",
      })
      setActiveTab("assembler")
    } catch (error) {
      toast({
        title: "Assembly failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsAssembling(false)
    }
  }

  const handleEmulate = async (command: string) => {
    if (!assemblyResult?.object_file_path) {
      toast({
        title: "Cannot emulate",
        description: "Please assemble the code first",
        variant: "destructive",
      })
      return
    }

    setIsEmulating(true)
    try {
      const result = await emulateCode(assemblyResult.object_file_path, command)
      setEmulationResult(result.output)
      setActiveTab("emulator")
    } catch (error) {
      toast({
        title: "Emulation failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsEmulating(false)
    }
  }

  return (
    <div className={`flex h-screen ${theme}`}>
      {/* Sidebar */}
      <div className="w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setActiveTab("editor")}>
                <Code className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Code Editor</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setActiveTab("assembler")}>
                <Terminal className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Assembler Logs</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setActiveTab("emulator")}>
                <Cpu className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Emulator</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex-grow" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle Theme</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-background text-foreground overflow-hidden">
        <Tabs value={activeTab} className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center p-2 border-b">
            <TabsList>
              <TabsTrigger value="editor">Code Editor</TabsTrigger>
              <TabsTrigger value="assembler">Assembler Logs</TabsTrigger>
              <TabsTrigger value="emulator">Emulator</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAssemble}
                disabled={isAssembling || !code}
              >
                {isAssembling ? "Assembling..." : "Assemble"}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload File</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download File</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <TabsContent value="editor" className="flex-grow">
            <CodeEditor code={code} onChange={setCode} />
          </TabsContent>
          <TabsContent value="assembler" className="flex-grow">
            <AssemblerLogs result={assemblyResult} />
          </TabsContent>
          <TabsContent value="emulator" className="flex-grow">
            <Emulator 
              onEmulate={handleEmulate} 
              output={emulationResult}
              isEmulating={isEmulating}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "Upload failed",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }
  
    // Validate file extension
    if (!file.name.toLowerCase().endsWith('.asm')) {
      toast({
        title: "Invalid file",
        description: "Please upload a .asm file",
        variant: "destructive",
      });
      return;
    }
  
    setIsAssembling(true);
  
    try {
      // Read file content first
      const fileContent = await file.text();
      setCode(fileContent);
  
      // Then try to assemble it
      const result = await uploadFile(file);
      setAssemblyResult(result);
      
      toast({
        title: "File uploaded successfully",
        description: "File has been uploaded and assembled",
      });
      
      setActiveTab("assembler");
    } catch (error) {
      setAssemblyResult(null);
      toast({
        title: "Upload failed",
        description: error instanceof Error 
          ? error.message 
          : "Failed to upload and assemble file",
        variant: "destructive",
      });
    } finally {
      setIsAssembling(false);
      if (event.target) {
        event.target.value = ''; // Reset file input
      }
    }
  };
const handleDownload = async () => {
  try {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.asm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    toast({
      title: "Download failed",
      description: error instanceof Error ? error.message : "Failed to download file",
      variant: "destructive",
    });
  }
};

}

