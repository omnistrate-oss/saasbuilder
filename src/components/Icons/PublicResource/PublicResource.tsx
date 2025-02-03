const PublicResourceIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}
  >
    <g filter="url(#a)">
      <path
        fill="#079455"
        d="M2 9a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H10a8 8 0 0 1-8-8V9Z"
      />
      <path
        stroke="url(#b)"
        strokeWidth={2}
        d="M3 9a7 7 0 0 1 7-7h16a7 7 0 0 1 7 7v16a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7V9Z"
      />
      <g
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={0.5}
        clipPath="url(#c)"
      >
        <path d="M17.972 27a6.599 6.599 0 0 1-6.593-6.592 6.6 6.6 0 0 1 6.593-6.591 6.6 6.6 0 0 1 6.591 6.591A6.599 6.599 0 0 1 17.972 27Z" />
        <path d="M25.913 12.35c-.755 0-1.454.22-2.059.583 0-.017.004-.031.004-.047a5.887 5.887 0 0 0-11.772 0l.002.047a3.986 3.986 0 0 0-2.059-.583 4.03 4.03 0 0 0 0 8.058h1.35a6.6 6.6 0 0 1 6.593-6.592 6.6 6.6 0 0 1 6.591 6.592h1.35a4.029 4.029 0 0 0 0-8.059Z" />
        <path d="M17.97 26.98c1.816 0 3.288-2.942 3.288-6.572s-1.472-6.572-3.287-6.572-3.287 2.943-3.287 6.572c0 3.63 1.472 6.573 3.287 6.573Z" />
        <path d="M17.971 26.98a6.572 6.572 0 1 0 0-13.144 6.572 6.572 0 0 0 0 13.144ZM17.972 13.836v13.145" />
        <path d="M17.972 17.123c3.63 0 6.572 1.472 6.572 3.286 0 1.813-2.943 3.287-6.572 3.287-3.63 0-6.573-1.473-6.573-3.287 0-1.814 2.943-3.286 6.573-3.286Z" />
        <path d="M17.972 26.98a6.572 6.572 0 1 0 0-13.144 6.572 6.572 0 0 0 0 13.145ZM11.4 20.408h13.143" />
      </g>
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={18}
        x2={18}
        y1={1}
        y2={33}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" stopOpacity={0.12} />
        <stop offset={1} stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <clipPath id="c">
        <path fill="#fff" d="M6 5h24v24H6z" />
      </clipPath>
      <filter
        id="a"
        width={36}
        height={36}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_36_7179" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_36_7179"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={-2} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0" />
        <feBlend in2="shape" result="effect2_innerShadow_36_7179" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feMorphology
          in="SourceAlpha"
          radius={1}
          result="effect3_innerShadow_36_7179"
        />
        <feOffset />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.18 0" />
        <feBlend
          in2="effect2_innerShadow_36_7179"
          result="effect3_innerShadow_36_7179"
        />
      </filter>
    </defs>
  </svg>
);
export default PublicResourceIcon;
