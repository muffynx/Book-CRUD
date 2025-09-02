import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { StatusBar } from "react-native";

const CustomHeader = () => {
  const { color } = useTheme();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };
    checkToken();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      setIsLoggedIn(false);
      router.replace("/index");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: color.background, borderBottomColor: color.textSecondary }]}>
      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => router.push("/")} style={styles.navButton}>
          <Text style={[styles.navText, { color: color.text }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/about")} style={styles.navButton}>
          <Text style={[styles.navText, { color: color.text }]}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/book")} style={styles.navButton}>
          <Text style={[styles.navText, { color: color.text }]}>Books</Text>
        </TouchableOpacity>
        {!isLoggedIn && (
          <>
            <TouchableOpacity onPress={() => router.push("/signin")} style={styles.navButton}>
              <Text style={[styles.navText, { color: color.text }]}>Signin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/signup")} style={styles.navButton}>
              <Text style={[styles.navText, { color: color.text }]}>Signup</Text>
            </TouchableOpacity>
          </>
        )}
        {isLoggedIn && (
          <TouchableOpacity onPress={handleLogout} style={styles.navButton}>
            <Text style={[styles.navText, { color: color.error }]}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
      <ThemeToggle />
    </View>
  );
};

function StackLayout() {
  const { isDarkMode, color } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };
    checkToken();
  }, []);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Stack
        screenOptions={{
          header: () => <CustomHeader />,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Profile" }} />
        <Stack.Screen name="about" options={{ title: "About us" }} />
        <Stack.Screen name="book" options={{ title: "Books" }} />
        <Stack.Screen name="book_new" options={{ title: "New Book" }} />
        <Stack.Screen name="book_detail" options={{ title: "Book Detail" }} />
        {!isLoggedIn && (
          <>
            <Stack.Screen name="signin" options={{ title: "Welcome" }} />
            <Stack.Screen name="signup" options={{ title: "Register" }} />
          </>
        )}
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <StackLayout />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  navButton: {
    padding: 10,
    
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
  },
});