
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, useWindowDimensions, Modal, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store"; // เพิ่ม SecureStore
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import * as Font from "expo-font";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const CustomHeader = () => {
  const { color } = useTheme();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        setIsLoggedIn(!!accessToken);
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };
    checkToken();
  }, []);

const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("userId");
    
    // ไม่ลบ biometricKey เพื่อให้ Biometrics ยังใช้งานได้หลัง Logout
    // ถ้าต้องการให้ลบเมื่อรีเซ็ต Biometrics ควรเพิ่มปุ่มรีเซ็ตใน UI
    setIsLoggedIn(false);
    router.replace("/");
    setIsMenuOpen(false);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

  const isSmallScreen = screenWidth < 600;

  const MenuItems = () => (
    <View style={styles.menuContainer}>
      <TouchableOpacity onPress={() => { router.push("/"); setIsMenuOpen(false); }} style={styles.menuItem}>
        <View style={styles.buttonContent}>
          <Ionicons name="home" size={20} color={color.text} style={styles.buttonIcon} />
          <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { router.push("/about"); setIsMenuOpen(false); }} style={styles.menuItem}>
        <View style={styles.buttonContent}>
          <Ionicons name="information-circle" size={20} color={color.text} style={styles.buttonIcon} />
          <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>About</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { router.push("/book"); setIsMenuOpen(false); }} style={styles.menuItem}>
        <View style={styles.buttonContent}>
          <MaterialIcons name="book" size={20} color={color.text} style={styles.buttonIcon} />
          <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>Books</Text>
        </View>
      </TouchableOpacity>
      {!isLoggedIn && (
        <>
          <TouchableOpacity onPress={() => { router.push("/signin"); setIsMenuOpen(false); }} style={styles.menuItem}>
            <View style={styles.buttonContent}>
              <MaterialIcons name="person" size={20} color={color.text} style={styles.buttonIcon} />
              <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>Signin</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push("/signup"); setIsMenuOpen(false); }} style={styles.menuItem}>
            <View style={styles.buttonContent}>
              <MaterialIcons name="person-add" size={20} color={color.text} style={styles.buttonIcon} />
              <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>Signup</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
      {isLoggedIn && (
        <TouchableOpacity onPress={() => { handleLogout(); setIsMenuOpen(false); }} style={styles.menuItem}>
          <View style={styles.buttonContent}>
            <MaterialIcons name="logout" size={20} color={color.error} style={styles.buttonIcon} />
            <Text style={[styles.navText, { color: color.error, fontFamily: "NotoSansThai-Regular" }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.header, { backgroundColor: color.background, borderBottomWidth: 1, borderBottomColor: color.textSecondary, padding: isSmallScreen ? 10 : 15 }]}>
      {isSmallScreen ? (
        <>
          <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.hamburgerButton}>
            <Ionicons name="menu" size={24} color={color.text} />
          </TouchableOpacity>
          <ThemeToggle />
          <Modal
            visible={isMenuOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsMenuOpen(false)}
          >
            <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={[styles.menuModal, { backgroundColor: color.surface }]}>
                    <TouchableOpacity onPress={() => setIsMenuOpen(false)} style={styles.closeButton}>
                      <Ionicons name="close" size={24} color={color.text} />
                    </TouchableOpacity>
                    <MenuItems />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </>
      ) : (
        <>
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={() => router.push("/")} style={styles.navButton}>
              <View style={styles.buttonContent}>
                <Ionicons name="home" size={20} color={color.text} style={styles.buttonIcon} />
                <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>Home</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/about")} style={styles.navButton}>
              <View style={styles.buttonContent}>
                <Ionicons name="information-circle" size={20} color={color.text} style={styles.buttonIcon} />
                <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>About</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/book")} style={styles.navButton}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="book" size={20} color={color.text} style={styles.buttonIcon} />
                <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>Books</Text>
              </View>
            </TouchableOpacity>
            {!isLoggedIn && (
              <>
                <TouchableOpacity onPress={() => router.push("/signin")} style={styles.navButton}>
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="person" size={20} color={color.text} style={styles.buttonIcon} />
                    <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>Signin</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/signup")} style={styles.navButton}>
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="person-add" size={20} color={color.text} style={styles.buttonIcon} />
                    <Text style={[styles.navText, { color: color.text, fontFamily: "NotoSansThai-Regular" }]}>Signup</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
            {isLoggedIn && (
              <TouchableOpacity onPress={handleLogout} style={styles.navButton}>
                <View style={styles.buttonContent}>
                  <MaterialIcons name="logout" size={20} color={color.error} style={styles.buttonIcon} />
                  <Text style={[styles.navText, { color: color.error, fontFamily: "NotoSansThai-Regular" }]}>Logout</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <ThemeToggle />
        </>
      )}
    </View>
  );
};

function Layout() {
  const { isDarkMode } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { width } = useWindowDimensions();

  const loadFonts = async () => {
    await Font.loadAsync({
      "NotoSansThai-Regular": require("../assets/fonts/NotoSansThai-Regular.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();

    const checkToken = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        setIsLoggedIn(!!accessToken);
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };
    checkToken();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={width < 600 ? "small" : "large"} color="#000" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Stack
        screenOptions={{
          header: () => <CustomHeader />,
          contentStyle: { padding: width < 600 ? 10 : 20 },
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  navButton: {
    padding: 8,
    margin: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    marginRight: 6,
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
  },
  hamburgerButton: {
    padding: 10,
  },
  menuModal: {
    width: "70%",
    height: "100%",
    padding: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  menuContainer: {
    marginTop: 40,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
});
