import dynamic from "next/dynamic";

import { BaseCodeEditorProps } from "./BaseCodeEditor";
const BaseCodeEditor = dynamic(() => import("./BaseCodeEditor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const CodeEditor = (props: BaseCodeEditorProps) => {
  return <BaseCodeEditor {...props} />;
};

export default CodeEditor;
