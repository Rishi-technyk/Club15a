import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12 13.982l6.805-6.616a1.312 1.312 0 011.818 0c.503.488.503 1.28 0 1.768l-7.714 7.5a1.312 1.312 0 01-1.818 0l-7.714-7.5a1.226 1.226 0 010-1.768 1.312 1.312 0 011.818 0L12 13.982z"
        fill="#151831"
      />
    </Svg>
  )
}

export default SvgComponent
