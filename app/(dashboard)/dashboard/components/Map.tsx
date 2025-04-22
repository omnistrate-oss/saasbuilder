function Map(props) {
  return (
    <svg
      viewBox="0 0 230 137"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        // backgroundColor: "#FFF",
        position: "absolute",
      }}
    >
      {props.children}
    </svg>
  );
}

export default Map;
