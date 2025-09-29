
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../context/ThemeContext";

const Authenticate = ({ onSuccess }) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { color } = useTheme();

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(hasHardware);
      if (hasHardware) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);
      }
    })();
  }, []);

  const handleBiometricAuth = async () => {
    if (!isBiometricSupported || !isEnrolled) {
      Alert.alert("ข้อผิดพลาด", "อุปกรณ์ไม่รองรับ Biometrics หรือยังไม่ได้ลงทะเบียน");
      return;
    }

    try {
      const biometricKey = await SecureStore.getItemAsync("biometricKey");
      if (!biometricKey) {
        Alert.alert("ข้อผิดพลาด", "กรุณาลงชื่อเข้าใช้ด้วยรหัสผ่านก่อนใช้ Biometrics");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "โปรดยืนยันตัวตนเพื่อเข้าสู่ระบบ",
      });

      if (result.success) {
        onSuccess();
        Alert.alert("สำเร็จ", "ยืนยันตัวตนสำเร็จ!");
      } else {
        Alert.alert("ล้มเหลว", `การยืนยันตัวตนล้มเหลว: ${result.error}`);
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการยืนยันตัวตน");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.heading, { color: color.text }]}>ยืนยันตัวตน</Text>
      <Text style={[styles.status, { color: color.textSecondary }]}>
        รองรับ Biometrics: {isBiometricSupported ? "ใช่" : "ไม่"}
      </Text>
      <Text style={[styles.status, { color: color.textSecondary }]}>
        ลงทะเบียน Biometrics: {isEnrolled ? "ใช่" : "ไม่"}
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: color.primary }]}
        onPress={handleBiometricAuth}
        disabled={!isBiometricSupported || !isEnrolled}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>ยืนยันด้วย Biometrics</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "NotoSansThai-Regular",
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "NotoSansThai-Regular",
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "NotoSansThai-Regular",
  },
});

export default Authenticate;
