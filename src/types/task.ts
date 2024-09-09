export interface Task {
    id?: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "completed";
    date?: Date;
    priority: "low" | "medium" | "high";
  }
  
  export type TaskList = Task[];
  