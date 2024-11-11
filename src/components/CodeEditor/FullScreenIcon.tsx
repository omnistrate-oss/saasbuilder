import { FC } from "react";

const FullScreenIcon: FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg
      width="15"
      height="18"
      viewBox="0 0 15 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        cursor: "pointer",
      }}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 3C9 2.86739 9.05268 2.74021 9.14645 2.64645C9.24022 2.55268 9.36739 2.5 9.5 2.5H13.5C13.6326 2.5 13.7598 2.55268 13.8536 2.64645C13.9473 2.74021 14 2.86739 14 3V7C14 7.13261 13.9473 7.25979 13.8536 7.35355C13.7598 7.44732 13.6326 7.5 13.5 7.5C13.3674 7.5 13.2402 7.44732 13.1464 7.35355C13.0527 7.25979 13 7.13261 13 7V4.20667L9.18667 8.02C9.14089 8.06912 9.08569 8.10853 9.02436 8.13585C8.96303 8.16318 8.89682 8.17788 8.82968 8.17906C8.76255 8.18025 8.69586 8.1679 8.6336 8.14275C8.57134 8.1176 8.51479 8.08017 8.46731 8.03269C8.41983 7.98521 8.3824 7.92866 8.35725 7.8664C8.3321 7.80414 8.31975 7.73745 8.32094 7.67032C8.32212 7.60318 8.33682 7.53697 8.36415 7.47564C8.39147 7.41431 8.43088 7.35911 8.48 7.31333L12.2933 3.5H9.5C9.36739 3.5 9.24022 3.44732 9.14645 3.35355C9.05268 3.25979 9 3.13261 9 3ZM6.52 9.98C6.61363 10.0738 6.66623 10.2008 6.66623 10.3333C6.66623 10.4658 6.61363 10.5929 6.52 10.6867L2.70667 14.5H5.5C5.63261 14.5 5.75979 14.5527 5.85355 14.6464C5.94732 14.7402 6 14.8674 6 15C6 15.1326 5.94732 15.2598 5.85355 15.3536C5.75979 15.4473 5.63261 15.5 5.5 15.5H1.5C1.36739 15.5 1.24021 15.4473 1.14645 15.3536C1.05268 15.2598 1 15.1326 1 15V11C1 10.8674 1.05268 10.7402 1.14645 10.6464C1.24021 10.5527 1.36739 10.5 1.5 10.5C1.63261 10.5 1.75979 10.5527 1.85355 10.6464C1.94732 10.7402 2 10.8674 2 11V13.7933L5.81333 9.98C5.90708 9.88637 6.03417 9.83377 6.16667 9.83377C6.29917 9.83377 6.42625 9.88637 6.52 9.98Z"
        fill="white"
      />
    </svg>
  );
};

export default FullScreenIcon;