import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "./context/ThemeContext";

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
      Alert.alert("Error", "จำเป็นต้องมีชื่อเรื่องและผู้แต่ง");
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
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "กรุณาลงชื่อเข้าใช้เพื่อสร้างหนังสือ");
        router.push("/signin");
        return;
      }
      const response = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message || "Book created successfully");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to create book");
      }
    } catch (error) {
      console.error("Error creating book:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.title, { color: color.text }]}>สร้างหนังสือใหม่</Text>
      <View style={styles.form}>
        <Text style={[styles.label, { color: color.text }]}>ชื่อ *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="กรอกชื่อหนังสือ"
          placeholderTextColor={color.textSecondary}
        />
        <Text style={[styles.label, { color: color.text }]}>ผู้เขียน *</Text>
        <TextInput
          value={author}
          onChangeText={setAuthor}
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="กรอกชื่อผู้เขียน"
          placeholderTextColor={color.textSecondary}
        />
        <Text style={[styles.label, { color: color.text }]}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="กรอกรายละเอียดหนังสือ"
          placeholderTextColor={color.textSecondary}
        />
        <Text style={[styles.label, { color: color.text }]}>Genre</Text>
        <TextInput
          value={genre}
          onChangeText={setGenre}
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="Enter genre"
          placeholderTextColor={color.textSecondary}
        />
        <Text style={[styles.label, { color: color.text }]}>Year</Text>
        <TextInput
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="Enter publication year"
          placeholderTextColor={color.textSecondary}
        />
        <Text style={[styles.label, { color: color.text }]}>Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="Enter price"
          placeholderTextColor={color.textSecondary}
        />
        <Button
          title={loading ? "Creating..." : "Create Book"}
          onPress={handleCreate}
          color={color.primary}
          disabled={loading}
        />
        {loading && <ActivityIndicator size="small" color={color.primary} style={styles.loader} />}
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