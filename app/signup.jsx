import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "./context/ThemeContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { color } = useTheme();
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
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
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userId', data.userId);
        Alert.alert("Success", data.message || "Registered successfully");
        router.push("/book");
      } else {
        Alert.alert("Error", data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.title, { color: color.text }]}>Sign Up</Text>
      <View style={styles.form}>
        <Text style={[styles.label, { color: color.text }]}>Email *</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@email.com"
          keyboardType="email-address"
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholderTextColor={color.textSecondary}
        />
        <Text style={[styles.label, { color: color.text }]}>Password *</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Password"
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholderTextColor={color.textSecondary}
        />
        <Button
          title={loading ? "Signing up..." : "Signup"}
          onPress={handleSignup}
          color={color.primary}
          disabled={loading}
        />
        {loading && <ActivityIndicator size="small" color={color.primary} style={styles.loader} />}
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  loader: {
    marginTop: 10,
  },
});