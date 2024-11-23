"use client"

import React, { useState } from 'react'
import { Moon, Sun, Upload, Download, Play, Pause, StepForward, HelpCircle, Code, Terminal, Cpu } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SimpleAsmIde() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [activeTab, setActiveTab] = useState("editor")

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
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
            <div className="flex space-x-2">
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
          <TabsContent value="editor" className="flex-grow p-4">
            <div className="w-full h-full border rounded-md overflow-hidden">
              <pre className="p-4 font-mono text-sm">
                <code>{`; SIMPLE ASM Code Example
START:
  MOV A, 5
  MOV B, 10
  ADD A, B
  JMP END
END:
  HLT`}</code>
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="assembler" className="flex-grow p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Assembler Logs</h3>
              <ScrollArea className="h-40 w-full rounded-md border p-4">
                <pre className="font-mono text-sm">
                  <span className="text-green-500">Info: Assembling code...</span>
                  <br />
                  <span className="text-green-500">Success: Code assembled without errors.</span>
                </pre>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Machine Code Listing</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Address</TableHead>
                    <TableHead>Instruction Code</TableHead>
                    <TableHead>Assembly Instruction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono">0x0000</TableCell>
                    <TableCell className="font-mono">0x01 0x05</TableCell>
                    <TableCell className="font-mono">MOV A, 5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">0x0002</TableCell>
                    <TableCell className="font-mono">0x02 0x0A</TableCell>
                    <TableCell className="font-mono">MOV B, 10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">0x0004</TableCell>
                    <TableCell className="font-mono">0x03</TableCell>
                    <TableCell className="font-mono">ADD A, B</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">0x0005</TableCell>
                    <TableCell className="font-mono">0x04 0x07</TableCell>
                    <TableCell className="font-mono">JMP END</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono">0x0007</TableCell>
                    <TableCell className="font-mono">0xFF</TableCell>
                    <TableCell className="font-mono">HLT</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="emulator" className="flex-grow p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Emulator Controls</h3>
              <div className="space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Run</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Pause className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pause</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <StepForward className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Step</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Registers</h4>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">PC</TableCell>
                      <TableCell className="font-mono">0x0000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">SP</TableCell>
                      <TableCell className="font-mono">0xFFFF</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">A</TableCell>
                      <TableCell className="font-mono">0x00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">B</TableCell>
                      <TableCell className="font-mono">0x00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Trace Log</h4>
                <ScrollArea className="h-40 w-full rounded-md border p-4">
                  <pre className="font-mono text-sm">
                    {`0x0000: MOV A, 5
0x0002: MOV B, 10
0x0004: ADD A, B
0x0005: JMP END
0x0007: HLT`}
                  </pre>
                </ScrollArea>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Memory Dump</h4>
              <ScrollArea className="h-40 w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Address</TableHead>
                      <TableHead>+0</TableHead>
                      <TableHead>+1</TableHead>
                      <TableHead>+2</TableHead>
                      <TableHead>+3</TableHead>
                      <TableHead>+4</TableHead>
                      <TableHead>+5</TableHead>
                      <TableHead>+6</TableHead>
                      <TableHead>+7</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">0x0000</TableCell>
                      <TableCell className="font-mono">01</TableCell>
                      <TableCell className="font-mono">05</TableCell>
                      <TableCell className="font-mono">02</TableCell>
                      <TableCell className="font-mono">0A</TableCell>
                      <TableCell className="font-mono">03</TableCell>
                      <TableCell className="font-mono">04</TableCell>
                      <TableCell className="font-mono">07</TableCell>
                      <TableCell className="font-mono">FF</TableCell>
                    </TableRow>
                    {/* Add more rows as needed */}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

