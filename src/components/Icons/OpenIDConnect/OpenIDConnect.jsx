function OpenIDConnectIcon(props) {
  const {  width = 27, height = 24 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="#CCC"
        d="M23.81 9.373C21.303 7.81 17.8 6.84 13.966 6.84 6.248 6.84 0 10.698 0 15.456 0 19.81 5.207 23.385 11.953 24v-2.509C7.408 20.923 4 18.438 4 15.456c0-3.385 4.45-6.154 9.964-6.154 2.746 0 5.231.686 7.03 1.799l-2.556 1.585h7.976V7.764l-2.603 1.61Z"
      />
      <path fill="#FF6200" d="M11.953 2.58V24l4-2.509V0l-4 2.58Z" />
    </svg>
  );
}

export default OpenIDConnectIcon;
