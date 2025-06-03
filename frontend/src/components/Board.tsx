import React from "react";
import { Column, Task } from "../app/types";
// import "./Board.css";
import TaskModal from "./modals/TaskModal";
import { useBoard } from "@/context/BoardContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ColumnForm from "./modals/forms/ColumnForm";
import { addColumn } from "@/api/board.api";

interface BoardProps {
  columns: Column[] | undefined;
}

const Board: React.FC<BoardProps> = ({ columns }) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [taskData, setTaskData] = React.useState<Task>();
  const queryClient = useQueryClient();
  const [isColumnFormOpen, setColumnFormOpen] = React.useState(false);
  const { board } = useBoard();

  const columnOptions =
    columns?.map((col) => ({
      id: col.id,
      title: col.title,
    })) || [];
    

  // Handle Add Column
  const handleAddColumn = () => {
    setColumnFormOpen(true);
  };

  const columnFormMutation = useMutation({
    mutationFn: addColumn,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["ActiveBoard"] });
      setColumnFormOpen(false);
    },
  });

  const handleAddColumnRequest = (data: { title: string }) => {
    columnFormMutation.mutate({
      boardId: board.id,
      data,
    });
  };
  // End Add Column 

  return (
    <div className="board-container">
      {columns?.length === 0 ? (
        <div className="empty-board-message">
          <p className="empty-board-text">
            This board is empty. Create a new column to get started.
          </p>
          <button onClick={handleAddColumn} className="add-column-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="add-column-icon"
            >
              <path
                d="M14 7H9V2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2V7H2C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9H7V14C7 14.5523 7.44772 15 8 15C8.55228 15 9 14.5523 9 14V9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7Z"
                fill="currentColor"
              />
            </svg>
            Add New Column
          </button>
        </div>
      ) : (
        <>
          {columns?.map((column) => (
            <div key={column.id} className="board-column">
              <h3 className="column-heading">
                <span className={`column-color-dot column-color-blue`}></span>
                {column.title} ({column.tasks?.length})
              </h3>
              <div className="task-list">
                {column.tasks?.map((task) => (
                  //onClick={setModalOpen}
                  <div
                    key={task.id}
                    className="task-card"
                    onClick={() => {
                      setTaskData(task); // set the clicked task
                      setModalOpen(true); // open the modal
                    }}
                  >
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-subtasks">
                      {task.doneSubTasks} of {task.totalSubTasks} substasks
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="add-column-placeholder">
            <button
              onClick={handleAddColumn}
              className="add-column-placeholder-button"
            >
              + New Column
            </button>
          </div>
        </>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={taskData}
        columnOptions={columnOptions}
      />

      <ColumnForm
        isOpen={isColumnFormOpen}
        onClose={() => setColumnFormOpen(false)}
        onSubmit={handleAddColumnRequest}
      />
    </div>
  );
};

export default Board;
