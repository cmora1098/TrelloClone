import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTasks } from "@/context/TaskContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const STATUS_LABELS: Record<string, string> = {
  todo: "Pendiente",
  inprogress: "En progreso",
  done: "Hecho",
};

export default function BoardScreen() {
  const { tasks, loading, addTask } = useTasks();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    inprogress: filteredTasks.filter((t) => t.status === "inprogress"),
    done: filteredTasks.filter((t) => t.status === "done"),
  };

  const handleAdd = () => {
    if (!newTask.trim()) return;
    addTask(newTask, "todo"); // Estado por defecto: Pendiente
    setNewTask("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Tablero</Text>

      <TextInput
        placeholder="Buscar tarea..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.newTaskContainer}>
        <TextInput
          placeholder="Nueva tarea"
          style={styles.newTaskInput}
          value={newTask}
          onChangeText={setNewTask}
        />
        <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(Object.keys(grouped) as Array<keyof typeof grouped>).map((status) => (
          <View style={styles.column} key={status}>
            <Text style={styles.columnTitle}>{STATUS_LABELS[status]}</Text>
            {grouped[status].map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => router.push(`/task/${task.id}`)}
                style={styles.taskCard}
              >
                <Text style={styles.taskTitle}>{task.title}</Text>
                {task.subtasks && task.subtasks.length > 0 && (
                  <Text style={styles.subtaskBadge}>
                    {task.subtasks.filter((s) => s.completed).length}/
                    {task.subtasks.length} subtareas
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  newTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  newTaskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
  },
  column: {
    width: 260,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  subtaskBadge: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
