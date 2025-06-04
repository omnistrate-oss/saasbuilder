function OpenIDConnectIcon(props) {
  const { width = 24, height = 24 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M23.8107 9.37288C21.3018 7.81075 17.7988 6.84033 13.9645 6.84033C6.24852 6.84033 0 10.6983 0 15.4557C0 19.8107 5.2071 23.3847 11.9527 24.0001V21.4912C7.40828 20.9232 4 18.438 4 15.4557C4 12.0711 8.4497 9.30187 13.9645 9.30187C16.7101 9.30187 19.1953 9.98826 20.9941 11.1007L18.4379 12.6865H26.4142V7.76341L23.8107 9.37288Z"
        fill="#CCCCCC"
      />
      <path d="M11.9526 2.57988V21.4911V24L15.9526 21.4911V0L11.9526 2.57988Z" fill="#FF6200" />
    </svg>
  );
}

export default OpenIDConnectIcon;
