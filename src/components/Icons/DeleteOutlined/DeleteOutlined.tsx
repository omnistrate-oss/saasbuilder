const DeleteOutlinedIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={52} height={52} fill="none" {...props}>
    <g filter="url(#a)">
      <path
        fill="#fff"
        d="M2 11C2 5.477 6.477 1 12 1h28c5.523 0 10 4.477 10 10v28c0 5.523-4.477 10-10 10H12C6.477 49 2 44.523 2 39V11Z"
      />
      <path
        stroke="#E9EAEB"
        d="M12 1.5h28a9.5 9.5 0 0 1 9.5 9.5v28a9.5 9.5 0 0 1-9.5 9.5H12A9.5 9.5 0 0 1 2.5 39V11A9.5 9.5 0 0 1 12 1.5Z"
      />
      <path
        stroke="#F04438"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M30 19v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C28.48 15 27.92 15 26.8 15h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C22 16.52 22 17.08 22 18.2v.8m2 5.5v5m4-5v5M17 19h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C30.72 35 29.88 35 28.2 35h-4.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C19 32.72 19 31.88 19 30.2V19"
      />
    </g>
    <defs>
      <filter id="a" width={52} height={52} x={0} y={0} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1988_59936" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_1988_59936" result="shape" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset dy={-2} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0" />
        <feBlend in2="shape" result="effect2_innerShadow_1988_59936" />
        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feMorphology in="SourceAlpha" radius={1} result="effect3_innerShadow_1988_59936" />
        <feOffset />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.18 0" />
        <feBlend in2="effect2_innerShadow_1988_59936" result="effect3_innerShadow_1988_59936" />
      </filter>
    </defs>
  </svg>
);
export default DeleteOutlinedIcon;
