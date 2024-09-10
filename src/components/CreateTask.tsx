"use client";

import React from "react";
import CreateTaskForm from "./CreateTaskForm";
import { RxCross2 } from "react-icons/rx";
import { FaCirclePlus } from "react-icons/fa6";

interface CreateTaskProps {
  onClose: () => void;
  fetchAllTasks: () => void;
  setIsModalVisible: (value: boolean) => void;
}
const CreateTask: React.FC<CreateTaskProps> = ({ onClose, setIsModalVisible, fetchAllTasks }) => {
  return (
    <div className="bg-slate-200 bg-opacity-50 w-full h-screen flex flex-col justify-center items-center">
      <div className="bg-white flex flex-col justify-center items-center p-6 rounded-lg w-[40%]">
        <div className="flex flex-row justify-between items-center w-full mb-4 font-medium">
          <div className="flex flex-row justify-center items-center gap-2">
            <FaCirclePlus style={{ color: "#8A31E5" }} />
            Create New Task
          </div>
          <div
            onClick={onClose}
            className="cursor-pointer hover:bg-slate-200 rounded-full p-2"
          >
            <RxCross2 />
          </div>
        </div>
        <CreateTaskForm setIsModalVisible={setIsModalVisible} fetchAllTasks={fetchAllTasks} />
      </div>
    </div>
  );
};

export default CreateTask;
