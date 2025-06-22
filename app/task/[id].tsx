import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useTasks } from "@/context/TaskContext";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const {
    tasks,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTasks();
  const router = useRouter();
  const navigation = useNavigation();

  const task = tasks.find((t) => t.id === id);
  const [title, setTitle] = useState(task?.title ?? "");
  const [status, setStatus] = useState(task?.status ?? "todo");
  const [subtaskText, setSubtaskText] = useState("");

  const handleSave = () => {
    if (!title.trim()) return;
    updateTask(id as string, { title, status });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert("¿Eliminar tarea?", "Esta acción no se puede deshacer.", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteTask(id as string);
          router.replace("/board");
        },
      },
    ]);
  };

  const handleAddSubtask = () => {
    if (subtaskText.trim()) {
      addSubtask(id as string, subtaskText);
      setSubtaskText("");
    }
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.label}>Tarea no encontrada</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.btnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Título de la tarea"
        />

        <Text style={styles.label}>Estado</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={status} onValueChange={setStatus}>
            <Picker.Item label="Pendiente" value="todo" />
            <Picker.Item label="En progreso" value="inprogress" />
            <Picker.Item label="Hecho" value="done" />
          </Picker>
        </View>

        <Text style={styles.label}>Subtareas</Text>
        <FlatList
          data={task.subtasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.subtask}>
              <TouchableOpacity
                onPress={() => toggleSubtask(task.id, item.id)}
                style={{ flex: 1 }}
              >
                <Text
                  style={{
                    textDecorationLine: item.completed
                      ? "line-through"
                      : "none",
                    color: item.completed ? "#999" : "#000",
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteSubtask(task.id, item.id)}>
                <Ionicons name="trash" size={18} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
          style={styles.subtaskList}
        />

        <View style={styles.subtaskInputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={subtaskText}
            onChangeText={setSubtaskText}
            placeholder="Nueva subtarea"
          />
          <TouchableOpacity
            style={styles.addSubtaskBtn}
            onPress={handleAddSubtask}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
            <Text style={styles.btnText}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.save} onPress={handleSave}>
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.btnText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.delete} onPress={handleDelete}>
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.btnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  label: { marginTop: 10, fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  subtaskInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  addSubtaskBtn: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  subtask: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  subtaskList: {
    marginTop: 6,
    maxHeight: 180,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    gap: 10,
  },
  save: {
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  delete: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    backgroundColor: "#95a5a6",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
