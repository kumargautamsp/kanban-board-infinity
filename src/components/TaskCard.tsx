"use client";
import { Card, Modal, Tag } from "antd";
import CalendarIcon from "./CalendarIcon";
import { Task } from "@/types/task";
import { FaAngleDown, FaTrash } from "react-icons/fa6";
import ChangeStatus from "./ChangeStatus";
import { useState } from "react";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "@/firebase";
import { RiEdit2Fill } from "react-icons/ri";
import EditTaskForm from "./EditTaskForm";
interface TaskCardProps {
  fetchAllTasks: () => void;
  task: Task;
  setActiveCard: (card: Task | null) => void;
  activeCard: Task | null;
}

const TaskCard = ({
  task,
  setActiveCard,
  activeCard,
  fetchAllTasks,
}: TaskCardProps) => {
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const db = getFirestore(app);

  const handleDelete = async () => {
    if (!task.id) return;
    const taskDocRef = doc(db, "tasks", task.id);
    await deleteDoc(taskDocRef);
    fetchAllTasks();
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    fetchAllTasks();
  };

  const handleTaskUpdated = () => {
    setIsEditModalVisible(false);
    fetchAllTasks();
  };

  return (
    <>
      <Card
        className={`mb-4 bg-transparent shadow-lg rounded-[15px] cursor-grab ${
          activeCard === task ? "border-2 border-slate-200" : ""
        }`}
        key={task.title}
        draggable={true}
        onDragStart={() => setActiveCard(task)}
        onDragEnd={() => setActiveCard(null)}
      >
        <Tag
          color={
            task.priority === "high"
              ? "red"
              : task.priority === "medium"
              ? "pink"
              : "green"
          }
        >
          {task.priority}
        </Tag>
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <div className="relative">
            <FaAngleDown
              style={{ cursor: "pointer" }}
              onClick={() => setShowChangeStatus(!showChangeStatus)}
            />
            {showChangeStatus && (
              <div className="absolute top-full left-[-90px] z-10 w-[250px]">
                <ChangeStatus
                  fetchAllTasks={fetchAllTasks}
                  onStatusChange={() => {
                    setShowChangeStatus(false);
                  }}
                  docId={task.id ?? ""}
                  currentStatus={task.status}
                />
              </div>
            )}
          </div>
        </div>

        {task.description && <p>{task.description}</p>}
        <div className="border-b border-slate-200 my-2"></div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <p className="text-sm text-gray-500">
              {task.date instanceof Date
                ? task.date.toLocaleDateString()
                : "Invalid date"}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-row">
            <RiEdit2Fill onClick={handleEdit} />
            <FaTrash onClick={handleDelete} />
          </div>
        </div>
      </Card>
      <Modal
        title="Edit Task"
        visible={isEditModalVisible}
        footer={null}
        onCancel={handleModalClose}
      >
        <EditTaskForm task={task} onTaskUpdated={handleTaskUpdated} />
      </Modal>
    </>
  );
};

export default TaskCard;
