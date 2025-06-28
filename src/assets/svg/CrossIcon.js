import * as React from "react"
import Svg, { G, Circle, Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        transform="translate(-321 -520) translate(0 490) translate(321 30)"
        stroke="none"
        strokeWidth={1}
        fill="none"
        fillRule="evenodd"
      >
        <Circle fill="#79CA14" cx={12} cy={12} r={12} />
        <Path
          d="M16.333 7l.667.667L12.666 12 17 16.333l-.667.667L12 12.666 7.667 17 7 16.333 11.333 12 7 7.667 7.667 7 12 11.333 16.333 7z"
          fill="#FFF"
        />
      </G>
    </Svg>
  )
}

export default SvgComponent
