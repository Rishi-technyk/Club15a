import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.018 12l6.616-6.805a1.312 1.312 0 000-1.818 1.226 1.226 0 00-1.768 0l-7.5 7.714a1.312 1.312 0 000 1.818l7.5 7.714c.488.503 1.28.503 1.768 0a1.312 1.312 0 000-1.818L10.018 12z"
        transform="translate(-20 -54) translate(0 44) translate(20 10)"
        fill="#151831"
        fillRule="nonzero"
        stroke="none"
        strokeWidth={1}
      />
    </Svg>
  )
}

export default SvgComponent
