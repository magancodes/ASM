"use client"

import React from 'react'
import { Textarea } from "@/components/ui/textarea"

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="w-full h-full p-4">
      <Textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-black text-white font-mono text-sm resize-none p-4"
        placeholder="Enter your assembly code here..."
      />
    </div>
  )
}

