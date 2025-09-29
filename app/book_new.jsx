
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "./context/ThemeContext";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const BookNew = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { color } = useTheme();

  const handleCreate = async () => {
    if (!title || !author) {
      Alert.alert("ข้อผิดพลาด", "จำเป็นต้องมีชื่อเรื่องและผู้แต่ง");
      return;
    }
    setLoading(true);
    const bookData = {
      title,
      author,
      description,
      genre,
      year: parseInt(year) || 0,
      price: parseFloat(price) || 0,
      available,
    };
    try {
      let accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (refreshToken) {
          const refreshResponse = await fetch("http://192.168.1.3:3000/api/auth/refresh-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });
          const refreshData = await refreshResponse.json();
          if (refreshResponse.ok) {
            accessToken = refreshData.accessToken;
            await AsyncStorage.setItem("accessToken", accessToken);
            await AsyncStorage.setItem("userId", refreshData.userId);
          } else {
            Alert.alert("ข้อผิดพลาด", "Session expired. Please sign in again.");
            router.push("/signin");
            return;
          }
        } else {
          Alert.alert("ข้อผิดพลาด", "กรุณาลงชื่อเข้าใช้เพื่อสร้างหนังสือ");
          router.push("/signin");
          return;
        }
      }

      const response = await fetch("http://192.168.1.3:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("สำเร็จ", data.message || "สร้างหนังสือสำเร็จ");
        router.back();
      } else {
        Alert.alert("ข้อผิดพลาด", data.message || "สร้างหนังสือล้มเหลว");
      }
    } catch (error) {
      console.error("Error creating book:", error);
      Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.title, { color: color.text }]}>สร้างหนังสือใหม่</Text>
      <View style={[styles.form, { backgroundColor: color.surface }]}>
        {/* ชื่อ */}
        <View style={[styles.inputContainer, { borderColor: color.textSecondary, backgroundColor: color.background }]}>
          <MaterialIcons name="title" size={20} color={color.textSecondary} style={styles.icon} />
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[styles.input, { color: color.text }]}
            placeholder="ใส่ชื่อหนังสือ"
            placeholderTextColor={color.textSecondary}
          />
        </View>

        {/* ผู้เขียน */}
        <View style={[styles.inputContainer, { borderColor: color.textSecondary, backgroundColor: color.background }]}>
          <MaterialIcons name="person" size={20} color={color.textSecondary} style={styles.icon} />
          <TextInput
            value={author}
            onChangeText={setAuthor}
            style={[styles.input, { color: color.text }]}
            placeholder="ใส่ชื่อผู้เขียน"
            placeholderTextColor={color.textSecondary}
          />
        </View>

        {/* คำอธิบาย */}
        <View style={[styles.inputContainer, { borderColor: color.textSecondary, backgroundColor: color.background }]}>
          <MaterialIcons name="description" size={20} color={color.textSecondary} style={styles.icon} />
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, { color: color.text, height: 100 }]}
            placeholder="ใส่รายละเอียดหนังสือ"
            placeholderTextColor={color.textSecondary}
          />
        </View>

        {/* ประเภท */}
        <View style={[styles.inputContainer, { borderColor: color.textSecondary, backgroundColor: color.background }]}>
          <MaterialIcons name="category" size={20} color={color.textSecondary} style={styles.icon} />
          <TextInput
            value={genre}
            onChangeText={setGenre}
            style={[styles.input, { color: color.text }]}
            placeholder="ใส่ประเภทหนังสือ"
            placeholderTextColor={color.textSecondary}
          />
        </View>

        {/* ปี */}
        <View style={[styles.inputContainer, { borderColor: color.textSecondary, backgroundColor: color.background }]}>
          <MaterialIcons name="calendar-today" size={20} color={color.textSecondary} style={styles.icon} />
          <TextInput
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            style={[styles.input, { color: color.text }]}
            placeholder="ใส่ปีที่พิมพ์"
            placeholderTextColor={color.textSecondary}
          />
        </View>

        {/* ราคา */}
        <View style={[styles.inputContainer, { borderColor: color.textSecondary, backgroundColor: color.background }]}>
          <MaterialIcons name="attach-money" size={20} color={color.textSecondary} style={styles.icon} />
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={[styles.input, { color: color.text }]}
            placeholder="ใส่ราคาหนังสือ"
            placeholderTextColor={color.textSecondary}
          />
        </View>

        {/* ปุ่มสร้าง */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: color.primary }]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <MaterialIcons name="add" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: "#fff" }]}>สร้างหนังสือ</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BookNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
