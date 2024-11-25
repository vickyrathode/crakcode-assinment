import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const tasksCollectionRef = collection(db, "tasks");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const data = await getDocs(tasksCollectionRef);
    setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, tasksCollectionRef, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
