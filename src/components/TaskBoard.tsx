"use client";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { app } from "@/firebase";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
import TaskStatusCard from "./TaskStatusCard";
import { Task } from "@/types/task";
import CreateTask from "./CreateTask";

const TaskBoard: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<Task | null>(null);

  const [todo, setTodo] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);

  const handleCreateTaskClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const fetchAllTasks = async () => {
    try {
      const db = getFirestore(app);
      const taskCollection = collection(db, "tasks");
      const taskSnapshot = await getDocs(taskCollection);

      const todoTasks: Task[] = [];
      const inProgressTasks: Task[] = [];
      const completedTasks: Task[] = [];

      taskSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const task: Task = {
          id: doc.id,
          title: data.title || "Untitled Task",
          description: data.description || "",
          date:
            data.date instanceof Timestamp
              ? data.date.toDate()
              : data.date instanceof Date
              ? data.date
              : typeof data.date === "string" && !isNaN(Date.parse(data.date))
              ? new Date(data.date)
              : undefined,
          priority: data.priority || "low",
          status: data.status || "todo",
        };
        switch (task.status) {
          case "todo":
            todoTasks.push(task);
            break;
          case "in-progress":
            inProgressTasks.push(task);
            break;
          case "completed":
            completedTasks.push(task);
            break;
          default:
            todoTasks.push(task);
        }
      });

      setTodo(todoTasks);
      setInProgress(inProgressTasks);
      setCompleted(completedTasks);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, [todo, inProgress, completed]);


  const onDrop = async (status: string, position: number) => {
    if (!activeCard || activeCard.status === status) return; 

    try {
      if (!activeCard || !activeCard.id) return;
      const db = getFirestore(app);
      const taskRef = doc(db, "tasks", activeCard.id); 
      await updateDoc(taskRef, { status }); 
      console.log(`${activeCard.title} is dragged to ${status} at position ${position}`);
    } catch (error) {
      console.error("Error updating task status: ", error);
    }
  };

  return (
    <div className=" bg-[#f7fafc] min-h-screen p-10">
      <div className="flex justify-between bg-white rounded-lg p-8 items-center">
        <h1 className="text-2xl font-bold">Desktop & Mobile Application</h1>
        <Button
          type="primary"
          className="bg-purple-700 px-5 py-6"
          onClick={handleCreateTaskClick}
        >
          Create Task
        </Button>
      </div>
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <CreateTask onClose={handleCloseModal} setIsModalVisible = {setIsModalVisible} />
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 mt-8">
        {}
        <div className="bg-transparent p-4">
          <TaskStatusCard
            title="TODO"
            tasks={todo}
            bgColor="bg-purple-700"
            setActiveCard={setActiveCard}
            activeCard={activeCard}
            onDrop={onDrop}
            status="todo"
          />
        </div>

        {}
        <div className="bg-transparent p-4">
          <TaskStatusCard
            title="IN PROGRESS"
            tasks={inProgress}
            bgColor="bg-yellow-500"
            setActiveCard={setActiveCard}
            activeCard={activeCard}
            onDrop={onDrop}
            status="in-progress"
          />
        </div>

        {}
        <div className="bg-transparent p-4">
          <TaskStatusCard
            title="COMPLETED"
            tasks={completed}
            bgColor="bg-green-500"
            setActiveCard={setActiveCard}
            activeCard={activeCard}
            onDrop={onDrop}
            status="completed"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
