const StepperDefaultIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
      <path
        stroke="#E9EAEB"
        strokeWidth={1.5}
        d="M.75 12C.75 5.787 5.787.75 12 .75S23.25 5.787 23.25 12 18.213 23.25 12 23.25.75 18.213.75 12Z"
      />
      <circle cx={12} cy={12} r={4} fill="#D5D7DA" />
    </svg>
  );
};

export default StepperDefaultIcon;
