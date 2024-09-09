import React, { useState } from "react";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import { app } from "@/firebase";

type Status = "todo" | "in-progress" | "completed";

interface ChangeStatusProps {
  fetchAllTasks: () => void;
  docId: string;
  currentStatus: Status;
  onStatusChange?: (status: Status) => void;
}

const ChangeStatus: React.FC<ChangeStatusProps> = ({
  fetchAllTasks,
  docId,
  currentStatus,
  onStatusChange,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedStatus, setSelectedStatus] = useState<Status>(currentStatus);

  const statuses: Status[] = ["todo", "in-progress", "completed"];

  const handleStatusChange = async (status: Status) => {
    try {
      const db = getFirestore(app);
      const taskDocRef = doc(db, "tasks", docId);

      await updateDoc(taskDocRef, {
        status: status,
      });

      setSelectedStatus(status);
      if (onStatusChange) {
        onStatusChange(status);
      }

      console.log(`Status updated to ${status} for docId: ${docId}`);
      fetchAllTasks();
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <div className="bg-white p-3 rounded-[15px] shadow-lg border-2 border-slate-200 w-[150px] mx-auto">
      <h2 className="text-l font-medium mb-4 border-b-2 border-slate-200 pb-2">
        Change Status
      </h2>
      <div className="space-y-2">
        {statuses.map((status) => (
          <button
            key={status}
            className={`w-full text-left p-1 font-medium text-l rounded-md transition-colors bg-white hover:bg-gray-200`}
            onClick={() => handleStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChangeStatus;
