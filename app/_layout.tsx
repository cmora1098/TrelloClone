// app/_layout.tsx
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TaskProvider } from "@/context/TaskContext";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TaskProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TaskProvider>
    </GestureHandlerRootView>
  );
}
