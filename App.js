import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import "expo-router/entry";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-xl font-bold text-blue-500">Hello World</Text>
      <StatusBar style="auto" />
    </View>
  );
}
