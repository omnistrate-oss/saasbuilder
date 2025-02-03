const PrivateResourceIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}
  >
    <g filter="url(#a)">
      <path
        fill="#535862"
        d="M2 7a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V7Z"
      />
      <path
        stroke="url(#b)"
        strokeWidth={2}
        d="M3 7a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v20a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V7Z"
      />
      <path
        fill="#fff"
        d="M25.297 22.325h-2.782a.324.324 0 1 1 0-.648h2.782a3.406 3.406 0 0 0 .487-6.775.323.323 0 0 1-.263-.422 4.866 4.866 0 0 0-4.602-6.425 4.83 4.83 0 0 0-4.54 3.088.325.325 0 0 1-.442.175 3.508 3.508 0 0 0-1.505-.344 3.567 3.567 0 0 0-3.567 3.568.324.324 0 0 1-.325.324 3.406 3.406 0 1 0 .15 6.81h2.782a.324.324 0 1 1 0 .65h-2.77a4.05 4.05 0 0 1-.486-8.076 4.216 4.216 0 0 1 4.216-3.925c.509 0 1.014.092 1.489.273a5.513 5.513 0 0 1 10.326 3.733 4.054 4.054 0 0 1-.95 7.994Z"
      />
      <path
        fill="#fff"
        d="M22.064 26.593h-8.128a.775.775 0 0 1-.775-.775V20.63a.775.775 0 0 1 .775-.775h8.128a.775.775 0 0 1 .775.775v5.19a.775.775 0 0 1-.775.774Zm-8.128-6.09a.126.126 0 0 0-.126.126v5.19a.126.126 0 0 0 .126.126h8.128a.126.126 0 0 0 .117-.078.126.126 0 0 0 .01-.049V20.63a.125.125 0 0 0-.079-.117.127.127 0 0 0-.048-.01h-8.128Z"
      />
      <path
        fill="#fff"
        d="M20.968 20.503h-5.936a.324.324 0 0 1-.324-.325V17.72a3.292 3.292 0 1 1 6.584 0v2.458a.324.324 0 0 1-.325.325Zm-5.611-.649h5.286V17.72a2.643 2.643 0 1 0-5.286 0v2.134ZM18 23.866a1.083 1.083 0 1 1 0-2.167 1.083 1.083 0 0 1 0 2.167Zm0-1.515a.434.434 0 1 0 0 .869.434.434 0 0 0 0-.869Z"
      />
      <path
        fill="#fff"
        d="M18 24.745a.324.324 0 0 1-.324-.325v-.878a.324.324 0 0 1 .648 0v.878a.324.324 0 0 1-.324.325Z"
      />
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
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_39_7439" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_39_7439"
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
        <feBlend in2="shape" result="effect2_innerShadow_39_7439" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feMorphology
          in="SourceAlpha"
          radius={1}
          result="effect3_innerShadow_39_7439"
        />
        <feOffset />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.18 0" />
        <feBlend
          in2="effect2_innerShadow_39_7439"
          result="effect3_innerShadow_39_7439"
        />
      </filter>
    </defs>
  </svg>
);
export default PrivateResourceIcon;
