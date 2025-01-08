import { SVGIconType } from "src/types/common/reactGenerics";

const Flag: SVGIconType = (props) => {
  const { color = "#ffffff" } = props;
  return (
    <svg
      width={24}
      height={25}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.0913 7.26617H20.0451C20.5172 7.26617 20.7533 7.26617 20.8914 7.36543C21.0118 7.45204 21.0903 7.58536 21.1075 7.73272C21.1272 7.90161 21.0126 8.10798 20.7833 8.52071L19.3624 11.0783C19.2792 11.228 19.2376 11.3028 19.2213 11.3821C19.2069 11.4522 19.2069 11.5246 19.2213 11.5947C19.2376 11.674 19.2792 11.7488 19.3624 11.8985L20.7833 14.4561C21.0126 14.8688 21.1272 15.0752 21.1075 15.2441C21.0903 15.3914 21.0118 15.5247 20.8914 15.6113C20.7533 15.7106 20.5172 15.7106 20.0451 15.7106H12.6136C12.0224 15.7106 11.7268 15.7106 11.501 15.5956C11.3024 15.4944 11.1409 15.3329 11.0397 15.1343C10.9247 14.9085 10.9247 14.6129 10.9247 14.0217V11.4884M7.23023 22.0439L3.00801 5.15506M4.59139 11.4884H12.4024C12.9936 11.4884 13.2892 11.4884 13.515 11.3733C13.7136 11.2721 13.8751 11.1107 13.9763 10.912C14.0913 10.6863 14.0913 10.3907 14.0913 9.7995V4.73283C14.0913 4.14167 14.0913 3.84608 13.9763 3.62029C13.8751 3.42167 13.7136 3.26019 13.515 3.15899C13.2892 3.04395 12.9936 3.04395 12.4024 3.04395H4.6433C3.90597 3.04395 3.53731 3.04395 3.28515 3.19672C3.06415 3.33062 2.89995 3.54094 2.82364 3.78782C2.73659 4.0695 2.82601 4.42715 3.00484 5.14247L4.59139 11.4884Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Flag;