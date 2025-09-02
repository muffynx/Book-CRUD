import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from "./context/ThemeContext";

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
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert("Error", "Please sign in to view book details");
          router.push("/signin");
          return;
        }
        console.log("Fetching book with ID:", id);
        const response = await fetch(`http://localhost:3000/api/books/${id}`, {
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
          Alert.alert("Error", data.message || "Failed to fetch book");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching book details:", error.message, error.stack);
        Alert.alert("Error", "Failed to fetch book details. Please check your network and try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBook();
    } else {
      console.error("Invalid book ID:", id);
      Alert.alert("Error", "Invalid book ID");
      router.back();
    }
  }, [id, router]);

  const handleUpdate = async () => {
    if (!title || !author) {
      Alert.alert("Error", "Title and Author are required");
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
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "Please sign in to update a book");
        router.push("/signin");
        return;
      }
      console.log("Updating book with ID:", id, "Data:", updateData);
      const response = await fetch(`http://localhost:3000/api/books/${id}`, {
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
        Alert.alert("Success", data.message || "Book updated successfully");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to update book");
      }
    } catch (error) {
      console.error("Error updating book:", error.message, error.stack);
      Alert.alert("Error", "Failed to update book. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    console.log("handleDelete called for book ID:", id);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Error", "Please sign in to delete a book");
        router.push("/signin");
        setLoading(false);
        return;
      }
      console.log("Sending DELETE request for book ID:", id);
      console.log("Using token:", token.substring(0, 10) + "...");
      const response = await fetch(`http://localhost:3000/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Delete response:", data, "Status:", response.status);
      if (response.ok) {
        Alert.alert("Success", data.message || "Book deleted successfully");
        router.back();
      } else {
        Alert.alert("Error", data.message || `Failed to delete book (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error deleting book:", error.message, error.stack);
      Alert.alert("Error", `Failed to delete book: ${error.message}. Please check your network and try again.`);
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
      Alert.alert("Error", "Failed to show delete confirmation. Please try again.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={color.primary} style={styles.loader} />;
  }

  if (!book) {
    return <Text style={[styles.errorText, { color: color.text }]}>Book not found</Text>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.title, { color: color.text }]}>Book Details</Text>
      <View style={styles.form}>
        <Text style={[styles.label, { color: color.text }]}>Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="Enter book title"
          placeholderTextColor={color.textSecondary}
        />
        <Text style={[styles.label, { color: color.text }]}>Author *</Text>
        <TextInput
          value={author}
          onChangeText={setAuthor}
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="Enter author name"
          placeholderTextColor={color.textSecondary}
        />
        <Text style={[styles.label, { color: color.text }]}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={[styles.input, { color: color.text, backgroundColor: color.surface, borderColor: color.textSecondary }]}
          placeholder="Enter book description"
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
        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Saving..." : "Save"}
            onPress={handleUpdate}
            color={color.primary}
            disabled={loading}
          />
          <TouchableOpacity
            onPress={() => {
              console.log("Delete button pressed for book ID:", id, "Loading state:", loading);
              confirmDelete();
            }}
            style={[styles.deleteButton, { backgroundColor: color.error, opacity: loading ? 0.5 : 1 }]}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Deleting..." : "Delete"}</Text>
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
            <Text style={[styles.modalTitle, { color: color.text }]}>
              Confirm Deletion
            </Text>
            <Text style={[styles.modalText, { color: color.textSecondary }]}>
              Are you sure you want to delete this book?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  console.log("Cancel deletion for book ID:", id);
                  setShowDeleteModal(false);
                }}
                style={[styles.modalButton, { backgroundColor: color.textSecondary }]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log("User confirmed deletion for book ID:", id);
                  handleDelete();
                }}
                style={[styles.modalButton, { backgroundColor: color.error }]}
              >
                <Text style={styles.buttonText}>OK</Text>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
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
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 120,
  },
});