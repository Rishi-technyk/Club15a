import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ENDPOINT, FONT_FAMILY } from "../util/constant";
import moment from "moment";
import DatePickerComponent from "../screens/Transaction/DatePicker";
import * as api from "../util/api";
import RNFS from "react-native-fs";
import { DARK_BLUE, SECONDARY_COLOR } from "../util/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { useNavigation } from "@react-navigation/native";
import InvoiceStyle from "../Styles/InvoiceStyle";
import { ModalStyles } from "../Styles/ModalStyles";
import { Toast } from "react-native-toast-notifications";

const DownloadModal = ({ visible, setVisible, data }) => {
  const [click, setClick] = useState(null);
  const [loader, setLoader] = useState(false);
  const [resetDate, setResetDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { userData } = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const arrData = [
    "Last 1 month",
    "Last 3 months",
    "Last 6 months",
    "Last 1 Year",
    "Select a duration",
  ];
  const apiCallDownload = async () => {
    let body = {};
    let path = {};
    path.ws_type =
      data === "Credit"
        ? ENDPOINT.invoice_transaction_download
        : ENDPOINT.transaction_download;
    body.member_id = userData.data.data[0].MemberID;
    body.pay_mode = data === "wallet" ? "SmartCard" : "CREDIT";
    body.start_date = startDate;
    body.end_date = endDate;
    if (data !== "Credit") {
      body.pay_mode = data === "member" ? "SmartCard" : "CREDIT";
    }

    try {
      const apiRequestObject = {
        path: path.ws_type,
        body: body,
        Token: userData.data.token,
      };
      console.log(apiRequestObject);
      setLoader(true);
      const response = await api.javascriptPost(apiRequestObject);
      setClick(null)
      setLoader(false);
      if (response.status === true) {
        onProceed(response.data);
      } else {
        Toast.show(response.message || "Something went wrong.",
          {
            type:'warning',
          }
        );
        return { result: "FAILURE" };
      }
    } catch (err) {
      console.log(err);
      return { result: "FAILURE" };
    }
  };
  const onSelect = (ind) => {
    if (ind !== 4) {
      setStartDate("");
      setEndDate("");
      const monthNo = ind === 0 ? 1 : ind === 1 ? 3 : ind === 2 ? 6 : 12;
      const currDate = moment(new Date()).format("YYYY-MM-DD");
      setEndDate(currDate);
      var dateFrom = moment(currDate)
        .subtract(monthNo, "months")
        .format("YYYY-MM-DD");
      setStartDate(dateFrom);

      setClick(ind);
    } else {
      setStartDate("");
      setEndDate("");
      setClick(ind);
    }
  };
  const onProceed = async (filePath) => {
    Toast.hideAll();
    try {
      const randomNum = Date.now();
      let options = {
        html: filePath,
        fileName: `Transaction_${userData?.data?.data[0]?.MemberID}_${data}_${randomNum}`,
        directory: "Documents",
      };
      const path =
        Platform.OS === "ios"
          ? RNFS.LibraryDirectoryPath
          : RNFS.DownloadDirectoryPath;
      const destPath =
        path +
        "/" +
        `Transaction_${userData?.data?.data[0]?.MemberID}_${data}_${randomNum}.pdf`;

      let file = await RNHTMLtoPDF.convert(options);
      await RNFS.copyFile(file.filePath, destPath);
      setLoader(false);
      setVisible(false);

      if (file) {
        Alert.alert(
          "File Downloaded Successfully",
          ``,
          [
            {
              text: "OK",
            },
            {
              text: "Open File",
              onPress: () => {
                RNFS.exists(destPath)
                  .then((exists) => {
                    if (exists) {
                      navigation.navigate("PDFView", {
                        url: destPath,
                        title: "Statement",
                      });
                    } else {
                      Toast.show("File does not exist:", {
                        type: "warning",
                      });
                    }
                  })
                  .catch((error) => {
                    Toast.show( error.message || "File does not exist:", {
                      type: "danger",
                    });
                  });
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      setLoader(false);
      Toast.show("Error during file download or open", {
        type: "danger",
      });
    }
  };
  return (
    <Modal
      transparent={true}
      dismissableBackButton={true}
      onRequestClose={() => {
        setVisible(false), setClick(null);
      }}
      statusBarTranslucent={true}
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "overFullScreen"}
      dismissable={true}
      visible={visible}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ModalStyles.modal}>
        <View style={ModalStyles.innerModalCont}>
          <View style={InvoiceStyle.headingContainer}>
            <Text style={InvoiceStyle.headingText}>Download Statment</Text>
            <Icon
              onPress={() => {
                setVisible(false), setClick(null);
              }}
              name="close"
              size={25}
              style={ModalStyles.cancelText}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={arrData}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => onSelect(index)}
                    activeOpacity={0.7}
                    style={ModalStyles.listRow}>
                    <View
                      style={{
                        flex: 0.1,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}>
                      <Image
                        source={
                          click === index
                            ? require("../assets/images/circleFilled.png")
                            : require("../assets/images/circle.png")
                        }
                        style={{ height: 15, width: 15 }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 0.8,
                        alignItems: "flex-start",
                        justifyContent: "center",
                      }}>
                      <Text style={ModalStyles.downloadText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                  {index === 4 && click === 4 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}>
                      <View style={{}}>
                        <Text style={ModalStyles.headerStyle}>{"Start Date"}</Text>
                        <DatePickerComponent
                          placeholder={"Start Date"}
                          setResetDate={resetDate}
                          stateDate={setStartDate}
                          maxDate={new Date()}
                        />
                      </View>
                      <View>
                        <Text style={ModalStyles.headerStyle}>{"End Date"}</Text>
                        <DatePickerComponent
                          placeholder={"End Date"}
                          setResetDate={resetDate}
                          stateDate={setEndDate}
                          maxDate={new Date()}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            }}
          />
          {(click !== 4 ||
            (click == 4 && startDate !== "" && endDate !== "")) &&
            click !== null && (
              <TouchableOpacity
                onPress={apiCallDownload}
                activeOpacity={0.9}
                style={ModalStyles.submitContainer}>
                {loader && (
                  <ActivityIndicator
                    style={{ marginRight: 20 }}
                    color={"white"}
                  />
                )}

                <Text style={ModalStyles.confirmText}>Download</Text>
              </TouchableOpacity>
            )}
        </View>
      </ScrollView>
    </Modal>
  );
};

export default DownloadModal;


