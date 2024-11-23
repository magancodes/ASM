import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";

const Editor = ({ value, onChange }) => (
    <div>
        <h2>Code Editor</h2>
        <CodeMirror
            value={value}
            options={{ mode: "text/x-asm", lineNumbers: true }}
            onBeforeChange={(editor, data, value) => onChange(value)}
        />
    </div>
);

export default Editor;
