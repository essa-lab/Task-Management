"use client";
import React from "react";

import Board from "../components/Board";
import "./globals.css";
import { useBoard } from "@/context/BoardContext";
import { useQuery } from "@tanstack/react-query";
import { fetchBoardData } from "@/api/board.api";

export default function Page() {
  const { board } = useBoard();

  const { data, isLoading, isError } = useQuery({
  queryKey: ["ActiveBoard", board?.id],
  queryFn: () => fetchBoardData(board.id),
  enabled: !!board?.id,
  staleTime: 1000 * 60 * 5,
});
  
  if (isLoading) {
    return (
      <main className="board-main-area">
        <div className="board-container">
      
        <>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="board-column">
              <h3 className="column-heading">
              </h3>
              <div className="task-list">
                {[...Array(5)].map((_, i) => (
                  //onClick={setModalOpen}
                  <div
                    key={i}
                    className="task-card-skeleton"
                  >
                    <h4 className="task-title"></h4>
                    <p className="task-subtasks">
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </>
      

    </div>
        
      </main>
    );
  }

  if (isError) {
    return (
      <main className="board-main-area">
        <div className="error-message">
          <h2>Something went wrong.</h2>
          <p>We couldn’t load your board. Please try again later.</p>
        </div>
      </main>
    );
  }
  return (
    <main className="board-main-area">
      {board ? (
        <Board columns={data?.data.columns} />
      ) : (
        <div className="no-board-selected">
          Please select a board or create a new one.
        </div>
      )}
    </main>
  );
}
