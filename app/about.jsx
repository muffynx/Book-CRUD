import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "./context/ThemeContext";

const About = () => {
  const { color } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Text style={[styles.title, { color: color.text }]}>About Us</Text>
      <Text style={[styles.text, { color: color.textSecondary }]}>
        We are a team of passionate developers dedicated to creating amazing
        applications. Our mission is to deliver high-quality software that
        enhances user experience and meets the needs of our clients.
      </Text>
    </View>
  );
};
export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});