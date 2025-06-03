import { Board } from "@/app/types";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type BoardContextType = {
  board: Board;
  setBoard: (board: Board) => void;
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [board, setBoard] = useState<Board>({});

  // ✅ Memoize the context value
  const value = useMemo(() => ({ board, setBoard }), [board]);

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
