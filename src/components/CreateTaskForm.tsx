import React, { useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "@/firebase";
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import type { FormInstance } from "antd";
import { Task } from "@/types/task";

interface SubmitButtonProps {
  form: FormInstance;

}

interface CreateTaskFormProps {
  setIsModalVisible: (value: boolean) => void;
  fetchAllTasks: () => void;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  form,
  children,
}) => {
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true });
  }, [form, values]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      style={{
        backgroundColor: "#8A31E5",
        borderColor: "#8A31E5",
        color: "#ffffff",
      }}
    >
      {children}
    </Button>
  );
};

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ setIsModalVisible , fetchAllTasks})  => {
  const db = getFirestore(app);
  const [form] = Form.useForm();

  const onFinish = async (values: Task) => {
    console.log("Form Values: ", values);
  
    const { date, description, ...data } = values; 
    try {
      const formattedData = {
        ...data,
        status: values.status,
        date: date ? date.toISOString() : null, 
        description: description ? description : null,
      };
      const docRef = await addDoc(collection(db, "tasks"), formattedData); 
      console.log("Document written with ID: ", docRef.id);   
      
      setIsModalVisible(false);
      fetchAllTasks();
    } catch (error) {
      console.error("Error writing document: ", error);
      throw error;
    }
  };

  return (
    <Form
      form={form}
      variant="outlined"
      style={{ width: "100%", fontFamily: "Poppins", fontWeight: "500" }}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea style={{ resize: "none", height: "80px" }} />
      </Form.Item>

      <Form.Item
        label="Select Date"
        name="date"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Select>
          <Select.Option value="todo">Todo</Select.Option>
          <Select.Option value="in-progress">In Progress</Select.Option>
          <Select.Option value="completed">Completed</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Priority"
        name="priority"
        rules={[{ required: true, message: "Please input!" }]}
      >
        <Select
          options={[
            {
              value: "low",
              label: "Low",
            },
            {
              value: "medium",
              label: "Medium",
            },
            {
              value: "high",
              label: "High",
            },
          ]}
        />
      </Form.Item>

      <Form.Item>
        <Space style={{ float: "right" }}>
          <Button
            htmlType="reset"
            style={{ borderColor: "#8A31E5", color: "#8A31E5" }}
          >
            Reset
          </Button>
          <SubmitButton form={form}>Submit</SubmitButton>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateTaskForm;
