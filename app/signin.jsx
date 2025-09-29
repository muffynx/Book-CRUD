
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "./context/ThemeContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Authenticate from "./components/Authenticate";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  const { color } = useTheme();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      router.push("/book");
    }
  };

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert("ข้อผิดพลาด", "ต้องระบุอีเมลและรหัสผ่าน");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.3:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("userId", data.userId);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken); // เก็บ refreshToken ใน SecureStore
        // สร้าง biometricKey ใหม่ (เช่น ใช้ timestamp + userId หรือรหัสสุ่ม)
        const biometricKey = `${Date.now()}_${data.userId}_${Math.random().toString(36).substring(2, 15)}`;
        await SecureStore.setItemAsync("biometricKey", biometricKey); // เก็บ biometricKey แยก
        Alert.alert("สำเร็จ", data.message || "เข้าสู่ระบบสำเร็จ");
        router.push("/book");
      } else {
        Alert.alert("ข้อผิดพลาด", data.message || "เข้าสู่ระบบล้มเหลว");
      }
    } catch (error) {
      console.error("Error during signin:", error);
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่ (Network request failed)");
    } finally {
      setLoading(false);
    }
  };

const handleBiometricSuccess = async () => {
  const storedBiometricKey = await SecureStore.getItemAsync("biometricKey");
  if (!storedBiometricKey) {
    Alert.alert("ข้อผิดพลาด", "กรุณาลงชื่อเข้าใช้ด้วยรหัสผ่านเพื่อตั้งค่า Biometrics");
    router.push("/signin");
    return;
  }

  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) {
      Alert.alert("ข้อผิดพลาด", "ไม่มี refreshToken กรุณาลงชื่อเข้าใช้ใหม่");
      router.push("/signin");
      return;
    }

    const response = await fetch("http://192.168.1.3:3000/api/auth/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("userId", data.userId);
     
      router.push("/book");
    } 
  } catch (error) {
    
  }
};
  

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.title, { color: color.text }]}>เข้าสู่ระบบ</Text>
      <View style={[styles.form, { backgroundColor: color.surface }]}>
        <View style={[styles.inputContainer, { borderColor: color.textSecondary, backgroundColor: color.background }]}>
          <Ionicons name="mail-outline" size={20} color={color.textSecondary} style={styles.icon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="อีเมล@example.com"
            keyboardType="email-address"
            style={[styles.input, { color: color.text }]}
            placeholderTextColor={color.textSecondary}
          />
        </View>
        <View style={[styles.inputContainer, { borderColor: color.textSecondary, backgroundColor: color.background }]}>
          <MaterialIcons name="lock-outline" size={20} color={color.textSecondary} style={styles.icon} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="รหัสผ่าน"
            style={[styles.input, { color: color.text }]}
            placeholderTextColor={color.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: color.primary }]}
          onPress={handleSignin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <MaterialIcons name="login" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: "#fff" }]}>เข้าสู่ระบบ</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: color.secondary }]}
          onPress={() => setUseBiometric(true)}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>ใช้ Biometrics</Text>
        </TouchableOpacity>
      </View>
      {useBiometric && (
        <Authenticate onSuccess={handleBiometricSuccess} />
      )}
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "NotoSansThai-Regular",
  },
  form: {
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "NotoSansThai-Regular",
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "NotoSansThai-Regular",
  },
});
