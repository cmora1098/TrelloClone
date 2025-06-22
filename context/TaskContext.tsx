// context/TaskContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export type TaskStatus = "todo" | "inprogress" | "done";

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks?: Subtask[];
  favorite?: boolean;
  repeat?: boolean;
  tagColor?: string;
};

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string, status: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleFavorite: (id: string) => void;
};

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem("tasks");
      if (data) setTasks(JSON.parse(data));
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, status: TaskStatus) => {
    const newTask: Task = {
      id: uuid.v4().toString(),
      title,
      status,
      subtasks: [],
      favorite: false,
      repeat: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks?.map((sub) =>
                sub.id === subtaskId
                  ? { ...sub, completed: !sub.completed }
                  : sub
              ),
            }
          : task
      )
    );
  };

  const addSubtask = (taskId: string, title: string) => {
    const newSubtask: Subtask = {
      id: uuid.v4().toString(),
      title,
      completed: false,
    };
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
          : task
      )
    );
  };

  const toggleFavorite = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, favorite: !task.favorite } : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        addSubtask,
        toggleFavorite,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
