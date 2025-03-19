const StepperErrorIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        border: "2px solid #FFFFFF",
        outline: "2px solid #D92D20",
        borderRadius: "50%",
      }}
    >
      <path
        d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
        fill="#D92D20"
      />
      <path
        d="M15.75 8.25L8.25 15.75M8.25 8.25L15.75 15.75"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default StepperErrorIcon;
