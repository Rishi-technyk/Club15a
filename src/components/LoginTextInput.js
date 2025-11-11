import React, {useState, useRef} from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import _ from 'lodash';
import {LIGHT_GREY, RED_COLOR} from '../util/colors';
import {moderateScale} from '../util/scale';
import {FONT_FAMILY} from '../util/constant';

const LoginTextInput = ({
  name,
  textValue,
  secureTextEntry = false,
  canManageTextVisibility = false,
  onChangeText,
  required = false,
  keyboardType,
  returnKeyType,
  onDone,
  onFocusLost,
  placeholder,
  maxLength,
}) => {
  const [error, setError] = useState('');
  const [isHidden, setIsHidden] = useState(true);
  const txtInputRef = useRef(null);

  const focus = () => {
    txtInputRef.current.focus();
  };

  const renderStar = () => {
    return <Text style={styles.starText}> * </Text>;
  };

  const renderError = () => {
    return <Text style={styles.starText}>{error}</Text>;
  };

  return (
    <View style={[styles.container]}>
      <View>
        <View style={styles.requiredFieldsContainer}>
          <Text style={styles.label}>{name}</Text>
          {required && renderStar()}
          {!_.isEmpty(error) && renderError()}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            ref={txtInputRef}
            value={textValue}
            secureTextEntry={
              secureTextEntry && canManageTextVisibility
                ? isHidden
                : secureTextEntry
            }
            maxLength={maxLength ? maxLength : 20}
            style={[styles.textInput,{paddingVertical:Platform.OS=='ios'&&20}]}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            placeholderTextColor="#363b5d"
            onBlur={onFocusLost}
            placeholder={placeholder}
            onFocus={focus}
            returnKeyType={returnKeyType || 'done'}
            onSubmitEditing={onDone}
          />
          {secureTextEntry && canManageTextVisibility && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsHidden(!isHidden)}
              style={styles.eyeIconTouchable}>
              <Image
                source={
                  isHidden
                    ? require('../assets/images/eye.png')
                    : require('../assets/images/eyeClose.png')
                }
                style={{height: 20, width: 20, tintColor: 'black'}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eyeIconTouchable: {
    position: 'absolute',
    alignSelf: 'flex-end',
    margin: 15,
    right: 0,
  },
  label: {
    color: '#016BBD',
    fontFamily: FONT_FAMILY.normal,
    fontSize: moderateScale(14),
  },
  textInput: {
    color: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#363b5d',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: FONT_FAMILY.normal,
  },
  container: {
    paddingHorizontal: moderateScale(0),
    paddingTop: moderateScale(0),
  },
  requiredFieldsContainer: {
    flexDirection: 'row',
    paddingBottom: moderateScale(0),
  },
  starText: {
    color: RED_COLOR,
    fontSize: moderateScale(10),
    marginLeft: moderateScale(5),
  },
  inputContainer: {
    position: 'relative',
  },
});

export default LoginTextInput;

// import React, {useState, useRef} from 'react';
// import {
//   TouchableWithoutFeedback,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   View,
//   TextInput,
//   Image,
//   Platform,
// } from 'react-native';
// import _ from 'lodash';
// import {LIGHT_GREY, RED_COLOR} from '../util/colors';
// import {moderateScale} from '../util/scale';
// import {FONT_FAMILY} from '../util/constant';

// const LoginTextInput = ({
//   name,
//   textValue,
//   secureTextEntry = false,
//   canManageTextVisibility = false,
//   onChangeText,
//   required = false,
//   keyboardType,
//   returnKeyType,
//   onDone,
//   onFocusLost,
//   placeholder,
//   maxLength,
// }) => {
//   const [error, setError] = useState('');
//   const [isHidden, setIsHidden] = useState(true);
//   const txtInputRef = useRef(null);

//   const focus = () => {
//     txtInputRef.current.focus();
//   };

//   const renderStar = () => {
//     return <Text style={styles.starText}> * </Text>;
//   };

//   const renderError = () => {
//     return <Text style={styles.starText}>{error}</Text>;
//   };

//   return (
//     <View style={[styles.container]}>
//       <View>
//         <View style={styles.requiredFieldsContainer}>
//           <Text style={styles.label}>{name}</Text>
//           {required && renderStar()}
//           {!_.isEmpty(error) && renderError()}
//         </View>
//         <View style={styles.inputContainer}>
//           <TextInput
//             ref={txtInputRef}
//             value={textValue}
//             secureTextEntry={
//               secureTextEntry && canManageTextVisibility
//                 ? isHidden
//                 : secureTextEntry
//             }
//             maxLength={maxLength ? maxLength : 20}
//             style={[styles.textInput,{paddingVertical:Platform.OS=='ios'&&20}]}
//             keyboardType={keyboardType}
//             onChangeText={onChangeText}
//             placeholderTextColor="#363b5d"
//             onBlur={onFocusLost}
//             placeholder={placeholder}
//             onFocus={focus}
//             returnKeyType={returnKeyType || 'done'}
//             onSubmitEditing={onDone}
//           />
//           {secureTextEntry && canManageTextVisibility && (
//             <TouchableOpacity
//               activeOpacity={0.8}
//               onPress={() => setIsHidden(!isHidden)}
//               style={styles.eyeIconTouchable}>
//               <Image
//                 source={
//                   isHidden
//                     ? require('../assets/images/eye.png')
//                     : require('../assets/images/eyeClose.png')
//                 }
//                 style={{height: 20, width: 20, tintColor: 'black'}}
//               />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   eyeIconTouchable: {
//     position: 'absolute',
//     alignSelf: 'flex-end',
//     right: 15,
//     bottom: 15,
//   },
//   label: {
//     color: '#016BBD',
//     fontFamily: FONT_FAMILY.normal,
//     fontSize: moderateScale(14),
//   },
//   textInput: {
//     color: 'black',
//     borderBottomWidth: 1,
//     borderBottomColor: '#363b5d',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     fontFamily: FONT_FAMILY.normal,
//   },

//   requiredFieldsContainer: {
//     flexDirection: 'row',
//     paddingBottom: moderateScale(0),
//   },
//   starText: {
//     color: RED_COLOR,
//     fontSize: moderateScale(10),
//     marginLeft: moderateScale(5),
//   },
//   inputContainer: {
//     // position: 'relative',
//   },
// });

// export default LoginTextInput;
