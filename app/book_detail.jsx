
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";

const BookDetail = () => {
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { color } = useTheme();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("ข้อผิดพลาด", "กรุณาลงชื่อเข้าใช้เพื่อดูรายละเอียดหนังสือ");
          router.push("/signin");
          return;
        }
        console.log("Fetching book with ID:", id);
        const response = await fetch(`http://192.168.1.3:3000/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetch book response:", data);
        if (response.ok) {
          const fetchedBook = data.book;
          setBook(fetchedBook);
          setTitle(fetchedBook.title || "");
          setAuthor(fetchedBook.author || "");
          setDescription(fetchedBook.description || "");
          setGenre(fetchedBook.genre || "");
          setYear(fetchedBook.year ? fetchedBook.year.toString() : "");
          setPrice(fetchedBook.price ? fetchedBook.price.toString() : "");
          setAvailable(fetchedBook.available);
        } else {
          Alert.alert("ข้อผิดพลาด", data.message || "ไม่สามารถดึงข้อมูลหนังสือได้");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching book details:", error.message, error.stack);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลหนังสือได้ กรุณาตรวจสอบเครือข่ายและลองใหม่");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBook();
    } else {
      console.error("Invalid book ID:", id);
      Alert.alert("ข้อผิดพลาด", "ID หนังสือไม่ถูกต้อง");
      router.back();
    }
  }, [id, router]);

  const handleUpdate = async () => {
    if (!title || !author) {
      Alert.alert("ข้อผิดพลาด", "จำเป็นต้องมีชื่อเรื่องและผู้แต่ง");
      return;
    }
    setLoading(true);
    const updateData = {
      title,
      author,
      description,
      genre,
      year: parseInt(year) || 0,
      price: parseFloat(price) || 0,
      available,
    };
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("ข้อผิดพลาด", "กรุณาลงชื่อเข้าใช้เพื่ออัปเดตหนังสือ");
        router.push("/signin");
        return;
      }
      console.log("Updating book with ID:", id, "Data:", updateData);
      const response = await fetch(`http://192.168.1.3:3000/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      console.log("Update response:", data);
      if (response.ok) {
        Alert.alert("สำเร็จ", data.message || "อัปเดตหนังสือสำเร็จ");
        router.back();
      } else {
        Alert.alert("ข้อผิดพลาด", data.message || "ไม่สามารถอัปเดตหนังสือได้");
      }
    } catch (error) {
      console.error("Error updating book:", error.message, error.stack);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถอัปเดตหนังสือได้ กรุณาตรวจสอบเครือข่ายและลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log("handleDelete called for book ID:", id);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("ข้อผิดพลาด", "กรุณาลงชื่อเข้าใช้เพื่อลบหนังสือ");
        router.push("/signin");
        setLoading(false);
        return;
      }
      console.log("Sending DELETE request for book ID:", id);
      console.log("Using token:", token.substring(0, 10) + "...");
      const response = await fetch(`http://192.168.1.3:3000/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Delete response:", data, "Status:", response.status);
      if (response.ok) {
        Alert.alert("สำเร็จ", data.message || "ลบหนังสือสำเร็จ");
        router.back();
      } else {
        Alert.alert("ข้อผิดพลาด", data.message || `ไม่สามารถลบหนังสือได้ (สถานะ: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting book:", error.message, error.stack);
      Alert.alert("ข้อผิดพลาด", `ไม่สามารถลบหนังสือได้: ${error.message} กรุณาตรวจสอบเครือข่ายและลองใหม่`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = () => {
    console.log("Confirm delete triggered for book ID:", id);
    try {
      setShowDeleteModal(true);
    } catch (error) {
      console.error("Error showing delete modal:", error.message);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถแสดงการยืนยันการลบ กรุณาลองใหม่");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={color.primary} style={styles.loader} />;
  }

  if (!book) {
    return <Text style={[styles.errorText, { color: color.text }]}>ไม่พบหนังสือ</Text>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.title, { color: color.text }]}>รายละเอียดหนังสือ</Text>
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: color.primary }]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <MaterialIcons name="save" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, { color: "#fff" }]}>บันทึก</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log("Delete button pressed for book ID:", id, "Loading state:", loading);
              confirmDelete();
            }}
            style={[styles.button, { backgroundColor: color.error, opacity: loading ? 0.5 : 1 }]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <MaterialIcons name="delete" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={[styles.buttonText, { color: "#fff" }]}>ลบ</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: color.surface }]}>
            <Text style={[styles.modalTitle, { color: color.text }]}>ยืนยันการลบ</Text>
            <Text style={[styles.modalText, { color: color.textSecondary }]}>คุณแน่ใจว่าต้องการลบหนังสือเล่มนี้ใช่ไหม?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  console.log("Cancel deletion for book ID:", id);
                  setShowDeleteModal(false);
                }}
                style={[styles.button, { backgroundColor: color.textSecondary }]}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log("User confirmed deletion for book ID:", id);
                  handleDelete();
                }}
                style={[styles.button, { backgroundColor: color.error }]}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>ตกลง</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default BookDetail;

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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 120,
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
  loader: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "NotoSansThai-Regular",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "NotoSansThai-Regular",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "NotoSansThai-Regular",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
