"use client"
import React, { useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Controlled as CodeMirror } from "react-codemirror2";
import { Play, AlertCircle, Code2, Terminal } from "lucide-react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/gas/gas";

const Editor = ({ value, onChange }) => (
  <Card className="h-[600px] flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2">
        <Code2 className="h-5 w-5" />
        Code Editor
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-1 overflow-hidden p-0">
      <div className="h-full">
        <CodeMirror
          value={value}
          options={{
            mode: "gas",
            theme: "material",
            lineNumbers: true,
            lineWrapping: true,
          }}
          onBeforeChange={(editor, data, value) => onChange(value)}
        />
      </div>
    </CardContent>
  </Card>
);

const EmulatorControls = ({ emulateCode, disabled }) => (
  <div className="flex gap-2 mt-4">
    <Button onClick={() => emulateCode("-trace")} disabled={disabled}>
      Run Full Trace
    </Button>
    <Button onClick={() => emulateCode("-before")} disabled={disabled} variant="outline">
      Memory Before
    </Button>
    <Button onClick={() => emulateCode("-after")} disabled={disabled} variant="outline">
      Memory After
    </Button>
  </div>
);

const Output = ({ title, content, icon }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-base">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto">
        {content || "No output yet."}
      </pre>
    </CardContent>
  </Card>
);

const App = () => {
  const [asmCode, setAsmCode] = useState("");
  const [log, setLog] = useState("");
  const [listing, setListing] = useState("");
  const [trace, setTrace] = useState("");
  const [objectFilePath, setObjectFilePath] = useState("");
  const [isAssembling, setIsAssembling] = useState(false);
  const [isEmulating, setIsEmulating] = useState(false);

  const assembleCode = async () => {
    setIsAssembling(true);
    const formData = new FormData();
    const file = new Blob([asmCode], { type: "text/plain" });
    formData.append("asmFile", new File([file], "program.asm"));

    try {
      const response = await axios.post("http://localhost:5000/assemble", formData);
      setLog(response.data.log);
      setListing(response.data.listing);
      setObjectFilePath(response.data.object_file_path);
    } catch (error) {
      console.error("Assembly error:", error.response?.data || error.message);
      setLog("Assembly failed.");
    } finally {
      setIsAssembling(false);
    }
  };

  const emulateCode = async (command) => {
    setIsEmulating(true);
    try {
      const response = await axios.post("http://localhost:5000/emulate", {
        object_file_path: objectFilePath,
        command,
      });
      setTrace(response.data.output);
    } catch (error) {
      console.error("Emulation error:", error.response?.data || error.message);
      setTrace("Emulation failed.");
    } finally {
      setIsEmulating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SIMPLE ASM IDE</h1>
        <Button
          onClick={assembleCode}
          disabled={isAssembling || !asmCode}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {isAssembling ? "Assembling..." : "Assemble"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Editor value={asmCode} onChange={setAsmCode} />
          <EmulatorControls 
            emulateCode={emulateCode} 
            disabled={isEmulating || !objectFilePath} 
          />
        </div>

        <Tabs defaultValue="log" className="space-y-4">
          <TabsList>
            <TabsTrigger value="log">Assembler Log</TabsTrigger>
            <TabsTrigger value="listing">Listing File</TabsTrigger>
            <TabsTrigger value="trace">Trace Output</TabsTrigger>
          </TabsList>

          <TabsContent value="log">
            <Output 
              title="Assembler Log" 
              content={log} 
              icon={<Terminal className="h-4 w-4" />}
            />
          </TabsContent>

          <TabsContent value="listing">
            <Output 
              title="Listing File" 
              content={listing}
              icon={<Code2 className="h-4 w-4" />}
            />
          </TabsContent>

          <TabsContent value="trace">
            <Output 
              title="Trace Output" 
              content={trace}
              icon={<AlertCircle className="h-4 w-4" />}
            />
          </TabsContent>
        </Tabs>
      </div>

      {!asmCode && (
        <Alert>
          <AlertDescription>
            Start by writing your assembly code in the editor. Click &quot;Assemble&quot; when ready to compile.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default App;