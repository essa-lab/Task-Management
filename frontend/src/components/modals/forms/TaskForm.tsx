import React, { useEffect, useRef, useState } from "react";
import { Column, SubTasks, Task } from "@/app/types";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initialData?: Task;
  onSubmit: (data: {
    status_id: number;
    description: string;
    title: string;
    subTasks: SubTasks[];
  }) => void;
  column: Column[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onSubmit,
  column,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [subtasks, setSubTasks] = useState<SubTasks[]>([]);
  const [description, setDescription] = useState("");
  const [statusID, setStatusID] = useState<number|undefined>(0);
  const [errors, setErrors] = React.useState<{
    name?: string;
    subTasks?: string[];
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = "Task Title is required.";
    }

    if (mode === "add") {
      const subError: string[] = [];

      subtasks.forEach((sub, idx) => {
        if (!sub.title.trim()) {
          subError[idx] = "SubTask Title is required.";
        }
      });

      if (subError.length > 0) {
        newErrors.subTasks = subError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setName(initialData.title);
      setSubTasks(initialData.tasks?.map((col: SubTasks) => col) || []);
      setDescription(initialData.description);
      setStatusID(initialData.status_id);
    } else {
      setName("");
      setSubTasks([]);
      setDescription("");
      setStatusID(column[0]?.id);

    }
  }, [isOpen, mode, initialData]);

  const addSubTask = () => setSubTasks([...subtasks, { title: "" }]);
  const updateSubTasks = (index: number, value: SubTasks) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubTasks(updated);
  };
  const removeSubtask = (index: number) => {
    const updated = [...subtasks];
    updated.splice(index, 1);
    setSubTasks(updated);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      description: description,
      status_id: statusID??0,
      title: name,
      subTasks: subtasks,
    });
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(e.target.value)
    const newStatus = Number(e.target.value);
    setStatusID(newStatus);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>{mode === "add" ? "Add New Task" : "Edit Task"}</h2>

        <label>Task Title</label>
        <input
          type="text"
          placeholder="e.g. To-Do"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}

        <label>Task Description</label>

        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. describe your sub task"
          className="textarea"
        />
        {errors.name && <p className="error-message">{errors.name}</p>}

        {
          <>
            <label>SubTasks</label>
            <div className="columns-list">
              {subtasks.map((sub, idx) => (
                <div key={idx} className="column-input-wrapper">
                  <input
                    type="text"
                    className={`column-input ${
                      errors.subTasks && errors.subTasks[idx]
                        ? "input-error"
                        : ""
                    }`}
                    value={sub.title}
                    placeholder={
                      errors.subTasks?.[idx] || "Enter Sub Task Title"
                    }
                    onChange={(e) =>
                      updateSubTasks(idx, { ...sub, title: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeSubtask(idx)}
                    className={`remove-column-btn ${
                      errors.subTasks && errors.subTasks[idx] ? "btn-error" : ""
                    }`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button className="add-column-btn" onClick={addSubTask}>
              + Add New Sub Task
            </button>
          </>
        }

        <div className="status">
          <label >Change Status</label>
          <select value={initialData?.status_id} onChange={handleStatusChange}>
            {column.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-buttons">
          <button className="submit-btn" onClick={handleSubmit}>
            {mode === "add" ? "Create New Task" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
