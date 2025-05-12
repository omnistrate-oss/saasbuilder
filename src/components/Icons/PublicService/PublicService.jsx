import * as React from "react";

const PublicServiceIcon = (props) => {
  let { color = "" } = props;
  if (!color) {
    color = "#fff";
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none" {...props}>
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.167 13 10.446 5.223c.142.07.213.106.287.12a.541.541 0 0 0 .2 0c.075-.014.146-.05.288-.12L23.833 13M2.167 18.417l10.446 5.223c.142.07.213.106.287.12a.541.541 0 0 0 .2 0c.075-.014.146-.05.288-.12l10.445-5.223M2.167 7.583 12.613 2.36c.142-.07.213-.106.287-.12a.542.542 0 0 1 .2 0c.075.014.146.05.288.12l10.445 5.223-10.445 5.223c-.142.071-.213.107-.288.12a.546.546 0 0 1-.2 0c-.074-.013-.145-.049-.287-.12L2.167 7.583Z"
      />
    </svg>
  );
};
export default PublicServiceIcon;
