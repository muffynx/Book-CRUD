
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from "expo-secure-store";
import { useTheme } from "./context/ThemeContext";

const Book = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { color } = useTheme();

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
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
            await AsyncStorage.setItem("accessToken", refreshData.accessToken);
            await AsyncStorage.setItem("userId", refreshData.userId);
          } else {
            Alert.alert("Error", "Session expired. Please sign in again.");
            router.push("/signin");
            return;
          }
        } else {
          Alert.alert("Error", "Please sign in to view your books");
          router.push("/signin");
          return;
        }
      }

      const response = await fetch("http://192.168.1.3:3000/api/books?page=1&limit=10", {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('accessToken')}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setData(json.books || []);
      } else {
        Alert.alert("Error", json.message || "Failed to fetch books");
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [fetchBooks])
  );

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Link href="/book_new" style={[styles.createButton, { backgroundColor: color.primary }]}>
        <Text style={[styles.buttonText, { color: color.text }]}>Create New Book</Text>
      </Link>
      {loading ? (
        <ActivityIndicator size="large" color={color.primary} style={styles.loader} />
      ) : data.length === 0 ? (
        <Text style={[styles.emptyText, { color: color.text }]}>No books found</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/book_detail?id=${item._id}`)}
              style={[styles.bookCard, { backgroundColor: color.surface, borderColor: color.textSecondary }]}
            >
              <Text style={[styles.title, { color: color.text }]}>{item.title}</Text>
              <Text style={[styles.text, { color: color.textSecondary }]}>Author: {item.author}</Text>
              <Text style={[styles.text, { color: color.textSecondary }]}>Genre: {item.genre || 'N/A'}</Text>
              <Text style={[styles.text, { color: color.textSecondary }]}>Price: ${item.price || 0}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  createButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  bookCard: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 3,
  },
});
