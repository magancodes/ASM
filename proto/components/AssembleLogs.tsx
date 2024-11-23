"use client"

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AssemblerLogsProps {
  result: {
    listing: string
    log: string
    object_file_path: string
  } | null
}

export default function AssemblerLogs({ result }: AssemblerLogsProps) {
  if (!result) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No assembly results yet. Click "Assemble" to compile your code.
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Assembler Logs</h3>
        <ScrollArea className="h-40 w-full rounded-md border">
          <pre className="p-4 text-green-500 font-mono whitespace-pre-wrap">
            {result.log}
          </pre>
        </ScrollArea>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Machine Code Listing</h3>
        <ScrollArea className="h-[calc(100vh-300px)] w-full rounded-md border">
          <pre className="p-4 font-mono whitespace-pre">
            {result.listing}
          </pre>
        </ScrollArea>
      </div>
    </div>
  )
}

