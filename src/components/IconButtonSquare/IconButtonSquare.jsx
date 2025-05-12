import Button from "../Button/Button";

const IconButtonSquare = (props) => {
  const { sx = {}, ...restProps } = props;
  return <Button variant="outlined" sx={{ padding: "10px !important", ...sx }} {...restProps} />;
};

export default IconButtonSquare;
