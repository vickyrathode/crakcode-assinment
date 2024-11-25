import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom"; // To redirect
import { getAuth, signOut } from "firebase/auth"; // Firebase logout
import Spinner from "./Spinner";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskDateTime, setTaskDateTime] = useState(""); // For task date and time
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const tasksCollectionRef = collection(db, "tasks");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getDocs(tasksCollectionRef);
      setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    setLoading(true);
    try {
      if (editingId) {
        const taskDoc = doc(db, "tasks", editingId);
        await updateDoc(taskDoc, { title, description, taskDateTime });
        setEditingId(null);
      } else {
        await addDoc(tasksCollectionRef, { title, description, taskDateTime });
      }
      setTitle("");
      setDescription("");
      setTaskDateTime("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding/updating task:", error.message);
    }
    setLoading(false);
  };

  const handleEditTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setTaskDateTime(task.taskDateTime);
  };

  const handleDeleteTask = async (id) => {
    setLoading(true);
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const colors = ["#FF6B6B", "#FF7F7F", "#FF9999", "#FFB6B6", "#FFC3C3"];
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Manager</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="task-form">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          value={taskDateTime}
          onChange={(e) => setTaskDateTime(e.target.value)}
        />
        <button onClick={handleAddTask}>{editingId ? "Update Task" : "Add Task"}</button>
      </div>
      <div className="task-list">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="task-item"
            style={{ backgroundColor: colors[index % colors.length] }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {task.taskDateTime && (
              <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#333" }}>
                Task Date & Time: {new Date(task.taskDateTime).toLocaleString()}
              </p>
            )}
            <button onClick={() => handleEditTask(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
