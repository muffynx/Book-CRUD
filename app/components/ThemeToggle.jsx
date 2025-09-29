
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../context/ThemeContext"; 
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme, color } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Text
        style={{
          color: color.text,
        }}
      >
        {isDarkMode ? "Dark" : "Light"}
      </Text>
    </TouchableOpacity>
  );
};
export default ThemeToggle;


