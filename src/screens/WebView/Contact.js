import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  FlatList,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import NewButton from "../../components/Button";
import Header from "../../components/Header";
import { FONT_FAMILY, SECONDARY_COLOR } from "../../util/constant";
import { Toast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { ENDPOINT } from "../../util/constant";
import { javascriptPost } from "../../util/api";
import Icons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";

const Contact = ({ navigation }) => {
  const token = useSelector((state) => state.auth.userData.data.token);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const scrollViewRef = useRef();
  const Items = [
    {
      id: 1,
      icon: "location-on",
      text: `Club road in Sector 15A Noida, Gautam Budh Nagar, Uttar Pradesh 201301.`,
    },
    {
      id: 2,
      icon: "email",
      text: `15asportsclub@gmail.com`,
      color: "rgb(36, 126, 252)",
    },
    {
      id: 3,
      icon: "call",
      text: `+91 120 251 6379`,
      color: "rgb(36, 126, 252)",
    },
  ];
  const [Inputs, setInputs] = useState([
    {
      id: 1,
      placeHolder: "Enter Name",
      name: "Name",
      maxLength: 50,
      keyboardType: "default",
      value: "",
    },
    {
      id: 2,
      placeHolder: "Enter Email",
      name: "Email",
      maxLength: 50,
      keyboardType: "email-address",
      value: "",
    },
    {
      id: 3,
      placeHolder: "Enter Phone",
      name: "Phone",
      maxLength: 10,
      keyboardType: "phone-pad",
      value: "",
    },
    {
      id: 4,
      placeHolder: "Enter Subject",
      name: "Subject",
      maxLength: 100,
      keyboardType: "default",
      value: "",
    },
    {
      id: 5,
      placeHolder: "Write Message",
      name: "Message",
      maxLength: 200,
      keyboardType: "default",
      value: "",
    },
  ]);

  const handleChangeText = (text, id) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, value: text } : input
      )
    );
  };

  const validateInputs = () => {
    const [name, email, phone, subject, message] = Inputs.map((input) =>
      input.value.trim()
    );
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name) return "Please enter your name.";
    if (!email || !emailRegex.test(email)) return "Please enter a valid email.";
    if (!phone || phone.length !== 10) return "Phone must be 10 digits.";
    if (!subject) return "Please enter a subject.";
    if (!message) return "Please enter a message.";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateInputs();
    if (error) return Toast.show(error, { type: "danger" });

    const body = {
      name: Inputs[0].value,
      email: Inputs[1].value,
      phone: Inputs[2].value,
      subject: Inputs[3].value,
      message: Inputs[4].value,
    };

    try {
      setLoading(true);
      const response = await javascriptPost({
        path: ENDPOINT.feedBack,
        body,
        Token: token,
      });
      setLoading(false);
      if (response?.success) {
        Toast.show("Your message has been sent!", { type: "success" });
        setInputs((prev) => prev.map((field) => ({ ...field, value: "" })));
        navigation.goBack();
      } else {
        Toast.show(response?.message || "Failed to send. Try again.", {
          type: "danger",
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show("Something went wrong. Please try later.", { type: "danger" });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header title="Contact Us" />
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        extraScrollHeight={80}
        extraHeight={80}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20 }}
      >
        <FlatList
          // scrollEnabled={false}
          data={Items}
          contentContainerStyle={{ flex: 1 }}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  alignItems: "center",
                }}
              >
                <Icons
                  name={item.icon}
                  size={20}
                  color={"#000"}
                  style={{ marginRight: 10 }}
                />
                <Text
                  onPress={() => handleContactPress(item)}
                  style={{
                    color: "black",
                    fontFamily: FONT_FAMILY.normal,
                    color: item.color ? item.color : "black",
                    flexWrap:'wrap'
                  }}
                >
                  {item.text}
                </Text>
              </View>
            );
          }}
        />
        {Inputs.map((item, index) => (
          <View key={item.id} style={{ marginBottom: 15 }}>
            <Text style={{ color: "black", fontFamily: FONT_FAMILY.normal }}>
              {item.name}
            </Text>
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={{
                borderWidth: 0.3,
                borderRadius: 10,
                padding: 10,
                marginTop: 5,
                fontFamily: FONT_FAMILY.normal,
                minHeight: item.id === 5 ? 150 : undefined,
                textAlignVertical: "top",
                color: "black",
              }}
          
              placeholder={item.placeHolder}
              placeholderTextColor="grey"
              keyboardType={item.keyboardType}
              maxLength={item.maxLength}
              value={item.value}
              onChangeText={(text) => handleChangeText(text, item.id)}
              returnKeyType={index === Inputs.length - 1 ? "done" : "next"}
              onSubmitEditing={() => {
                if (index < Inputs.length - 1) {
                  inputRefs.current[index + 1]?.focus();
                } else {
                  Keyboard.dismiss();
                  handleSubmit();
                }
              }}
              blurOnSubmit={false}
            />
          </View>
        ))}

        <NewButton
          loading={loading}
          onPress={handleSubmit}
          text="Ask A Question"
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Contact;

// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TextInput,
//   Linking,
//   Alert,
//   Keyboard,
//   KeyboardAvoidingView,
// } from "react-native";
// import React, { useRef, useState } from "react";
// import Icons from "react-native-vector-icons/MaterialIcons";
// import Icon from "react-native-vector-icons/Ionicons";
// import { Marker } from "react-native-svg";
// import Header from "../../components/Header";
// import NewButton from "../../components/Button";
// import { ENDPOINT, FONT_FAMILY, SECONDARY_COLOR } from "../../util/constant";
// import { Toast } from "react-native-toast-notifications";
// import { javascriptPost } from "../../util/api";
// import { useSelector } from "react-redux";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// const Contact = ({ navigation }) => {
//   const token = useSelector((state) => state.auth.userData.data.token);
//   const inputRefs = useRef([]);
//   const Items = [
//     {
//       id: 1,
//       icon: "location-on",
//       text: `Sector 15A, Noida, Uttar Pradesh 201301`,
//     },
//     {
//       id: 2,
//       icon: "email",
//       text: `info@club15a.com`,
//       color: "rgb(36, 126, 252)",
//     },
//     // {
//     //   id: 3,
//     //   icon: "call",
//     //   text: `+91-9876543210`,
//     //   color: "rgb(36, 126, 252)",
//     // },
//   ];
//   const [loading, setLoading] = useState(false);
//   const handleContactPress = (item) => {
//     if (item.icon === "email") {
//       const emailUrl = `mailto:${item.text}`;
//       Linking.openURL(emailUrl).catch(() =>
//         Toast.show("Could not open email app.", { type: "warning" })
//       );
//     } else if (item.icon === "call") {
//       // Remove any non-digit characters (like dash or spaces)
//       const phoneNumber = item.text.replace(/[^\d+]/g, "");
//       const phoneUrl = `tel:${phoneNumber}`;
//       Linking.openURL(phoneUrl).catch(() =>
//         Toast.show("Could not open phone dialer.", { type: "warning" })
//       );
//     }
//   };
//   const [Inputs, setInputs] = useState([
//     {
//       id: 1,
//       placeHolder: "Enter Name",
//       name: "Name",
//       maxLength: 50,
//       keyboardType: "ascii-capable",
//       value: "",
//     },
//     {
//       id: 2,
//       placeHolder: "Enter Email",
//       name: "Email",
//       maxLength: 50,
//       keyboardType: "email-address",
//       value: "",
//     },
//     {
//       id: 3,
//       placeHolder: "Enter Phone",
//       name: "Phone",
//       maxLength: 10,
//       keyboardType: "phone-pad",
//       value: "",
//     },
//     {
//       id: 4,
//       placeHolder: "Enter Subject",
//       name: "Subject",
//       maxLength: 100,
//       keyboardType: "default",
//       value: "",
//     },
//     {
//       id: 5,
//       placeHolder: "Write Message",
//       name: "Message",
//       maxLength: 200,
//       keyboardType: "default",
//       value: "",
//     },
//   ]);
//   const handleChangeText = (text, id) => {
//     setInputs((prevInputs) =>
//       prevInputs.map((input) =>
//         input.id === id ? { ...input, value: text } : input
//       )
//     );
//   };
//   const validateInputs = () => {
//     const name = Inputs[0].value.trim();
//     const email = Inputs[1].value.trim();
//     const phone = Inputs[2].value.trim();
//     const subject = Inputs[3].value.trim();
//     const message = Inputs[4].value.trim();

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!name) return "Please enter your name.";
//     if (!email || !emailRegex.test(email)) return "Please enter a valid email.";
//     if (!phone || phone.length !== 10) return "Phone must be 10 digits.";
//     if (!subject) return "Please enter a subject.";
//     if (!message) return "Please enter a message.";

//     return null;
//   };

//   const handleSubmit = async () => {
//     const error = validateInputs();
//     if (error) return Toast.show(error, { type: "danger" });

//     const body = {
//       name: Inputs[0].value,
//       email: Inputs[1].value,
//       phone: Inputs[2].value,
//       subject: Inputs[3].value,
//       message: Inputs[4].value,
//     };

//     const apiRequestObject = {
//       path: ENDPOINT.feedBack,
//       body,
//       Token: token,
//     };

//     try {
//       setLoading(true);
//       const response = await javascriptPost(apiRequestObject);
//       console.log(
//         "\x1b[36m%s\x1b[0m",
//         response,
//         "---------------------- response ---------------------"
//       );
//       setLoading(false);
//       if (response?.success) {
//         Toast.show("Your message has been sent!", { type: "success" });
//         setInputs((prev) => prev.map((field) => ({ ...field, value: "" }))); // clear
//         navigation.goBack(); // go back to previous screen
//       } else {
//         Toast.show(response?.message || "Failed to send. Try again.", {
//           type: "danger",
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       Toast.show("Something went wrong. Please try later.", { type: "danger" });
//     }
//   };
//   return (
//     <View style={styles.container}>
//       <Header title={"Contact Us"} />
//       <ScrollView style={{ margin: 20 }} showsVerticalScrollIndicator={false}>
//         {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
//                     keyboardVerticalOffset={ 200}
//                     style={{ flex: 1, marginBottom: 20 }}
//                   > */}
//         <View>
//           <Text style={{ fontFamily: FONT_FAMILY.bold, fontSize: 20 }}>
//             OFFICE ADDRESS
//           </Text>
//           <FlatList
//             // scrollEnabled={false}
//             data={Items}
//             contentContainerStyle={{ flex: 1 }}
//             renderItem={({ item }) => {
//               return (
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     margin: 10,
//                     alignItems: "center",
//                   }}
//                 >
//                   <Icons
//                     name={item.icon}
//                     size={20}
//                     color={"#000"}
//                     style={{ marginRight: 10 }}
//                   />
//                   <Text
//                     onPress={() => handleContactPress(item)}
//                     style={{
//                       color: "black",
//                       fontFamily: FONT_FAMILY.normal,
//                       color: item.color ? item.color : "black",
//                     }}
//                   >
//                     {item.text}
//                   </Text>
//                 </View>
//               );
//             }}
//           />
//         </View>
//         <View>
//           <KeyboardAwareScrollView
//             // style={{ margin: 20 }}
//             showsVerticalScrollIndicator={false}
//             enableOnAndroid={true}
//             extraScrollHeight={20}
//             keyboardShouldPersistTaps="handled"
//           >
//             <FlatList
//               data={Inputs}
//               contentContainerStyle={{ flex: 1 }}
//               renderItem={({ item, index }) => {
//                 return (
//                   <View
//                     style={{
//                       margin: 10,
//                     }}
//                   >
//                     <Text
//                       style={{ color: "black", fontFamily: FONT_FAMILY.normal }}
//                     >
//                       {item.name}
//                     </Text>

//                     <TextInput
//                       ref={(el) => (inputRefs.current[index] = el)}
//                       style={{
//                         borderWidth: 0.3,
//                         borderRadius: 10,
//                         padding: 10,
//                         marginVertical: 5,
//                         fontFamily: FONT_FAMILY.normal,
//                         minHeight: item.id === 5 ? 150 : undefined,
//                         textAlignVertical: "top",
//                         color: "black",
//                       }}
//                       placeholderTextColor={"grey"}
//                       scrollEnabled={false}
//                       // multiline={true}
//                       cursorColor={SECONDARY_COLOR}
//                       maxLength={item.maxLength}
//                       keyboardType={item.keyboardType || "decimal-pad"}
//                       value={item.value}
//                       onChangeText={(text) => handleChangeText(text, item.id)}
//                       placeholder={item.placeHolder}
//                       returnKeyType={
//                         index === Inputs.length - 1 ? "done" : "next"
//                       }
//                       blurOnSubmit={item.id === 5}
//                       onSubmitEditing={() => {
//                         if (index < Inputs.length - 1) {
//                           inputRefs.current[index + 1]?.focus();
//                         } else {
//                           handleSubmit(); // submit on last
//                         }
//                       }}
//                     />
//                   </View>
//                 );
//               }}
//             />
//           </KeyboardAwareScrollView>
//         </View>
//         {/* </KeyboardAvoidingView> */}
//       </ScrollView>
//       <View style={{ margin: 20 }}>
//         <NewButton
//           loading={loading}
//           onPress={handleSubmit}
//           text={"Ask A Question"}
//         />
//       </View>
//     </View>
//   );
// };

// export default Contact;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "white" },
// });
