import React, { useEffect, useRef, useState } from "react";
import { Column, SubTasks, Task } from "@/app/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "./ConfirmModal";
import TaskForm from "./forms/TaskForm";
import { useBoard } from "@/context/BoardContext";
import {
  updateTask,
  deleteTask,
  toggleSubtaskStatus,
  updateTaskStatus,
} from "@/api/task.api";
interface TaskModalProb {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Task;
  columnOptions: { id: number | undefined; title: string }[];
}

const TaskModal: React.FC<TaskModalProb> = ({
  isOpen,
  onClose,
  initialData,
  columnOptions,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [task, setTask] = useState<Task | undefined>(initialData);
  const [isConfirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [type, setType] = React.useState<"task" | "board">("task");
  const [isTaskModalOpen, setTaskModalOpen] = React.useState(false);
  const [taskModalMode, setTaskModalMode] = React.useState<"add" | "edit">("edit");
  const [columns, setColumns] = useState<Column[]>([]);
  const { board } = useBoard();
  const queryClient = useQueryClient();

  useEffect(() => {
    setTask(initialData);
  }, [initialData]);


  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = Number(e.target.value);
    if (!task) return;

    try {
      await updateTaskStatus({ taskId: task.id, statusId: newStatus });
      setTask({ ...task, status_id: newStatus });
            queryClient.invalidateQueries({ queryKey: ["ActiveBoard"] });

      // TODO: Inform parent to update Board
    } catch (error) {
      console.error("Failed to change task status:", error);
    }
  };

  const handleSubtaskToggle = async (subtaskIndex: number) => {
    if (!task || !task.tasks) return;

    const updatedSubtasks = [...task.tasks];
    const subtask = updatedSubtasks[subtaskIndex];
    subtask.is_done = !subtask.is_done;

    try {
      await toggleSubtaskStatus({
        subtaskId: subtask.id,
        isDone: subtask.is_done,
      });
            queryClient.invalidateQueries({ queryKey: ["ActiveBoard"] });

      setTask({ ...task, tasks: updatedSubtasks });
    } catch (error) {
      console.error("Failed to update subtask:", error);
    }
  };

  // handle Delte Task
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ActiveBoard"] });
      onClose();
    },
  });

  const submitDelete = async () => {
    deleteMutation.mutate(initialData?.id);
  };

  const handleDelete = async () => {
    try {
      setConfirmModalOpen(true);
      setType("task");
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };
  // End of Delete Task


  // handle update task
  const handleUpdateTask = () => {
    setTaskModalOpen(true);
    setTaskModalMode("edit");
    setColumns(board.columns?.map((col: Column) => col) || []);
  };

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["ActiveBoard"] });
      setTaskModalOpen(false);
    },
  });

  const handleUpdateTaskRequest = (data: {
    description: string;
    status_id: number;
    title: string;
    subTasks: SubTasks[];
  }) => {
    if (task) {
      updateMutation.mutate({
        taskId: task.id,
        data,
      });
    }
  };
  // end  update task

  if (!isOpen){
          return null;
  } 

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="dropdown-task">
          <button className="dropdown-task-toggle">⋮</button>
          <div className="dropdown-menu-task">
            <button onClick={handleUpdateTask}>Edit Task</button>
            <button className="delete" onClick={handleDelete}>
              Delete Task
            </button>
          </div>
        </div>
</div>
        <h2>{initialData?.title}</h2>
        <p>{initialData?.description}</p>

        <div className="subtasks">
          <p>
            {initialData?.tasks?.filter((t) => t.is_done).length || 0} of{" "}
            {initialData?.tasks?.length || 0} subtasks completed
          </p>
          {initialData?.tasks?.map((subtask, index) => (
            <label key={index}>
              <input
                type="checkbox"
                checked={subtask.is_done}
                onChange={() => handleSubtaskToggle(index)}
              />
              {subtask.title}
            </label>
          ))}
        </div>

        <div className="status">
          <label htmlFor="status">Current Status</label>
          <select value={task?.status_id} onChange={handleStatusChange}>
            {columnOptions.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        type={type}
        onSubmit={submitDelete}
        name={initialData?.title}
      />

      <TaskForm
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        mode={taskModalMode}
        initialData={task}
        onSubmit={handleUpdateTaskRequest}
        column={columns}
      />
    </div>
  );
};

export default TaskModal;
