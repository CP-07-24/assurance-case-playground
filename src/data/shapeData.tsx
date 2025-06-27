import { Shape } from "../types/shapes";

// Define GSN Elements
export const gsnElements: Shape[] = [
  {
    id: "gsn-goal-1",
    type: "goal1",
    mainText: "Goals",
    title: "Goals",
    preview: (
      <svg
        viewBox="157.28 125.38 76.04 51.49"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <rect
          x="157.784"
          y="125.876"
          width="75.036"
          height="50.491"
          style={{
            stroke: "rgb(0, 0, 0)",
            fill: "none",
          }}
        />
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "gsn-goal-2",
    mainText: "Context",
    type: "goal2",
    title: "Context",
    preview: (
      <svg
        viewBox="-0.47 -0.5 59.54 37.24"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <path
          style={{
            stroke: "rgb(0, 0, 0)",
            fill: "none",
          }}
          strokeWidth="1"
          d="M 7.304 0 L 51.52 0.154 C 62.608 7.221 58.996 34.757 51.732 36.243 L 7.152 36.082 C -1.786 34.697 -2.942 3.146 7.304 0 Z"
        />
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "gsn-goal-3",
    type: "goal3",
    mainText: "Solution",
    title: "Solution",
    preview: (
      <svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <circle
          cx="250"
          cy="250"
          r="240"
          stroke="black"
          strokeWidth="7"
          fill="none"
        />
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "gsn-goal-4",
    mainText: "Strategy",
    type: "goal4",
    title: "Strategy",
    preview: (
      <svg
        viewBox="141.04 90.31 139.15 47.28"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <path
          d="M 164.489 90.813 L 141.538 137.097 L 256.293 136.743 L 279.687 91.52 L 164.489 90.813 Z"
          stroke="black"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "gsn-goal-5",
    type: "goal5",
    mainText: "Assumptions",
    title: "Assumptions",
    preview: (
      <svg
        viewBox="62.69 199 97.89 56.82"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <ellipse
          cx="111.64"
          cy="227.413"
          rx="48.446"
          ry="27.909"
          stroke="rgb(0, 0, 0)"
          fill="none"
        />
        <text
          x="156.487"
          y="254.027"
          transform="matrix(3.306396, 0, 0, 2.587165, -366.604095, -404.534119)"
          fill="rgb(51, 51, 51)"
          fontFamily="Arial, sans-serif"
          fontSize="3.3px"
          fontWeight="700"
          style={{ whiteSpace: "pre" }}
        >
          A
        </text>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "gsn-goal-6",
    mainText: "Justifications",
    type: "goal6",
    title: "Justifications",
    preview: (
      <svg
        viewBox="62.69 199 97.89 56.82"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <ellipse
          cx="111.64"
          cy="227.413"
          rx="48.446"
          ry="27.909"
          stroke="rgb(0, 0, 0)"
          fill="none"
        />
        <text
          x="156.487"
          y="254.027"
          transform="matrix(3.306396, 0, 0, 2.587165, -366.604095, -404.534119)"
          fill="rgb(51, 51, 51)"
          fontFamily="Arial, sans-serif"
          fontSize="3.3px"
          fontWeight="700"
          style={{ whiteSpace: "pre" }}
        >
          J
        </text>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "gsn-goal-7",
    mainText: "",
    type: "goal7",
    title: "Undeveloped",
    preview: (
      <svg
        viewBox="11.04 12.09 24.21 24.21"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <rect
          x="158.949"
          y="83.542"
          width="15"
          height="15"
          style={{
            stroke: "rgb(0, 0, 0)",
            fill: "none",
            vectorEffect: "non-scaling-stroke",
            strokeWidth: "1",
          }}
          transform="matrix(0.707106, 0.707108, -0.707108, 0.707106, -30.178931, -157.880223)"
        />
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "gsn-goal-8",
    mainText: "Undeveloped Goal",
    type: "goal8",
    title: "Undeveloped Goal",
    preview: (
      <svg
        viewBox="120.37 137.78 76.04 65.14"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <rect
          x="120.873"
          y="138.278"
          width="75.036"
          height="50.491"
          style={{
            stroke: "rgb(0, 0, 0)",
            fill: "none",
          }}
        />
        <polygon
          style={{
            stroke: "rgb(0, 0, 0)",
            fill: "none",
          }}
          points="157.932 189.286 150.714 195.917 157.932 202.422 164.91 196.192"
        />
      </svg>
    ),
    cornerRadius: 0,
  },
];

// Define GSN Extension Elements
export const gsnExtensionElements: Shape[] = [
  {
    id: "gsn-ext-1",
    type: "extension1",
    mainText: "",
    title: "Public Decorator",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="284.18 107.64 14.73 10.36"
      >
        <g
          transform="matrix(0.436665, 0, 0, 0.518052, 157.340444, -28.360312)"
          style={{}}
        >
          <rect
            x="291.624"
            y="268.148"
            width="31.442"
            height="13.408"
            style={{
              stroke: "rgb(0, 0, 0)",
              fill: "rgb(215, 215, 215)",
            }}
          />
          <rect
            x="291.624"
            y="263.496"
            width="11.706"
            height="4.652"
            style={{
              stroke: "rgb(0, 0, 0)",
              fill: "rgb(215, 215, 215)",
            }}
          />
        </g>
      </svg>
    ),
    cornerRadius: 5,
  },
  {
    id: "gsn-ext-2",
    mainText: "Away Solution",
    type: "extension2",
    title: "Away Solution",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="228.46 181.41 76.04 83.6"
        height="70px"
      >
        <g style={{}} transform="matrix(1, 0, 0, 1.039405, 0, -10.423142)">
          <rect
            x="228.958"
            y="245.876"
            width="75.036"
            height="18.64"
            style={{
              stroke: "rgb(0, 0, 0)",
              fill: "none",
            }}
          />
          <g
            transform="matrix(0.436665, 0, 0, 0.518052, 106.434837, 113.239815)"
            style={{}}
          >
            <rect
              x="291.624"
              y="268.148"
              width="31.442"
              height="13.408"
              style={{
                stroke: "rgb(0, 0, 0)",
                fill: "rgb(215, 215, 215)",
              }}
            />
            <rect
              x="291.624"
              y="263.496"
              width="11.706"
              height="4.652"
              style={{
                stroke: "rgb(0, 0, 0)",
                fill: "rgb(215, 215, 215)",
              }}
            />
          </g>
          <path
            style={{
              stroke: "rgb(0, 0, 0)",
              fill: "none",
            }}
            d="M 228.958 222.158 L 228.958 245.876 L 303.994 245.876 L 303.994 222.222 C 298.294 169.367 232.928 176.067 228.958 222.158 Z"
          />
        </g>
      </svg>
    ),
    cornerRadius: 5,
  },
  {
    id: "gsn-ext-3",
    mainText: "Away Context",
    type: "extension3",
    title: "Away Context",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="228.46 209.97 76.04 55.04"
      >
        <g>
          <g style={{}} transform="matrix(1, 0, 0, 1.039405, 0, -10.423141)">
            <rect
              x="228.958"
              y="245.876"
              width="75.036"
              height="18.64"
              style={{ stroke: "rgb(0, 0, 0)", fill: "none" }}
            />
            <g
              transform="matrix(0.436665, 0, 0, 0.518052, 106.434837, 113.239815)"
              style={{}}
            >
              <rect
                x="291.624"
                y="268.148"
                width="31.442"
                height="13.408"
                style={{ stroke: "rgb(0, 0, 0)", fill: "rgb(215, 215, 215)" }}
              />
              <rect
                x="291.624"
                y="263.496"
                width="11.706"
                height="4.652"
                style={{ stroke: "rgb(0, 0, 0)", fill: "rgb(215, 215, 215)" }}
              />
            </g>
            <path
              style={{ stroke: "rgb(0, 0, 0)", fill: "none" }}
              d="M 237.421 212.967 C 228.585 216.1 229.403 223.191 228.958 224.503 L 228.958 245.876 L 303.994 245.876 L 303.994 223.458 C 303.668 222.055 303.964 214.798 295.913 212.522 L 237.421 212.967 Z"
            />
          </g>
        </g>
        <path style={{ fill: "rgb(51, 51, 51)", whiteSpace: "pre" }} />
      </svg>
    ),
    cornerRadius: 5,
  },
  {
    id: "gsn-ext-4",
    mainText: "Away Goal",
    type: "extension4",
    title: "Away Goal",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="228.46 194.89 76.04 70.13"
      >
        <rect
          x="228.958"
          y="195.385"
          width="75.036"
          height="50.491"
          style={{ stroke: "rgb(0, 0, 0)", fill: "none" }}
        />
        <rect
          x="228.958"
          y="245.876"
          width="75.036"
          height="18.64"
          style={{ stroke: "rgb(0, 0, 0)", fill: "none" }}
        />
        <g
          transform="matrix(0.436665, 0, 0, 0.518052, 106.434841, 113.239818)"
          style={{}}
        >
          <rect
            x="291.624"
            y="268.148"
            width="31.442"
            height="13.408"
            style={{ stroke: "rgb(0, 0, 0)", fill: "rgb(215, 215, 215)" }}
          />
          <rect
            x="291.624"
            y="263.496"
            width="11.706"
            height="4.652"
            style={{ stroke: "rgb(0, 0, 0)", fill: "rgb(215, 215, 215)" }}
          />
        </g>
      </svg>
    ),
    cornerRadius: 5,
  },
];

// Define SACM Elements
export const sacmElements: Shape[] = [
  {
    id: "sacm-1",
    mainText: "Claim",
    type: "sacm1",
    title: "Claim",
    preview: (
      <svg
        viewBox="157.28 125.38 76.04 51.49"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <rect
          x="157.784"
          y="125.876"
          width="75.036"
          height="50.491"
          style={{
            stroke: "rgb(0, 0, 0)",
            fill: "none",
          }}
        />
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-2",
    mainText: "Argument Reasoning",
    type: "sacm2",
    title: "Argument Reasoning",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="-0.5 -0.5 42 32"
        style={{ display: "block" }}
      >
        <defs />
        <g>
          <path
            d="M 20 30 L 20 0"
            fill="none"
            stroke="rgb(0, 0, 0)"
            strokeOpacity="0.7"
            strokeMiterlimit="10"
            pointerEvents="stroke"
          />
          <path
            d="M 20 0 L 40 0"
            fill="none"
            stroke="rgb(0, 0, 0)"
            strokeOpacity="0.7"
            strokeMiterlimit="10"
            pointerEvents="stroke"
          />
          <path
            d="M 20 30 L 40 30"
            fill="none"
            stroke="rgb(0, 0, 0)"
            strokeOpacity="0.7"
            strokeMiterlimit="10"
            pointerEvents="stroke"
          />
          <path
            d="M 0 14 L 20 14"
            fill="none"
            stroke="rgb(0, 0, 0)"
            strokeOpacity="0.7"
            strokeMiterlimit="10"
            pointerEvents="stroke"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-3",
    mainText: "Artifact Reference",
    type: "sacm3",
    title: "Artifact Reference",
    preview: (
      <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        {/* Description */}
        <desc>Created with Fabric.js 4.6.0</desc>

        {/* Transformed elements */}
        <g
          transform="matrix(0 0.09 1.16 0 36.94 4.81)"
          id="dSP65oEp0JMh1TZHnJUzP"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>

        <g
          transform="matrix(0.52 -0.46 0.06 0.04 30.96 3.64)"
          id="J6yUVuefAgSbee4HkUeEq"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>

        <g
          transform="matrix(0.02 -0.01 -0.01 -0.02 32.83 2.4)"
          id="NGt3V3D4NCkSluSwWw4sh"
        >
          <path
            style={{
              stroke: "none",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(-40, -40)"
            d="M 60 40 L 80 80 L 40 80 L 0 80 L 20 40 L 40 0 L 60 40 z"
            strokeLinecap="round"
          />
        </g>

        <g
          transform="matrix(0 -0.63 0.09 0 5.7 38.42)"
          id="lxfNtmBv0g3jh5kDUI6XZ"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>

        <g
          transform="matrix(6.13 0 0 6.57 17.23 18.45)"
          id="S6lAl6dO2Dpksxpi8gXUo"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.76515 -2.76515 L 2.76515 -2.76515 L 2.76515 2.76515 L -2.76515 2.76515 z"
            strokeLinecap="round"
          />
        </g>

        <g
          transform="matrix(0 -7.16 0.07 0 39.79 22.1)"
          id="K9D6ezRr6qG2r3Ctiym50"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>

        <g
          transform="matrix(0 0.09 7.06 0 22.71 39.75)"
          id="KzY64UF0oP3kADxV73kto"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
];

// Define SACM Extension Elements
export const sacmExtensionElements: Shape[] = [
  {
    id: "sacm-ext-1",
    mainText: "Ascited Claim",
    type: "sacmExt1",
    title: "Ascited Claim",
    preview: (
      <svg
        viewBox="0 0 40 20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <g transform="matrix(4.49 0 0 3.43 19.65 10.03)">
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.84091 -2.84091 L 2.84091 -2.84091 L 2.84091 2.84091 L -2.84091 2.84091 z"
            strokeLinecap="round"
          />
        </g>
        <g transform="matrix(0.11 0 0 4.06 39.7 10.03)">
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g transform="matrix(0 0.09 -1 0 37.52 19.76)">
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g transform="matrix(0 0.09 -1 0 37.52 0.24)">
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g transform="matrix(-0.11 0 0 4.06 0.3 10.03)">
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g transform="matrix(0 0.09 1 0 2.52 19.76)">
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g transform="matrix(0 0.09 1 0 2.52 0.24)">
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-2",
    mainText: "Argument Package Binding",
    type: "sacmExt2",
    title: "ArgumentPackageBinding",
    preview: (
      <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        {/* Main rectangles */}
        <rect
          x="0.37"
          y="0.12"
          width="39.24"
          height="3.14"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="1.82"
          y="3.28"
          width="36.34"
          height="36.10"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />

        {/* Right side rectangles */}
        <rect
          x="30.22"
          y="3.28"
          width="7.94"
          height="36.10"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="30.22"
          y="21.54"
          width="7.94"
          height="17.60"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="31.04"
          y="8.94"
          width="6.28"
          height="6.72"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />

        {/* Circles */}
        <circle
          cx="34.01"
          cy="28.82"
          r="2.67"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
        <circle
          cx="34.01"
          cy="31.82"
          r="2.67"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-3",
    mainText: "Argument Package Interface",
    type: "sacmExt3",
    title: "ArgumentPackageInterface",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        viewBox="0 0 40 40"
        xmlSpace="preserve"
      >
        <desc>Created with Fabric.js 4.6.0</desc>
        <defs></defs>
        <g
          transform="matrix(1.92 0 0 0.13 19.99 1.69)"
          id="AizuvqeKMzawDr0uU-KN7"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(1.74 0 0 1.78 19.99 21.33)"
          id="8UfMRL__SYEPkqzdoEoKX"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.37 0 0 1.78 34.01 21.33)"
          id="Uy6J-KacOb5BBUwtJEBsM"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.37 0 0 0.9 34.01 30.34)"
          id="LXudeA1sw0k5mjlLVuf8L"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.29 0 0 0.36 34.01 12.3)"
          id="WOz9Zhywxl9kLtZ7ozu6W"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.44 0 0 0.44 34.01 26.96)"
          id="Tv1qP8KzixZVBwg9Kkl_x"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M 0 -3.18182 C 1.75637 -3.18182 3.18182 -1.7563600000000001 3.18182 0 C 3.18182 1.75637 1.7563600000000001 3.18182 0 3.18182 C -1.75637 3.18182 -3.18182 1.7563600000000001 -3.18182 0 C -3.18182 -1.75637 -1.7563600000000001 -3.18182 0 -3.18182 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.37 0 0 0.9 54.01 50.34)"
          id="FzL2Zim_GYVBhkPTOpHzQ"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -10.26515 -10.26515 L 10.26515 -10.26515 L 10.26515 10.26515 L -10.26515 10.26515 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.02 0 0 0.66 34.01 30.83)"
          id="xlvMBJsNP3AczmG1Ei6Cj"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -3.78788 -3.78788 L 3.78788 -3.78788 L 3.78788 3.78788 L -3.78788 3.78788 z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-4",
    mainText: "Argument Package",
    type: "sacmExt4",
    title: "ArgumentPackage",
    preview: (
      <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        {/* Main rectangles */}
        <rect
          x="0.37"
          y="0.12"
          width="39.24"
          height="3.14"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="1.82"
          y="3.28"
          width="36.34"
          height="36.10"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />

        {/* Right side rectangles */}
        <rect
          x="30.22"
          y="3.28"
          width="7.94"
          height="36.10"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="30.22"
          y="21.54"
          width="7.94"
          height="17.60"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
        <rect
          x="31.04"
          y="8.94"
          width="6.28"
          height="6.72"
          stroke="rgb(0, 0, 0)"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-5",
    mainText: "Axiomatic Claim",
    type: "sacmExt5",
    title: "Axiomatic Claim",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        viewBox="0 0 40 20"
        xmlSpace="preserve"
      >
        <desc>Created with Fabric.js 4.6.0</desc>
        <defs></defs>
        <g transform="matrix(8.07 0 0 3.63 20 9.14)" id="YBq28Vp2qFK8Nmzy9J-YF">
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.87 0 0 0.87 19.98 19.56)"
          id="-q12FbmdiJvuG1vZ5ijOD"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.87 0 0 0.87 19.99 19.81)"
          id="IjpB59CyjIFRwGaPQ2dZJ"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-6",
    mainText: "Defeated Claim",
    type: "sacmExt6",
    title: "Defeated Claim",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        viewBox="0 0 40 20"
        xmlSpace="preserve"
      >
        <desc>Created with Fabric.js 4.6.0</desc>
        <defs></defs>
        <g
          transform="matrix(7.85 0 0 3.74 19.89 10.1)"
          id="YBq28Vp2qFK8Nmzy9J-YF"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.84 -0.39 -0.39 -0.84 19.89 10.1)"
          id="-q12FbmdiJvuG1vZ5ijOD"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.83 0.39 -0.37 0.79 19.89 10)"
          id="IjpB59CyjIFRwGaPQ2dZJ"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-7",
    mainText: "Assumed Claim",
    type: "sacmExt7",
    title: "Assumed Claim",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        xmlSpace="preserve"
        viewBox="-0.01 -0.09 40.05 29.31"
      >
        <desc>Created with Fabric.js 4.6.0</desc>
        <defs></defs>
        <g
          transform="matrix(0 0.1 -0.88 0 10.32 26.52)"
          id="rtuyLlzMzHeXcqo1XDg5E"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.1 -0.88 0 29.45 26.58)"
          id="fDe7PWYj4-jwFOfE--7SU"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(4.49 0 0 1.48 19.89 26.14)"
          id="UowMXpxyILWXvDzvSWu-b"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -2.07824 -2.07824 L 2.07824 -2.07824 L 2.07824 2.07824 L -2.07824 2.07824 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.57 -0.88 0 0.27 13.35)"
          id="NERr3R3TkklDyYCS7c8gx"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.58 -0.88 0 39.79 13.37)"
          id="8p5y28PdfCeXmQdVzq9gy"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.86 0 0 1.31 19.97 0.23)"
          id="DggPCMuK1zK5BbEEi8BhJ"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.22 0 0 1.31 5.25 26.51)"
          id="3HTYJiSHVVnfGHP-XLhLI"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.21 0 0 1.26 34.8 26.51)"
          id="gznAmQxsZFEPbDIFNXXWX"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-8",
    mainText: "NeedsSuport Claim",
    type: "sacmExt8",
    title: "NeedsSuport Claim",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        viewBox="0 0 40 30"
        xmlSpace="preserve"
      >
        <desc>Created with Fabric.js 4.6.0</desc>
        <defs></defs>
        <g
          transform="matrix(4.49 0 0 1.62 19.89 28.5)"
          id="UowMXpxyILWXvDzvSWu-b"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -2.07824 -2.07824 L 2.07824 -2.07824 L 2.07824 2.07824 L -2.07824 2.07824 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.63 -0.88 0 0.27 14.56)"
          id="NERr3R3TkklDyYCS7c8gx"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.63 -0.88 0 39.79 14.58)"
          id="8p5y28PdfCeXmQdVzq9gy"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.86 0 0 1.42 19.97 0.25)"
          id="DggPCMuK1zK5BbEEi8BhJ"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.25 0 0 1.62 5.96 28.9)"
          id="3HTYJiSHVVnfGHP-XLhLI"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.24 0 0 1.57 34.1 28.9)"
          id="gznAmQxsZFEPbDIFNXXWX"
        >
          <path
            style={{
              stroke: "rgb(0,0,0)",
              strokeWidth: 0.5,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "none",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M -22.775 -0.00005 L 22.775 -0.00005 L 22.775 0.00005 L -22.775 0.00005 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(1.15 0 0 1.25 15.84 28.9)"
          id="iMmki-e1QTnClkEtZ-v8g"
        >
          <path
            style={{
              stroke: "rgb(120,161,12)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M 0 -0.76705 C 0.42341 -0.76705 0.76705 -0.42341 0.76705 0 C 0.76705 0.42341 0.42341 0.76705 0 0.76705 C -0.42341 0.76705 -0.76705 0.42341 -0.76705 0 C -0.76705 -0.42341 -0.42341 -0.76705 0 -0.76705 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(1.15 0 0 1.25 19.89 28.9)"
          id="bMMqRhrRdflonlyrEYec_"
        >
          <path
            style={{
              stroke: "rgb(120,161,12)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M 0 -0.76705 C 0.42341 -0.76705 0.76705 -0.42341 0.76705 0 C 0.76705 0.42341 0.42341 0.76705 0 0.76705 C -0.42341 0.76705 -0.76705 0.42341 -0.76705 0 C -0.76705 -0.42341 -0.42341 -0.76705 0 -0.76705 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(1.15 0 0 1.25 24.19 28.9)"
          id="8A_kbOM-5KLVSQ6EJ_rlG"
        >
          <path
            style={{
              stroke: "rgb(120,161,12)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform=" translate(0, 0)"
            d="M 0 -0.76705 C 0.42341 -0.76705 0.76705 -0.42341 0.76705 0 C 0.76705 0.42341 0.42341 0.76705 0 0.76705 C -0.42341 0.76705 -0.76705 0.42341 -0.76705 0 C -0.76705 -0.42341 -0.42341 -0.76705 0 -0.76705 z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-9",
    mainText: "Abstract Artifact Reference",
    type: "sacmExt9",
    title: "Abstract Artifact Reference",
    preview: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        viewBox="0 0 40 40"
        xmlSpace="preserve"
      >
        <g
          transform="matrix(0 0.09 0.71 0 32.97 0.27)"
          id="JZxVSofQ1urerpIAWryBq"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 28.65 0.27)"
          id="g7WSGJ5m42Kt9t1-uluXv"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 24.29 0.27)"
          id="Too_YVDNwMiJmG3Z4fZ5C"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 19.95 0.27)"
          id="_1HfLz568FSHBu8V0Zjxn"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 15.97 0.26)"
          id="cQ4GMjxPuo0uuOFfmnu8J"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 11.66 0.26)"
          id="SA6SIGvj5wTPiuBT3guZ-"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 7.28 0.27)"
          id="fFEmSSzZFpUwHr0CT88pa"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 2.95 0.27)"
          id="J3jJbzTHEckz9EVSFoZCa"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.09 0 34.48 6.53)"
          id="4VKPbpie16YBfEbfrD2iS"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 32.99 36.14)"
          id="PELGenApNA1M28xeNrgRO"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 28.66 36.14)"
          id="9Z3CRUXK_Il3unmAw64oS"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 24.29 36.15)"
          id="cJBvkg94FUIycQKwCh1vh"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 19.95 36.15)"
          id="rUPYKgqaPEfNWvLVBHmQC"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 15.97 36.13)"
          id="qXhx_GubNExNe_MOyk4J_"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 11.66 36.13)"
          id="GmMlDF7SpWixg8q1e0aKD"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 7.28 36.14)"
          id="-myps8WMrt__FCfZSWhNZ"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.09 0.72 0 2.95 36.14)"
          id="jRp632YQTMZ_hb84Kaqgh"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 34.48 2.57)"
          id="NXylTTELzziIHRXg2AhJ6"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 34.48 14.46)"
          id="KnIuJx4k93S147QwMspx3"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 34.48 10.5)"
          id="O2RBhvxnlUhdEQUAfoshu"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 34.48 22.29)"
          id="nl_X9b3-wjekQjJbEgVt9"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 34.48 18.33)"
          id="SNDlAKdTNCC0dtDyzIcB8"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 34.48 30.21)"
          id="Yu7oHCSu4XuPIc_Fkra7U"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 34.48 26.25)"
          id="iw1LkT8BtRZIvDKgJCc_c"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 34.48 33.87)"
          id="W_tkYOFoBFzX7-05Qaefu"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 6.53)"
          id="_or_mReG-7rSbIo8LUGW7"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 2.57)"
          id="IvLBPXH13Gs-Xt44SBfJP"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 14.46)"
          id="SED3i75ZyAatcwUvorRXT"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 10.5)"
          id="krDYNyi4e1fy3z38TJ5lm"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 22.29)"
          id="NHJSlh1J98WT7xxbpVlq2"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 18.33)"
          id="_IaUv3dYg-6-Tw0IkICqB"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 30.21)"
          id="U9wrGe-dwQgDQQAWDyx7g"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 26.25)"
          id="dnTP2JriRnVuC4GMuai4E"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 0.14 33.88)"
          id="I0FZBA7E34AtQjBKAwe3t"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 12.83)"
          id="MM8q1vjDrJBKc_sDmkuOb"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 9.12)"
          id="2l5qoO_-esCVLJP0gkHOF"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 20.23)"
          id="JIeftoKtV9m5-4KdYU-Is"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 16.54)"
          id="y_aee_wm32zzAbULjXzO_"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 27.56)"
          id="hRmXdk7CjNmlLcsfL3NSh"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 23.85)"
          id="YqUl95Vahq9bPv5PqRg5M"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 34.95)"
          id="b4kXEfy50QEoETjVK3cw-"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 31.25)"
          id="B1Wubt1KwRSIV1flbFPgj"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 38.38)"
          id="hte_Jd6bw1AaFDyar7l9T"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 38.33 39.77)"
          id="hUy6tLHXY6j5266CwpX9t"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 34.4 39.6)"
          id="WAlciHHOBpAMTzVfCjqyG"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 30.29 39.61)"
          id="Bz9TF0yhFEw-14sQCphMo"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 26.26 39.61)"
          id="rf41d24w-OcZJRrBMZe77"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 22.54 39.59)"
          id="I_3q4b06XsvnS2aAOOLhF"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 18.51 39.59)"
          id="ZZPPYOi-CumCj4h9WSFYt"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 14.42 39.6)"
          id="D_oUK1DuMp4psX-tl5wq0"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 10.37 39.6)"
          id="EMMIq4LYuSurZjzT8zefi"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.08 0.67 0 6.03 39.6)"
          id="HmyataW3SS9oiYOqu6b2m"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.6 0.08 0 4.69 37.91)"
          id="Ng8oIDhLor4_K9sJCQEFk"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 0.07 0.91 0 37.55 4.76)"
          id="dSP65oEp0JMh1TZHnJUzP"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.52 -0.46 0.06 0.04 30.96 3.64)"
          id="J6yUVuefAgSbee4HkUeEq"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0.02 -0.01 -0.01 -0.02 32.83 2.4)"
          id="NGt3V3D4NCkSluSwWw4sh"
        >
          <path
            style={{
              stroke: "none",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(-40, -40)"
            d="M 60 40 L 80 80 L 40 80 L 0 80 L 20 40 L 40 0 L 60 40 z"
            strokeLinecap="round"
          />
        </g>
        <g
          transform="matrix(0 -0.56 0.08 0 39.77 6.14)"
          id="lxfNtmBv0g3jh5kDUI6XZ"
        >
          <path
            style={{
              stroke: "rgb(139,52,162)",
              strokeWidth: 0,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeDashoffset: 0,
              strokeLinejoin: "miter",
              strokeMiterlimit: 4,
              fill: "rgb(0,0,0)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            vectorEffect="non-scaling-stroke"
            transform="translate(0, 0)"
            d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    ),
    cornerRadius: 0,
  },
  {
    id: "sacm-ext-10",
    mainText: "Abstract Claim",
    type: "sacmExt10",
    title: "Abstract Claim",
    preview: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 20">
        {Array.from({ length: 10 }, (_, i) => (
          <g
            key={i}
            transform={`matrix(0.45 0 0 0.09 ${1.81 + i * 3.87} 0.24)`}
          >
            <path
              style={{
                stroke: "rgb(139,52,162)",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeDashoffset: 0,
                strokeLinejoin: "miter",
                strokeMiterlimit: 4,
                fill: "rgb(0,0,0)",
                fillRule: "nonzero",
                opacity: 1,
              }}
              vectorEffect="non-scaling-stroke"
              transform="translate(0, 0)"
              d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
              strokeLinecap="round"
            />
          </g>
        ))}

        {Array.from({ length: 10 }, (_, i) => (
          <g
            key={i + 8}
            transform={`matrix(0.45 0 0 0.09 ${1.81 + i * 3.87} 19.76)`}
          >
            <path
              style={{
                stroke: "rgb(139,52,162)",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeDashoffset: 0,
                strokeLinejoin: "miter",
                strokeMiterlimit: 4,
                fill: "rgb(0,0,0)",
                fillRule: "nonzero",
                opacity: 1,
              }}
              vectorEffect="non-scaling-stroke"
              transform="translate(0, 0)"
              d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
              strokeLinecap="round"
            />
          </g>
        ))}

        {Array.from({ length: 8 }, (_, i) => (
          <g
            key={i + 16}
            transform={`matrix(0 -0.45 0.09 0 0.24 ${1.81 + i * 2.74})`}
          >
            <path
              style={{
                stroke: "rgb(139,52,162)",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeDashoffset: 0,
                strokeLinejoin: "miter",
                strokeMiterlimit: 4,
                fill: "rgb(0,0,0)",
                fillRule: "nonzero",
                opacity: 1,
              }}
              vectorEffect="non-scaling-stroke"
              transform="translate(0, 0)"
              d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
              strokeLinecap="round"
            />
          </g>
        ))}

        {Array.from({ length: 8 }, (_, i) => (
          <g
            key={i + 24}
            transform={`matrix(0 -0.45 0.09 0 39.76 ${1.81 + i * 2.74})`}
          >
            <path
              style={{
                stroke: "rgb(139,52,162)",
                strokeWidth: 0,
                strokeDasharray: "none",
                strokeLinecap: "butt",
                strokeDashoffset: 0,
                strokeLinejoin: "miter",
                strokeMiterlimit: 4,
                fill: "rgb(0,0,0)",
                fillRule: "nonzero",
                opacity: 1,
              }}
              vectorEffect="non-scaling-stroke"
              transform="translate(0, 0)"
              d="M -2.44499 -2.44499 L 2.44499 -2.44499 L 2.44499 2.44499 L -2.44499 2.44499 z"
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>
    ),
    cornerRadius: 0,
  },
];
