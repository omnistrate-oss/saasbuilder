const AccordionEditIcon = (props) => {
  const { color = "#475467" } = props;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 5.333 10.667 8m0 0L8 10.667M10.667 8H2m.225-3.333a6.667 6.667 0 1 1 0 6.667"
      />
    </svg>
  );
};

export default AccordionEditIcon;
