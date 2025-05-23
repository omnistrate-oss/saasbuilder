function AuthOIcon(props) {
  const { width = 22, height = 24 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#EB5424"
        d="M17.423 19.416 14.969 12l6.426-4.584c1.58 4.758 0 9.168-3.972 12Zm3.972-12L18.94 0h-7.944l2.441 7.416h7.957ZM10.997 0H3.054L.613 7.416h7.943L10.997 0ZM.6 7.416c-1.568 4.758 0 9.168 3.972 12L7.013 12 .6 7.416Zm3.972 12L10.997 24l6.426-4.584-6.426-4.584-6.425 4.584Z"
      />
    </svg>
  );
}

export default AuthOIcon;
