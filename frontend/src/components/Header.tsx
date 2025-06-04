import React, { useState } from "react";
import { useBoard } from "@/context/BoardContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BoardForm from "./modals/forms/BoardForm";
import ConfirmModal from "./modals/ConfirmModal";
import { Column, SubTasks } from "@/app/types";
import TaskForm from "./modals/forms/TaskForm";
import { deleteBoard, updateBoard, fetchBoards } from "@/api/board.api";
import { addTask } from "@/api/task.api";
import toast from "react-hot-toast";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  isSidebarOpen,
  isMobile,
}) => {
  const { board, setBoard } = useBoard();
  const [columns, setColumns] = useState<Column[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [type, setType] = React.useState<"task" | "board">("task");
  const [id, setId] = React.useState<number>();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"add" | "edit">("edit");
  const [editingItem, setEditingItem] = React.useState<any>();
  const [isTaskModalOpen, setTaskModalOpen] = React.useState(false);
  const [taskModalMode, setTaskModalMode] = React.useState<"add" | "edit">(
    "edit"
  );

  const queryClient = useQueryClient();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  //Handle Edit Board
  const handleEditBoard = () => {
    setModalOpen(true);
    setMode("edit");
    setEditingItem(board);
    setShowDropdown(false);
  };
  const updateMutation = useMutation({
    mutationFn: updateBoard,
    onSuccess: (response) => {

      queryClient.invalidateQueries({ queryKey: ["ActiveBoard"] });

      toast.success("Board Updated Successfuly!");
      console.log(response)
      setBoard(response.data);
      setModalOpen(false);
    },
    onError: (error) => {
      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        message.forEach((msg) => toast.error(msg));
      } else if (typeof message === "string") {
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });
  const handleSubmit = (data: { title: string; column: Column[] }) => {
    updateMutation.mutate({
      boardId: board.id,
      data,
    });

  };
  // End Handle Edit Board

  // Handle Board Delete
  const deleteMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: async (response) => {
      toast.success("Board Deleted Successfuly!");
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["boards"] });
      setBoard(response.data)
    },
  });
  const submitDelete = async () => {
    deleteMutation.mutate(board.id);

    
  };

  const handleDelete = async () => {
    try {
      setConfirmModalOpen(true);
      setType("board");
      setId(board.id);
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to delete board:", error);
    }
  };
  // End Handle Board Delte

  // Handle Add Task
  const handleAddTask = () => {
    setTaskModalOpen(true);
    setTaskModalMode("add");
    setColumns(board.columns?.map((col: Column) => col) || []);
  };

  const taskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: (response) => {
            toast.success("Task Added Successfuly!");

      queryClient.invalidateQueries({ queryKey: ["ActiveBoard"] });
      setTaskModalOpen(false);
    },
    onError: (error) => {
      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        message.forEach((msg) => toast.error(msg));
      } else if (typeof message === "string") {
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const handleAddTaskRequest = (data: {
    description: string;
    status_id: number;
    title: string;
    subTasks: SubTasks[];
  }) => {
    taskMutation.mutate(data);
  };
  // End Handle Add Task

  return (
    <header className="header">
      
      <div className="header-logo-title">
      {!isSidebarOpen && (
        <h1>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="header-logo-icon"
          >
            <rect x="0" y="0" width="8" height="24" rx="4" fill="#635FC7" />
            <rect x="8" y="12" width="8" height="12" rx="4" fill="#635FC7" />
            <rect x="16" y="4" width="8" height="20" rx="4" fill="#635FC7" />
          </svg>
          Kanban
          </h1>
        )}

      <h1 className="header-board-name">

        {board.title}

      </h1>
      </div>
      <div className="header-actions">
        <button className="add-task-button" onClick={handleAddTask}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="add-task-icon"
          >
            <path
              d="M14 7H9V2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2V7H2C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9H7V14C7 14.5523 7.44772 15 8 15C8.55228 15 9 14.5523 9 14V9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7Z"
              fill="currentColor"
            />
          </svg>

          <span className="add-task-text-desktop">Add New Task</span>

          {/* <span className="add-task-text-mobile">+</span> */}
        </button>
        <div className="dropdown-wrapper">
          <button className="header-options-button" onClick={toggleDropdown}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="5" r="2" fill="currentColor" />
              <circle cx="12" cy="19" r="2" fill="currentColor" />
            </svg>
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleEditBoard}>Edit Board</button>
              <button onClick={handleDelete} className="danger">
                Delete Board
              </button>
            </div>
          )}
        </div>
      </div>
      <BoardForm
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        mode={mode}
        initialData={editingItem}
        onSubmit={handleSubmit}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        type={type}
        onSubmit={submitDelete}
        name={board.title}
      />

      <TaskForm
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        mode={taskModalMode}
        onSubmit={handleAddTaskRequest}
        column={columns}
      />
    </header>
  );
};

export default Header;
