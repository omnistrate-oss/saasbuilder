import dynamic from "next/dynamic";

const JSONView = dynamic(() => import("react-json-view").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default JSONView;
