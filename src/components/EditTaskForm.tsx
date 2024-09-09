import { useState } from "react";
import { Input, Button, Select, Form } from "antd";
import { Task } from "@/types/task";
import { updateDoc, doc, getFirestore } from "firebase/firestore";
import { app } from "@/firebase";
import moment from "moment";
import MyDatePicker from "./DatePicker";

const { TextArea } = Input;
const { Option } = Select;

interface EditTaskFormProps {
  task: Task;
  onTaskUpdated: () => void;
}

const EditTaskForm = ({ task, onTaskUpdated }: EditTaskFormProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "low");
  const [date, setDate] = useState(task.date ? moment(task.date) : null);
  const [loading, setLoading] = useState(false);
  const db = getFirestore(app);

  const handleSave = async () => {
    if (!task.id) return;

    setLoading(true);
    const taskDocRef = doc(db, "tasks", task.id);

    await updateDoc(taskDocRef, {
      title,
      description,
      priority,
      date: date ? date.toDate() : null,
    });

    setLoading(false);
    onTaskUpdated(); // Trigger callback after task is updated
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Title" required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Form.Item>

      <Form.Item label="Description">
        <TextArea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Priority">
        <Select value={priority} onChange={setPriority}>
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Due Date">
        <MyDatePicker
          value={date}
          onChange={(value) => setDate(value)}
          format="YYYY-MM-DD"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          onClick={handleSave}
          loading={loading}
          disabled={!title}
        >
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditTaskForm;
