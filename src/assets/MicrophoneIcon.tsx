import { FC } from "react";

interface MicrophoneIconProps {
  color?: string;
  stroke?: number;
  className?: string;
}

const MicrophoneIcon: FC<MicrophoneIconProps> = ({
  color = "#000000",
  stroke = 2,
  className,
}) => {
  return (
    <svg
      viewBox="0 0 23 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.1 16.72c0 3 .96 5.8 3.61 7.95a9.96 9.96 0 0 0 6.5 2.17m0 0v4.34h4.34-8.67m4.34-4.34c2.35 0 4.42-.48 6.5-2.17a9.87 9.87 0 0 0 3.61-7.95M11.22 1.82c-1.45 0-2.5.37-3.3.93a5.6 5.6 0 0 0-1.84 2.4c-.9 2.06-1.1 4.77-1.1 7.24 0 2.46.2 5.17 1.1 7.24a5.6 5.6 0 0 0 1.84 2.4c.8.55 1.85.92 3.3.92 1.44 0 2.5-.37 3.29-.93a5.6 5.6 0 0 0 1.84-2.4c.9-2.06 1.1-4.77 1.1-7.23 0-2.47-.2-5.18-1.1-7.24a5.6 5.6 0 0 0-1.84-2.4 5.52 5.52 0 0 0-3.3-.93Z"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MicrophoneIcon;
