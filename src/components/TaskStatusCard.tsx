import TaskCard from "./TaskCard";
import { Task, TaskList } from "../types/task";
import DropArea from "./DropArea";
interface TaskStatusCardProps {
  title: string;
  tasks: TaskList;
  bgColor?: string;
  setActiveCard: (card: Task | null) => void;
  activeCard: Task | null;
  onDrop: (status: string, position: number) => void;
  status: string;
}

const TaskStatusCard = ({ title, tasks, bgColor, setActiveCard, activeCard, onDrop, status }: TaskStatusCardProps) => {
  return (
    <div className="bg-transparent m-8">
      <div className={`${bgColor} flex justify-center items-center rounded-t-[15px] py-3`}>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="bg-white p-6 rounded-b-lg border-x border-b border-slate-100">
        <DropArea onDrop={() => onDrop(status, 0)}/>
        {tasks.map((task, index) => (
          <div key={index}> 
          <TaskCard task={task} setActiveCard={setActiveCard} activeCard={activeCard} />
          <DropArea onDrop={() => onDrop(task.status, index+1)}/>
        </div>
        ))}
      </div>
      
    </div>
  );
};

export default TaskStatusCard;
