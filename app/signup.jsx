
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { color } = useTheme();
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("ข้อผิดพลาด", "ต้องระบุอีเมลและรหัสผ่าน");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("userId", data.userId);
        Alert.alert("สำเร็จ", data.message || "สมัครสมาชิกสำเร็จ");
        router.push("/book");
      } else {
        Alert.alert("ข้อผิดพลาด", data.message || "สมัครสมาชิกล้มเหลว");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.title, { color: color.text }]}>สมัครสมาชิก</Text>

      <View style={[styles.form, { backgroundColor: color.surface }]}>
        {/* อีเมล */}
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

        {/* รหัสผ่าน */}
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

        {/* ปุ่มสมัครสมาชิก */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: color.primary }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <MaterialIcons name="person-add" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: "#fff" }]}>สมัครสมาชิก</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

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
