import { StyleSheet, Image, Text, View } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "./context/ThemeContext";

const Home = () => {
  const { color } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Image
        source={require("../assets/image/profile.jpg")}
        style={styles.profile}
      />
      <Text style={[styles.title, { color: color.text }]}>Hello World</Text>
      <Text style={[styles.text, { color: color.textSecondary }]}>We are CIS</Text>
      <Link href={"/about"} style={[styles.button, { backgroundColor: color.primary }]}>
        <Text style={{ color: color.text }}>About Us</Text>
      </Link>
      <Link href={"/book"} style={[styles.button, { backgroundColor: color.primary }]}>
        <Text style={{ color: color.text }}>Books</Text>
      </Link>
      <Link href={"/signin"} style={[styles.button, { backgroundColor: color.primary }]}>
        <Text style={{ color: color.text }}>Signin</Text>
      </Link>
      <Link href={"/signup"} style={[styles.button, { backgroundColor: color.primary }]}>
        <Text style={{ color: color.text }}>Signup</Text>
      </Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  profile: {
    height: 128,
    width: 128,
    borderRadius: 64,
    marginBottom: 20,
  },
});