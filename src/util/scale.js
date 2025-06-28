import ActualDimensions from './DeviceDimension';
const { width, height } = ActualDimensions;

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

/**
 * Function to scale a value based on the size of the screen size and the original
 * size used on the design.
 */

const scale = (size) => {
	return width / guidelineBaseWidth * size;
}

const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {verticalScale, moderateScale, scale};
export default scale;