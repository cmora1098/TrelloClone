// components/AddTaskModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
}

export const AddTaskModal = ({ visible, onClose, onAdd }: Props) => {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>Nueva Tarea</Text>
          <TextInput
            style={styles.input}
            placeholder="Título de la tarea"
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.add} onPress={handleSubmit}>
              <Text style={styles.btnText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancel: {
    marginRight: 10,
  },
  add: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
