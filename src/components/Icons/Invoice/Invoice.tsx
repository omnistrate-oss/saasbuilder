const InvoiceIcon = (props) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <mask
      id="mask0_1635_1025"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="4"
      y="0"
      width="32"
      height="40"
    >
      <path
        d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z"
        fill="url(#paint0_linear_1635_1025)"
      />
    </mask>
    <g mask="url(#mask0_1635_1025)">
      <path
        d="M4.5 4C4.5 2.067 6.067 0.5 8 0.5H23.7929L35.5 12.2071V36C35.5 37.933 33.933 39.5 32 39.5H8C6.067 39.5 4.5 37.933 4.5 36V4Z"
        fill="#F5F5F5"
        stroke="#E9EAEB"
      />
    </g>
    <path d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z" fill="#E9EAEB" />
    <path
      d="M12.8 20H27.2M12.8 23.2H27.2M12.8 26.4H27.2M12.8 29.6H24"
      stroke="#414651"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="paint0_linear_1635_1025" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopOpacity="0.4" />
        <stop offset="1" />
      </linearGradient>
    </defs>
  </svg>
);

export default InvoiceIcon;
