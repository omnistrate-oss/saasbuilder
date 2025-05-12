const SuccessIcon = (props) => (
  <svg width={56} height={56} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x={4} y={4} width={48} height={48} rx={24} fill="#D1FADF" />
    <rect x={4} y={4} width={48} height={48} rx={24} stroke="#ECFDF3" strokeWidth={8} />
    <path
      d="M23.5 28L26.5 31L32.5 25M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z"
      stroke="#039855"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SuccessIcon;
