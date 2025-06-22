// components/Column.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { TaskCard } from "./TaskCard";

interface Props {
  title: string;
  color: string;
  tasks: { id: string; title: string; status: string }[];
  onMoveTask: (taskId: string, newStatus: string) => void;
}

export const Column = ({ title, color, tasks, onMoveTask }: Props) => {
  const handleDrop = (data: any) => {
    // Mueve la tarea a otra columna si se arrastró fuera
    // Por ahora simplemente reordena dentro de la columna
    // (esto se puede mejorar con lógica entre columnas)
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <DraggableFlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => handleDrop(data)}
        renderItem={({ item, drag, isActive }) => (
          <ScaleDecorator>
            <TaskCard
              id={item.id}
              title={item.title}
              status={item.status}
              onLongPress={drag}
              isActive={isActive}
            />
          </ScaleDecorator>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: "#fff",
  },
});
