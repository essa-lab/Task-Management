import React, { useEffect } from "react";
import { Board as BoardType, Column } from "../app/types";
import { useBoard } from "../context/BoardContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BoardForm from "./modals/forms/BoardForm";
import { fetchBoards, createBoard } from "@/api/board.api";
import toast from "react-hot-toast";
import { onError } from "@/utils/error-toast";
interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  toggleSidebar,
  toggleTheme,
  isDarkMode,
}) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = React.useState<any>();
  const { board, setBoard } = useBoard();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      toast.success("Board created successfully!");

      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setModalOpen(false);
    },
    onError: (error) => {
            onError(error)
      
    },
  });

  const handleSubmit = (data: { title: string; column: Column[] }) => {
    mutation.mutate(data);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["boards"],
    queryFn: () => fetchBoards(),

    enabled: board !== null,
  });

  useEffect(() => {
    if (!board.id && data?.data && data?.data.length > 0) {
      setBoard(data.data[0]);
    }
  }, [data, board, setBoard]);

  if (isError) {
    <div>Something went wrong</div>;
  }
  if (isLoading) {
    <div className="sidebar-content">
      <h2 className="sidebar-boards-heading">All Boards</h2>
      <nav>
        {[...Array(5)].map((_, i) => (
          <button key={i} className="sidebar-board-button"></button>
        ))}
      </nav>
    </div>;
  }
  return (
    <div className={!isSidebarOpen ? "d-none" : ""}>
      <aside
        className={`sidebar ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="sidebar-header">
          <h1 className="sidebar-logo">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="logo-icon"
            >
              <rect x="0" y="0" width="8" height="24" rx="4" fill="#635FC7" />
              <rect x="8" y="12" width="8" height="12" rx="4" fill="#635FC7" />
              <rect x="16" y="4" width="8" height="20" rx="4" fill="#635FC7" />
            </svg>
            Kanban
          </h1>
        </div>
        <div className="sidebar-content">
          <h2 className="sidebar-boards-heading">
            All Boards ({data?.data?.length})
          </h2>
          <nav>
            {data?.data?.map((b: BoardType) => (
              <button
                key={b.id}
                onClick={() => setBoard(b)}
                className={`sidebar-board-button ${
                  board.id === b.id ? "active" : ""
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="board-icon"
                >
                  <path
                    d="M14 0H2C0.89543 0 0 0.89543 0 2V14C0 15.1046 0.89543 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.89543 15.1046 0 14 0ZM2 2V14H14V2H2Z"
                    fill="currentColor"
                  />
                  <rect
                    x="4"
                    y="4"
                    width="2"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="7"
                    y="4"
                    width="5"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="4"
                    y="7"
                    width="2"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="7"
                    y="7"
                    width="5"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="4"
                    y="10"
                    width="2"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                  <rect
                    x="7"
                    y="10"
                    width="5"
                    height="2"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
                {b.title}
              </button>
            ))}
            <button
              onClick={() => {
                setMode("add");
                setEditingItem(undefined);
                setModalOpen(true);
              }}
              className="sidebar-board-button create-new-board-button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="board-icon"
              >
                <path
                  d="M14 7H9V2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2V7H2C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9H7V14C7 14.5523 7.44772 15 8 15C8.55228 15 9 14.5523 9 14V9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7Z"
                  fill="currentColor"
                />
              </svg>
              Create New Board
            </button>
          </nav>
        </div>
        <div className="sidebar-footer">
          {/* Dark/Light Mode Toggle */}
          <div className="theme-toggle-container">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="theme-icon"
            >
              <path
                d="M10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 1V3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 17V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 10H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 10H1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.3254 2.6746L15.9112 4.08881"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.08881 15.9112L2.6746 17.3254"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.9112 15.9112L17.3254 17.3254"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.6746 2.6746L4.08881 4.08881"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <label htmlFor="theme-toggle" className="theme-toggle-label">
              <input
                type="checkbox"
                id="theme-toggle"
                className="theme-toggle-checkbox"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <div className="theme-toggle-slider"></div>
            </label>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="theme-icon"
            >
              <path
                d="M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C10.9916 1 11.9442 1.18921 12.846 1.54562C11.3916 2.87974 10.4286 4.87816 10.4286 7.07143C10.4286 10.1558 12.8442 12.5714 15.9286 12.5714C17.1218 12.5714 18.1203 11.6084 19 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {/* Hide Sidebar Button */}
          <button onClick={toggleSidebar} className="hide-sidebar-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hide-sidebar-icon"
            >
              <path
                d="M15 8H1C0.447715 8 0 8.44772 0 9C0 9.55228 0.447715 10 1 10H15C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8Z"
                fill="currentColor"
              />
              <path
                d="M15 3H1C0.447715 3 0 3.44772 0 4C0 4.55228 0.447715 5 1 5H15C15.5523 5 16 4.55228 16 4C16 3.44772 15.5523 3 15 3Z"
                fill="currentColor"
              />
              <path
                d="M15 13H1C0.447715 13 0 13.4477 0 14C0 14.5523 0.447715 15 1 15H15C15.5523 15 16 14.5523 16 14C16 13.4477 15.5523 13 15 13Z"
                fill="currentColor"
              />
            </svg>
            Hide Sidebar
          </button>
        </div>
      </aside>
      {!isSidebarOpen && (
        <button className="show-sidebar-button" onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      <BoardForm
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        mode={mode}
        initialData={editingItem}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Sidebar;
