const RegionIcon = (props) => {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#filter0_dii_3115_241)">
        <path
          d="M2 5C2 2.79086 3.79086 1 6 1H26C28.2091 1 30 2.79086 30 5V25C30 27.2091 28.2091 29 26 29H6C3.79086 29 2 27.2091 2 25V5Z"
          fill="white"
        />
        <path
          d="M2.5 5C2.5 3.067 4.067 1.5 6 1.5H26C27.933 1.5 29.5 3.067 29.5 5V25C29.5 26.933 27.933 28.5 26 28.5H6C4.067 28.5 2.5 26.933 2.5 25V5Z"
          stroke="#D0D5DD"
        />
        <path
          d="M16 6.66666C18.0844 8.94862 19.269 11.91 19.3334 15C19.269 18.09 18.0844 21.0514 16 23.3333M16 6.66666C13.9156 8.94862 12.7311 11.91 12.6667 15C12.7311 18.09 13.9156 21.0514 16 23.3333M16 6.66666C11.3976 6.66666 7.66669 10.3976 7.66669 15C7.66669 19.6024 11.3976 23.3333 16 23.3333M16 6.66666C20.6024 6.66666 24.3334 10.3976 24.3334 15C24.3334 19.6024 20.6024 23.3333 16 23.3333M8.08337 12.5H23.9167M8.08335 17.5H23.9167"
          stroke="#7F56D9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_dii_3115_241"
          x={0}
          y={0}
          width={32}
          height={32}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={1} />
          <feGaussianBlur stdDeviation={1} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3115_241" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3115_241" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={-2} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_3115_241" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology radius={1} operator="erode" in="SourceAlpha" result="effect3_innerShadow_3115_241" />
          <feOffset />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.18 0" />
          <feBlend mode="normal" in2="effect2_innerShadow_3115_241" result="effect3_innerShadow_3115_241" />
        </filter>
      </defs>
    </svg>
  );
};

export default RegionIcon;
