const TickIcon = (props) => {
  const { width = 13, height = 12, disabled } = props;

  let color = props.color || "#12B76A";
  if (disabled) {
    color = "#D0D5DD";
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" {...props} viewBox="0 0 13 12">
      <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.8 3 5.3 8.5 2.8 6" />
    </svg>
  );
};

export default TickIcon;
