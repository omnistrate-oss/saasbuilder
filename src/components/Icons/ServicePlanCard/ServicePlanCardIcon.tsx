const ServicePlanCardIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_dii_276_7970)">
        <path
          d="M2 7C2 3.68629 4.68629 1 8 1H28C31.3137 1 34 3.68629 34 7V27C34 30.3137 31.3137 33 28 33H8C4.68629 33 2 30.3137 2 27V7Z"
          fill="white"
        />
        <path
          d="M2.5 7C2.5 3.96243 4.96243 1.5 8 1.5H28C31.0376 1.5 33.5 3.96243 33.5 7V27C33.5 30.0376 31.0376 32.5 28 32.5H8C4.96243 32.5 2.5 30.0376 2.5 27V7Z"
          stroke="#E9EAEB"
        />
        <path
          d="M15.9999 20.6667H12.3333M14.3333 17H11.3333M15.9999 13.3333H12.6666M21.3333 11L16.9356 17.1567C16.741 17.4292 16.6437 17.5654 16.6479 17.679C16.6515 17.7779 16.699 17.8701 16.7773 17.9305C16.8673 18 17.0347 18 17.3696 18H20.6666L19.9999 23L24.3975 16.8433C24.5922 16.5708 24.6895 16.4346 24.6853 16.321C24.6816 16.2221 24.6342 16.1299 24.5559 16.0695C24.4659 16 24.2984 16 23.9636 16H20.6666L21.3333 11Z"
          stroke="#414651"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_dii_276_7970"
          x="0"
          y="0"
          width="36"
          height="36"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_276_7970"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_276_7970"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_276_7970"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="erode"
            in="SourceAlpha"
            result="effect3_innerShadow_276_7970"
          />
          <feOffset />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0392157 0 0 0 0 0.0496732 0 0 0 0 0.0705882 0 0 0 0.18 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_innerShadow_276_7970"
            result="effect3_innerShadow_276_7970"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default ServicePlanCardIcon;
