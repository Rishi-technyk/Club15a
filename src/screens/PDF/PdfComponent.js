import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Keyboard,
  TouchableOpacity,
  Image,
  Text,
  StatusBar,
  Platform,
} from "react-native";
import BackIcon from "../../assets/svg/BackButton";
import Pdf from "react-native-pdf";
import { connect } from "react-redux";
import { SECONDARY_COLOR } from "../../util/colors";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Header from "../../components/Header";

const PDFComponent = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  const { navigation, route } = props;
  console.log(route.params.url, "---------------route---------------");
  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            backgroundColor: "rgba(0, 0,0, 0.3)",
            flex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator
              size="large"
              color={SECONDARY_COLOR}
              animating={loading}
            />
          </View>
        </View>
      )}
      <Header title={"Invoice"} />

      <Pdf
        enablePaging={false}
        trustAllCerts={false}
        source={{ uri: route.params.url }}
        scale={1.0} // Force default scale
        minScale={1.0}
        maxScale={3.0}
        fitPolicy={0} // 0 = fit width, 1 = fit height, 2 = fit both
        onLoadComplete={(numberOfPages, filePath) => {
          setLoading(false);
        }}
        onPageChanged={(page, numberOfPages) => {}}
        onError={(error) => {
          console.log("PDF Error:", error);
          setLoading(false);
        }}
        onPressLink={(uri) => {}}
        style={styles.pdf}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
  const { commonReducer } = state;
  return {
    ...commonReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const PDFView = connect(mapStateToProps, mapDispatchToProps)(PDFComponent);
export default PDFView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: "100%",
  },
});
