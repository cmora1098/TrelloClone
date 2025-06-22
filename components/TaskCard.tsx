// components/TaskCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface Props {
  id: string;
  title: string;
  status: string;
  onLongPress?: () => void;
  isActive?: boolean;
}

export const TaskCard = ({
  id,
  title,
  status,
  onLongPress,
  isActive,
}: Props) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, isActive && styles.active]}
      onPress={() =>
        router.push({
          pathname: "/task/[id]",
          params: { id, title, status },
        })
      }
      onLongPress={onLongPress}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  active: {
    backgroundColor: "#e0e0e0",
  },
  title: {
    fontWeight: "bold",
  },
});
