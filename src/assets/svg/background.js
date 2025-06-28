import * as React from "react"
import Svg, { Defs, Path, G, Mask, Use } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */

const SvgComponent = ({height,width}) => (
  <>
  <Svg
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <Defs>
      <Path id="a" d="M0 0h375v812H0z" />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Mask id="b" fill="#fff">
        <Use xlinkHref="#a" />
      </Mask>
      <Use fill="#151831" xlinkHref="#a" />
      <Path
        d="M383.104 170.5c31.48 0 45.574-9.668 45.574-37.006S398.034 59 366.553 59c-31.48 0-109.162 44-57 49.5 52.162 5.5 42.07 62 73.551 62ZM60 119.851c51.143-20.484 90-40.294 90-90 0-49.705-121.818-30-90-90 31.818-60-90 80.557-90 90 0 9.444 38.857 110.485 90 90Z"
        fill="#363B5D"
        opacity={0.4}
        style={{
          mixBlendMode: "lighten",
        }}
        mask="url(#b)"
      />
    </G>
  </Svg>
  </>
)

export default SvgComponent
