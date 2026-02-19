import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

import splashAnimation from "../../assets/animations/feedback.json";

export default function SplashAnimation() {
  return (
    <View style={styles.container}>
      <LottieView
        source={splashAnimation}
        autoPlay={true}
        style={{ width: "100%", height: "100%" }}
        loop={true}
        speed={2.2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Ensure the background matches the animation
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 300,
    height: 300,
  },
});
