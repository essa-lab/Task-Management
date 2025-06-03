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
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

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
