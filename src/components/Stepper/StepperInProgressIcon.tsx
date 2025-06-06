const StepperInProgressIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        border: "2px solid #FFFFFF",
        outline: "2px solid #079455",
        borderRadius: "50%",
      }}
    >
      <path
        d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
        fill="#079455"
      />
      <circle cx="12" cy="12" r="4" fill="white" />
    </svg>
  );
};

export default StepperInProgressIcon;
